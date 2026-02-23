import http from "http";
import { execFile } from "child_process";

const PORT = parseInt(process.env.PORT || "3100", 10);
const PROXY_TOKEN = process.env.OPENCLAW_PROXY_TOKEN || "";
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || "openclaw";
const DEFAULT_TIMEOUT = 120;

function sendJSON(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    sendJSON(res, 204, null);
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/agent") {
    sendJSON(res, 404, { error: "Not found. Use POST /api/agent" });
    return;
  }

  // Auth check
  if (PROXY_TOKEN) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${PROXY_TOKEN}`) {
      sendJSON(res, 401, { error: "Unauthorized" });
      return;
    }
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    let parsed: { message?: string; agent?: string; timeout?: number };
    try {
      parsed = JSON.parse(body);
    } catch {
      sendJSON(res, 400, { error: "Invalid JSON" });
      return;
    }

    const message = parsed.message;
    if (!message) {
      sendJSON(res, 400, { error: "Missing 'message' field" });
      return;
    }

    const agent = parsed.agent || "main";
    const timeout = parsed.timeout || DEFAULT_TIMEOUT;

    const args = [
      "agent",
      "--agent", agent,
      "--message", message,
      "--json",
      "--timeout", String(timeout),
    ];

    console.log(`[openclaw-proxy] invoking: ${OPENCLAW_BIN} agent --agent ${agent} --timeout ${timeout}`);

    execFile(
      OPENCLAW_BIN,
      args,
      {
        maxBuffer: 10 * 1024 * 1024,
        timeout: (timeout + 30) * 1000,
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr?.trim() || error.message;
          console.error(`[openclaw-proxy] error: ${detail}`);
          sendJSON(res, 502, { status: "error", error: detail });
          return;
        }

        try {
          const jsonStart = stdout.indexOf("{");
          if (jsonStart === -1) {
            sendJSON(res, 502, { status: "error", error: "No JSON in output" });
            return;
          }
          const data = JSON.parse(stdout.slice(jsonStart));

          // OpenClaw CLI outputs { payloads: [...] } directly
          // or { status: "ok", result: { payloads: [...] } }
          const payloads = data.payloads || data.result?.payloads;
          const text = payloads?.[0]?.text;

          if (text) {
            sendJSON(res, 200, { status: "ok", text });
          } else {
            sendJSON(res, 200, { status: "ok", text: JSON.stringify(data) });
          }
        } catch (parseErr) {
          sendJSON(res, 502, { status: "error", error: `Parse error: ${parseErr}` });
        }
      }
    );
  });
});

server.listen(PORT, () => {
  console.log(`[openclaw-proxy] listening on http://localhost:${PORT}`);
  console.log(`[openclaw-proxy] POST /api/agent`);
  if (PROXY_TOKEN) console.log(`[openclaw-proxy] auth: Bearer token required`);
  else console.log(`[openclaw-proxy] auth: NONE (set OPENCLAW_PROXY_TOKEN to enable)`);
});
