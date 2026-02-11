const GATEWAY_URL =
  process.env.OPENCLAW_GATEWAY_URL || "http://127.0.0.1:18789";
const AUTH_TOKEN = process.env.OPENCLAW_AUTH_TOKEN || "";

export async function callOpenClaw(userMessage: string): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (AUTH_TOKEN) {
    headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  }

  const response = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `OpenClaw Gateway error ${response.status}: ${text || response.statusText}`
    );
  }

  const data = await response.json();

  // OpenAI-compatible response format
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  // Fallback: return raw text if format differs
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}
