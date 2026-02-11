---
name: skills-traffic2
description: 交通安全宣传教育 Skills 系统 - 包含8个核心Skill，覆盖计划制定、内容生产、内容审核、效果分析、精准宣传、业务咨询、应急响应、素材管理全流程
user-invocable: false
---

# Skills-Traffic2 系统使用指南

## 系统概述

Skills-Traffic2 是一套完整的交通安全宣传教育 AI 辅助系统，通过 8 个专业 Skill 协同工作，为交通安全宣传工作提供全方位智能化支持。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Skills-Traffic2 系统                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Plan     │  │ Content  │  │ Content  │  │ Analytics│   │
│  │ Manager  │  │ Producer │  │ Reviewer │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Precision │  │ Public   │  │Emergency │  │ Media    │   │
│  │ Outreach │  │ Relations│  │ Response│  │ Hub      │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Skill 速查表

| Skill | 功能 | 触发词 | 用户可调用 |
|-------|------|--------|-----------|
| plan-manager | 月度计划制定 | 制定计划、排期、本月计划 | ✅ |
| content-producer | 内容生成 | 写文案、生成内容、写脚本 | ✅ |
| content-reviewer | 内容审核 | 审核、检查、合规检查 | ✅ |
| analytics | 效果分析 | 效果分析、数据报告 | ✅ |
| precision-outreach | 精准宣传 | 精准宣传、风险分析 | ✅ |
| public-relations | 业务咨询 | 驾照、违章、事故咨询 | ✅ |
| emergency-response | 应急响应 | 应急、预警、恶劣天气 | ✅ |
| media-hub | 素材管理 | 找素材、素材标签 | ✅ |

## 使用方式

### 方式一：自然语言触发

直接在对话中描述需求，系统自动匹配合适的 Skill：

```
用户：帮我制定3月份的宣传计划
→ 系统：自动调用 plan-manager

用户：写一篇关于拒绝酒驾的推文
→ 系统：自动调用 content-producer

用户：审核一下这篇文案有没有问题
→ 系统：自动调用 content-reviewer
```

### 方式二：显式指定 Skill

如需显式指定，可直接提及 Skill 名称：

```
用户：使用 plan-manager 制定4月份计划
用户：用 content-producer 生成抖音脚本
```

### 方式三：技能协作

多个 Skill 可以协作完成复杂任务：

```
用户：制定计划并生成第一周的内容
→ 1. plan-manager 制定计划
→ 2. content-producer 生成内容
→ 3. content-reviewer 审核
```

## 典型工作流

### 工作流1：月度宣传工作

```
第1步：Plan Manager
用户：制定3月份宣传计划
→ 生成月度计划文档

第2步：Content Producer  
用户：根据计划生成第一周的主题文案
→ 生成微信推文、微博、抖音脚本

第3步：Content Reviewer
用户：审核这些内容
→ 三级审核，输出审核报告

第4步：（发布内容...）

第5步：Analytics
用户：生成3月份效果分析报告
→ 分析传播数据，给出优化建议
```

### 工作流2：精准定向宣传

```
第1步：Precision Outreach
用户：分析我市高风险路段
→ 识别 Top 风险区域

第2步：Precision Outreach
用户：针对这些路段制定宣传方案
→ 生成分区域定向方案

第3步：Content Producer
用户：为XX路段生成定向内容
→ 生成针对性内容

第4步：（发布并追踪...）
```

### 工作流3：应急快速响应

```
第1步：Emergency Response
用户：气象局发布了暴雨橙色预警
→ 生成应急内容包（微信/微博/抖音/海报）

第2步：Content Reviewer（快速通道）
→ 10分钟完成审核

第3步：（发布应急内容...）

第4步：持续更新预警信息
```

### 工作流4：内容创作支持

```
第1步：Media Hub
用户：找一些雨天事故的素材
→ 返回相关素材列表

第2步：Content Producer
用户：用这些素材写一篇警示推文
→ 生成推文并引用素材

第3步：Content Reviewer
→ 审核内容
```

### 工作流5：公众咨询

```
用户：我的驾照快到期了，怎么换证？
→ Public Relations 自动激活
→ 提供完整换证指南

用户：我有个违章要处理
→ 提供违法处理流程
```

## 资源文件导航

### 计划管理 (plan-manager)
- `assets/plan-template.md` - 月度计划模板
- `reference/holiday-calendar-2026.json.md` - 节假日数据
- `reference/seasonal-risks.md` - 季节风险指南

### 内容生产 (content-producer)
- `assets/wechat-template.md` - 微信推文模板
- `assets/weibo-template.md` - 微博内容模板
- `assets/douyin-template.md` - 抖音脚本模板
- `reference/copywriting-guide.md` - 文案创作规范

### 内容审核 (content-reviewer)
- `reference/sensitive-words.json.md` - 敏感词库
- `reference/policy-checklist.md` - 政策合规检查清单
- `reference/quality-standards.md` - 内容质量标准

### 效果分析 (analytics)
- `reference/metrics-definition.md` - 效果监测指标定义

### 精准宣传 (precision-outreach)
- `reference/risk-zones.json.md` - 风险区域数据
- `reference/target-groups.md` - 目标人群分析

### 业务咨询 (public-relations)
- `reference/procedures/license-renewal.md` - 驾驶证换证流程
- `reference/procedures/violation-handling.md` - 违法处理流程
- `reference/procedures/accident-reporting.md` - 事故处理流程

### 应急响应 (emergency-response)
- `reference/weather-warnings.md` - 天气预警级别说明
- `reference/emergency-templates/rainstorm.md` - 暴雨应急模板
- `reference/emergency-templates/snow-ice.md` - 冰雪应急模板
- `reference/emergency-templates/fog-warning.md` - 大雾应急模板

### 素材管理 (media-hub)
- `reference/tagging-standards.md` - 素材标签标引标准

## 输出目录

各 Skill 的输出文件保存在项目根目录的 `output/` 文件夹中：

```
output/
├── plans/                    # plan-manager 输出
│   └── 3月-月度宣传计划-20260225.md
├── content/                  # content-producer 输出
│   └── 20260225-拒绝酒驾-微信.md
├── review/                   # content-reviewer 输出
│   └── 20260225-拒绝酒驾-审核报告.md
├── analytics/                # analytics 输出
│   └── 202601-效果分析报告.md
├── precision/                # precision-outreach 输出
│   └── 20260225-精准宣传方案.md
├── emergency/                # emergency-response 输出
│   └── 20260225-暴雨应急内容包/
└── pr/                       # public-relations 日志
    └── query-log-202602.md
```

## 最佳实践

### 1. 计划驱动
始终先制定计划，再生成内容，最后分析效果。

### 2. 审核必过
所有对外发布的内容必须经过 content-reviewer 审核。

### 3. 数据支撑
效果分析基于真实数据，定期查看 analytics 报告优化策略。

### 4. 素材复用
充分利用 media-hub 中的素材，提高内容生产效率。

### 5. 应急响应
恶劣天气预警时，优先使用 emergency-response 快速生成内容。

## 系统限制

### 当前为占位版本
- `data/` 目录下的实际数据需要对接真实系统
- `scripts/` 目录为占位，可后续添加自动化脚本
- 部分参考文件为框架性内容，需要补充具体数据

### 需要补充的数据
1. 节假日日历的具体日期
2. 敏感词库的具体词汇
3. 风险区域的实际数据
4. 业务咨询的完整 FAQ
5. 素材库的实际索引

## 技术支持

如遇到问题或需要扩展功能，请联系系统管理员。

---

*Skills-Traffic2 系统 v1.0*
*创建时间：2026年2月11日*
