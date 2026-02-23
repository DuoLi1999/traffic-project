"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QA_QUICK_TOPICS } from "@/lib/constants";
import { Send, MessageCircle, User, Bot, BarChart3, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function QAPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "您好！我是交通安全智能咨询助手，可以为您解答驾照换证、违章处理、车辆年检、事故处理等交通业务相关问题。请问有什么可以帮助您的？",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [opinionLoading, setOpinionLoading] = useState(false);
  const [opinionReport, setOpinionReport] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(question?: string) {
    const q = question || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/skills/public-relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，服务暂时不可用，请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpinionAnalysis() {
    setOpinionLoading(true);
    setOpinionReport("");
    try {
      const res = await fetch("/api/skills/opinion-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setOpinionReport(data.content);
    } catch {
      setOpinionReport("生成失败，请重试");
    } finally {
      setOpinionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">咨询服务</h1>
        <p className="text-muted-foreground">
          交通业务智能问答 + 民意数据分析
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
            <MessageCircle className="h-4 w-4 mr-1" />
            智能问答
          </TabsTrigger>
          <TabsTrigger active={activeTab === "opinion"} onClick={() => setActiveTab("opinion")}>
            <BarChart3 className="h-4 w-4 mr-1" />
            民意分析
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "chat" && (
            <div className="space-y-4">
              {/* Quick Topics */}
              <div className="flex flex-wrap gap-2">
                {QA_QUICK_TOPICS.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent px-3 py-1.5"
                    onClick={() => handleSend(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Chat Area */}
              <Card className="flex flex-col h-[calc(100vh-340px)] min-h-[400px]">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="h-5 w-5" />
                    智能问答
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className={`ai-content-chat ${msg.role === "user" ? "prose-invert text-white [&_*]:text-inherit" : ""}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-muted px-4 py-2">
                        <p className="text-sm text-muted-foreground">正在输入...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="输入您的问题..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "opinion" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      民意数据分析
                    </CardTitle>
                    <Button onClick={handleOpinionAnalysis} disabled={opinionLoading}>
                      {opinionLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />分析中...</>
                      ) : (
                        "生成民意分析报告"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    汇总分析群众投诉建议数据，生成民意趋势报告
                  </p>
                </CardHeader>
                {opinionReport && (
                  <CardContent>
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {opinionReport}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
