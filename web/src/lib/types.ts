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

export interface DocWriterRequest {
  docType: "summary" | "report" | "briefing" | "plan" | "experience";
  timePeriod?: string;
  keyPoints?: string;
  reference?: string;
}

// Plan management types
export interface PlanRecord {
  id: string;
  month: string;
  title: string;
  content: string;
  createdAt: string;
  version: number;
  status: "draft" | "active" | "archived";
}

export interface PlanTask {
  id: string;
  planId: string;
  title: string;
  description: string;
  assignee: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "P0" | "P1" | "P2";
  dueDate: string;
  week: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanVersion {
  id: string;
  planId: string;
  version: number;
  content: string;
  changeNote: string;
  createdAt: string;
}

// Human review workflow types
export interface HumanReviewStage {
  role: string;
  reviewer: string;
  action: "approve" | "reject" | "revise" | "pending";
  comment: string;
  timestamp: string;
}

export interface ReviewRecord {
  id: string;
  content: string;
  platform: string;
  aiResult: ReviewResult;
  humanStages: HumanReviewStage[];
  status: "pending_human" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Courseware types
export interface CoursewareRequest {
  audience: string;
  topic: string;
  duration: string;
  format: string;
}

// Publish types
export interface PublishJob {
  id: string;
  content: string;
  platforms: string[];
  status: "draft" | "publishing" | "published" | "failed";
  results: { platform: string; status: string; url?: string }[];
  createdAt: string;
}

// Sentiment types
export interface SentimentItem {
  id: string;
  title: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  heat: number;
  time: string;
  summary: string;
}

export interface SentimentData {
  period: string;
  items: SentimentItem[];
  distribution: { sentiment: string; count: number }[];
  trend: { date: string; positive: number; negative: number; neutral: number }[];
  hotWords: { word: string; count: number }[];
  alerts: { level: string; title: string; description: string; time: string }[];
}

// Complaint/opinion types
export interface ComplaintItem {
  id: string;
  category: string;
  content: string;
  source: string;
  sentiment: string;
  time: string;
  status: string;
}

export interface ComplaintData {
  period: string;
  items: ComplaintItem[];
  categoryStats: { category: string; count: number; percentage: number }[];
  trendByMonth: { month: string; count: number }[];
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
