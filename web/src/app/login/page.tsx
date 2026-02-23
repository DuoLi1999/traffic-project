"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      router.push("/plans");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <Shield className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            交通安全宣传教育智能化平台
          </h1>
          <p className="text-sm text-blue-200/70">
            XX市公安局交警支队
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 text-center">
            系统登录
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-100/80 mb-1.5">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/[0.15] bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
                placeholder="请输入用户名"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100/80 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.15] bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  登录中...
                </span>
              ) : (
                "登 录"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-blue-200/30 mt-6">
          交通安全宣传教育智能化平台 v1.0
        </p>
      </div>
    </div>
  );
}
