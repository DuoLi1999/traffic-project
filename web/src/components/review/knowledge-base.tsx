"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Plus, Loader2 } from "lucide-react";

interface KBEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  source: string;
  createdAt: string;
}

const CATEGORIES = ["全部", "格式规范", "敏感词", "政策法规", "历史案例"];

export function KnowledgeBase() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("格式规范");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category !== "全部") params.set("category", category);
      const res = await fetch(`/api/data/review-kb?${params}`);
      const data = await res.json();
      setEntries(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newTitle || !newContent) return;
    try {
      await fetch("/api/data/review-kb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newCategory,
          title: newTitle,
          content: newContent,
          source: "人工录入",
        }),
      });
      setNewTitle("");
      setNewContent("");
      setShowAdd(false);
      fetchEntries();
    } catch {
      // ignore
    }
  }

  const filtered = entries.filter((e) => {
    const matchCategory = category === "全部" || e.category === category;
    const matchQuery =
      !query ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.content.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          审核知识库
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          新增
        </button>
      </div>

      {showAdd && (
        <div className="border rounded-lg p-3 space-y-2 bg-blue-50">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full text-xs px-2 py-1 border rounded"
          >
            {CATEGORIES.filter((c) => c !== "全部").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Input
            placeholder="标题"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-xs"
          />
          <textarea
            placeholder="内容"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={2}
            className="w-full text-xs px-3 py-1 border rounded resize-none"
          />
          <button
            onClick={handleAdd}
            disabled={!newTitle || !newContent}
            className="w-full text-xs py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            保存
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-7 pr-3 py-1.5 text-xs border rounded-md"
          placeholder="搜索知识库..."
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-[10px] px-2 py-0.5 rounded-full transition ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">
          暂无知识条目
        </p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-lg p-2.5 bg-white"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge className="text-[9px] px-1.5 py-0" variant="secondary">
                  {entry.category}
                </Badge>
                <span className="text-xs font-medium text-gray-800">
                  {entry.title}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-3">
                {entry.content}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {entry.source} · {new Date(entry.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
