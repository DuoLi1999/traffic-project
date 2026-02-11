import {
  simulateContentProducer,
  simulateContentReviewer,
  simulatePlanManager,
  simulateEmergencyResponse,
  simulateQA,
} from "./skills";
import { callLLM } from "./llm";
import { callOpenClaw } from "./openclaw";
import { getAllAnalytics, getAccidentData } from "./data";
import type { ReviewResult, PlatformAnalytics, AccidentData } from "./types";

type SkillMode = "simulated" | "llm" | "openclaw";

function getSkillMode(): SkillMode {
  const mode = process.env.SKILL_MODE || "simulated";
  if (mode === "llm" || mode === "openclaw") return mode;
  return "simulated";
}

// ── Data serialization helpers ──

function serializeAnalytics(data: PlatformAnalytics[]): string {
  const lines: string[] = [];

  for (const d of data) {
    const name =
      d.platform === "wechat" ? "微信公众号" :
      d.platform === "weibo" ? "微博" : "抖音";
    const reads = d.summary.totalReads || d.summary.totalViews || 0;

    lines.push(`### ${name}（${d.period}）`);
    lines.push(`- 发布量：${d.summary.totalPosts}篇`);
    lines.push(`- 总阅读/播放量：${reads.toLocaleString()}`);
    lines.push(`- 总点赞：${d.summary.totalLikes.toLocaleString()}`);
    lines.push(`- 总转发：${d.summary.totalShares.toLocaleString()}`);
    lines.push(`- 总评论：${d.summary.totalComments.toLocaleString()}`);
    lines.push(`- 新增关注：${d.summary.newFollowers}`);
    lines.push(`- 平均互动率：${(d.summary.avgInteractionRate * 100).toFixed(1)}%`);

    if (d.weeklyTrend.length > 0) {
      lines.push(`\n周度趋势：`);
      for (const w of d.weeklyTrend) {
        const wr = w.reads || w.views || 0;
        lines.push(`  第${w.week}周：发布${w.posts}篇，阅读${wr.toLocaleString()}，点赞${w.likes}，转发${w.shares}`);
      }
    }

    if (d.topContent.length > 0) {
      lines.push(`\n热门内容 Top ${Math.min(d.topContent.length, 5)}：`);
      for (const c of d.topContent.slice(0, 5)) {
        const cr = c.reads || c.views || 0;
        lines.push(`  「${c.title}」(${c.publishDate}) — 阅读${cr.toLocaleString()}，互动率${(c.interactionRate * 100).toFixed(1)}%，主题：${c.topic}`);
      }
    }

    if (d.topicAnalysis.length > 0) {
      lines.push(`\n主题表现：`);
      for (const t of d.topicAnalysis) {
        const tr = t.avgReads || t.avgViews || 0;
        lines.push(`  ${t.topic}：${t.posts}篇，篇均阅读${tr.toLocaleString()}，平均互动率${(t.avgInteractionRate * 100).toFixed(1)}%`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

function serializeAccidentData(accident: AccidentData): string {
  const lines: string[] = [];

  lines.push(`数据期间：${accident.period}，地区：${accident.region}`);
  lines.push(`\n### 总体概况`);
  lines.push(`- 事故总数：${accident.overview.totalAccidents}起`);
  lines.push(`- 死亡人数：${accident.overview.totalFatalities}人`);
  lines.push(`- 受伤人数：${accident.overview.totalInjuries}人`);
  lines.push(`- 财产损失：${accident.overview.totalPropertyDamage.toLocaleString()}万元`);
  lines.push(`- 事故同比变化：${accident.overview.yoyAccidentChange > 0 ? "+" : ""}${(accident.overview.yoyAccidentChange * 100).toFixed(1)}%`);
  lines.push(`- 死亡同比变化：${accident.overview.yoyFatalityChange > 0 ? "+" : ""}${(accident.overview.yoyFatalityChange * 100).toFixed(1)}%`);

  lines.push(`\n### 事故类型分布`);
  for (const t of accident.byAccidentType) {
    lines.push(`- ${t.type}：${t.count}起（占${(t.percentage * 100).toFixed(1)}%），死亡${t.fatalities}人`);
  }

  lines.push(`\n### 违法类型分布`);
  for (const v of accident.byViolationType) {
    lines.push(`- ${v.type}：${v.count}起（占${(v.percentage * 100).toFixed(1)}%）${v.fatalities !== undefined ? `，死亡${v.fatalities}人` : ""}`);
  }

  lines.push(`\n### 高风险区域`);
  for (const a of accident.highRiskAreas) {
    lines.push(`- ${a.location}（${a.type}）：${a.accidents}起事故，死亡${a.fatalities}人，主因：${a.mainCause}，风险等级：${a.riskLevel}，季节特征：${a.seasonalPattern}`);
  }

  lines.push(`\n### 高风险群体`);
  for (const g of accident.highRiskGroups) {
    lines.push(`- ${g.group}：涉及${g.involvedAccidents}起（占${(g.percentage * 100).toFixed(1)}%），主要违法：${g.mainViolation}，风险等级：${g.riskLevel}`);
  }

  lines.push(`\n### 天气关联`);
  for (const w of accident.weatherRelated) {
    lines.push(`- ${w.weather}：${w.accidents}起（占${(w.percentage * 100).toFixed(1)}%）`);
  }

  lines.push(`\n### 时段分布`);
  for (const t of accident.timeDistribution) {
    lines.push(`- ${t.period}：${t.accidents}起事故，死亡${t.fatalities}人`);
  }

  return lines.join("\n");
}

// ── User message construction ──

const PLATFORM_NAMES: Record<string, string> = {
  wechat: "微信公众号",
  weibo: "微博",
  douyin: "抖音",
};

const CONTENT_TYPE_NAMES: Record<string, string> = {
  article: "推文/文章",
  short: "短文",
  "video-script": "短视频脚本",
};

function buildUserMessage(
  skillName: string,
  params: Record<string, unknown>
): string {
  switch (skillName) {
    case "content-producer": {
      const platform = PLATFORM_NAMES[params.platform as string] || params.platform;
      const contentType = CONTENT_TYPE_NAMES[params.contentType as string] || params.contentType || "推文";
      const style = params.style || "温馨提醒";

      return `请为我生成一篇交通安全宣传内容。

主题：${params.topic}
目标平台：${platform}
内容类型：${contentType}
语气风格：${style}

要求：
- 严格遵循${platform}平台的内容规范和字数要求
- 在合适位置标注 [配图建议: 描述]
- 内容要有交警宣传的专业性，同时保持可读性
- 引用数据请标注"据统计""数据显示"等，不编造具体数字
- 案例描述必须脱敏处理`;
    }

    case "content-reviewer": {
      return `请对以下交通安全宣传内容进行三级审核（初审：格式与敏感词检查；复审：内容质量检查；终审：政策合规检查）。

待审核内容：

${params.content}

请严格按照以下 JSON 格式输出审核结果，用 \`\`\`json\`\`\` 包裹：

\`\`\`json
{
  "id": "review-时间戳",
  "contentFile": "用户输入内容",
  "stages": [
    {
      "stage": "ai_first_review",
      "stageName": "初审：格式与敏感词",
      "result": "pass 或 warning 或 block",
      "issues": [
        {
          "level": "warning 或 block",
          "category": "检查项分类",
          "text": "问题描述",
          "suggestion": "修改建议",
          "location": "问题所在位置"
        }
      ],
      "timestamp": "ISO时间"
    },
    {
      "stage": "ai_quality_review",
      "stageName": "复审：内容质量",
      "result": "...",
      "issues": [],
      "timestamp": "..."
    },
    {
      "stage": "ai_compliance_review",
      "stageName": "终审：政策合规",
      "result": "...",
      "issues": [],
      "timestamp": "..."
    }
  ],
  "finalResult": "approved 或 revision_required 或 rejected",
  "summary": "审核总结"
}
\`\`\`

判定规则：三级全部 pass → approved；任一级 warning 且无 block → revision_required；任一级 block → rejected。
如果没有发现问题，issues 数组留空，result 为 "pass"。`;
    }

    case "plan-manager": {
      const month = params.month as string;
      const focus = params.focus as string | undefined;

      // Embed analytics summary for data-driven planning
      let dataContext = "";
      try {
        const analytics = getAllAnalytics();
        if (analytics.length > 0) {
          dataContext += `\n\n以下是上月（2026年1月）各平台传播效果数据，请参考优化本月计划：\n\n${serializeAnalytics(analytics)}`;
        }
      } catch { /* data not available */ }

      try {
        const accident = getAccidentData();
        dataContext += `\n\n以下是2025年度事故数据摘要，请据此识别${month}月的安全风险重点：\n\n${serializeAccidentData(accident)}`;
      } catch { /* data not available */ }

      const focusLine = focus
        ? `\n- 本月重点方向：${focus}`
        : "";

      return `请制定2026年${month}月的月度交通安全宣传计划。

要求：
- 结合${month}月的节假日、季节特征、安全风险制定计划${focusLine}
- 包含4周的周度计划（每周含主题、内容方向、形式、渠道、发布时间、配合活动）
- 按优先级列出 P0 必做内容、P1 建议内容、P2 机动内容
- 列出资源需求（各类型内容数量）和效果预期
- 参考下方的传播效果数据和事故数据，确保宣传重点与安全风险精准匹配${dataContext}`;
    }

    case "analytics": {
      // Embed full analytics data
      let dataContent = "";
      try {
        const analytics = getAllAnalytics();
        dataContent = serializeAnalytics(analytics);
      } catch { /* data not available */ }

      return `请基于以下各平台传播数据，生成2026年1月的月度效果分析报告。

要求：
- 汇总三个平台的核心指标（总发布量、总阅读/播放量、总互动量、新增关注）
- 分平台详细分析各项指标
- 列出阅读量 Top 5 和互动率 Top 5 的内容
- 分析各主题的传播效果差异
- 分析周度变化趋势
- 基于数据给出内容策略、发布策略、互动运营三方面的优化建议
- 所有数值必须来自下方提供的真实数据，不得编造

各平台传播数据：

${dataContent}`;
    }

    case "precision-outreach": {
      // Embed full accident data
      let accidentContent = "";
      try {
        const accident = getAccidentData();
        accidentContent = serializeAccidentData(accident);
      } catch { /* data not available */ }

      return `请基于以下事故数据，生成精准宣传分析报告，识别高风险区域和高风险人群，并为每个风险维度制定定向宣传方案。

要求：
- 对高风险区域按风险等级和事故数排序，分析主要原因和季节特征，制定区域定向宣传方案（含宣传主题、内容策略、投放渠道、投放时机）
- 对高风险人群按涉事占比排序，分析违法行为特征，制定人群定向宣传方案（含宣传主题、内容风格、投放渠道、配合举措）
- 分析致死率最高的违法类型，给出宣传策略
- 分析事故高发时段和天气影响
- 给出综合宣传策略建议（短期、中期、长期）
- 所有分析必须基于下方提供的真实数据，不得编造

2025年度事故数据：

${accidentContent}`;
    }

    case "emergency-response":
      return `启动应急宣传响应，请根据以下预警信息快速生成应急宣传内容包。

事件类型：${params.eventType}
预警等级：${params.alertLevel}
影响区域：${params.area}
事件详情：${params.description}

请生成完整的应急宣传内容包，包含：
1. 微信公众号安全提示推文（500-800字，正式但紧迫）
2. 微博安全提示短文（140字以内，含话题标签）
3. 抖音短视频文案（200字以内，口语化但严肃）
4. 安全行车要点（3-5条具体可操作的提示）
5. 绕行建议（如涉及道路）

内容要求：
- 预警等级必须与输入一致，不得自行升降级
- 安全提示必须实用可操作，避免空洞套话
- 末尾标注"应急发布，请人工快速确认后发布"`;

    case "public-relations":
      return `我是一位市民，想咨询交通业务相关问题：${params.question}

请以交警业务窗口智能客服的身份回答，要求：
- 先用1-2句话直接回答核心问题
- 如涉及办理业务，列出所需材料和办理流程
- 说明线上（交管12123 APP）和线下办理渠道
- 列出注意事项
- 引用法律法规请标注具体条款
- 末尾提示"以上信息仅供参考，具体政策以当地规定为准"`;

    default:
      return JSON.stringify(params);
  }
}

// ── Simulated mode ──

function invokeSimulated(
  skillName: string,
  params: Record<string, unknown>
): string | ReviewResult {
  switch (skillName) {
    case "content-producer":
      return simulateContentProducer({
        topic: params.topic as string,
        platform: params.platform as "wechat" | "weibo" | "douyin",
        contentType: (params.contentType as "article" | "short" | "video-script") || "article",
        style: params.style as string | undefined,
      });

    case "content-reviewer":
      return simulateContentReviewer({
        content: params.content as string,
        platform: params.platform as string | undefined,
      });

    case "plan-manager":
      return simulatePlanManager({
        month: params.month as string,
      });

    case "analytics": {
      const data = getAllAnalytics();
      const totalPosts = data.reduce((s, d) => s + d.summary.totalPosts, 0);
      const totalReach = data.reduce(
        (s, d) => s + (d.summary.totalReads || d.summary.totalViews || 0),
        0
      );
      const totalInteractions = data.reduce(
        (s, d) =>
          s +
          d.summary.totalLikes +
          d.summary.totalShares +
          d.summary.totalComments,
        0
      );

      return `# 2026年1月 月度效果分析报告

## 核心指标

| 指标 | 数值 |
|------|------|
| 总发布量 | ${totalPosts}篇/条 |
| 总阅读/播放量 | ${totalReach.toLocaleString()} |
| 总互动量 | ${totalInteractions.toLocaleString()} |
| 新增关注 | ${data.reduce((s, d) => s + d.summary.newFollowers, 0).toLocaleString()} |

## 平台表现

${data
  .map((d) => {
    const name =
      d.platform === "wechat"
        ? "微信公众号"
        : d.platform === "weibo"
          ? "微博"
          : "抖音";
    const reads = d.summary.totalReads || d.summary.totalViews || 0;
    return `### ${name}
- 发布量：${d.summary.totalPosts}篇
- 阅读量：${reads.toLocaleString()}
- 互动率：${(d.summary.avgInteractionRate * 100).toFixed(1)}%
- 新增关注：${d.summary.newFollowers}`;
  })
  .join("\n\n")}

## 优化建议

1. **内容策略**：交警正能量类内容互动率最高，建议增加此类内容占比
2. **发布策略**：抖音平台表现突出，建议加大短视频投入
3. **互动运营**：微博评论互动活跃，建议加强评论区运营
`;
    }

    case "precision-outreach": {
      const accident = getAccidentData();
      return `# 精准宣传分析报告

## 分析日期
${new Date().toISOString().split("T")[0]}

## 高风险区域分析

${accident.highRiskAreas
  .map(
    (a, i) => `### ${i + 1}. ${a.location}
- **道路类型**：${a.type}
- **事故数量**：${a.accidents}起，死亡${a.fatalities}人
- **主要原因**：${a.mainCause}
- **风险等级**：${a.riskLevel}
- **季节特征**：${a.seasonalPattern}
- **建议宣传方案**：针对${a.mainCause}，在${a.seasonalPattern.replace("高发", "")}加强宣传，采用${a.type === "高速公路" ? "电子情报板+微博实时播报" : a.type.includes("农村") ? "村委广播+入户宣传" : "路口LED屏+微信推文"}方式`
  )
  .join("\n\n")}

## 高风险群体分析

${accident.highRiskGroups
  .map(
    (g, i) => `### ${i + 1}. ${g.group}
- **涉及事故**：${g.involvedAccidents}起（占${(g.percentage * 100).toFixed(1)}%）
- **主要违法**：${g.mainViolation}
- **风险等级**：${g.riskLevel}
- **建议宣传方案**：针对${g.group}群体，重点宣传${g.mainViolation}的危害和处罚，通过${g.group.includes("骑手") ? "企业座谈+抖音短视频" : g.group.includes("老年") ? "社区宣传+子女转告" : g.group.includes("学生") ? "校园安全课+动画视频" : "微信推文+路面宣传"}方式`
  )
  .join("\n\n")}
`;
    }

    case "emergency-response":
      return simulateEmergencyResponse({
        eventType: params.eventType as string,
        alertLevel: params.alertLevel as string,
        area: params.area as string,
        description: params.description as string,
      });

    case "public-relations":
      return simulateQA({
        question: params.question as string,
      });

    default:
      throw new Error(`Unknown skill: ${skillName}`);
  }
}

// ── ReviewResult parsing ──

function parseReviewResult(text: string): ReviewResult {
  // Try to extract JSON from ```json``` block
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1]);
      if (parsed.stages && parsed.finalResult) {
        return parsed as ReviewResult;
      }
    } catch { /* fall through */ }
  }

  // Try to find a JSON object with required fields
  const jsonObjMatch = text.match(/(\{[\s\S]*"finalResult"[\s\S]*\})/);
  if (jsonObjMatch) {
    try {
      const parsed = JSON.parse(jsonObjMatch[1]);
      if (parsed.stages && parsed.finalResult) {
        return parsed as ReviewResult;
      }
    } catch { /* fall through */ }
  }

  // Try parsing entire text as JSON
  try {
    const parsed = JSON.parse(text);
    if (parsed.stages && parsed.finalResult) {
      return parsed as ReviewResult;
    }
  } catch { /* fall through */ }

  // Fallback: parse markdown review into structured stages
  return parseMarkdownReview(text);
}

function parseMarkdownReview(text: string): ReviewResult {
  const now = new Date().toISOString();
  const stages: ReviewResult["stages"] = [];

  // Try to extract stages from markdown headers
  const stagePatterns = [
    { pattern: /初审[：:]?\s*格式[与和]?敏感词/i, stage: "ai_first_review", name: "初审：格式与敏感词" },
    { pattern: /复审[：:]?\s*内容质量/i, stage: "ai_quality_review", name: "复审：内容质量" },
    { pattern: /终审[：:]?\s*政策合规/i, stage: "ai_compliance_review", name: "终审：政策合规" },
  ];

  for (const sp of stagePatterns) {
    if (sp.pattern.test(text)) {
      // Extract the section for this stage
      const hasBlock = /block|阻断|不通过|必须修改/i.test(text);
      const hasWarning = /warning|警告|建议修改/i.test(text);
      stages.push({
        stage: sp.stage,
        stageName: sp.name,
        result: hasBlock ? "block" : hasWarning ? "warning" : "pass",
        issues: [],
        timestamp: now,
      });
    }
  }

  // If we couldn't parse stages, create a single AI review stage
  if (stages.length === 0) {
    stages.push({
      stage: "ai_review",
      stageName: "AI 综合审核",
      result: "warning",
      issues: [
        {
          level: "warning",
          category: "AI审核意见",
          text: "AI 返回了非结构化审核意见，请参考总结",
          suggestion: text.length > 500 ? text.slice(0, 500) + "..." : text,
          location: "全文",
        },
      ],
      timestamp: now,
    });
  }

  const hasBlock = stages.some((s) => s.result === "block");
  const hasWarning = stages.some((s) => s.result === "warning");

  return {
    id: `review-${Date.now()}`,
    contentFile: "用户输入内容",
    stages,
    finalResult: hasBlock ? "rejected" : hasWarning ? "revision_required" : "approved",
    summary: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
  };
}

// ── Main entry point ──

export async function invokeSkill(
  skillName: string,
  params: Record<string, unknown>
): Promise<string | ReviewResult> {
  const mode = getSkillMode();

  if (mode === "simulated") {
    return invokeSimulated(skillName, params);
  }

  const userMessage = buildUserMessage(skillName, params);

  let rawResult: string;

  if (mode === "llm") {
    rawResult = await callLLM(skillName, userMessage, params);
  } else {
    rawResult = await callOpenClaw(userMessage);
  }

  // content-reviewer needs structured ReviewResult for the frontend
  if (skillName === "content-reviewer") {
    return parseReviewResult(rawResult);
  }

  return rawResult;
}
