# 输出格式规范

> content-producer 三种输出类型的详细格式说明。

## 一、多平台文案（Markdown）

文案以 Markdown 格式输出，每个平台独立一个文件。

### 微信公众号推文

```markdown
# {标题}

> {导语：1-2句话点明核心信息}

## {小标题1}

{正文段落，每段3-5行}

[配图建议: {描述}]

## {小标题2}

{正文段落}

## {小标题3}

{正文段落}

---

**{结尾呼吁}**

{安全提示/行动号召}

---

来源：{来源}
编辑：{编辑}
审核：{审核人}
```

- 字数：800-1500 字
- 配图位置：在正文中合适位置标注 `[配图建议: 描述]`
- 尾部编辑信息为固定格式

### 微博短文

```
#话题标签# {核心信息，≤140字} {行动呼吁} #话题标签#

[配图建议: {描述}，{数量}张]
```

- 话题标签：前后各 1-2 个
- 风格：简洁有力、口语化

### 抖音文案

```
{Hook：前3秒抓注意力}

{核心内容：2-4句}

{行动呼吁：引导评论/转发}

#话题1 #话题2 #话题3
```

- 字数：≤ 300 字
- 话题标签：3-5 个，放在末尾

## 二、海报方案（JSON）

海报方案以 JSON 格式输出，结构如下：

```json
{
  "topic": "主题",
  "generatedDate": "YYYY-MM-DD",
  "plans": [
    {
      "planName": "方案一：{方案名}",
      "mainTitle": "主标题",
      "subTitle": "副标题",
      "bodyCopy": "核心文案",
      "visualStyle": "视觉风格描述",
      "dimensions": "推荐尺寸",
      "colorScheme": "色彩方向",
      "imageNotes": "配图建议"
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `topic` | string | 海报宣传主题 |
| `generatedDate` | string | 生成日期，格式 YYYY-MM-DD |
| `plans` | array | 方案数组，通常提供 2-3 个备选方案 |
| `planName` | string | 方案编号与名称，如"方案一：温情守护" |
| `mainTitle` | string | 海报主标题，简洁有力，通常 ≤ 10 字 |
| `subTitle` | string | 副标题，补充说明，通常 ≤ 20 字 |
| `bodyCopy` | string | 核心文案内容 |
| `visualStyle` | string | 视觉风格描述（如"扁平插画风""实景+文字叠加"） |
| `dimensions` | string | 推荐尺寸（如"1080x1920px 竖版""900x500px 横版"） |
| `colorScheme` | string | 色彩方向（如"蓝白为主，红色点缀警示"） |
| `imageNotes` | string | 配图/插画建议 |

### 输出规则

- 每次至少生成 2 个方案，最多 3 个
- 方案之间应有明显的风格差异（如一个温馨风、一个警示风）
- JSON schema 模板见 `../assets/templates/poster-schema.json`

## 三、视频脚本（JSON + Markdown）

视频脚本以 JSON 格式存储结构化数据，同时输出 Markdown 格式的分镜表。

### JSON 结构

```json
{
  "topic": "主题",
  "generatedDate": "YYYY-MM-DD",
  "totalDuration": "30-60s",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": "0-5s",
      "visualDescription": "画面内容描述",
      "narration": "旁白/配音文字",
      "subtitle": "字幕文字",
      "cameraNote": "镜头运动说明"
    }
  ]
}
```

### 分镜表 Markdown 格式

```markdown
# {主题} — 短视频脚本

**总时长**：{30-60}s

| 镜号 | 时长 | 画面描述 | 旁白/配音 | 字幕 | 镜头说明 |
|------|------|----------|-----------|------|----------|
| 1 | 0-5s | {画面} | {旁白} | {字幕} | {镜头} |
| 2 | 5-15s | {画面} | {旁白} | {字幕} | {镜头} |
| ... | ... | ... | ... | ... | ... |
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `topic` | string | 视频主题 |
| `generatedDate` | string | 生成日期 |
| `totalDuration` | string | 视频总时长范围 |
| `scenes` | array | 分镜数组 |
| `sceneNumber` | number | 镜号，从 1 开始 |
| `duration` | string | 该镜时长范围 |
| `visualDescription` | string | 画面内容详细描述 |
| `narration` | string | 旁白或配音文字 |
| `subtitle` | string | 屏幕字幕内容 |
| `cameraNote` | string | 镜头运动说明（推、拉、固定等） |

### 输出规则

- 视频时长默认 30-60 秒，用户可指定
- 分镜数量通常 5-8 个
- 第一个镜头必须是 Hook（抓注意力）
- 最后一个镜头包含行动呼吁和品牌信息
- JSON schema 模板见 `../assets/templates/video-script-schema.json`
