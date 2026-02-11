---
name: content-producer
description: 交通安全宣传内容生产助手。生成适用于微信公众号、微博、抖音等多平台的宣传文案、海报方案和短视频脚本。当用户提到"写文案""生成内容""写推文""做海报""写脚本""宣传内容""写一篇""生成一篇"时激活。
user-invocable: true
---

# content-producer

交通安全宣传内容生产技能，一次性生成多平台适配的宣传内容。

## 功能概述

本技能支持三类输出：

1. **多平台文案** — 根据主题同时生成微信公众号推文、微博短文、抖音文案
2. **海报方案** — 输出含主标题、副标题、视觉风格、配色等信息的 JSON 方案
3. **短视频脚本** — 输出含分镜、旁白、字幕、时长的结构化脚本

## 触发条件

用户消息包含以下意图关键词时激活：
- 文案类："写文案""写推文""写一篇""生成一篇""宣传内容""生成内容"
- 海报类："做海报""海报方案""设计海报"
- 脚本类："写脚本""视频脚本""拍摄脚本"

## 工作流程

### Step 1：理解用户意图

从用户输入中提取以下要素：

| 要素 | 说明 | 默认值 |
|------|------|--------|
| 主题 | 宣传主题（如"春运安全""酒驾警示"） | 必填 |
| 平台 | 目标平台（微信/微博/抖音/全部） | 全部 |
| 内容类型 | 文案 / 海报方案 / 视频脚本 | 文案 |
| 语气风格 | 温馨提醒 / 严肃警示 / 幽默科普 | 温馨提醒 |
| 特殊要求 | 字数偏好、特定案例引用、时令元素等 | 无 |

如关键要素不明确，向用户确认后再生成。

### Step 2：读取模板与参考资料

从共享目录加载：
- `_shared/assets/templates/content-wechat.md` — 微信推文模板
- `_shared/assets/templates/content-weibo.md` — 微博短文模板
- `_shared/assets/templates/content-douyin.md` — 抖音文案模板
- `_shared/references/platform-specs.md` — 平台格式规范
- `_shared/references/writing-style-guide.md` — 统一写作风格指南

海报/脚本类还需加载本技能模板：
- `assets/templates/poster-schema.json` — 海报方案输出结构
- `assets/templates/video-script-schema.json` — 视频脚本输出结构

### Step 3：按平台规则生成内容

根据目标平台的规范生成内容。各平台核心要点：

- **微信公众号**：800-1500 字，标题→导语→分段正文→结尾呼吁→编辑信息
- **微博**：核心信息 ≤ 140 字，`#话题标签#` + 信息 + CTA + `#话题标签#`
- **抖音**：≤ 300 字，Hook（前3秒）→ 核心内容 → 行动呼吁 + 话题标签

> 完整平台规范见 `_shared/references/platform-specs.md`。

### Step 4：保存与展示

按平台规范中的文件命名和目录规则保存输出：
- 文案 → `output/content/{主题关键词}-{平台}-{YYYYMMDD}.md`
- 海报方案 → `output/posters/{主题关键词}-海报方案-{YYYYMMDD}.json`
- 视频脚本 → `output/scripts/{主题关键词}-脚本-{YYYYMMDD}.md`

保存后在对话中展示内容摘要。

## 数据引用

| 资源 | 路径 | 用途 |
|------|------|------|
| 微信模板 | `_shared/assets/templates/content-wechat.md` | 推文结构与范例 |
| 微博模板 | `_shared/assets/templates/content-weibo.md` | 短文结构与范例 |
| 抖音模板 | `_shared/assets/templates/content-douyin.md` | 短视频文案结构与范例 |
| 平台规范 | `_shared/references/platform-specs.md` | 字数、结构、命名规则 |
| 写作风格 | `_shared/references/writing-style-guide.md` | 文体风格与用词规范 |
| 内容红线 | `_shared/references/content-redlines.md` | 内容审核红线规则 |
| 事故数据 | `_shared/assets/data/accident-data/` | 案例与统计数据引用 |
| 素材库 | `_shared/assets/data/materials/` | 宣传素材索引 |
| 海报模板 | `assets/templates/poster-schema.json` | 海报方案 JSON 结构 |
| 脚本模板 | `assets/templates/video-script-schema.json` | 视频脚本 JSON 结构 |

## 约束规则

1. **内容红线**：所有输出必须通过红线检查，详见 `_shared/references/content-redlines.md`
2. **写作规范**：遵循统一写作风格指南，详见 `_shared/references/writing-style-guide.md`
3. **数据准确**：引用法规条文、罚款金额、记分分值必须与现行法规一致
4. **隐私保护**：案例中的姓名、车牌、地址等必须脱敏处理
5. **平台适配**：同一主题在不同平台应有差异化表达，而非简单裁剪字数
6. **标注配图**：在文案合适位置标注 `[配图建议: 描述]`

## 补充参考

- 各内容类型的详细输出格式：`references/output-formats.md`
- 使用示例：`references/examples.md`
