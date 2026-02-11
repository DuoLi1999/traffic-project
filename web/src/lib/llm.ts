import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SKILLS_ROOT = path.join(process.cwd(), "..", ".agents", "skills");
const DATA_ROOT = path.join(process.cwd(), "..", "data");
const TEMPLATES_ROOT = path.join(process.cwd(), "..", "templates");

function readFileOrEmpty(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function readSkillPrompt(skillName: string): string {
  return readFileOrEmpty(path.join(SKILLS_ROOT, skillName, "SKILL.md"));
}

function readTemplate(name: string): string {
  return readFileOrEmpty(path.join(TEMPLATES_ROOT, name));
}

function readDataJSON(filePath: string): string {
  const content = readFileOrEmpty(path.join(DATA_ROOT, filePath));
  if (!content) return "";
  try {
    // Pretty-print for readability in the prompt
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
}

function buildContext(skillName: string, params: Record<string, unknown>): string {
  const parts: string[] = [];

  switch (skillName) {
    case "content-producer": {
      const platform = params.platform as string;
      if (platform) {
        const template = readTemplate(`content-${platform}.md`);
        if (template) parts.push(`## ${platform} 平台内容模板\n\n${template}`);
      } else {
        for (const p of ["wechat", "weibo", "douyin"]) {
          const t = readTemplate(`content-${p}.md`);
          if (t) parts.push(`## ${p} 平台内容模板\n\n${t}`);
        }
      }
      break;
    }
    case "content-reviewer": {
      const checklist = readTemplate("review-checklist.md");
      if (checklist) parts.push(`## 审核检查清单\n\n${checklist}`);
      break;
    }
    case "plan-manager": {
      const planTemplate = readTemplate("plan-monthly.md");
      if (planTemplate) parts.push(`## 月度计划模板\n\n${planTemplate}`);
      for (const platform of ["wechat", "weibo", "douyin"]) {
        const data = readDataJSON(`analytics/${platform}-202601.json`);
        if (data) parts.push(`## ${platform} 传播数据 (2026年1月)\n\n\`\`\`json\n${data}\n\`\`\``);
      }
      const accidentData = readDataJSON("accident-data/2025-summary.json");
      if (accidentData) parts.push(`## 2025年事故数据\n\n\`\`\`json\n${accidentData}\n\`\`\``);
      break;
    }
    case "analytics": {
      for (const platform of ["wechat", "weibo", "douyin"]) {
        const data = readDataJSON(`analytics/${platform}-202601.json`);
        if (data) parts.push(`## ${platform} 传播数据 (2026年1月)\n\n\`\`\`json\n${data}\n\`\`\``);
      }
      const reportTemplate = readTemplate("report-monthly.md");
      if (reportTemplate) parts.push(`## 月度报告模板\n\n${reportTemplate}`);
      break;
    }
    case "precision-outreach": {
      const accidentData = readDataJSON("accident-data/2025-summary.json");
      if (accidentData) parts.push(`## 2025年事故数据\n\n\`\`\`json\n${accidentData}\n\`\`\``);
      break;
    }
    // emergency-response and public-relations: no extra context needed
  }

  if (parts.length === 0) return "";
  return "\n\n---\n\n# 参考数据与模板\n\n" + parts.join("\n\n---\n\n");
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export async function callLLM(
  skillName: string,
  userMessage: string,
  params: Record<string, unknown> = {}
): Promise<string> {
  const systemPrompt = readSkillPrompt(skillName);
  if (!systemPrompt) {
    throw new Error(`Skill "${skillName}" not found: missing SKILL.md`);
  }

  const context = buildContext(skillName, params);
  const fullSystem = systemPrompt + context;

  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: fullSystem,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text ?? "";
}
