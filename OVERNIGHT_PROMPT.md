---
## 你的任务

根据「需求文档差距补齐计划」完成 Web 平台的 P0 → P1 → P2 全部功能开发。

当前平台已覆盖 8 大场景的核心 AI 能力（计划生成、内容生产、AI审核、数据分析、精准宣传、应急响应、智能客服、素材管理），但缺少工作流管理、外部系统对接、多模态AI等功能。本次任务按 P0/P1/P2 三个优先级分阶段补齐差距，将平台从"AI演示"升级为"可用工作工具"。

我会去睡觉，大概8小时后回来验收成果。

---

## ⚠️ 核心规则（必须遵守）

### 1. 绝对不要询问用户
- 用户已经睡觉了，不要使用任何 AskUserQuestion
- 所有问题自己解决：查阅代码、搜索最佳实践、参考现有实现模式
- 遇到不确定的地方，参照已有代码风格做决策

### 2. 自主决策并记录
- 遇到技术选择时，自己按照最佳实践做决定
- **所有重要决策必须记录在 `task-plan.md` 中**，格式：
  ```markdown
  ## 决策 [YYYY-MM-DD HH:MM]
  ### 问题
  [描述遇到的问题或选择]

  ### 选择的方案
  [你选择的方案]

  ### 原因
  [为什么选这个方案]
  ```

### 3. 任务状态管理
- 完成的任务：标记 ✅
- 进行中：标记 🚧
- 需要外部资源（无法独立完成）：标记 ⏸️

### 4. 优先级
- **严格按 P0 → P1 → P2 顺序实施**
- P0 全部完成后再开始 P1
- 时间不够时 P2 可以跳过（但尽量做完）

### 5. 不要着急
- 有8小时时间，慢慢做
- 不要节约token，做对最重要
- 多测试、多验证，避免返工

### 6. 分阶段执行 + 验证
- 每完成一个 P0/P1/P2 子项后运行 `cd web && npx next build` 验证编译通过
- 如果编译失败立即修复，不要积累错误
- 完成所有改动后做一次完整构建验证

### 7. 遵循现有代码风格
- **前端页面**：参考 `web/src/app/(dashboard)/plans/page.tsx` 的 "use client" 模式、Tailwind CSS 类名风格、Card/Badge/Tabs 组件用法
- **API 路由**：参考 `web/src/app/api/skills/plan-manager/route.ts` 的 Next.js Route Handler 模式
- **类型定义**：参考 `web/src/lib/types.ts` 的 interface 风格
- **模拟函数**：参考 `web/src/lib/skills.ts` 的 `simulateXxx()` 函数风格
- **组件**：使用 `lucide-react` 图标，`@/components/ui/*` 基础组件，Tailwind 样式
- **不要引入新依赖**，只用 `package.json` 中已有的库

---

## 📋 任务计划文件

你必须创建并持续更新 `task-plan.md`，格式见最下方。

---

## 🏗️ 现有代码架构

### 技术栈
- Next.js 14（App Router，`web/src/app/`）
- React 18 + TypeScript
- Tailwind CSS + lucide-react 图标
- Recharts 图表
- react-markdown 渲染

### 目录结构
```
web/src/
├── app/
│   ├── (dashboard)/          # 受保护的仪表盘路由（含 layout.tsx）
│   │   ├── page.tsx          # 工作台首页
│   │   ├── plans/page.tsx
│   │   ├── materials/page.tsx
│   │   ├── content/page.tsx
│   │   ├── content/review/page.tsx
│   │   ├── writing/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── outreach/page.tsx
│   │   ├── emergency/page.tsx
│   │   └── qa/page.tsx
│   ├── api/
│   │   ├── auth/             # 登录/登出
│   │   ├── data/             # 数据读取 API
│   │   └── skills/           # Skill 调用 API（POST）
│   └── login/
├── components/
│   ├── layout/sidebar.tsx    # Header + Sidebar
│   └── ui/                   # badge, button, card, input, select, tabs, textarea, planned-features
├── lib/
│   ├── constants.ts          # NAV_ITEMS 导航配置 ← 已更新（含新导航项）
│   ├── types.ts              # 所有 TypeScript 接口 ← 已更新（含新类型）
│   ├── store.ts              # JSON 文件持久化 CRUD ← 已创建
│   ├── skills.ts             # 模拟 Skill 实现
│   ├── skill-router.ts       # Skill 路由（simulated/llm/openclaw 三模式）
│   ├── data.ts               # 数据加载工具
│   ├── auth.ts               # 认证逻辑
│   └── utils.ts
```

