import { execFile } from "child_process";

const AUTH_TOKEN = process.env.OPENCLAW_AUTH_TOKEN || "";
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || "openclaw";
const AGENT_TIMEOUT = process.env.OPENCLAW_TIMEOUT || "120";
const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "";
const PROXY_TOKEN = process.env.OPENCLAW_PROXY_TOKEN || "";

interface OpenClawResult {
  status: string;
  result?: {
    payloads?: Array<{ text: string; mediaUrl: string | null }>;
  };
}

export async function callOpenClaw(userMessage: string): Promise<string> {
  // Remote HTTP proxy mode (for Vercel / cloud deployment)
  if (GATEWAY_URL) {
    return callOpenClawHTTP(userMessage);
  }
  // Local CLI mode (for local development)
  return callOpenClawCLI(userMessage);
}

async function callOpenClawHTTP(userMessage: string): Promise<string> {
  const timeout = parseInt(AGENT_TIMEOUT, 10);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (PROXY_TOKEN) headers["Authorization"] = `Bearer ${PROXY_TOKEN}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), (timeout + 60) * 1000);

  try {
    const res = await fetch(`${GATEWAY_URL}/api/agent`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: userMessage, timeout }),
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok || data.status !== "ok") {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data.text;
  } finally {
    clearTimeout(timer);
  }
}

function callOpenClawCLI(userMessage: string): Promise<string> {
  const args = [
    "agent",
    "--agent", "main",
    "--message", userMessage,
    "--json",
    "--timeout", AGENT_TIMEOUT,
  ];

  const env = { ...process.env, OPENCLAW_GATEWAY_TOKEN: AUTH_TOKEN || undefined };

  return new Promise<string>((resolve, reject) => {
    execFile(
      OPENCLAW_BIN,
      args,
      {
        env,
        maxBuffer: 10 * 1024 * 1024,
        timeout: (parseInt(AGENT_TIMEOUT, 10) + 30) * 1000,
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr?.trim() || error.message;
          reject(new Error(`OpenClaw agent error: ${detail}`));
          return;
        }

        try {
          const jsonStart = stdout.indexOf("{");
          if (jsonStart === -1) {
            reject(new Error(`OpenClaw returned no JSON: ${stdout.slice(0, 200)}`));
            return;
          }
          const data: OpenClawResult = JSON.parse(stdout.slice(jsonStart));

          if (data.status !== "ok") {
            reject(new Error(`OpenClaw agent status: ${data.status}`));
            return;
          }

          const text = data.result?.payloads?.[0]?.text;
          if (text) {
            resolve(text);
            return;
          }

          resolve(JSON.stringify(data.result ?? data));
        } catch (parseErr) {
          reject(
            new Error(`OpenClaw response parse error: ${parseErr}. Raw: ${stdout.slice(0, 300)}`)
          );
        }
      }
    );
  });
}
