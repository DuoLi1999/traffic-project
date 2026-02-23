"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { MaterialDetail } from "@/lib/types";
import {
  Search,
  Video,
  ImageIcon,
  Plus,
  Sparkles,
  Loader2,
  X,
  Upload,
  Trash2,
  Database,
  Camera,
} from "lucide-react";

const INGEST_SOURCES = [
  { id: "1", name: "执法记录仪", type: "视频", status: "已连接", count: 1250, lastSync: "2026-02-22 18:00" },
  { id: "2", name: "道路监控", type: "视频/图片", status: "已连接", count: 3800, lastSync: "2026-02-22 17:45" },
  { id: "3", name: "行车记录仪（举报）", type: "视频", status: "待对接", count: 0, lastSync: "—" },
  { id: "4", name: "无人机航拍", type: "视频/图片", status: "待对接", count: 0, lastSync: "—" },
  { id: "5", name: "宣传活动拍摄", type: "图片/视频", status: "手动上传", count: 420, lastSync: "2026-02-20 10:30" },
];

// ── Types ──

interface UserMaterial extends MaterialDetail {
  userAdded?: boolean;
}

// ── Constants ──

const USER_MATERIALS_KEY = "userMaterials";

const SOURCE_OPTIONS = [
  "执法记录仪",
  "道路监控",
  "路口监控",
  "宣传活动拍摄",
  "宣传科设计",
  "市民投稿",
  "社区宣传拍摄",
];

// ── Helper: localStorage persistence ──