### 已完成的前置工作

以下文件已经修改/创建好，你不需要重做：

1. **`web/src/lib/store.ts`** — JSON 文件持久化层，提供 `readItem<T>()`, `writeItem<T>()`, `listItems<T>()`, `deleteItem()`, `queryItems<T>()` 方法。数据存储在项目根目录 `store/` 下。

2. **`web/src/lib/types.ts`** — 已添加以下新类型：
   - `PlanRecord` — id, month, title, content, createdAt, version, status(draft/active/archived)
   - `PlanTask` — id, planId, title, description, assignee, status(pending/in_progress/completed/overdue), priority(P0/P1/P2), dueDate, week, createdAt, updatedAt
   - `PlanVersion` — id, planId, version, content, changeNote, createdAt
   - `HumanReviewStage` — role, reviewer, action(approve/reject/revise/pending), comment, timestamp
   - `ReviewRecord` — id, content, platform, aiResult(ReviewResult), humanStages[], status(pending_human/approved/rejected), createdAt, updatedAt
   - `CoursewareRequest` — audience, topic, duration, format
   - `PublishJob` — id, content, platforms[], status(draft/publishing/published/failed), results[], createdAt
   - `SentimentItem`, `SentimentData` — 舆情监测数据结构
   - `ComplaintItem`, `ComplaintData` — 投诉建议数据结构

3. **`web/src/lib/constants.ts`** — 导航已更新为完整结构：
   ```
   概览: 工作台
   计划与素材: 计划管理, 素材库
   内容工作流: 内容生产, 视觉内容, 材料撰写, 内容审核, 内容发布
   监测与分析: 传播分析, 舆情监测, 精准宣传
   响应与服务: 应急响应, 咨询服务, 12345热线
   系统管理: 权限管理
   ```

4. **`store/` 目录**已创建：`store/plans/`, `store/plan-versions/`, `store/tasks/`, `store/reviews/`, `store/review-kb/`

---

## 🚀 实施计划

### 实施依赖关系
```
store.ts (已完成) ← types.ts (已完成) ← constants.ts (已完成)
  ├→ P0-1 计划任务跟踪
  │   └→ P0-2 版本管理
  ├→ P0-3 多级审核工作流
  │   └→ P0-4 审核知识库
  └→ P0-5 宣讲课件生成（独立，无依赖）

P1-1 多平台发布（独立）
P1-2 关联分析（独立）
P1-3 舆情监测（独立）
P1-4 民意分析（独立）

P2-1~P2-5 占位页面（独立，可并行）
```

---

### P0-1：计划任务跟踪（场景 1.4）

将生成的计划分解为可跟踪的任务，支持状态管理和责任指派。

**新增 API**：
- `web/src/app/api/data/plans/route.ts` — GET 列表（调用 `listItems<PlanRecord>("plans")`），POST 保存计划（调用 `writeItem`）
- `web/src/app/api/data/plans/[id]/route.ts` — GET/PUT/DELETE 单个计划
- `web/src/app/api/data/plans/[id]/tasks/route.ts` — GET 列表（`queryItems<PlanTask>("tasks", t => t.planId === id)`），POST 创建任务

**新增组件**：
- `web/src/components/plans/task-board.tsx` — 看板视图（4列：待办/进行中/已完成/逾期），每列显示对应状态的任务卡片
- `web/src/components/plans/task-card.tsx` — 任务卡片（显示标题、状态徽章、负责人、截止日期、优先级标签）

**修改文件**：
- `web/src/app/(dashboard)/plans/page.tsx` — 添加 Tabs：「生成计划」|「任务看板」|「历史记录」
  - 生成计划 Tab：保留现有月份选择+生成功能，增加"保存计划"按钮
  - 保存计划时：调用 POST /api/data/plans 保存，然后自动从计划内容提取任务（解析周度计划生成4个 PlanTask）
  - 任务看板 Tab：嵌入 TaskBoard 组件，支持点击任务卡片修改状态
  - 历史记录 Tab：列出已保存的计划，点击可查看详情

