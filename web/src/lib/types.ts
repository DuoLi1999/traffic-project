// Material types
export interface MaterialSummary {
  id: string;
  title: string;
  type: "video" | "image";
  tags: string[];
}

export interface MaterialDetail extends MaterialSummary {
  filename: string;
  source: string;
  description: string;
  location: string;
  date: string;
  usageCount: number;
}

export interface MaterialIndex {
  version: string;
  lastUpdated: string;
  totalCount: number;
  materials: MaterialSummary[];
}

// Analytics types
export interface AnalyticsSummary {
  totalPosts: number;
  totalReads?: number;
  totalViews?: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  newFollowers: number;
  avgReadPerPost?: number;
  avgViewsPerPost?: number;
  avgInteractionRate: number;
  avgCompletionRate?: number;
}

export interface WeeklyTrend {
  week: number;
  posts: number;
  reads?: number;
  views?: number;
  likes: number;
  shares: number;
  completionRate?: number;
}

export interface TopContent {
  title: string;
  publishDate: string;
  reads?: number;
  views?: number;
  likes: number;
  shares: number;
  comments: number;
  interactionRate: number;
  completionRate?: number;
  topic: string;
}

export interface TopicAnalysis {
  topic: string;
  posts: number;
  avgReads?: number;
  avgViews?: number;
  avgInteractionRate: number;
  avgCompletionRate?: number;
}

export interface PlatformAnalytics {
  platform: string;
  period: string;
  summary: AnalyticsSummary;
  weeklyTrend: WeeklyTrend[];
  topContent: TopContent[];
  topicAnalysis: TopicAnalysis[];
}

// Accident data types
export interface AccidentOverview {
  totalAccidents: number;
  totalFatalities: number;
  totalInjuries: number;
  totalPropertyDamage: number;
  yoyAccidentChange: number;
  yoyFatalityChange: number;
}

export interface MonthlyTrend {
  month: number;
  accidents: number;
  fatalities: number;
  injuries: number;
}

export interface AccidentType {
  type: string;
  count: number;
  percentage: number;
  fatalities: number;
}

export interface ViolationType {
  type: string;
  count: number;
  percentage: number;
  fatalities?: number;
}

export interface HighRiskArea {
  location: string;
  type: string;
  accidents: number;
  fatalities: number;
  mainCause: string;
  riskLevel: string;
  seasonalPattern: string;
}

export interface HighRiskGroup {
  group: string;
  involvedAccidents: number;
  percentage: number;
  mainViolation: string;
  riskLevel: string;
}

export interface WeatherRelated {
  weather: string;
  accidents: number;
  percentage: number;
}

export interface TimeDistribution {
  period: string;
  accidents: number;
  fatalities: number;
}

export interface AccidentData {
  period: string;
  generatedDate: string;
  region: string;
  overview: AccidentOverview;
  monthlyTrend: MonthlyTrend[];
  byAccidentType: AccidentType[];
  byViolationType: ViolationType[];
  highRiskAreas: HighRiskArea[];
  highRiskGroups: HighRiskGroup[];
  weatherRelated: WeatherRelated[];
  timeDistribution: TimeDistribution[];
}

// Review types
export interface ReviewIssue {
  level: "warning" | "block";
  category: string;
  text: string;
  suggestion: string;
  location: string;
}

export interface ReviewStage {
  stage: string;
  stageName: string;
  result: "pass" | "warning" | "block";
  issues: ReviewIssue[];
  timestamp: string;
}

export interface ReviewResult {
  id: string;
  contentFile: string;
  stages: ReviewStage[];
  finalResult: "approved" | "revision_required" | "rejected";
  summary: string;
}

// Skill request/response types
export interface ContentProducerRequest {
  topic: string;
  platform: "wechat" | "weibo" | "douyin";
  contentType: "article" | "short" | "video-script";
  style?: string;
}

export interface ContentReviewerRequest {
  content: string;
  platform?: string;
}

export interface PlanManagerRequest {
  month: string;
}

export interface EmergencyRequest {
  eventType: string;
  alertLevel: string;
  area: string;
  description: string;
}

export interface QARequest {
  question: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
