"use client";

import type { PlanTask } from "@/lib/types";
import { TaskCard } from "./task-card";

const COLUMNS: { status: PlanTask["status"]; label: string; color: string }[] = [
  { status: "pending", label: "待办", color: "border-t-gray-400" },
  { status: "in_progress", label: "进行中", color: "border-t-blue-500" },
  { status: "completed", label: "已完成", color: "border-t-green-500" },
  { status: "overdue", label: "逾期", color: "border-t-red-500" },
];

interface TaskBoardProps {
  tasks: PlanTask[];
  onStatusChange: (taskId: string, status: PlanTask["status"]) => void;
}

export function TaskBoard({ tasks, onStatusChange }: TaskBoardProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无任务，请先生成并保存计划
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="space-y-3">
            <div
              className={`rounded-lg bg-gray-50 p-3 border-t-4 ${col.color}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  {col.label}
                </h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