### P0-2：计划版本管理（场景 1.5）

每次重新生成或编辑计划时自动保存新版本，支持版本对比。

**新增 API**：
- `web/src/app/api/data/plans/[id]/versions/route.ts` — GET 版本列表（`queryItems<PlanVersion>("plan-versions", v => v.planId === id)` 按 version 排序）

**新增组件**：
- `web/src/components/plans/version-history.tsx` — 版本时间线（垂直时间轴，每个节点显示版本号、变更说明、时间）
- `web/src/components/plans/version-diff.tsx` — 双栏对比视图（左旧右新，行级文本差异用颜色标注增/删）

**修改**：历史记录 Tab 中选中某计划后可展开版本历史

### P0-3：多级人工审核工作流（场景 4.2）

在 AI 审核之后增加人工审核流程。

审核流水线：`AI三级自动审核 → 创作员提交 → 新媒体负责人初审 → 科室领导复审 → 分管领导终审`

**新增 API**：
- `web/src/app/api/data/reviews/route.ts` — GET 列表（支持 `?status=` 筛选），POST 提交审核（创建 ReviewRecord，humanStages 初始化4个 pending 阶段）
- `web/src/app/api/data/reviews/[id]/route.ts` — GET 详情，PUT 审批操作（更新对应 humanStage 的 action/comment/timestamp，如果全部 approve 则更新 status 为 approved）

**新增组件**：
- `web/src/components/review/review-pipeline.tsx` — 审核流水线可视化
  - 横向展示 AI 阶段（3个圆点）+ 人工阶段（4个圆点：创作员提交→新媒体负责人初审→科室领导复审→分管领导终审）
  - 已通过的节点绿色，当前节点蓝色闪烁，未到达的灰色
- `web/src/components/review/review-action.tsx` — 审批操作面板
  - 当前阶段显示"通过""驳回""批注"三个按钮
  - 驳回/批注需填写意见
- `web/src/components/review/review-list.tsx` — 待审核列表
  - 按角色筛选（全部/新媒体负责人/科室领导/分管领导）
  - 显示内容摘要、提交时间、当前审核阶段

**修改文件**：
- `web/src/app/(dashboard)/content/review/page.tsx` — 添加 Tabs：「AI审核」|「审批流程」|「审核记录」
  - AI 审核 Tab：保留现有功能，增加"提交人工审核"按钮（AI 审核通过后可点击）
  - 审批流程 Tab：嵌入 ReviewList + 点击展开 ReviewPipeline + ReviewAction
  - 审核记录 Tab：所有历史审核记录列表

### P0-4：审核知识库（场景 4.3）

积累审核意见，辅助审核人快速决策。

**新增 API**：
- `web/src/app/api/data/review-kb/route.ts` — GET 列表（支持 `?q=` 搜索），POST 新增条目（id, category, title, content, source, createdAt）

**新增组件**：
- `web/src/components/review/knowledge-base.tsx` — 知识库面板
  - 搜索框 + 分类筛选（格式规范/敏感词/政策法规/历史案例）
  - 知识条目卡片列表

**修改**：审核页面侧边栏（或审批流程 Tab 右侧）展示相关知识库条目

### P0-5："七进"宣讲课件生成（场景 6.2）

新增 skill 生成进校园/社区/企业的宣讲课件大纲。

**新增 API**：
- `web/src/app/api/skills/courseware/route.ts` — POST，调用 `invokeSkill("courseware", params)`

**修改文件**：
- `web/src/lib/skills.ts` — 添加 `simulateCourseware(req: CoursewareRequest): string`
  - 根据 audience（进校园/进社区/进企业/进农村/进家庭/进机关/进网络）和 topic 生成课件大纲
  - 输出 Markdown 格式的课件大纲（含封面信息、目标受众分析、课程结构、每页 PPT 内容提要、互动环节设计、考核测验题）
