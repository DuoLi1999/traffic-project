# Skills-Traffic2 交通安全宣传 Skills 系统

## 项目概述

Skills-Traffic2 是一套完整的交通安全宣传教育 AI Skills 系统，基于 Agent Skill 架构设计，为交通安全宣传工作提供智能化支持。

本项目包含 **8 个核心 Skill**，覆盖交通安全宣传的完整工作流程：

| Skill | 功能 | 触发关键词 |
|-------|------|-----------|
| **plan-manager** | 月度宣传计划制定 | 制定计划、月度计划、排期 |
| **content-producer** | 多平台内容生成 | 写文案、生成内容、写脚本 |
| **content-reviewer** | 三级内容审核 | 审核、检查、合规检查 |
| **analytics** | 传播效果分析 | 效果分析、数据报告 |
| **precision-outreach** | 精准宣传方案 | 精准宣传、高风险区域 |
| **public-relations** | 交通业务咨询 | 驾照、违章、事故咨询 |
| **emergency-response** | 应急宣传响应 | 应急、预警、暴雨 |
| **media-hub** | 素材管理中枢 | 找素材、素材标签 |

## 目录结构

```
skills-traffic2/
├── README.md                          # 本文件
├── SKILL.md                           # 系统使用指南
│
├── plan-manager/                      # 计划管理助手
│   ├── SKILL.md                       # Skill定义
│   ├── reference/                     # 参考资料
│   │   ├── holiday-calendar-2026.json.md  # 节假日数据
│   │   └── seasonal-risks.md          # 季节风险指南
│   ├── assets/                        # 模板资源
│   │   └── plan-template.md           # 月度计划模板
│   └── scripts/                       # 辅助脚本
│       └── .gitkeep
│
├── content-producer/                  # 内容生产助手
│   ├── SKILL.md
│   ├── reference/
│   │   ├── copywriting-guide.md       # 文案规范
│   │   └── platform-formats.json.md   # 平台格式规范
│   ├── assets/
│   │   ├── wechat-template.md         # 微信模板
│   │   ├── weibo-template.md          # 微博模板
│   │   └── douyin-template.md         # 抖音模板
│   └── scripts/
│       └── .gitkeep
│
├── content-reviewer/                  # 内容审核助手
│   ├── SKILL.md
│   ├── reference/
│   │   ├── sensitive-words.json.md    # 敏感词库
│   │   ├── policy-checklist.md        # 政策合规清单
│   │   └── quality-standards.md       # 内容质量标准
│   ├── assets/
│   │   └── .gitkeep
│   └── scripts/
│       └── .gitkeep
│
├── analytics/                         # 效果监测分析
│   ├── SKILL.md
│   ├── reference/
│   │   └── metrics-definition.md      # 指标定义
│   ├── assets/
│   │   └── .gitkeep
│   └── scripts/
│       └── .gitkeep
│
├── precision-outreach/                # 精准宣传方案
│   ├── SKILL.md
│   ├── reference/
│   │   ├── risk-zones.json.md         # 风险区域数据
│   │   └── target-groups.md           # 目标人群分析
│   ├── assets/
│   │   └── .gitkeep
│   └── scripts/
│       └── .gitkeep
│
├── public-relations/                  # 交通业务咨询
│   ├── SKILL.md
│   ├── reference/
│   │   ├── faq-database.md            # FAQ数据库
│   │   └── procedures/                # 办理流程
│   │       ├── license-renewal.md     # 驾驶证换证
│   │       ├── violation-handling.md  # 违法处理
│   │       └── accident-reporting.md  # 事故处理
│   ├── assets/
│   │   └── .gitkeep
│   └── scripts/
│       └── .gitkeep
│
├── emergency-response/                # 应急响应助手
│   ├── SKILL.md
│   ├── reference/
│   │   ├── weather-warnings.md        # 天气预警指南
│   │   └── emergency-templates/       # 应急模板
│   │       ├── rainstorm.md           # 暴雨模板
│   │       ├── snow-ice.md            # 冰雪模板
│   │       └── fog-warning.md         # 大雾模板
│   ├── assets/
│   │   └── .gitkeep
│   └── scripts/
│       └── .gitkeep
│
└── media-hub/                         # 素材中枢
    ├── SKILL.md
    ├── reference/
    │   └── tagging-standards.md       # 标签标引标准
    ├── assets/
    │   └── .gitkeep
    └── scripts/
        └── .gitkeep
```

## 快速开始

### 1. 使用 Skill

当用户在对话中提及相应的触发词时，Agent 会自动激活对应的 Skill：

```
用户：帮我制定3月份的宣传计划
→ 自动激活 plan-manager

用户：写一篇关于拒绝酒驾的微信推文
→ 自动激活 content-producer

用户：审核一下这篇文案
→ 自动激活 content-reviewer
```

### 2. Skill 文件结构

每个 Skill 包含以下组成部分：

- **SKILL.md** - Skill 的核心定义文件，包含：
  - Frontmatter（name, description, triggers）
  - 功能概述
  - 触发条件
  - 工作流程
  - 资源文件清单
  - 约束规则

