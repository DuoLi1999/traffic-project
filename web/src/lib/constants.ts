import {
  BarChart3,
  FolderOpen,
  FileEdit,
  CheckSquare,
  Calendar,
  Target,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    group: "计划与素材",
    items: [
      { label: "计划管理", href: "/plans", icon: Calendar },
      { label: "素材库", href: "/materials", icon: FolderOpen },
    ],
  },
  {
    group: "内容工作流",
    items: [
      { label: "内容生产", href: "/content", icon: FileEdit },
      { label: "内容审核", href: "/content/review", icon: CheckSquare },
    ],
  },
  {
    group: "监测与分析",
    items: [
      { label: "传播分析", href: "/analytics", icon: BarChart3 },
      { label: "精准宣传", href: "/outreach", icon: Target },
    ],
  },
  {
    group: "响应与服务",
    items: [
      { label: "应急响应", href: "/emergency", icon: AlertTriangle },
      { label: "咨询服务", href: "/qa", icon: MessageCircle },
    ],
  },
];

export const PLATFORM_COLORS: Record<string, string> = {
  wechat: "#07C160",
  weibo: "#E6162D",
  douyin: "#000000",
};

export const PLATFORM_NAMES: Record<string, string> = {
  wechat: "微信公众号",
  weibo: "微博",
  douyin: "抖音",
};

export const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export const RISK_LEVEL_COLORS: Record<string, string> = {
  高: "#ef4444",
  中: "#f59e0b",
  低: "#10b981",
};

export const QA_QUICK_TOPICS = [
  "驾照到期怎么换证？",
  "酒驾怎么处罚？",
  "车辆年检需要什么材料？",
  "发生轻微交通事故怎么处理？",
  "违章罚款怎么交？",
  "ETC怎么办理？",
];
