import { NextResponse } from "next/server";
import { authenticate, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: "请输入用户名和密码" },
      { status: 400 }
    );
  }

  const result = authenticate(username, password);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, result.token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return response;
}
