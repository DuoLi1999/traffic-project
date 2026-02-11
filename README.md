# 交通安全宣传教育智能化平台

> 基于 AI Agent Skills 的交警宣传教育全链路智能化平台（PoC）

## 项目简介

本项目将交警宣传教育工作的 8 大业务场景封装为 AI Agent Skills，配套 Web 管理界面，覆盖"**计划制定 → 素材管理 → 内容生产 → 审核发布 → 效果监测 → 精准投放**"全链路。

后端支持两种 AI 调用方式，通过环境变量一键切换：

| 模式 | 说明 |
|------|------|
| `SKILL_MODE=simulated` | 本地模拟（无需 API Key，默认） |
| `SKILL_MODE=llm` | 直连 LLM API（Anthropic Claude） |
| `SKILL_MODE=openclaw` | 通过 OpenClaw Gateway 调用 |

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Next.js 14 + React 18 + TailwindCSS |
| 后端 API | Next.js API Routes |
| AI 推理 | Anthropic Claude SDK / OpenClaw Gateway |
| Skill 定义 | `.agents/skills/*/SKILL.md` |
| 数据存储 | 本地 JSON 文件 |
| 图表可视化 | Recharts |
| Markdown 渲染 | react-markdown + remark-gfm |

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/DuoLi1999/traffic-project.git
cd traffic-project
```

### 2. 安装依赖

```bash
cd web
npm install
```

### 3. 配置环境变量

复制并编辑配置文件：

```bash
cp .env.local.example .env.local
```

根据你选用的模式编辑 `.env.local`：

```env
# 模式选择：simulated | llm | openclaw
SKILL_MODE=simulated

# ── 方案 A：直连 LLM API ──
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_API_KEY=sk-xxx
# ANTHROPIC_MODEL=claude-sonnet-4-20250514  # 可选，指定模型

# ── 方案 B：OpenClaw Gateway ──
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_AUTH_TOKEN=
```

### 4. 启动开发服务

```bash
npm run dev
```

访问 http://localhost:3000

---

## 项目结构

```
traffic-project/
├── web/                                # Next.js Web 应用
│   ├── src/
│   │   ├── app/                        # 页面和 API 路由
│   │   │   ├── api/skills/             #   7 个 Skill API 端点
│   │   │   ├── api/data/               #   数据查询 API
│   │   │   ├── plans/                  #   计划管理页
│   │   │   ├── materials/              #   素材库页
│   │   │   ├── content/                #   内容生产页
│   │   │   ├── content/review/         #   内容审核页
│   │   │   ├── analytics/              #   传播分析页
│   │   │   ├── outreach/               #   精准宣传页
│   │   │   ├── emergency/              #   应急响应页
│   │   │   └── qa/                     #   咨询服务页
│   │   ├── components/                 # UI 组件
│   │   └── lib/                        # 核心逻辑
│   │       ├── skill-router.ts         #   Skill 调用路由（统一入口）
│   │       ├── llm.ts                  #   方案 A：Anthropic SDK 封装
│   │       ├── openclaw.ts             #   方案 B：OpenClaw HTTP 客户端
│   │       ├── skills.ts              #   模拟模式实现
│   │       ├── data.ts                 #   数据加载层
│   │       └── types.ts                #   TypeScript 类型定义
│   └── .env.local                      # 环境变量配置
│
├── .agents/skills/                     # 8 个 AI Skill 定义
│   ├── content-producer/SKILL.md       #   多平台内容生产
│   ├── content-reviewer/SKILL.md       #   三级内容审核
│   ├── plan-manager/SKILL.md           #   月度计划制定
│   ├── analytics/SKILL.md              #   传播效果分析
│   ├── precision-outreach/SKILL.md     #   精准宣传方案
│   ├── emergency-response/SKILL.md     #   应急宣传响应
│   ├── public-relations/SKILL.md       #   交通业务咨询
│   └── media-hub/SKILL.md              #   素材库管理
│
├── templates/                          # 内容模板
│   ├── content-wechat.md               #   微信推文模板
│   ├── content-weibo.md                #   微博内容模板
│   ├── content-douyin.md               #   抖音脚本模板
│   ├── review-checklist.md             #   审核检查清单
│   ├── plan-monthly.md                 #   月度计划模板
│   └── report-monthly.md              #   月度报告模板
│
├── data/                               # 业务数据（JSON）
│   ├── analytics/                      #   三平台传播数据
│   ├── accident-data/                  #   事故统计数据
│   └── materials/                      #   素材元数据（20条）
│
└── docs/                               # 技术文档
    └── skill-invocation-comparison.md  #   两种调用方案对比
