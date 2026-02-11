# Task Plan - 交通安全宣传教育智能化平台

## 总体进度
- 已完成: 100%
- 当前阶段: 全部完成

---

## 任务清单

### Phase 0: 项目初始化 [completed]
- [x] 创建目录结构（skills/8个、data/4个、output/5个、templates/、docs/）
- [x] 创建微信推文模板 `templates/content-wechat.md`（含格式规范 + 2篇范例）
- [x] 创建微博模板 `templates/content-weibo.md`（含字数限制 + 3条范例）
- [x] 创建抖音模板 `templates/content-douyin.md`（含口语化风格规范 + 3条范例）
- [x] 创建审核检查清单 `templates/review-checklist.md`（含敏感词库 + 4大类检查项 + 审核记录JSON格式）
- [x] 创建月度计划模板 `templates/plan-monthly.md`（含4周结构 + 资源需求 + 效果预期）
- [x] 创建月度报告模板 `templates/report-monthly.md`（含6大分析板块）
- [x] 生成素材模拟数据 — 20条素材元数据 `data/materials/items/mat-001~020.json`
- [x] 生成素材索引 `data/materials/index.json`
- [x] 生成传播模拟数据 — 3个平台 `data/analytics/wechat-202601.json` / `weibo-202601.json` / `douyin-202601.json`
- [x] 生成事故模拟数据 `data/accident-data/2025-summary.json`（含月度趋势、事故类型、高风险区域、高风险人群等）
- 状态: completed

### Phase 1: P0 核心 Skills [completed]
- [x] content-producer: 内容生产 Skill — 多平台文案 + 海报方案 + 视频脚本
- [x] media-hub: 素材中枢 Skill — 自然语言检索 + 自动标引 + 素材统计
- [x] content-reviewer: 内容审核 Skill — 三级审核流程 + 审核记录持久化
- 状态: completed

### Phase 2: P1 扩展 Skills [completed]
- [x] plan-manager: 计划管理 Skill — 月度计划生成 + 风险导向 + 数据驱动
- [x] analytics: 效果监测 Skill — 多平台数据分析 + 报告生成 + 优化建议
- 状态: completed

### Phase 3: P2 高级 Skills [completed]
- [x] precision-outreach: 精准宣传 Skill — 风险识别 + 定向方案 + 宣传指令包
- [x] emergency-response: 应急响应 Skill — 应急内容包 + 预警通报 + 绕行建议
- [x] public-relations: 公共关系 Skill — 智能客服 + 业务咨询 + 内置知识库
- 状态: completed

### Phase 4: 文档与验证 [completed]
- [x] 创建 task-plan.md
- [x] 创建 test-results.md
- [x] 创建 README.md
- 状态: completed

---

## 决策记录

## 决策 [2026-02-11 12:28]
### 问题
OpenClaw Skills 目录应放在项目根目录的 `skills/` 还是 `.agents/skills/`？

### 选择的方案
放在项目根目录的 `skills/` 目录下。

### 原因
1. PRD 明确指定了 `skills/` 作为 Skill 目录
2. 项目已有 `.agents/skills/` 用于全局安装的 Skills（如 find-skills），项目自定义 Skills 放在根目录的 `skills/` 更清晰
3. OpenClaw 支持从项目根目录的 `skills/` 加载工作区 Skills

### 备选方案（未选）
- `.agents/skills/` — 会与已安装的全局 Skills 混在一起，不利于项目管理

## 决策 [2026-02-11 12:29]
### 问题
SKILL.md 中是否需要使用 `allowed-tools` 字段限制工具权限？

### 选择的方案
不使用 `allowed-tools`，让 Skills 继承默认工具权限。

### 原因
1. 本项目是本地验证原型，不需要严格的工具权限控制
2. Skills 需要读写文件（Read/Write）、执行搜索（Grep/Glob），限制权限反而可能阻碍功能
3. 简化配置，减少调试复杂度

### 备选方案（未选）
- 为每个 Skill 指定精确的 `allowed-tools` — 增加了配置复杂度，PoC 阶段不必要

## 决策 [2026-02-11 12:30]
### 问题
素材模拟数据生成多少条？PRD 提到 10-20 条，开发计划提到 ≥ 30 条。

### 选择的方案
生成 20 条素材元数据。

### 原因
1. 20 条足以覆盖各种素材类型（视频 14 条、图片 6 条）
2. 覆盖了主要的标签维度：事故类型、违法种类、路段类型、天气、涉及对象、内容性质
3. 足够支撑搜索测试和素材管理功能验证
4. 在 PRD 的 10-20 条范围内

### 备选方案（未选）
- 30+ 条 — 开发计划建议的数量，但会增加大量重复性工作且边际收益有限

## 决策 [2026-02-11 12:31]
### 问题
public-relations Skill 是做简单的FAQ模板，还是内置一套完整的交通业务知识库？

### 选择的方案
直接在 SKILL.md 中内置一套精简但完整的交通业务知识库。

### 原因
1. 内置知识库使 Skill 开箱即用，不依赖外部数据文件
2. 覆盖了最常见的 4 大业务：驾驶证、机动车、违法处理、事故处理
3. LLM 可以基于这些知识库条目进行语义扩展回答
4. PoC 阶段不需要动态更新知识库

### 备选方案（未选）
- 使用外部 JSON 文件存储 FAQ — 增加文件管理复杂度，PoC 阶段无必要
- 仅做简单问答模板 — 内容过于单薄，无法有效验证智能客服能力

---

## 障碍记录

无障碍。所有任务均可独立完成，无需用户提供额外资源。

---

## 问题与解决方案

### 问题1：OpenClaw SKILL.md 格式确认
- 问题描述: 需要确认 OpenClaw SKILL.md 的精确格式规范，以确保 Skills 能被正确加载和触发
- 解决方案: 通过以下方式获取了完整的格式规范：
  1. 检查本地已安装的 Skills（find-skills、skill-creator 等）学习实际格式
  2. Web 搜索 OpenClaw 官方文档
  3. 分析了 `.agents/skills/` 下的实际 SKILL.md 文件
- 搜索到的参考:
  - OpenClaw Skills 官方文档：https://docs.openclaw.ai/tools/skills
  - DeepWiki Skills System：https://deepwiki.com/openclaw/openclaw/6.3-skills-system
  - Awesome OpenClaw Skills：https://github.com/VoltAgent/awesome-openclaw-skills
- 结论: SKILL.md 使用 YAML frontmatter（name + description 必填）+ Markdown body 的标准格式
