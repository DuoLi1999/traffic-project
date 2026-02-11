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
import type { ReviewResult } from "./types";

type SkillMode = "simulated" | "llm" | "openclaw";

function getSkillMode(): SkillMode {
  const mode = process.env.SKILL_MODE || "simulated";
  if (mode === "llm" || mode === "openclaw") return mode;
  return "simulated";
}

// Build a natural-language user message from skill params
function buildUserMessage(
  skillName: string,
  params: Record<string, unknown>
): string {
  switch (skillName) {
    case "content-producer":
      return `请为我写一篇关于${params.topic}的${params.platform}宣传内容，类型是${params.contentType || "article"}${params.style ? `，风格是${params.style}` : ""}`;

    case "content-reviewer":
      return `请审核以下内容：\n\n${params.content}`;

    case "plan-manager":
      return `请制定2026年${params.month}月的月度宣传计划`;

    case "analytics":
      return `请生成2026年1月的月度效果分析报告`;

    case "precision-outreach":
      return `请基于事故数据生成精准宣传分析报告`;

    case "emergency-response":
      return `应急响应：${params.eventType}，${params.alertLevel}级预警，影响区域${params.area}，详情：${params.description}`;

    case "public-relations":
      return String(params.question || "");

    default:
      return JSON.stringify(params);
  }
}

// Simulated mode: call original simulate* functions
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

// Try to parse LLM output as ReviewResult JSON for content-reviewer
function parseReviewResult(text: string): ReviewResult {
  // Try to extract JSON from the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/(\{[\s\S]*"stages"[\s\S]*"finalResult"[\s\S]*\})/);

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.stages && parsed.finalResult) {
        return parsed as ReviewResult;
      }
    } catch {
      // fall through to wrapping
    }
  }

  // Try parsing the entire text as JSON
  try {
    const parsed = JSON.parse(text);
    if (parsed.stages && parsed.finalResult) {
      return parsed as ReviewResult;
    }
  } catch {
    // fall through to wrapping
  }

  // Wrap markdown response as a single-stage review result
  const now = new Date().toISOString();
  return {
    id: `review-${Date.now()}`,
    contentFile: "用户输入内容",
    stages: [
      {
        stage: "ai_review",
        stageName: "AI 综合审核",
        result: "warning",
        issues: [
          {
            level: "warning",
            category: "AI审核意见",
            text: "AI 返回了非结构化审核意见，请参考以下内容",
            suggestion: text,
            location: "全文",
          },
        ],
        timestamp: now,
      },
    ],
    finalResult: "revision_required",
    summary: text.slice(0, 200) + (text.length > 200 ? "..." : ""),
  };
}

/**
 * Unified skill invocation entry point.
 * Returns string for most skills, ReviewResult for content-reviewer.
 */
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
    // For content-reviewer, add JSON format instruction
    const message =
      skillName === "content-reviewer"
        ? userMessage +
          '\n\n请按照审核记录 JSON 格式输出结果（包含 id, contentFile, stages, finalResult, summary 字段），用 ```json``` 包裹。'
        : userMessage;
    rawResult = await callLLM(skillName, message, params as Record<string, unknown>);
  } else {
    rawResult = await callOpenClaw(userMessage);
  }

  // Special handling: content-reviewer needs structured ReviewResult
  if (skillName === "content-reviewer") {
    return parseReviewResult(rawResult);
  }

  return rawResult;
}
