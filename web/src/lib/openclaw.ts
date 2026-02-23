import { execFile } from "child_process";

const AUTH_TOKEN = process.env.OPENCLAW_AUTH_TOKEN || "";
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || "openclaw";
const AGENT_TIMEOUT = process.env.OPENCLAW_TIMEOUT || "120";

interface OpenClawResult {
  status: string;
  result?: {
    payloads?: Array<{ text: string; mediaUrl: string | null }>;
  };
}

export async function callOpenClaw(userMessage: string): Promise<string> {
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
        maxBuffer: 10 * 1024 * 1024, // 10 MB
        timeout: (parseInt(AGENT_TIMEOUT, 10) + 30) * 1000,
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr?.trim() || error.message;
          reject(new Error(`OpenClaw agent error: ${detail}`));
          return;
        }

        try {
          // stdout may contain config warnings before the JSON — find the JSON object
          const jsonStart = stdout.indexOf("{");
          if (jsonStart === -1) {
            reject(new Error(`OpenClaw returned no JSON: ${stdout.slice(0, 200)}`));
            return;
          }
          const data: OpenClawResult = JSON.parse(stdout.slice(jsonStart));

          if (data.status !== "ok") {
            reject(
              new Error(`OpenClaw agent status: ${data.status}`)
            );
            return;
          }

          const text = data.result?.payloads?.[0]?.text;
          if (text) {
            resolve(text);
            return;
          }

          // Fallback: return the raw result
          resolve(JSON.stringify(data.result ?? data));
        } catch (parseErr) {
          reject(
            new Error(
              `OpenClaw response parse error: ${parseErr}. Raw: ${stdout.slice(0, 300)}`
            )
          );
        }
      }
    );
  });
}
