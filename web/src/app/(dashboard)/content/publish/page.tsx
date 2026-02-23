"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Send,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
  Globe,
} from "lucide-react";

const PLATFORMS = [
  { id: "wechat", name: "微信公众号", icon: "💬" },
  { id: "weibo", name: "微博", icon: "📢" },
  { id: "douyin", name: "抖音", icon: "🎵" },
  { id: "toutiao", name: "今日头条", icon: "📰" },
  { id: "kuaishou", name: "快手", icon: "🎬" },
];

interface PublishRecord {
  id: string;
  content: string;
  platforms: string[];
  status: "publishing" | "published" | "failed";
  createdAt: string;
}

export default function PublishPage() {
  const [activeTab, setActiveTab] = useState("publish");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["wechat"]);
  const [publishing, setPublishing] = useState(false);
  const [records, setRecords] = useState<PublishRecord[]>([
    {
      id: "demo-1",
      content: "【春季交通安全提示】近期春雨绵绵，路面湿滑，请广大驾驶人注意减速慢行...",
      platforms: ["wechat", "weibo"],
      status: "published",
      createdAt: "2026-02-22T10:30:00Z",
    },
    {
      id: "demo-2",
      content: "【一盔一带】骑乘电动自行车请佩戴安全头盔，驾乘汽车请系好安全带...",
      platforms: ["douyin", "kuaishou"],
      status: "published",
      createdAt: "2026-02-21T14:00:00Z",
    },
  ]);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handlePublish() {
    if (!content || selectedPlatforms.length === 0) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platforms: selectedPlatforms }),
      });
      const data = await res.json();
      setRecords((prev) => [
        {
          id: data.id,
          content: content.slice(0, 100),
          platforms: selectedPlatforms,
          status: "published",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setContent("");
      setActiveTab("records");
    } catch {
      alert("发布失败，请重试");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">内容发布</h1>
        <p className="text-muted-foreground">
          多平台一键发布，统一管理发布状态
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "publish"} onClick={() => setActiveTab("publish")}>
            <Send className="h-4 w-4 mr-1" />
            发布内容
          </TabsTrigger>
          <TabsTrigger active={activeTab === "records"} onClick={() => setActiveTab("records")}>
            <Clock className="h-4 w-4 mr-1" />
            发布记录
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "publish" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    发布到多平台
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">发布内容</label>
                    <Textarea
                      placeholder="输入或粘贴要发布的内容..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">选择发布平台</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm transition ${
                            selectedPlatforms.includes(p.id)
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <span>{p.icon}</span>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPlatforms.length > 0 && (
                    <div className="rounded-lg border p-3 bg-gray-50">
                      <p className="text-xs text-gray-500 mb-2">发布预览</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlatforms.map((pid) => {
                          const p = PLATFORMS.find((x) => x.id === pid);
                          return p ? (
                            <Badge key={pid} variant="outline">
                              {p.icon} {p.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      {content && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{content}</p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handlePublish}
                    disabled={publishing || !content || selectedPlatforms.length === 0}
                    className="w-full"
                  >
                    {publishing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />发布中...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" />一键发布到 {selectedPlatforms.length} 个平台</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "records" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  发布记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">暂无发布记录</p>
                ) : (
                  <div className="space-y-3">
                    {records.map((record) => (
                      <div key={record.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm text-gray-800 flex-1 line-clamp-2">
                            {record.content}
                          </p>
                          <Badge
                            variant={record.status === "published" ? "success" : record.status === "failed" ? "destructive" : "warning"}
                            className="ml-2 shrink-0"
                          >
                            {record.status === "published" ? (
                              <><CheckCircle2 className="h-3 w-3 mr-1" />已发布</>
                            ) : record.status === "failed" ? (
                              <><XCircle className="h-3 w-3 mr-1" />失败</>
                            ) : (
                              <><Loader2 className="h-3 w-3 mr-1 animate-spin" />发布中</>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{new Date(record.createdAt).toLocaleString("zh-CN")}</span>
                          <div className="flex gap-1">
                            {record.platforms.map((pid) => {
                              const p = PLATFORMS.find((x) => x.id === pid);
                              return p ? (
                                <span key={pid} title={p.name}>{p.icon}</span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
