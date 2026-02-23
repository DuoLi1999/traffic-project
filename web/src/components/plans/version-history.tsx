"use client";

import type { PlanVersion } from "@/lib/types";

interface VersionHistoryProps {
  versions: PlanVersion[];
  onSelect: (version: PlanVersion) => void;
  selectedId?: string;
}

export function VersionHistory({ versions, onSelect, selectedId }: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        暂无版本记录
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {versions.map((v) => (
          <div
            key={v.id}
            onClick={() => onSelect(v)}
            className={`relative cursor-pointer rounded-lg border p-3 transition hover:shadow-sm ${
              selectedId === v.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Dot on timeline */}
            <div
              className={`absolute -left-[19px] top-4 h-3 w-3 rounded-full border-2 ${
                selectedId === v.id
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-400"
              }`}
            />

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-800">
                v{v.version}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(v.createdAt).toLocaleString("zh-CN")}
              </span>
            </div>
            <p className="text-xs text-gray-600">{v.changeNote}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
