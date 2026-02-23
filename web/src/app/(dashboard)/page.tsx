"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react";

const STATS = [
  {
    label: "本月发布内容",
    value: "65",
    unit: "篇/条",
    change: "+12%",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "总阅读/播放量",
    value: "123.5",
    unit: "万",
    change: "+18.3%",
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "新增关注",
    value: "1,260",
    unit: "人",
    change: "+8.2%",
    icon: Users,
    color: "text-violet-600 bg-violet-50",
  },
  {
    label: "内容审核通过率",
    value: "96.2",
    unit: "%",
    change: "+2.1%",
    icon: ShieldCheck,
    color: "text-amber-600 bg-amber-50",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl gov-gradient p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              交通安全宣传教育智能化平台
            </h1>
            <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
              基于 AI 技术，覆盖&ldquo;计划制定 — 素材管理 — 内容生产 — 审核发布 — 效果监测 — 精准投放&rdquo;全链路，提升宣传教育工作效率。
            </p>
          </div>
          <div className="hidden lg:flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    stat.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.unit}
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                {stat.change} 较上月
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold mb-4">功能导航</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_ITEMS.flatMap((group) =>
            group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.group}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