```

---

## 功能模块

### 计划与素材

| 模块 | 页面 | 对应 Skill | 说明 |
|------|------|-----------|------|
| 计划管理 | `/plans` | plan-manager | 输入月份和重点方向，AI 生成含周度安排的月度宣传计划 |
| 素材库 | `/materials` | media-hub | 按关键词/类型搜索素材，查看素材详情 |

### 内容工作流

| 模块 | 页面 | 对应 Skill | 说明 |
|------|------|-----------|------|
| 内容生产 | `/content` | content-producer | 选平台、主题、风格，AI 生成微信/微博/抖音文案 |
| 内容审核 | `/content/review` | content-reviewer | 粘贴内容，AI 执行初审→复审→终审三级审核 |

### 监测与分析

| 模块 | 页面 | 对应 Skill | 说明 |
|------|------|-----------|------|
| 传播分析 | `/analytics` | analytics | 展示三平台数据看板 + AI 生成月度分析报告 |
| 精准宣传 | `/outreach` | precision-outreach | 基于事故数据识别高风险区域/人群，生成定向方案 |

### 响应与服务

| 模块 | 页面 | 对应 Skill | 说明 |
|------|------|-----------|------|
| 应急响应 | `/emergency` | emergency-response | 输入预警信息，AI 生成三平台应急宣传内容包 |
| 咨询服务 | `/qa` | public-relations | 交通业务智能问答（驾照、酒驾、年检、事故等） |

---

## 两种 AI 调用方案

### 方案 A：直连 LLM API（`SKILL_MODE=llm`）

Web 后端直接调用 Anthropic Claude API，自行管理 Prompt 拼装：

```
前端 → API Route → skill-router.ts
                      ├─ buildUserMessage()   → 参数转自然语言
                      └─ llm.ts
                           ├─ readSkillPrompt()  → SKILL.md 作为 system prompt
                           ├─ buildContext()      → 注入模板 + 数据到 system prompt
                           └─ Anthropic SDK       → 调用 Claude API
```

**特点**：部署简单，Prompt 控制精细，只需一个 API Key 即可运行。

### 方案 B：OpenClaw Gateway（`SKILL_MODE=openclaw`）

Web 后端将消息发给本地 OpenClaw 实例，由 Gateway 自动匹配 Skill：

```
前端 → API Route → skill-router.ts
                      ├─ buildUserMessage()   → 参数转自然语言 + 嵌入数据
                      └─ openclaw.ts
                           └─ HTTP POST → OpenClaw Gateway (localhost:18789)
                                            ├─ 自动匹配 SKILL.md
                                            ├─ 拼装 system prompt
                                            └─ 调用配置好的 LLM
```

**特点**：Skill 解耦，新增 Skill 只需编辑 SKILL.md；支持多模型切换和 Agent 高级能力。

> 详细对比见 [`docs/skill-invocation-comparison.md`](docs/skill-invocation-comparison.md)

---

## 数据说明

| 数据类型 | 文件 | 说明 |
|---------|------|------|
| 微信传播数据 | `data/analytics/wechat-202601.json` | 2026年1月微信公众号运营数据 |
| 微博传播数据 | `data/analytics/weibo-202601.json` | 2026年1月微博运营数据 |
| 抖音传播数据 | `data/analytics/douyin-202601.json` | 2026年1月抖音运营数据 |
| 事故统计 | `data/accident-data/2025-summary.json` | 2025年度交通事故汇总 |
| 素材索引 | `data/materials/index.json` | 20 条素材概要 |
| 素材详情 | `data/materials/items/mat-001~020.json` | 各素材的完整元数据 |

---

## API 接口

### Skill 调用

| 端点 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/api/skills/content-producer` | POST | `topic`, `platform`, `contentType?`, `style?` | 生成宣传内容 |
| `/api/skills/content-reviewer` | POST | `content`, `platform?` | 三级内容审核 |
| `/api/skills/plan-manager` | POST | `month`, `focus?` | 生成月度计划 |
| `/api/skills/analytics` | POST | 无 | 生成传播分析报告 |
| `/api/skills/precision-outreach` | POST | 无 | 生成精准宣传方案 |
| `/api/skills/emergency-response` | POST | `eventType`, `alertLevel`, `area`, `description` | 生成应急内容包 |
| `/api/skills/public-relations` | POST | `question` | 交通业务咨询 |

### 数据查询

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/data/analytics?platform=xxx` | GET | 查询平台传播数据 |
| `/api/data/accident` | GET | 查询事故统计数据 |
| `/api/data/materials?q=xxx&type=xxx` | GET | 搜索素材 |
| `/api/data/materials/[id]` | GET | 查询素材详情 |

---

## 部署指南

### 方案 A 部署（推荐用于演示/个人使用）

```bash
# 1. 配置 .env.local
SKILL_MODE=llm
ANTHROPIC_BASE_URL=https://api.anthropic.com  # 或中转地址
ANTHROPIC_API_KEY=sk-xxx

# 2. 构建并启动
cd web
npm run build
npm start
```

### 方案 B 部署（推荐用于正式环境）

```bash
# 1. 安装并启动 OpenClaw
# 参考 OpenClaw 官方文档安装

# 2. 启用 Gateway 的 chatCompletions 端点
# 编辑 ~/.openclaw/openclaw.json，确保：
# gateway.http.endpoints.chatCompletions.enabled = true

# 3. 配置 .env.local
SKILL_MODE=openclaw
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_AUTH_TOKEN=<从 openclaw.json 中获取>

# 4. 构建并启动
cd web
npm run build
npm start
```

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [`交通安全宣传教育工作智能化应用场景.md`](交通安全宣传教育工作智能化应用场景.md) | 原始需求文档 |
| [`PRD-交通安全宣传教育智能化平台.md`](PRD-交通安全宣传教育智能化平台.md) | 产品需求文档 |
| [`docs/skill-invocation-comparison.md`](docs/skill-invocation-comparison.md) | Skill 调用方案对比 |
