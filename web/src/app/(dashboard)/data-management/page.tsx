"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Database, HardDrive, FileText, BookOpen, BarChart3, Upload,
  RefreshCw, Trash2, Eye, X, Loader2,
} from "lucide-react";
import type { DataOverviewResponse, KBEntry } from "@/lib/types";

type UploadCategory = "accident" | "document" | "analytics" | "custom";
type FileItem = { name: string; sizeBytes: number; modifiedAt: string; path: string };
type KBListEntry = { id: string; title: string; category: string; tags: string[]; date: string; contentLength: number };

const CAT_CFG: Record<UploadCategory, { label: string; accept: string; desc: string }> = {
  accident: { label: "事故数据", accept: ".xls,.xlsx", desc: "XLS/XLSX" },
  document: { label: "宣传文档", accept: ".doc,.docx", desc: "DOC/DOCX" },
  analytics: { label: "分析数据", accept: ".json", desc: "JSON" },
  custom: { label: "自定义JSON", accept: ".json", desc: "JSON" },
};

const KB_CAT: Record<string, string> = {
  "work-summary": "工作总结", "work-plan": "工作计划",
  scheme: "方案", "opinion-report": "舆情报告", campaign: "宣传活动",
};

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}
function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleString("zh-CN");
}

export default function DataManagementPage() {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState<DataOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadCat, setUploadCat] = useState<UploadCategory>("accident");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [kbList, setKbList] = useState<KBListEntry[]>([]);
  const [preview, setPreview] = useState<KBEntry | null>(null);
  const [etlRunning, setEtlRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const j = await (await fetch("/api/data-management/status")).json();
      setData(j); setEtlRunning(j.etl?.status === "running");
    } catch { /* skip */ }
    setLoading(false);
  }, []);

  const fetchFiles = useCallback(async (dir: string) => {
    try {
      const j = await (await fetch(`/api/data-management/preview?category=files&dir=${dir}`)).json();
      setFiles(j.files || []);
    } catch { setFiles([]); }
  }, []);

  const fetchKB = useCallback(async () => {
    try {
      const j = await (await fetch("/api/data-management/preview?category=knowledge-base")).json();
      setKbList(j.entries || []);
    } catch { setKbList([]); }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  useEffect(() => { if (tab === "import") fetchFiles(uploadCat); }, [tab, uploadCat, fetchFiles]);
  useEffect(() => { if (tab === "kb") fetchKB(); }, [tab, fetchKB]);

  // Poll ETL status while running
  useEffect(() => {
    if (!etlRunning) return;
    const id = setInterval(fetchStatus, 3000);
    return () => clearInterval(id);
  }, [etlRunning, fetchStatus]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadMsg("");
    const fd = new FormData();
    fd.append("file", file); fd.append("category", uploadCat);
    try {
      const r = await fetch("/api/data-management/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (r.ok) { setUploadMsg(`✓ ${j.message}，请点击"重新聚合"以更新数据`); fetchFiles(uploadCat); fetchStatus(); }
      else setUploadMsg(`✗ ${j.error}`);
    } catch (err) { setUploadMsg(`✗ 上传失败: ${err}`); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const runETL = async (target: "all" | "extract-docs") => {
    setEtlRunning(true);
    try {
      const r = await fetch("/api/data-management/etl", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const j = await r.json();
      if (!r.ok) { setEtlRunning(false); alert(j.error); }
    } catch { setEtlRunning(false); }
  };

  const deleteFile = async (type: string, id: string) => {
    if (!confirm(`确定删除 ${id}？`)) return;
    try {
      const r = await fetch("/api/data-management/delete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (r.ok) { fetchFiles(uploadCat); fetchStatus(); fetchKB(); }
      else { const j = await r.json(); alert(j.error); }
    } catch { /* skip */ }
  };

  const previewKB = async (id: string) => {
    try {
      const j = await (await fetch(`/api/data-management/preview?category=knowledge-base&id=${id}`)).json();
      setPreview(j);
    } catch { /* skip */ }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const stats = [
    { label: "事故记录", value: data?.accidentRecords ?? 0, icon: Database, color: "text-blue-600" },
    { label: "知识库条目", value: data?.kbEntries ?? 0, icon: BookOpen, color: "text-green-600" },
    { label: "分析文件", value: data?.analyticsFiles ?? 0, icon: BarChart3, color: "text-purple-600" },
    { label: "磁盘占用", value: fmtSize(data?.diskUsageBytes ?? 0), icon: HardDrive, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">数据管理</h1>
        <p className="text-muted-foreground">管理平台数据源、导入文件、运行 ETL 流水线</p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={tab === "overview"} onClick={() => setTab("overview")}>
            <Database className="h-4 w-4 mr-1" />数据概览
          </TabsTrigger>
          <TabsTrigger active={tab === "import"} onClick={() => setTab("import")}>
            <Upload className="h-4 w-4 mr-1" />导入数据
          </TabsTrigger>
          <TabsTrigger active={tab === "kb"} onClick={() => setTab("kb")}>
            <BookOpen className="h-4 w-4 mr-1" />知识库管理
          </TabsTrigger>
        </TabsList>

        <TabsContent>
{/* ── Tab 1: Overview ── */}
{tab === "overview" && (<div className="space-y-6">
  <div className="grid grid-cols-4 gap-4">
    {stats.map((s) => (
      <Card key={s.label}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  <Card>
    <CardHeader><CardTitle>数据源状态</CardTitle></CardHeader>
    <CardContent>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 font-medium">数据源</th>
            <th className="pb-2 font-medium">记录数</th>
            <th className="pb-2 font-medium">文件数</th>
            <th className="pb-2 font-medium">大小</th>
            <th className="pb-2 font-medium">最后更新</th>
            <th className="pb-2 font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          {(data?.sources || []).map((src) => (
            <tr key={src.category} className="border-b last:border-0">
              <td className="py-3 font-medium">{src.name}</td>
              <td className="py-3">{src.recordCount.toLocaleString()}</td>
              <td className="py-3">{src.fileCount}</td>
              <td className="py-3">{fmtSize(src.sizeBytes)}</td>
              <td className="py-3">{fmtDate(src.lastUpdated)}</td>
              <td className="py-3">
                <Badge variant={src.status === "ready" ? "success" : "secondary"}>
                  {src.status === "ready" ? "就绪" : "空"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>ETL 流水线</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={etlRunning} onClick={() => runETL("all")}>
            {etlRunning ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            {etlRunning ? "运行中..." : "重新聚合"}
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">上次运行：{fmtDate(data?.etl?.lastRun ?? null)}</span>
        <Badge variant={data?.etl?.status === "success" ? "success" : data?.etl?.status === "error" ? "destructive" : "secondary"}>
          {data?.etl?.status === "success" ? "成功" : data?.etl?.status === "error" ? "失败" : data?.etl?.status === "running" ? "运行中" : "未运行"}
        </Badge>
      </div>
      {data?.etl?.log && (
        <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">{data.etl.log}</pre>
      )}
    </CardContent>
  </Card>
</div>)}

{/* ── Tab 2: Import ── */}
{tab === "import" && (<div className="space-y-6">
  <Card>
    <CardHeader><CardTitle>选择数据类别</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2">
        {(Object.keys(CAT_CFG) as UploadCategory[]).map((k) => (
          <Button key={k} size="sm" variant={uploadCat === k ? "default" : "outline"} onClick={() => { setUploadCat(k); setUploadMsg(""); }}>
            {CAT_CFG[k].label}
          </Button>
        ))}
      </div>

      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0] && fileRef.current) { const dt = new DataTransfer(); dt.items.add(e.dataTransfer.files[0]); fileRef.current.files = dt.files; fileRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }}
      >
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          拖拽文件到此处或点击选择 · {CAT_CFG[uploadCat].desc} · 最大 50MB
        </p>
        <input ref={fileRef} type="file" className="hidden" accept={CAT_CFG[uploadCat].accept} onChange={handleUpload} />
      </div>

      {uploading && <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />上传中...</div>}
      {uploadMsg && (
        <div className={`text-sm p-3 rounded-lg ${uploadMsg.startsWith("✓") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {uploadMsg}
        </div>
      )}
    </CardContent>
  </Card>

  <Card>
    <CardHeader><CardTitle>已有文件 — {CAT_CFG[uploadCat].label}</CardTitle></CardHeader>
    <CardContent>
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">暂无文件</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">文件名</th>
              <th className="pb-2 font-medium">大小</th>
              <th className="pb-2 font-medium">修改时间</th>
              <th className="pb-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.path} className="border-b last:border-0">
                <td className="py-3"><FileText className="h-4 w-4 inline mr-1 text-muted-foreground" />{f.name}</td>
                <td className="py-3">{fmtSize(f.sizeBytes)}</td>
                <td className="py-3">{fmtDate(f.modifiedAt)}</td>
                <td className="py-3">
                  <button className="text-xs text-red-600 hover:text-red-800" onClick={() => deleteFile(uploadCat === "document" ? "document" : uploadCat === "analytics" ? "analytics" : uploadCat === "custom" ? "custom" : "raw-file", f.name)}>
                    <Trash2 className="h-3.5 w-3.5 inline mr-0.5" />删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CardContent>
  </Card>
</div>)}

{/* ── Tab 3: Knowledge Base ── */}
{tab === "kb" && (<div className="space-y-6">
  <div className="flex items-center gap-4">
    <span className="text-sm text-muted-foreground">共 {kbList.length} 条</span>
    {Object.entries(KB_CAT).map(([k, v]) => {
      const cnt = kbList.filter((e) => e.category === k).length;
      return cnt > 0 ? <Badge key={k} variant="secondary">{v} {cnt}</Badge> : null;
    })}
    <div className="ml-auto">
      <Button size="sm" variant="outline" disabled={etlRunning} onClick={() => runETL("extract-docs")}>
        {etlRunning ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
        重建知识库
      </Button>
    </div>
  </div>

  <Card>
    <CardContent className="p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">标题</th>
            <th className="p-3 font-medium">分类</th>
            <th className="p-3 font-medium">标签</th>
            <th className="p-3 font-medium">日期</th>
            <th className="p-3 font-medium">字数</th>
            <th className="p-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {kbList.map((e) => (
            <tr key={e.id} className="border-b last:border-0">
              <td className="p-3 font-mono text-xs">{e.id}</td>
              <td className="p-3 font-medium max-w-[200px] truncate">{e.title}</td>
              <td className="p-3"><Badge variant="outline">{KB_CAT[e.category] || e.category}</Badge></td>
              <td className="p-3">{e.tags?.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="mr-1 text-xs">{t}</Badge>)}</td>
              <td className="p-3 text-xs">{e.date || "—"}</td>
              <td className="p-3">{e.contentLength?.toLocaleString() || "—"}</td>
              <td className="p-3 space-x-2">
                <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => previewKB(e.id)}>
                  <Eye className="h-3.5 w-3.5 inline mr-0.5" />预览
                </button>
                <button className="text-xs text-red-600 hover:text-red-800" onClick={() => deleteFile("kb-entry", e.id)}>
                  <Trash2 className="h-3.5 w-3.5 inline mr-0.5" />删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {kbList.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">暂无知识库条目</p>}
    </CardContent>
  </Card>
</div>)}
        </TabsContent>
      </Tabs>

{/* ── Preview Modal ── */}
{preview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPreview(null)}>
    <div className="bg-background rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{preview.title}</h3>
        <button onClick={() => setPreview(null)}><X className="h-5 w-5" /></button>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">{KB_CAT[preview.category] || preview.category}</Badge>
          {preview.tags?.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          {preview.date && <span className="text-muted-foreground">{preview.date}</span>}
        </div>
        {preview.summary && <p className="text-sm text-muted-foreground">{preview.summary}</p>}
        <div className="text-sm whitespace-pre-wrap bg-muted rounded-lg p-4">{preview.content}</div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
