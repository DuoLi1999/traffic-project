# 审核记录格式说明

## 概述

每次内容审核完成后生成一条结构化审核记录，以 JSON 格式保存。记录模板见 `../assets/templates/review-record-template.json`。

## JSON 结构

```json
{
  "id": "review-{序号}",
  "contentFile": "{被审核文件路径}",
  "stages": [
    {
      "stage": "ai_first_review",
      "stageName": "初审：格式与敏感词",
      "result": "pass | warning | block",
      "issues": [
        {
          "level": "warning | block",
          "category": "{检查项分类}",
          "text": "{问题描述}",
          "suggestion": "{修改建议}",
          "location": "{问题所在位置}"
        }
      ],
      "timestamp": "{ISO时间}"
    },
    {
      "stage": "ai_quality_review",
      "stageName": "复审：内容质量",
      "result": "pass | warning | block",
      "issues": [],
      "timestamp": "{ISO时间}"
    },
    {
      "stage": "ai_compliance_review",
      "stageName": "终审：政策合规",
      "result": "pass | warning | block",
      "issues": [],
      "timestamp": "{ISO时间}"
    }
  ],
  "finalResult": "approved | revision_required | rejected",
  "summary": "{审核总结}"
}
```

## 字段说明

### 顶层字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 审核记录唯一标识，格式为 `review-{序号}`，如 `review-001` |
| `contentFile` | string | 被审核文件的相对路径 |
| `stages` | array | 三个审核阶段的详细记录，按初审、复审、终审顺序排列 |
| `finalResult` | string | 最终审核结论，取值：`approved`（通过）、`revision_required`（需修改）、`rejected`（拒绝） |
| `summary` | string | 审核总结，概括说明整体审核情况与关键发现 |

### stages 数组元素

| 字段 | 类型 | 说明 |
|------|------|------|
| `stage` | string | 阶段标识：`ai_first_review` / `ai_quality_review` / `ai_compliance_review` |
| `stageName` | string | 阶段中文名称，用于报告展示 |
| `result` | string | 该阶段审核结果：`pass` / `warning` / `block` |
| `issues` | array | 该阶段发现的问题列表，无问题时为空数组 |
| `timestamp` | string | 该阶段完成时间，ISO 8601 格式，如 `2026-02-11T14:30:00+08:00` |

### issues 数组元素

| 字段 | 类型 | 说明 |
|------|------|------|
| `level` | string | 问题严重级别：`warning`（建议修改）/ `block`（必须修改） |
| `category` | string | 检查项分类，对应检查清单中的分类名，如"政治敏感""法律法规引用" |
| `text` | string | 问题描述，说明具体问题内容 |
| `suggestion` | string | 修改建议，给出可操作的修改方向 |
| `location` | string | 问题所在位置，如段落编号、具体文字引用 |

## finalResult 判定逻辑

| 条件 | finalResult |
|------|-------------|
| 三个阶段均为 `pass` | `approved` |
| 存在 `warning` 但无 `block` | `revision_required` |
| 任一阶段为 `block` | `rejected` |
