---
name: content-reviewer
description: 交通安全宣传内容审核助手。对宣传文案进行三级审核（初审格式敏感词、复审内容质量、终审政策合规），输出审核报告和修改建议。当用户提到"审核""检查""合规检查""审一下""看看有没有问题"时激活。
user-invocable: true
---

# content-reviewer — 交通安全宣传内容审核

## 功能概述

对交通安全宣传文案执行三级审核流程：

| 审核阶段 | 审核重点 |
|----------|----------|
| **初审** | 格式规范、敏感词检查 |
| **复审** | 事实准确性、逻辑连贯性、表达质量 |
| **终审** | 政治导向、法律合规、社会影响 |

三个阶段独立评估，最终汇总生成审核报告与修改建议。

## 触发条件

当用户消息包含以下意图关键词时激活：

- 审核、检查、合规检查
- 审一下、看看有没有问题
- 内容审核、文案检查、敏感词检查

## 工作流程

### 1. 获取待审内容
- 用户提供文案文本或文件路径
- 确认内容类型与目标发布平台

### 2. 加载审核规则
- 读取审核检查清单 `references/review-checklist.md`
- 读取内容红线规则 `_shared/references/content-redlines.md`

### 3. 初审：格式与敏感词
- 检查基本格式规范（错别字、标点、排版）
- 扫描敏感词与禁用表述（政治敏感、执法敏感、绝对化用语）
- 详细检查项见 `references/review-checklist.md` 第一、二节

### 4. 复审：内容质量
- 检查事实准确性（法规引用、数据来源、常识性错误）
- 检查逻辑连贯性与受众适宜性
- 详细检查项见 `references/review-checklist.md` 第二、三节

### 5. 终审：政策合规
- 检查政治导向与价值观传递
- 检查隐私保护与版权合规
- 详细检查项见 `references/review-checklist.md` 第四节

### 6. 生成审核报告
- 汇总三阶段结果，确定最终审核结论
- 按审核报告模板输出结构化 Markdown 报告

### 7. 提供修改建议
- 对每个问题项给出具体修改建议
- 标注问题位置、严重级别与修改方向

## 审核结果分级

每个阶段独立输出以下三级结果之一：

| 阶段结果 | 含义 |
|----------|------|
| **PASS** | 该阶段无问题，符合要求 |
| **WARNING** | 存在建议修改的问题 |
| **BLOCK** | 存在必须修改的严重问题 |

最终审核结论由三阶段结果综合决定：

| 最终结论 | 条件 | 含义 |
|----------|------|------|
| **approved** | 全部阶段 PASS | 审核通过，可发布 |
| **revision_required** | 存在 WARNING，无 BLOCK | 建议修改后发布 |
| **rejected** | 任一阶段 BLOCK | 必须修改，不得发布 |

## 数据引用

### 审核规则

| 资源 | 路径 | 说明 |
|------|------|------|
| 审核检查清单 | `references/review-checklist.md` | 完整的三级审核检查项 |
| 内容红线规则 | `_shared/references/content-redlines.md` | 全局内容禁区与红线 |

### 模板与参考

| 资源 | 路径 | 说明 |
|------|------|------|
| 审核记录模板 | `assets/templates/review-record-template.json` | 审核记录 JSON 模板 |
| 记录格式说明 | `references/review-record-schema.md` | 审核记录字段定义 |
| 使用示例 | `references/examples.md` | 使用示例与输出格式 |

## 约束规则

1. **独立审核**：三个阶段独立进行，每个阶段基于对应的检查项独立评估，不受其他阶段结果影响。
2. **零漏检原则**：宁可误报（false positive）也不可漏报（false negative），对可疑内容一律标记 WARNING 或 BLOCK。
3. **记录留存**：每次审核生成结构化记录，遵循 `references/review-record-schema.md` 中定义的格式。
4. **引用规则**：审核意见中涉及的法规、标准须标注具体条款，不做模糊引用。
5. **修改建议**：每个问题项必须附带可操作的修改建议，避免仅指出问题而不提供方向。

## 参考文档

- 完整审核检查清单：见 [references/review-checklist.md](references/review-checklist.md)
- 审核记录格式定义：见 [references/review-record-schema.md](references/review-record-schema.md)
- 使用示例与输出格式：见 [references/examples.md](references/examples.md)
- 审核记录 JSON 模板：见 [assets/templates/review-record-template.json](assets/templates/review-record-template.json)