- `web/src/lib/skill-router.ts` — 在 `invokeSimulated()` 和 `buildUserMessage()` 中添加 `courseware` case
- `web/src/app/(dashboard)/outreach/page.tsx` — 添加"生成宣讲课件"Tab
  - 表单：受众选择（七进下拉）、主题、时长（30/45/60/90分钟）、格式（PPT大纲/讲稿/教案）
  - 生成结果 Markdown 预览

**新增 Skill 文件**（可选，不影响功能）：
- `skills-traffic/courseware-generator/SKILL.md`

---

### P1-1：多平台一键发布（场景 3.2）

设计发布工作流 UI，后端模拟发布。

**新增 API**：
- `web/src/app/api/publish/route.ts` — POST 创建发布任务（模拟1秒后成功），GET 列表
- `web/src/app/api/publish/[id]/route.ts` — GET 发布状态

**新增页面**：
- `web/src/app/(dashboard)/content/publish/page.tsx` — 发布管理页
  - 上部：发布表单（内容文本框、平台多选：微信/微博/抖音/LED大屏、预览按钮、一键发布按钮）
  - 下部：发布记录列表（状态标签：草稿/发布中/已发布/失败、发布时间、平台列表）

### P1-2：传播效果与违法/事故关联分析（场景 5.3）

**新增 API**：
- `web/src/app/api/skills/correlation-analysis/route.ts` — POST

**修改文件**：
- `web/src/lib/skills.ts` — 添加 `simulateCorrelationAnalysis(): string` 生成关联分析报告（宣传曝光量 vs 违法率变化的月度对比表、相关性分析、效果评估）
- `web/src/lib/skill-router.ts` — 添加 `correlation-analysis` case，注入 analytics + accident 数据
- `web/src/app/(dashboard)/analytics/page.tsx` — 添加「效果关联分析」Tab

### P1-3：舆情监测页面（场景 5.2）

**新增数据**：
- `data/sentiment/sample-202601.json` — 模拟舆情数据（10-15条舆情条目、情感分布、7天趋势、热词、预警）

**新增页面**：
- `web/src/app/(dashboard)/sentiment/page.tsx` — 舆情大盘
  - 预警卡片区（红/橙/黄分级）
  - 情感分布饼图（Recharts PieChart）
  - 7日趋势折线图（Recharts LineChart）
  - 热词云（简单标签云，用 Badge 组件 + 不同字号）
  - 舆情条目列表（标题、来源、情感标签、热度、时间、摘要）

**新增组件**（可选，也可以内联在 page.tsx 中）：
- `web/src/components/sentiment/sentiment-list.tsx`
- `web/src/components/sentiment/sentiment-charts.tsx`
- `web/src/components/sentiment/alert-panel.tsx`

### P1-4：民意数据分析（场景 8.3）

**新增 API**：
- `web/src/app/api/skills/opinion-analysis/route.ts` — POST

**新增数据**：
- `data/complaints/sample-202601.json` — 模拟投诉建议数据（15-20条，含类别、内容、来源、情感、时间、状态）

**修改文件**：
- `web/src/lib/skills.ts` — 添加 `simulateOpinionAnalysis(): string` 生成民意分析报告
- `web/src/lib/skill-router.ts` — 添加 `opinion-analysis` case
- `web/src/app/(dashboard)/qa/page.tsx` — 添加「民意分析」Tab

---

### P2-1：应急智能触发（场景 7.1）

**新增组件**：
- `web/src/components/emergency/trigger-config.tsx` — 触发规则配置面板（表单样式，含气象预警阈值、事故等级阈值等选项，标注"需对接气象/指挥中心系统"）
- `web/src/components/emergency/trigger-log.tsx` — 触发历史记录（模拟数据表格）

**修改**：`web/src/app/(dashboard)/emergency/page.tsx` — 添加「触发配置」Tab

### P2-2：12345 热线对接（场景 8.2）

**新增页面**：
- `web/src/app/(dashboard)/hotline/page.tsx` — 工单列表（模拟数据）、智能分派面板、情感分析标签。使用模拟硬编码数据，页面顶部标注"需对接12345平台API"

### P2-3：素材自动采集（场景 2.1）

**新增组件**：
- `web/src/components/materials/ingest-config.tsx` — 采集源配置面板（监控/执法记录仪/行车记录仪，表单样式，标注"需对接视频源系统"）

