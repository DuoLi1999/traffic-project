---
name: media-hub
description: 交通安全宣传素材中枢。支持自然语言搜索素材库、为新素材自动标引标签、统计素材库概况。当用户提到"找素材""搜索素材""查找素材""素材标签""标引素材""素材统计""有什么素材"时激活。
user-invocable: true
---

# media-hub — 交通安全宣传素材中枢

## 功能概述

media-hub 提供三种工作模式：

| 模式 | 说明 |
|------|------|
| **search** | 自然语言语义搜索素材库，支持模糊匹配 |
| **tagging** | 为新素材自动标引分类标签 |
| **statistics** | 统计素材库整体概况与分布 |

## 触发条件

当用户消息包含以下意图关键词时激活本技能：

- 搜索类：找素材、搜索素材、查找素材、有什么素材、相关素材
- 标签类：素材标签、标引素材、打标签、分类标签
- 统计类：素材统计、素材概况、素材数量、库存情况

## 工作流程

### 1. 意图解析

从用户输入中识别以下要素：
- **模式**：search / tagging / statistics
- **关键词**：用户描述的主题、场景、条件（如"雨天追尾"）
- **过滤条件**：素材类型（video/image）、时间范围、标签约束
- **数量限制**：用户期望返回的结果数量（默认 10 条）

若用户意图不明确，应主动询问以确认模式。

### 2. 数据读取

加载素材索引文件 `_shared/assets/data/materials/index.json`，获取全部素材元数据列表。索引文件为 JSON 数组，每个元素遵循 `assets/templates/material-item-schema.json` 中定义的字段结构。

### 3. 执行逻辑

**search 模式：**
- 将用户关键词与素材的 title、tags、description 字段进行语义匹配
- 支持多关键词交集查询与模糊同义词匹配（如"老人"匹配"老年人"）
- 按相关度评分排序，相关度由命中字段数和关键词匹配度综合决定
- 返回结果上限默认 10 条，可由用户指定

**tagging 模式：**
- 根据素材的 title、filename、description、source 等字段提取关键信息
- 依据 `references/tagging-taxonomy.md` 中定义的 7 个维度自动生成标签
- 每条素材生成 3-8 个标签，优先覆盖多个不同维度
- 生成后需用户确认方可写入

**statistics 模式：**
- 汇总素材总数、按类型（video/image）分布
- 计算标签频次并输出 Top-10 排名
- 统计来源分布与时间分布等维度

### 4. 结果返回

以结构化格式输出结果，使用 Markdown 表格呈现。

输出格式模板与完整使用示例见 `references/examples.md`。

## 数据引用

本技能依赖以下共享数据路径：

```
_shared/assets/data/materials/
├── index.json          # 素材索引（所有素材元数据的数组）
└── items/              # 单条素材的独立 JSON 文件
    ├── mat-001.json
    ├── mat-002.json
    └── ...
```

- **index.json**：包含全部素材的元数据数组，是搜索和统计的主要数据源。
- **items/**：每条素材一个独立 JSON 文件，用于单条素材的详细查看与标签更新。
- **素材 schema**：见 `assets/templates/material-item-schema.json`。

## 约束规则

1. **只读优先**：search 和 statistics 模式不修改任何文件；tagging 模式仅在用户确认后写入标签。
2. **标签规范**：标签必须遵循 `references/tagging-taxonomy.md` 中定义的分类维度，每条素材 3-8 个标签，使用 2-4 字中文词语。
3. **结果数量**：search 默认返回最多 10 条结果；用户可指定数量。
4. **无结果处理**：未匹配到素材时返回空结果集，并根据索引中已有标签给出替代建议关键词。
5. **数据一致性**：tagging 写入 items/ 中的单条 JSON 后，应同步更新 index.json。可使用 `scripts/reindex-materials.sh` 从 items/ 目录重建完整索引。
6. **路径约束**：所有素材数据路径以 `_shared/assets/data/materials/` 为根目录，不使用硬编码绝对路径。
7. **用户确认**：tagging 模式下，标签推荐结果必须经用户确认（确认/修改/取消）后才可写入文件。
8. **编码规范**：所有 JSON 文件使用 UTF-8 编码，确保中文字符正确存储。

## 参考文档

- 标签分类法与规则：`references/tagging-taxonomy.md`
- 输出格式与使用示例：`references/examples.md`
- 素材条目 schema：`assets/templates/material-item-schema.json`
- 索引重建脚本：`scripts/reindex-materials.sh`
