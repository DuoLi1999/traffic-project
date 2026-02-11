# skills-traffic

交通安全宣传教育智能化平台 Agent Skill 包。

## 概述

本包包含 8 个独立的 Agent Skill，覆盖交通安全宣传教育工作的完整链路：内容生产、内容审核、计划管理、效果分析、精准宣传、应急响应、公众服务和素材管理。

## Skill 目录

| Skill | 目录 | 说明 |
|-------|------|------|
| 内容生产助手 | `content-producer/` | 生成微信/微博/抖音多平台宣传文案、海报方案、视频脚本 |
| 内容审核助手 | `content-reviewer/` | 三级审核（格式敏感词、内容质量、政策合规） |
| 计划管理助手 | `plan-manager/` | 月度宣传计划制定与排期 |
| 效果分析助手 | `analytics/` | 基于传播数据的月度效果分析报告 |
| 精准宣传助手 | `precision-outreach/` | 基于事故数据的高风险区域/人群定向宣传方案 |
| 应急响应助手 | `emergency-response/` | 恶劣天气/突发事件应急宣传内容包 |
| 交通业务客服 | `public-relations/` | 驾驶证、车辆、违章、事故等业务咨询 |
| 素材中枢 | `media-hub/` | 素材搜索、自动标引、素材统计 |

## 目录结构

```
skills-traffic/
├── README.md
├── package.json
├── _shared/              # 多 Skill 共用资源
│   ├── references/       # 共享参考文档
│   ├── assets/           # 共享模板和数据
│   └── scripts/          # 工具脚本
├── content-producer/
├── content-reviewer/
├── plan-manager/
├── analytics/
├── precision-outreach/
├── emergency-response/
├── public-relations/
└── media-hub/
```

每个 Skill 目录结构：

```
{skill-name}/
├── SKILL.md              # Skill 定义（含 frontmatter）
├── references/           # 参考文档（规则、示例等）
├── assets/               # 模板、schema、数据
└── scripts/              # 工具脚本（如有）
```

## 使用方式

### OpenClaw 集成

在 OpenClaw 配置中指定 Skill 包路径：

```yaml
skills:
  source: ./skills-traffic
```

### 单独使用

每个 Skill 的 `SKILL.md` 文件包含完整的指令定义，可直接作为 Agent 的 system prompt 使用。`references/` 中的文档作为上下文补充，`assets/` 中的模板和数据供 Skill 运行时读取。

## 共享资源

`_shared/` 目录包含多个 Skill 共用的资源：

- `references/content-redlines.md` — 内容红线规则
- `references/platform-specs.md` — 三平台格式规范
- `references/writing-style-guide.md` — 统一写作风格指南
- `assets/templates/` — 各平台内容模板
- `assets/data/` — 分析数据、事故数据、素材数据
- `scripts/validate-data.sh` — JSON 数据校验脚本

## 数据校验

```bash
bash skills-traffic/_shared/scripts/validate-data.sh
```
