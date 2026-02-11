"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Shield } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[65px] z-30 h-[calc(100vh-65px)] w-60 border-r bg-white">
      <div className="flex h-full flex-col">
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">
              系统状态
            </p>
            <p className="text-xs text-gray-500">
              XX市公安局交警支队
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[65px] border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">
              交通安全宣传教育智能化平台
            </h1>
            <p className="text-[11px] text-gray-400">
              Traffic Safety Education Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">AI 服务正常</span>
          </div>
        </div>
      </div>
    </header>
  );
}