**修改**：`web/src/app/(dashboard)/materials/page.tsx` — 添加「采集管理」Tab

### P2-4：视觉内容生成（场景 3.1）

**新增页面**：
- `web/src/app/(dashboard)/content/visual/page.tsx` — 三个 Tab（海报生成/视频生成/数字人播报），每个 Tab 展示表单 UI 和预期效果示意图，标注"需对接图像/视频生成AI服务"

### P2-5：权限管理（场景 2.3 + 4.2）

**新增页面**：
- `web/src/app/(dashboard)/admin/page.tsx` — 三个 Tab（用户管理/角色管理/部门管理），展示表格 UI 框架（模拟数据），标注"需对接统一身份认证系统"

---

## 📊 关键文件清单

| 文件 | 改动类型 | 优先级 |
|------|---------|--------|
| `web/src/lib/store.ts` | ✅ 已完成 | 前置 |
| `web/src/lib/types.ts` | ✅ 已完成 | 前置 |
| `web/src/lib/constants.ts` | ✅ 已完成 | 前置 |
| `web/src/lib/skills.ts` | 修改（+3 模拟函数） | P0-5, P1-2, P1-4 |
| `web/src/lib/skill-router.ts` | 修改（+3 case） | P0-5, P1-2, P1-4 |
| `web/src/app/api/data/plans/route.ts` | 新建 | P0-1 |
| `web/src/app/api/data/plans/[id]/route.ts` | 新建 | P0-1 |
| `web/src/app/api/data/plans/[id]/tasks/route.ts` | 新建 | P0-1 |
| `web/src/app/api/data/plans/[id]/versions/route.ts` | 新建 | P0-2 |
| `web/src/app/api/data/reviews/route.ts` | 新建 | P0-3 |
| `web/src/app/api/data/reviews/[id]/route.ts` | 新建 | P0-3 |
| `web/src/app/api/data/review-kb/route.ts` | 新建 | P0-4 |
| `web/src/app/api/skills/courseware/route.ts` | 新建 | P0-5 |
| `web/src/app/api/skills/correlation-analysis/route.ts` | 新建 | P1-2 |
| `web/src/app/api/skills/opinion-analysis/route.ts` | 新建 | P1-4 |
| `web/src/app/api/publish/route.ts` | 新建 | P1-1 |
| `web/src/app/api/publish/[id]/route.ts` | 新建 | P1-1 |
| `web/src/components/plans/task-board.tsx` | 新建 | P0-1 |
| `web/src/components/plans/task-card.tsx` | 新建 | P0-1 |
| `web/src/components/plans/version-history.tsx` | 新建 | P0-2 |
| `web/src/components/plans/version-diff.tsx` | 新建 | P0-2 |
| `web/src/components/review/review-pipeline.tsx` | 新建 | P0-3 |
| `web/src/components/review/review-action.tsx` | 新建 | P0-3 |
| `web/src/components/review/review-list.tsx` | 新建 | P0-3 |
| `web/src/components/review/knowledge-base.tsx` | 新建 | P0-4 |
| `web/src/components/emergency/trigger-config.tsx` | 新建 | P2-1 |
| `web/src/components/emergency/trigger-log.tsx` | 新建 | P2-1 |
| `web/src/components/materials/ingest-config.tsx` | 新建 | P2-3 |
| `web/src/app/(dashboard)/plans/page.tsx` | 重构 | P0-1 |
| `web/src/app/(dashboard)/content/review/page.tsx` | 重构 | P0-3 |
| `web/src/app/(dashboard)/outreach/page.tsx` | 修改 | P0-5 |
| `web/src/app/(dashboard)/analytics/page.tsx` | 修改 | P1-2 |
| `web/src/app/(dashboard)/qa/page.tsx` | 修改 | P1-4 |
| `web/src/app/(dashboard)/emergency/page.tsx` | 修改 | P2-1 |
| `web/src/app/(dashboard)/materials/page.tsx` | 修改 | P2-3 |
| `web/src/app/(dashboard)/sentiment/page.tsx` | 新建 | P1-3 |
| `web/src/app/(dashboard)/content/publish/page.tsx` | 新建 | P1-1 |
| `web/src/app/(dashboard)/content/visual/page.tsx` | 新建 | P2-4 |
| `web/src/app/(dashboard)/hotline/page.tsx` | 新建 | P2-2 |
| `web/src/app/(dashboard)/admin/page.tsx` | 新建 | P2-5 |
| `data/sentiment/sample-202601.json` | 新建 | P1-3 |
| `data/complaints/sample-202601.json` | 新建 | P1-4 |

