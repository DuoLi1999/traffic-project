"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import type { MaterialDetail } from "@/lib/types";
import { Search, Video, ImageIcon, X } from "lucide-react";
import { PlannedFeatures } from "@/components/ui/planned-features";

const PLANNED = [
  { name: "多渠道自动采集", description: "对接外部平台，自动采集交通安全相关素材入库" },
  { name: "AI 智能分类标引", description: "AI 自动识别素材内容并标注分类标签" },
  { name: "AI 语义搜索", description: "基于自然语言理解的智能素材检索" },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialDetail[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MaterialDetail | null>(null);

  // Initial load
  useEffect(() => {
    doFetch("", "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doFetch(q: string, t: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (t !== "all") params.set("type", t);
    const res = await fetch(`/api/data/materials?${params}`);
    const json = await res.json();
    setMaterials(json);
    setLoading(false);
  }

  function handleSearch() {
    doFetch(query, typeFilter);
  }

  function handleTypeChange(newType: string) {
    setTypeFilter(newType);
    doFetch(query, newType);
  }

  function handleTagClick(tag: string) {
    setQuery(tag);
    doFetch(tag, typeFilter);
  }

  // Collect all tags for tag cloud
  const allTags = Array.from(
    new Set(materials.flatMap((m) => m.tags))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">素材库</h1>
        <p className="text-muted-foreground">
          共 {materials.length} 个素材
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索素材（标题、标签）..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Select
          value={typeFilter}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-32"
        >
          <option value="all">全部类型</option>
          <option value="video">视频</option>
          <option value="image">图片</option>
        </Select>
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-2">
        {allTags.slice(0, 20).map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Materials Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground">加载中...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {materials.map((mat) => (
            <Card
              key={mat.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelected(mat)}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted" role="img" aria-label={mat.title}>
                  {mat.type === "video" ? (
                    <Video className="h-10 w-10 text-muted-foreground" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mb-2 line-clamp-2 text-sm font-medium">
                  {mat.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {mat.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {mat.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mat.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{mat.type === "video" ? "视频" : "图片"}</span>
                  <span>使用 {mat.usageCount} 次</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PlannedFeatures features={PLANNED} />

      {/* Detail Dialog */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 rounded-sm p-1 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="mb-4 text-lg font-bold">{selected.title}</h2>
            <div className="mb-4 flex h-40 items-center justify-center rounded-md bg-muted" role="img" aria-label={selected.title}>
              {selected.type === "video" ? (
                <Video className="h-12 w-12 text-muted-foreground" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">描述：</span>
                <span>{selected.description}</span>
              </div>
              <div>
                <span className="font-medium">来源：</span>
                <span>{selected.source}</span>
              </div>
              <div>
                <span className="font-medium">位置：</span>
                <span>{selected.location}</span>
              </div>
              <div>
                <span className="font-medium">日期：</span>
                <span>{selected.date}</span>
              </div>
              <div>
                <span className="font-medium">文件名：</span>
                <span>{selected.filename}</span>
              </div>
              <div>
                <span className="font-medium">使用次数：</span>
                <span>{selected.usageCount}</span>
              </div>
              <div>
                <span className="font-medium">标签：</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
