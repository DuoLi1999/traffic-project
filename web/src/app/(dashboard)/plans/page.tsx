"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskBoard } from "@/components/plans/task-board";
import { VersionHistory } from "@/components/plans/version-history";
import { VersionDiff } from "@/components/plans/version-diff";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PlanRecord, PlanTask, PlanVersion } from "@/lib/types";
import {
  Loader2,
  Calendar,
  Lightbulb,
  Save,
  KanbanSquare,
  History,
  FileText,
} from "lucide-react";

const MONTH_THEMES: Record<string, { label: string; tags: string[] }> = {
  "1": { label: "1月：冬季安全 · 春运启动", tags: ["春运安全出行", "冰雪路面驾驶", "年终岁末酒驾整治", "农村道路安全"] },
  "2": { label: "2月：春节 · 春运返程", tags: ["春节自驾安全", "春运返程高峰", "元宵出行提醒", "疲劳驾驶警示"] },
  "3": { label: "3月：开学季 · 春雨", tags: ["开学季校园周边交通", "春雨湿滑路面", "全国两会安保", "一盔一带常态化"] },
  "4": { label: "4月：清明出行 · 春游高峰", tags: ["清明祭扫出行", "春游自驾安全", "货运超载治理", "摩托车/电动车安全"] },
  "5": { label: "5月：五一长假 · 初夏", tags: ["五一假期出行", "旅游景区交通", "初夏暴雨预防", "交通安全宣传月"] },
  "6": { label: "6月：高考 · 暑期前", tags: ["高考爱心护航", "儿童交通安全", "端午出行安全", "暑期出行预热"] },
  "7": { label: "7月：暑期高峰 · 汛期", tags: ["暑期亲子出行", "暴雨洪水应急", "高温疲劳驾驶", "涉水行车安全"] },
  "8": { label: "8月：暑期 · 开学准备", tags: ["暑期出游安全", "台风预警应对", "开学前安全教育", "夜间行车安全"] },
  "9": { label: "9月：开学季 · 秋季", tags: ["开学季护学岗", "中秋出行安全", "秋季团雾预警", "减量控大专项"] },
  "10": { label: "10月：国庆 · 秋收", tags: ["国庆长假出行", "高速公路安全", "农忙农机安全", "秋冬转换安全"] },
  "11": { label: "11月：入冬 · 交通安全日", tags: ["122全国交通安全日", "入冬安全提醒", "大雾天气安全", "老年人出行安全"] },
  "12": { label: "12月：冬季安全 · 年终", tags: ["冰雪路面安全", "年末聚会酒驾", "冬季货运安全", "年终安全总结"] },
};

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState("generate");
  const [month, setMonth] = useState("3");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState("");

  // Task board state
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // History state
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null);
  const [versions, setVersions] = useState<PlanVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PlanVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<PlanVersion | null>(null);

  const themes = MONTH_THEMES[month];

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("/api/data/plans");
      const data = await res.json();
      setPlans(data);
    } catch { /* ignore */ }
  }, []);

  const fetchTasks = useCallback(async (planId: string) => {
    try {
      const res = await fetch(`/api/data/plans/${planId}/tasks`);
      const data = await res.json();
      setTasks(data);
      setActivePlanId(planId);
    } catch { /* ignore */ }
  }, []);

  const fetchVersions = useCallback(async (planId: string) => {
    try {
      const res = await fetch(`/api/data/plans/${planId}/versions`);
      const data = await res.json();
      setVersions(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Load tasks for the latest plan when switching to task board
  useEffect(() => {
    if (activeTab === "board" && plans.length > 0 && !activePlanId) {
      fetchTasks(plans[0].id);
    }
  }, [activeTab, plans, activePlanId, fetchTasks]);

  function handleTagClick(tag: string) {
    setFocus((prev) => {
      if (prev.includes(tag)) return prev;
      return prev ? `${prev}、${tag}` : tag;
    });
  }

  async function handleGenerate() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/skills/plan-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, focus: focus || undefined }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/data/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          title: `${month}月月度宣传计划`,
          content: result,
        }),
      });
      const data = await res.json();
      setActivePlanId(data.plan.id);
      setTasks(data.tasks);
      await fetchPlans();
      setActiveTab("board");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(taskId: string, status: PlanTask["status"]) {
    if (!activePlanId) return;
    try {
      await fetch(`/api/data/plans/${activePlanId}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      );
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">计划管理</h1>
        <p className="text-muted-foreground">
          结合节假日、季节特征、事故数据自动生成月度宣传计划
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "generate"} onClick={() => setActiveTab("generate")}>
            <FileText className="h-4 w-4 mr-1" />
            生成计划
          </TabsTrigger>
          <TabsTrigger active={activeTab === "board"} onClick={() => setActiveTab("board")}>
            <KanbanSquare className="h-4 w-4 mr-1" />
            任务看板
          </TabsTrigger>
          <TabsTrigger active={activeTab === "history"} onClick={() => setActiveTab("history")}>
            <History className="h-4 w-4 mr-1" />
            历史记录
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "generate" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    生成月度计划
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">选择月份</label>
                    <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                          2026年{i + 1}月
                        </option>
                      ))}
                    </Select>
                  </div>

                  {themes && (
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        智能主题推荐
                        <span className="font-normal text-muted-foreground">（点击添加到重点方向）</span>
                      </label>
                      <p className="mb-2 text-xs text-muted-foreground">{themes.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {themes.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={focus.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      重点方向 / 补充要求
                      <span className="ml-1 font-normal text-muted-foreground">（可选）</span>
                    </label>
                    <Textarea
                      placeholder={"例如：本月重点配合\u201C一盔一带\u201D专项行动，加强农村道路宣传..."}
                      value={focus}
                      onChange={(e) => setFocus(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleGenerate} disabled={loading} className="w-full">
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />生成中...</>
                    ) : (
                      "生成计划"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>2026年{month}月 月度宣传计划</CardTitle>
                      <Button onClick={handleSave} disabled={saving} size="sm">
                        {saving ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />保存中...</>
                        ) : (
                          <><Save className="mr-2 h-4 w-4" />保存计划</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "board" && (
            <div className="space-y-4">
              {plans.length > 0 && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">选择计划：</label>
                  <Select
                    value={activePlanId || ""}
                    onChange={(e) => fetchTasks(e.target.value)}
                    className="max-w-xs"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({new Date(p.createdAt).toLocaleDateString("zh-CN")})
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
            </div>
          )}

          {activeTab === "history" && (
            <div className="grid grid-cols-3 gap-6">
              {/* Plan list */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">已保存的计划</h3>
                {plans.length === 0 ? (
                  <p className="text-sm text-gray-500">暂无已保存的计划</p>
                ) : (
                  <div className="space-y-2">
                    {plans.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPlan(p);
                          setSelectedVersion(null);
                          setCompareVersion(null);
                          fetchVersions(p.id);
                        }}
                        className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-sm ${
                          selectedPlan?.id === p.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{p.title}</span>
                          <Badge variant={p.status === "active" ? "success" : "secondary"}>
                            {p.status === "draft" ? "草案" : p.status === "active" ? "执行中" : "已归档"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          v{p.version} · {new Date(p.createdAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Version history */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">版本历史</h3>
                {selectedPlan ? (
                  <VersionHistory
                    versions={versions}
                    onSelect={(v) => {
                      if (selectedVersion && selectedVersion.id !== v.id) {
                        setCompareVersion(selectedVersion);
                      }
                      setSelectedVersion(v);
                    }}
                    selectedId={selectedVersion?.id}
                  />
                ) : (
                  <p className="text-sm text-gray-500">请选择一个计划</p>
                )}
              </div>

              {/* Version content / diff */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">版本内容</h3>
                {selectedVersion && compareVersion ? (
                  <VersionDiff
                    oldContent={compareVersion.content}
                    newContent={selectedVersion.content}
                    oldVersion={compareVersion.version}
                    newVersion={selectedVersion.version}
                  />
                ) : selectedVersion ? (
                  <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedVersion.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">请选择一个版本查看</p>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