function loadUserMaterials(): UserMaterial[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(USER_MATERIALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserMaterials(materials: UserMaterial[]) {
  localStorage.setItem(USER_MATERIALS_KEY, JSON.stringify(materials));
}

// ── Sub-components ──

function MaterialSearchBar({
  onSearch,
  onAISearch,
  isSearching,
}: {
  onSearch: (q: string) => void;
  onAISearch: (q: string) => void;
  isSearching: boolean;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="搜索素材标题、描述、标签..."
        />
      </div>
      <button
        onClick={() => onAISearch(query)}
        disabled={!query.trim() || isSearching}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        AI 搜索
      </button>
    </div>
  );
}

function TagFilter({
  tags,
  selected,
  onChange,
}: {
  tags: string[];
  selected: string[];
  onChange: (s: string[]) => void;
}) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isActive = selected.includes(tag);
        return (
          <button key={tag} onClick={() => toggle(tag)}>
            <Badge
              className={`rounded-full cursor-pointer transition ${
                isActive
                  ? "bg-blue-600 text-white border-transparent"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              {tag}
            </Badge>
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-gray-500 hover:text-gray-700 ml-1"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}

function MaterialCard({ material }: { material: UserMaterial }) {
  const TypeIcon = material.type === "video" ? Video : ImageIcon;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            material.type === "video"
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800 truncate">
              {material.title}
            </h4>
            <Badge
              className={`rounded-full border-transparent shrink-0 ${
                material.type === "video"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {material.type === "video" ? "视频" : "图片"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {material.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span>来源：{material.source}</span>
            <span>{material.date}</span>
            {material.location && <span>{material.location}</span>}
            <span>使用 {material.usageCount} 次</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {material.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-50 text-blue-700 border-transparent rounded-full text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialUploadDialog({
  open,
  onClose,
  onSave,
  existingTags,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (m: UserMaterial) => void;
  existingTags: string[];
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "image">("video");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAISuggestTags = useCallback(async () => {
    if (!title && !description) return;
    setIsGeneratingTags(true);
    // Simulate AI tag suggestion
    await new Promise((r) => setTimeout(r, 800));
    const suggestedTags: string[] = [];
    const text = `${title} ${description} ${location}`.toLowerCase();
    const keywordMap: Record<string, string[]> = {
      "高速": ["高速公路"],
      "追尾": ["追尾", "事故"],
      "酒驾": ["酒驾", "查处"],
      "学校|学生": ["学生", "安全教育"],
      "电动车|骑手": ["电动车"],
      "头盔": ["头盔", "一盔一带"],
      "雨|暴雨": ["雨天", "恶劣天气"],
      "雪|冰": ["冰雪", "冬季"],
      "雾": ["雾天", "恶劣天气"],
      "老年|老人": ["老年人"],
      "农村|乡": ["农村", "乡村道路"],
      "货车": ["货车"],
      "闯红灯": ["闯红灯", "违法"],
      "疲劳": ["疲劳驾驶"],
      "宣传": ["宣传活动"],
    };
    for (const [pattern, matchTags] of Object.entries(keywordMap)) {
      if (new RegExp(pattern).test(text)) {
        suggestedTags.push(...matchTags);
      }
    }
    if (type === "video") suggestedTags.push("视频素材");
    if (type === "image") suggestedTags.push("图片素材");
    const unique = [...new Set(suggestedTags)].filter((t) => !tags.includes(t));
    setTags((prev) => [...prev, ...unique.slice(0, 8)]);
    setIsGeneratingTags(false);
  }, [title, description, location, type, tags]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: `mat-user-${Date.now()}`,
      title: title.trim(),
      type,
      filename: `${title.trim()}.${type === "video" ? "mp4" : "jpg"}`,
      tags,
      source: source || "用户上传",
      description: description.trim(),
      location: location.trim(),
      date,
      usageCount: 0,
      userAdded: true,
    });
    // Reset
    setTitle("");
    setType("video");
    setSource("");
    setDescription("");
    setLocation("");
    setDate(new Date().toISOString().slice(0, 10));
    setTags([]);
    onClose();
  };

  if (!open) return null;

  const quickPickTags = existingTags.filter((t) => !tags.includes(t)).slice(0, 12);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-700" />
            添加素材
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              素材标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="例如：高速公路追尾事故现场"
            />
          </div>

          {/* Type + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                类型
              </label>
              <div className="flex gap-2">
                {(["video", "image"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setType(opt)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      type === opt
                        ? "border-blue-700 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt === "video" ? "视频" : "图片"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              来源
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SOURCE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    source === s
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="简要描述素材内容、拍摄背景等"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              地点
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="例如：G15高速K120"
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700">
                标签
              </label>
              <button
                onClick={handleAISuggestTags}
                disabled={isGeneratingTags || (!title && !description)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition disabled:opacity-50"
              >
                {isGeneratingTags ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI 推荐标签
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="输入标签后回车添加"
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {quickPickTags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">快速添加：</p>
                <div className="flex flex-wrap gap-1">
                  {quickPickTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (!tags.includes(tag)) setTags([...tags, tag]);
                      }}
                      className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200 hover:bg-gray-100 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            保存素材
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState("library");
  const [serverMaterials, setServerMaterials] = useState<MaterialDetail[]>([]);
  const [userMaterials, setUserMaterials] = useState<UserMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aiSearching, setAiSearching] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load server materials
  useEffect(() => {
    fetch("/api/data/materials")
      .then((r) => r.json())
      .then((data) => {
        setServerMaterials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load user materials from localStorage
  useEffect(() => {
    setUserMaterials(loadUserMaterials());
  }, []);

  const materials: UserMaterial[] = useMemo(
    () => [
      ...userMaterials.map((m) => ({ ...m, userAdded: true })),
      ...serverMaterials,
    ],
    [userMaterials, serverMaterials]
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    materials.forEach((m) => m.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        !searchTerm ||
        m.title.includes(searchTerm) ||
        m.description.includes(searchTerm) ||
        m.tags.some((t) => t.includes(searchTerm));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => m.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [materials, searchTerm, selectedTags]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setAiSummary(null);
  };

  const handleAISearch = async (query: string) => {
    if (!query.trim()) return;
    setAiSearching(true);
    // Simulate AI search
    await new Promise((r) => setTimeout(r, 1000));
    setAiSummary(
      `基于"${query}"的语义搜索：已从 ${materials.length} 个素材中匹配到 ${filteredMaterials.length} 个相关结果。建议关注标签中包含相关关键词的素材。`
    );
    setAiSearching(false);
  };

  const handleSaveMaterial = useCallback(
    (material: UserMaterial) => {
      const updated = [material, ...userMaterials];
      setUserMaterials(updated);
      saveUserMaterials(updated);
    },
    [userMaterials]
  );

  const handleDeleteMaterial = useCallback(
    (id: string) => {
      const updated = userMaterials.filter((m) => m.id !== id);
      setUserMaterials(updated);
      saveUserMaterials(updated);
    },
    [userMaterials]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            素材库管理
          </h1>
          <p className="text-sm text-gray-600">
            管理宣传素材，支持 AI 语义搜索和智能标引
          </p>
        </div>
        <button
          onClick={() => setShowUploadDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 transition"
        >
          <Plus className="h-5 w-5" />
          新建素材
        </button>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "library"} onClick={() => setActiveTab("library")}>
            <Database className="h-4 w-4 mr-1" />
            素材库
          </TabsTrigger>
          <TabsTrigger active={activeTab === "ingest"} onClick={() => setActiveTab("ingest")}>
            <Camera className="h-4 w-4 mr-1" />
            采集管理
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "library" && (
      <Card className="shadow-sm border-gray-200">
        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex gap-1">
            <button className="flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 border-blue-700 text-blue-700 bg-blue-50 transition">
              <Database className="h-5 w-5" />
              素材库
              <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {materials.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <MaterialSearchBar
            onSearch={handleSearch}
            onAISearch={handleAISearch}
            isSearching={aiSearching}
          />

          <TagFilter
            tags={allTags}
            selected={selectedTags}
            onChange={setSelectedTags}
          />

          {aiSummary && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
              <span className="font-medium">AI 分析：</span>
              {aiSummary}
            </div>
          )}

          <div className="text-sm text-gray-500">
            共 {filteredMaterials.length} 个素材
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              加载中...
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="relative">
                  <MaterialCard material={material} />
                  {material.userAdded && (
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition shadow-sm"
                      title="删除素材"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  未找到匹配的素材
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
          )}

          {activeTab === "ingest" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      采集源管理
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      需对接视频源系统
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    配置素材自动采集源，对接监控、执法记录仪、行车记录仪等系统
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {INGEST_SOURCES.map((source) => (
                      <div key={source.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{source.name}</span>
                            <Badge variant={source.status === "已连接" ? "success" : source.status === "手动上传" ? "warning" : "secondary"} className="text-xs">
                              {source.status}
                            </Badge>
                          </div>
                          <button className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                            配置
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-400">素材类型：</span>
                            {source.type}
                          </div>
                          <div>
                            <span className="text-gray-400">已采集：</span>
                            {source.count} 条
                          </div>
                          <div>
                            <span className="text-gray-400">最近同步：</span>
                            {source.lastSync}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-center">
                <p className="text-sm text-blue-600">
                  自动采集功能需对接视频监控系统、执法记录仪管理平台等外部系统
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <MaterialUploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onSave={handleSaveMaterial}
        existingTags={allTags}
      />
    </div>
  );
}
