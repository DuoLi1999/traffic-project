import { execFile } from "child_process";

interface OpenClawResult {
  status: string;
  result?: {
    payloads?: Array<{ text: string; mediaUrl: string | null }>;
  };
}

export async function callOpenClaw(userMessage: string): Promise<string> {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || "";
  // Remote HTTP proxy mode (for Vercel / cloud deployment)
  if (gatewayUrl) {
    return callOpenClawHTTP(userMessage);
  }
  // Local CLI mode (for local development)
  return callOpenClawCLI(userMessage);
}

async function callOpenClawHTTP(userMessage: string): Promise<string> {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || "";
  const proxyToken = process.env.OPENCLAW_PROXY_TOKEN || "";
  const agentTimeout = process.env.OPENCLAW_TIMEOUT || "120";
  const timeout = parseInt(agentTimeout, 10);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (proxyToken) headers["Authorization"] = `Bearer ${proxyToken}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), (timeout + 60) * 1000);

  try {
    const res = await fetch(`${gatewayUrl}/api/agent`, {
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
  const openclawBin = process.env.OPENCLAW_BIN || "openclaw";
  const authToken = process.env.OPENCLAW_AUTH_TOKEN || "";
  const agentTimeout = process.env.OPENCLAW_TIMEOUT || "120";
  const args = [
    "agent",
    "--agent", "main",
    "--message", userMessage,
    "--json",
    "--timeout", agentTimeout,
  ];

  const env = { ...process.env, OPENCLAW_GATEWAY_TOKEN: authToken || undefined };

  return new Promise<string>((resolve, reject) => {
    execFile(
      openclawBin,
      args,
      {
        env,
        maxBuffer: 10 * 1024 * 1024,
        timeout: (parseInt(agentTimeout, 10) + 30) * 1000,
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
