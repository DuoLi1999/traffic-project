"use client";

import { Badge } from "@/components/ui/badge";
import type { PlanTask } from "@/lib/types";
import { Clock, User } from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-100 text-red-800",
  P1: "bg-yellow-100 text-yellow-800",
  P2: "bg-blue-100 text-blue-800",
};

interface TaskCardProps {
  task: PlanTask;
  onStatusChange: (taskId: string, status: PlanTask["status"]) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const statusOptions: PlanTask["status"][] = [
    "pending",
    "in_progress",
    "completed",
    "overdue",
  ];

  const STATUS_LABELS: Record<string, string> = {
    pending: "待办",
    in_progress: "进行中",
    completed: "已完成",
    overdue: "逾期",
  };

  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
          {task.title}
        </h4>
        <Badge
          className={`shrink-0 ml-2 text-[10px] px-1.5 py-0 ${PRIORITY_COLORS[task.priority] || ""}`}
        >
          {task.priority}
        </Badge>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
        {task.assignee && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.assignee}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.dueDate}
          </span>
        )}
      </div>

      <select
        value={task.status}
        onChange={(e) =>
          onStatusChange(task.id, e.target.value as PlanTask["status"])
        }
        className="w-full text-xs px-2 py-1 border border-gray-200 rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
