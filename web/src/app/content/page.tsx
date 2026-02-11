"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, FileEdit } from "lucide-react";
import { PlannedFeatures } from "@/components/ui/planned-features";

const PLANNED = [
  { name: "多平台一键发布", description: "生成内容后直接发布到微信、微博、抖音等平台" },
];

export default function ContentPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("wechat");
  const [contentType, setContentType] = useState("article");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    if (!topic) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/skills/content-producer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, contentType }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">内容生产</h1>
        <p className="text-muted-foreground">
          输入主题和参数，自动生成多平台宣传内容
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5" />
              生成设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                宣传主题
              </label>
              <Input
                placeholder="例如：春运安全、酒驾警示、电动车安全..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                目标平台
              </label>
              <Select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="wechat">微信公众号</option>
                <option value="weibo">微博</option>
                <option value="douyin">抖音</option>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                内容类型
              </label>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="article">图文推文</option>
                <option value="short">短文/微博</option>
                <option value="video-script">视频脚本</option>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "生成内容"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>内容预览</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p>填写左侧表单并点击&ldquo;生成内容&rdquo;查看预览</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
