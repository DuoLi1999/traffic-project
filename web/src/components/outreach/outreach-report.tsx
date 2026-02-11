"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, FileBarChart } from "lucide-react";

export function OutreachReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setReport("");
    try {
      const res = await fetch("/api/skills/precision-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setReport(data.content);
    } catch {
      setReport("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            AI 精准宣传分析
          </CardTitle>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              "生成精准宣传报告"
            )}
          </Button>
        </div>
      </CardHeader>
      {report && (
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report}
            </ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
