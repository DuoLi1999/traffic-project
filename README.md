# 交通安全宣传教育智能化平台

> 基于 OpenClaw Agent Skills 的本地验证原型（PoC）

## 项目简介

本项目将交警宣传教育工作的 8 大业务场景封装为可独立调用的 OpenClaw Agent Skills。用户通过自然语言对话驱动 AI Agent 完成"计划制定 → 素材管理 → 内容生产 → 审核发布 → 效果监测 → 精准投放"全链路工作。

## 技术架构

| 组件 | 技术/工具 |
|------|----------|
| AI Agent 框架 | OpenClaw |
| Skill 定义 | SKILL.md (YAML frontmatter + Markdown) |
| AI 推理 | LLM (Claude / GPT / 本地模型) |
| 数据存储 | 本地 JSON 文件 |
| 内容输出 | Markdown 文件 |

## 项目结构

```
traffic-project/
├── skills/                          # 8 个 OpenClaw Skills
│   ├── content-producer/SKILL.md    # 内容生产（P0）
│   ├── media-hub/SKILL.md           # 素材中枢（P0）
│   ├── content-reviewer/SKILL.md    # 内容审核（P0）
│   ├── plan-manager/SKILL.md        # 计划管理（P1）
│   ├── analytics/SKILL.md           # 效果监测（P1）
│   ├── precision-outreach/SKILL.md  # 精准宣传（P2）
│   ├── emergency-response/SKILL.md  # 应急响应（P2）
│   └── public-relations/SKILL.md    # 公共关系（P2）
├── data/                            # 模拟数据
│   ├── materials/                   # 素材库（20条元数据）
│   ├── analytics/                   # 传播数据（3个平台）
│   ├── reviews/                     # 审核记录（运行时生成）
│   └── accident-data/               # 事故数据
├── output/                          # AI 生成产出物
│   ├── content/                     # 文案
│   ├── plans/                       # 宣传计划
│   ├── reports/                     # 分析报告
│   ├── posters/                     # 海报方案
│   └── scripts/                     # 视频脚本
├── templates/                       # 模板文件
│   ├── content-wechat.md            # 微信推文模板
│   ├── content-weibo.md             # 微博模板
│   ├── content-douyin.md            # 抖音模板
│   ├── review-checklist.md          # 审核检查清单
│   ├── plan-monthly.md              # 月度计划模板
│   └── report-monthly.md           # 月度报告模板
├── task-plan.md                     # 开发任务计划与决策记录
├── test-results.md                  # 验证测试结果
└── README.md                        # 本文件
```

## Skills 概览

### P0 核心 Skills

| Skill | 功能 | 触发示例 |
|-------|------|---------|
| **content-producer** | 生成微信/微博/抖音多平台文案、海报方案、视频脚本 | "写一篇关于酒驾的宣传内容" |
| **media-hub** | 自然语言搜索素材库、为新素材自动标引 | "找雨天追尾事故的视频素材" |
| **content-reviewer** | 三级审核（初审→复审→终审），检查合规性 | "审核这篇文案" |

### P1 扩展 Skills

| Skill | 功能 | 触发示例 |
|-------|------|---------|
| **plan-manager** | 生成月度宣传计划，结合节假日和安全风险 | "制定3月份的宣传计划" |
| **analytics** | 基于传播数据生成月度效果分析报告 | "生成1月的传播效果分析报告" |

### P2 高级 Skills

| Skill | 功能 | 触发示例 |
|-------|------|---------|
| **precision-outreach** | 基于事故数据识别高风险区域，生成定向宣传方案 | "分析高风险区域，制定精准宣传方案" |
| **emergency-response** | 根据预警信息生成应急宣传内容包 | "发布暴雨预警应急宣传" |
| **public-relations** | 模拟智能客服应答交通业务咨询 | "驾照快过期了怎么换证" |

## 使用方法

### 前置条件

1. 安装 OpenClaw 并配置 LLM API Key
2. 将本项目目录作为 OpenClaw 工作区

### 使用示例

#### 示例 1：生成多平台宣传内容

```
用户: 帮我写一篇关于春运期间高速公路安全的宣传内容

Agent 自动执行:
1. 识别意图 → 激活 content-producer Skill
2. 读取微信/微博/抖音模板
3. 生成三个平台的文案
4. 保存到 output/content/ 目录
5. 展示生成结果
```

#### 示例 2：搜索素材

```
用户: 找一些雨天高速公路事故的视频素材

Agent 自动执行:
1. 识别意图 → 激活 media-hub Skill
2. 读取素材索引
3. 语义匹配"雨天""高速公路""事故""视频"
4. 返回匹配的素材列表和详细信息
```

#### 示例 3：审核文案

```
用户: 审核一下刚才生成的微信推文

Agent 自动执行:
1. 识别意图 → 激活 content-reviewer Skill
2. 读取审核检查清单
3. 依次执行初审、复审、终审
4. 输出审核报告
5. 保存审核记录到 data/reviews/
```

#### 示例 4：完整链路（计划 → 素材 → 生产 → 审核）

```
用户: 制定2月份宣传计划
Agent: → plan-manager 生成月度计划

用户: 根据计划第一个主题找相关素材
Agent: → media-hub 搜索匹配素材

用户: 根据这些素材写一篇微信推文
Agent: → content-producer 生成文案

用户: 审核这篇文案
Agent: → content-reviewer 三级审核
```

#### 示例 5：应急响应

```
用户: 发布暴雨橙色预警应急宣传，影响G15和G50高速

Agent 自动执行:
1. 激活 emergency-response Skill
2. 生成安全提示（3平台版本）
3. 生成预警通报
4. 生成绕行建议
5. 打包保存应急内容包
```

#### 示例 6：业务咨询

```
用户: 驾照快过期了怎么换证？

Agent 自动执行:
1. 激活 public-relations Skill
2. 匹配驾驶证换证知识
3. 输出材料清单、办理流程、注意事项
```

## 模拟数据说明

| 数据类型 | 文件 | 说明 |
|---------|------|------|
| 素材元数据 | `data/materials/items/mat-001~020.json` | 20条模拟素材（14视频+6图片） |
| 素材索引 | `data/materials/index.json` | 全部素材概要 |
| 微信传播数据 | `data/analytics/wechat-202601.json` | 2026年1月微信数据 |
| 微博传播数据 | `data/analytics/weibo-202601.json` | 2026年1月微博数据 |
| 抖音传播数据 | `data/analytics/douyin-202601.json` | 2026年1月抖音数据 |
| 事故数据 | `data/accident-data/2025-summary.json` | 2025年度事故汇总 |

## 文件说明

| 文件 | 说明 |
|------|------|
| `task-plan.md` | 开发任务计划、决策记录、障碍记录 |
| `test-results.md` | 各 Skill 的验证测试结果 |
| `PRD-交通安全宣传教育智能化平台.md` | 产品需求文档 |
| `开发计划-交通安全宣传教育智能化平台.md` | 开发计划 |
| `交通安全宣传教育工作智能化应用场景.md` | 原始需求文档 |
