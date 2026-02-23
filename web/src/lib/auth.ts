import { cookies } from "next/headers";

const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Simple token: base64(username:timestamp:hash)
function generateToken(username: string): string {
  const secret = process.env.AUTH_SECRET || "traffic-safety-default-secret";
  const timestamp = Date.now().toString();
  const payload = `${username}:${timestamp}:${secret}`;
  return Buffer.from(payload).toString("base64");
}

function validateToken(token: string): string | null {
  try {
    const secret = process.env.AUTH_SECRET || "traffic-safety-default-secret";
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;
    const tokenSecret = parts.slice(2).join(":");
    if (tokenSecret !== secret) return null;
    return parts[0]; // username
  } catch {
    return null;
  }
}

export function authenticate(
  username: string,
  password: string
): { success: boolean; token?: string; error?: string } {
  const validUser = process.env.AUTH_USERNAME || "admin";
  const validPass = process.env.AUTH_PASSWORD || "traffic2026";

  if (username === validUser && password === validPass) {
    const token = generateToken(username);
    return { success: true, token };
  }

  return { success: false, error: "用户名或密码错误" };
}

export function getSessionUser(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateToken(token);
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