- **reference/** - 参考资料目录
  - 数据文件（JSON/Markdown）
  - 知识库
  - 流程文档

- **assets/** - 模板资源目录
  - 内容模板
  - 格式规范
  - 示例文件

- **scripts/** - 辅助脚本目录（占位）
  - 未来可添加自动化脚本

## Skill 详解

### 1. Plan Manager（计划管理）

**功能**：根据指定月份自动生成月度宣传计划

**核心能力**：
- 分析当月节假日、季节特征
- 编排周度宣传主题
- 规划内容产出数量
- 生成完整计划文档

**参考文件**：
- `reference/holiday-calendar-2026.json.md` - 节假日数据
- `reference/seasonal-risks.md` - 季节风险指南
- `assets/plan-template.md` - 计划模板

### 2. Content Producer（内容生产）

**功能**：生成多平台宣传内容

**核心能力**：
- 微信公众号推文生成
- 微博内容生成
- 抖音短视频脚本生成
- 海报文案生成

**参考文件**：
- `reference/copywriting-guide.md` - 文案规范
- `assets/wechat-template.md` - 微信模板
- `assets/weibo-template.md` - 微博模板
- `assets/douyin-template.md` - 抖音模板

### 3. Content Reviewer（内容审核）

**功能**：三级内容审核（格式/质量/合规）

**核心能力**：
- 敏感词检测
- 内容质量评估
- 政策合规检查
- 生成审核报告

**参考文件**：
- `reference/sensitive-words.json.md` - 敏感词库
- `reference/policy-checklist.md` - 政策合规清单
- `reference/quality-standards.md` - 质量标准

### 4. Analytics（效果监测）

**功能**：传播数据分析和报告生成

**核心能力**：
- 多平台数据整合
- 核心指标计算
- Top 内容识别
- 趋势分析和建议

**参考文件**：
- `reference/metrics-definition.md` - 指标定义

### 5. Precision Outreach（精准宣传）

**功能**：基于数据的高风险区域/人群定向宣传

**核心能力**：
- 事故高发区域分析
- 重点违法人群画像
- 定向方案生成
- 效果追踪建议

**参考文件**：
- `reference/risk-zones.json.md` - 风险区域数据
- `reference/target-groups.md` - 目标人群分析

### 6. Public Relations（业务咨询）

**功能**：7×24小时交通业务智能咨询

**核心能力**：
- 驾驶证业务咨询
- 机动车业务咨询
- 违法处理咨询
- 事故处理咨询

**参考文件**：
- `reference/procedures/license-renewal.md` - 驾驶证换证
- `reference/procedures/violation-handling.md` - 违法处理
- `reference/procedures/accident-reporting.md` - 事故处理

### 7. Emergency Response（应急响应）

**功能**：恶劣天气/突发事件快速响应

**核心能力**：
- 天气预警内容生成
- 突发事件响应
- 多平台内容包
- 时效管理

**参考文件**：
- `reference/weather-warnings.md` - 天气预警指南
- `reference/emergency-templates/` - 应急模板库

### 8. Media Hub（素材中枢）

**功能**：素材管理和智能检索

**核心能力**：
- 自然语言素材搜索
- 自动标签标引
- 素材库统计
- 语义匹配

**参考文件**：
- `reference/tagging-standards.md` - 标签标引标准

## 工作流程示例

### 场景1：月度工作

```
1. Plan Manager → 制定月度计划
2. Content Producer → 按计划生成内容
3. Content Reviewer → 审核内容
4. Analytics → 月度效果分析
```

### 场景2：精准宣传

```
1. Precision Outreach → 分析风险区域/人群
2. Content Producer → 生成定向内容
3. Content Reviewer → 快速审核
4. Analytics → 追踪精准宣传效果
```

### 场景3：应急响应

```
1. Emergency Response → 接收预警信息
2. Emergency Response → 快速生成内容包
3. Content Reviewer → 快速审核（10分钟）
4. Analytics → 追踪应急发布效果
```

## 数据对接

### 需要对接的外部数据

| 数据类型 | 来源 | 用途 |
|---------|------|------|
| 事故数据 | 交警事故系统 | 风险分析、精准宣传 |
| 违法数据 | 违法处理系统 | 人群画像 |
| 传播数据 | 各平台后台 | 效果分析 |
| 气象数据 | 气象局接口 | 应急预警 |
| 素材库 | 本地存储 | 内容创作 |

### 数据目录（项目外）

```
data/
├── analytics/               # 传播数据
│   ├── wechat-202601.json
│   ├── weibo-202601.json
│   └── douyin-202601.json
├── accident-data/           # 事故数据
│   └── 2025-summary.json
├── violation-data/          # 违法数据
│   └── 2025-summary.json
└── materials/               # 素材库
    ├── index.json
    └── items/
        ├── mat-001.json
        └── ...
```

## 扩展开发

### 添加新 Skill

1. 在 `skills-traffic2/` 下创建新目录
2. 创建 `SKILL.md` 定义文件
3. 创建 `reference/`、`assets/`、`scripts/` 目录
4. 添加 `.gitkeep` 占位文件

### Skill 模板

```markdown
---
name: skill-name
description: Skill 功能描述
user-invocable: true
---

# Skill 名称

## 功能概述
简要描述功能

## 触发条件
描述何时激活

## 工作流程
详细步骤

## 资源文件
相关文件清单

## 约束规则
使用规则

## 使用示例
示例说明
```

## 维护说明

### 更新频率建议

| 文件类型 | 更新频率 | 责任人 |
|---------|---------|--------|
| 节假日数据 | 每年年初 | 管理员 |
| 敏感词库 | 每季度 | 内容团队 |
| 政策流程 | 政策变化时 | 业务专家 |
| 素材标签 | 持续更新 | 内容团队 |

### 版本管理

每个 Skill 独立版本管理：
- 主版本号：重大功能变更
- 次版本号：功能增强
- 修订号：Bug修复、内容更新

## 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护：[维护人]
- 技术支持：[技术支持]

---

*最后更新：2026年2月11日*