---

## ✅ 验收标准

### 编译验证
```bash
cd web && npx next build
```
必须编译通过，零 TypeScript 错误。

### 功能验证

**P0 验证**：
1. 计划管理页：生成计划 → 保存 → 自动分解为4个任务 → 任务看板显示 → 修改任务状态 → 版本历史展示
2. 内容审核页：AI审核通过 → 提交人工审核 → 审批流水线显示 → 逐级审批 → 知识库面板展示
3. 精准宣传页：新增"生成宣讲课件"Tab 可正常使用

**P1 验证**：
4. 内容发布页：填写内容 → 选择平台 → 一键发布 → 发布记录显示
5. 传播分析页：新增"效果关联分析"Tab 可生成报告
6. 舆情监测页：预警卡片、饼图、折线图、舆情列表正常显示
7. 咨询服务页：新增"民意分析"Tab 可生成报告

**P2 验证**：
8. 所有新增导航项可点击进入对应页面
9. P2 占位页面展示功能说明和"待对接"标注

### API 验证（curl 测试）
```bash
# 计划 CRUD
curl http://localhost:3000/api/data/plans
curl -X POST http://localhost:3000/api/data/plans -H 'Content-Type: application/json' -d '{"month":"3","title":"3月计划","content":"..."}'

# 审核提交
curl -X POST http://localhost:3000/api/data/reviews -H 'Content-Type: application/json' -d '{"content":"测试内容","platform":"wechat"}'

# 知识库
curl http://localhost:3000/api/data/review-kb

# 发布
curl -X POST http://localhost:3000/api/publish -H 'Content-Type: application/json' -d '{"content":"测试","platforms":["wechat","weibo"]}'
```

---

## ❌ 错误处理

### 如果编译失败
1. 仔细阅读错误信息
2. 修复 TypeScript 类型错误和 import 路径
3. 确保所有新增组件的 props 类型正确
4. 重新编译验证

### 如果时间不够
1. **P0 必须全部完成**
2. **P1 尽量完成**（独立模块，每个1-2小时）
3. **P2 可以简化**（每个占位页面可以很快）
4. 在 task-plan.md 中记录未完成项

---

## 📝 task-plan.md 模板

```markdown
# Task Plan - 交通安全智能化平台功能补齐

## 总体进度
- 已完成: X%
- 当前阶段: [P0/P1/P2]

---

## 前置工作
- [x] store.ts 持久化层
- [x] types.ts 新增类型
- [x] constants.ts 导航更新

## P0 任务
- [ ] P0-1: 计划任务跟踪
- [ ] P0-2: 计划版本管理
- [ ] P0-3: 多级人工审核工作流
- [ ] P0-4: 审核知识库
- [ ] P0-5: 宣讲课件生成

## P1 任务
- [ ] P1-1: 多平台一键发布
- [ ] P1-2: 关联分析
- [ ] P1-3: 舆情监测
- [ ] P1-4: 民意分析

## P2 任务
- [ ] P2-1: 应急智能触发
- [ ] P2-2: 12345热线
- [ ] P2-3: 素材自动采集
- [ ] P2-4: 视觉内容生成
- [ ] P2-5: 权限管理

---

## 决策记录

[记录所有重要决策]

---

## 问题与解决方案

[记录遇到的问题和解决方法]
```

---

## 🌙 开始工作

1. 创建 `task-plan.md`
2. 从 P0-1 开始：创建 API 目录和路由文件，编写组件，修改 plans 页面
3. 完成 P0-1 后运行 `npx next build` 验证
4. 继续 P0-2 → P0-3 → P0-4 → P0-5
5. P0 全部完成后开始 P1
6. P1 全部完成后开始 P2
7. 最终运行 `npx next build` 确认全部编译通过
8. 更新 task-plan.md 最终状态

**记住：慢慢做，做对最重要。晚安！**
