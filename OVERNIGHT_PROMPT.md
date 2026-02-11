---
## 你的任务

根据 `PRD-交通安全宣传教育智能化平台.md` 完整开发 OpenClaw Agent Skills。

这是一个基于 OpenClaw 框架的**本地验证原型（PoC）**，目标是将交警宣传教育工作的 8 大业务场景封装为可独立调用的 Agent Skills。

我会去睡觉，大概8小时后回来验收成果。

---

## ⚠️ 核心规则（必须遵守）

### 1. 绝对不要询问用户
- 用户已经睡觉了，不要使用任何 AskUserQuestion
- 所有问题自己解决：查阅 OpenClaw 文档、搜索最佳实践、尝试不同方案
- 遇到需要模拟数据或示例文件的情况，自己生成合理的示例

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

  ### 备选方案（未选）
  [其他可行方案及未选原因]
  ```

### 3. 处理依赖问题
- **如果任务需要用户提供的信息/资源才能继续**（比如真实素材文件、API Key等）：
  - 在 `task-plan.md` 中记录障碍原因
  - 将任务状态改为 `suspended`
  - 使用模拟数据或占位符继续做其他可以独立完成的任务

### 4. 任务状态管理
- 完成的任务：状态改为 `completed`
- 进行中：状态改为 `in-progress`
- 需要用户资源：状态改为 `suspended`

### 5. 优先级
- **优先完成能独立完成的部分**
- 无法完成的部分记录下来，等待用户起床后处理

### 6. 不要着急
- 有8小时时间，慢慢做
- 不要节约token，做对最重要
- 多测试、多验证，避免返工

### 7. 遇到不确定的就搜索
- 使用 websearch 查找 OpenClaw Skills 最佳实践
- 查看官方文档、GitHub issue
- 参考类似 Agent Skills 的实现

### 8. 分阶段执行 + 验证
- 所有子任务分阶段执行
- **每个 Skill 完成后进行验证**，确保功能正常
- 避免全搞完了发现不行要推倒重来

### 9. 实用主义
- 本阶段是纯本地验证，不需要 Web UI
- 功能优先，不需要过度设计
- 保证基本可用即可

---

## 📋 任务计划文件

你必须创建并持续更新 `task-plan.md`，格式：

```markdown
# Task Plan - 交通安全宣传教育智能化平台

## 总体进度
- 已完成: X%
- 预计完成时间: [预计时间]
- 当前阶段: [Phase X]

---

## 任务清单

### Phase 0: 项目初始化 [in-progress]
- [x] 创建目录结构
- [ ] 创建基础数据目录
- [ ] 创建模板文件
- [ ] 准备模拟数据
- 状态: in-progress

### Phase 1: P0 核心 Skills [pending]
- [ ] content-producer: 内容生产 Skill
- [ ] media-hub: 素材中枢 Skill
- [ ] content-reviewer: 内容审核 Skill
- 状态: pending

### Phase 2: P1 扩展 Skills [pending]
- [ ] plan-manager: 计划管理 Skill
- [ ] analytics: 效果监测 Skill
- 状态: pending

### Phase 3: P2 高级 Skills [pending]
- [ ] precision-outreach: 精准宣传 Skill
- [ ] emergency-response: 应急响应 Skill
- [ ] public-relations: 公共关系 Skill
- 状态: pending

### Phase 4: 端到端验证 [pending]
- [ ] 链路测试: 计划 → 素材 → 生产 → 审核
- [ ] 生成测试报告
- 状态: pending

---

## 决策记录

[在上面规则中定义的格式记录所有决策]

---

## 障碍记录

### [障碍1]
- 任务: [某个任务]
- 原因: [为什么卡住]
- 需要的资源: [需要用户提供什么]
- 状态: suspended

---

## 问题与解决方案

### [问题1]
- 问题描述: ...
- 解决方案: ...
- 搜索到的参考: ...
```

---

## 🚀 工作流程

### Phase 0: 项目初始化 (1小时)

1. **创建目录结构**（参考 PRD 4.3 节）
   ```
   traffic-project/
   ├── skills/                    # 8个 Skill 目录
   │   ├── content-producer/
   │   ├── media-hub/
   │   ├── content-reviewer/
   │   ├── plan-manager/
   │   ├── analytics/
   │   ├── precision-outreach/
   │   ├── emergency-response/
   │   └── public-relations/
   ├── data/                      # 本地数据
   │   ├── materials/             # 素材库
   │   ├── analytics/             # 模拟传播数据
   │   ├── reviews/               # 审核记录
   │   └── accident-data/         # 模拟事故数据
   ├── output/                    # 产出物
   │   ├── content/               # 生成的文案
   │   ├── plans/                 # 生成的计划
   │   ├── reports/               # 分析报告
   │   ├── posters/               # 海报方案
   │   └── scripts/               # 视频脚本
   ├── templates/                 # 模板文件
   └── docs/                      # 文档
   ```

2. **创建模板文件**
   - `templates/content-wechat.md` - 微信推文模板
   - `templates/content-weibo.md` - 微博模板
   - `templates/content-douyin.md` - 抖音模板
   - `templates/review-checklist.md` - 审核检查清单
   - `templates/plan-monthly.md` - 月度计划模板
   - `templates/report-monthly.md` - 月度报告模板

3. **准备模拟数据**
   - `data/materials/index.json` - 素材索引
   - `data/materials/items/mat-*.json` - 10-20条素材元数据
   - `data/analytics/*.json` - 3个平台的模拟传播数据
   - `data/accident-data/2025-summary.json` - 模拟事故数据

### Phase 1: P0 核心 Skills (4小时)

#### Skill 1: content-producer（内容生产）

**功能需求**（参考 PRD 2.3 节 US-CP.1~CP.3）：
- 生成多平台文案（微信/微博/抖音）
- 生成海报文案方案
- 生成短视频脚本

**实现步骤**：
1. 创建 `skills/content-producer/SKILL.md`
2. 定义触发条件：用户提到"写文案"、"生成内容"、"创作"等
3. 实现指令逻辑：
   - 调用 LLM 生成符合平台规范的文案
   - 保存到 `output/content/`
   - 生成海报方案保存到 `output/posters/`
   - 生成视频脚本保存到 `output/scripts/`
4. **验证**：测试生成3个主题的文案，检查格式是否符合规范

#### Skill 2: media-hub（素材中枢）

**功能需求**（参考 PRD 2.3 节 US-MH.1~MH.2）：
- 自然语言搜索本地素材
- 为新素材自动生成标签

**实现步骤**：
1. 创建 `skills/media-hub/SKILL.md`
2. 定义触发条件：用户提到"找素材"、"搜索"、"标引"等
3. 实现指令逻辑：
   - 读取 `data/materials/index.json`
   - 使用 LLM 理解查询意图，匹配标签
   - 返回匹配的素材列表
   - 新素材标引：生成多维度标签并保存元数据
4. **验证**：测试5个搜索查询，检查返回结果是否相关

#### Skill 3: content-reviewer（内容审核）

**功能需求**（参考 PRD 2.3 节 US-CR.1~CR.2）：
- 自动检查文案合规性
- 模拟多级审核流程

**实现步骤**：
1. 创建 `skills/content-reviewer/SKILL.md`
2. 定义触发条件：用户提到"审核"、"检查"、"合规"等
3. 实现指令逻辑：
   - 检查敏感词、政治表述、事实准确性
   - 输出三级结果：通过/警告/阻断
   - 模拟初审→复审→终审三级审核
   - 保存审核记录到 `data/reviews/`
4. **验证**：准备5篇测试文案（含已知问题），检查检出率

### Phase 2: P1 扩展 Skills (2小时)

#### Skill 4: plan-manager（计划管理）

**功能需求**（参考 PRD 2.3 节 US-PM.1）：
- 自动生成月度宣传计划

**实现步骤**：
1. 创建 `skills/plan-manager/SKILL.md`
2. 结合当月节假日、季节特性生成计划
3. 输出包含周度主题、内容方向、发布渠道的 Markdown 文件
4. **验证**：生成3份月度计划，检查结构合理性

#### Skill 5: analytics（效果监测）

**功能需求**（参考 PRD 2.3 节 US-AN.1）：
- 基于模拟数据生成分析报告

**实现步骤**：
1. 创建 `skills/analytics/SKILL.md`
2. 读取 `data/analytics/` 下的模拟数据
3. 生成包含核心指标、Top内容、趋势分析的 Markdown 报告
4. **验证**：读取测试数据，检查报告结构完整性

### Phase 3: P2 高级 Skills (2小时)

#### Skill 6: precision-outreach（精准宣传）

**功能需求**：基于事故数据识别高风险区域，生成定向宣传方案

**实现步骤**：
1. 创建 `skills/precision-outreach/SKILL.md`
2. 分析 `data/accident-data/` 数据
3. 生成针对特定区域/人群的定向宣传文案

#### Skill 7: emergency-response（应急响应）

**功能需求**：根据预警信息自动生成应急宣传内容包

**实现步骤**：
1. 创建 `skills/emergency-response/SKILL.md`
2. 快速生成安全提示、绕行建议等内容

#### Skill 8: public-relations（公共关系）

**功能需求**：模拟智能客服应答常见交通业务咨询

**实现步骤**：
1. 创建 `skills/public-relations/SKILL.md`
2. 定义常见咨询 Q&A 模板
3. 实现智能应答逻辑

### Phase 4: 端到端验证 (1小时)

1. **链路测试**
   ```
   用户: "制定2月份宣传计划"
   → plan-manager 生成计划
   
   用户: "根据计划第一个主题找相关素材"
   → media-hub 搜索素材
   
   用户: "根据这些素材写一篇微信推文"
   → content-producer 生成文案
   
   用户: "审核这篇文案"
   → content-reviewer 审核
   ```

2. **验证清单**：
   - [ ] 每个 Skill 能被正确触发
   - [ ] Skill 输出符合预期格式
   - [ ] 文件正确保存到对应目录
   - [ ] 审核链路能完整跑通

---

## 📊 输出要求

### 1. 完整目录结构
```
traffic-project/
├── skills/                          # 8个 Skill
│   ├── content-producer/SKILL.md
│   ├── media-hub/SKILL.md
│   ├── content-reviewer/SKILL.md
│   ├── plan-manager/SKILL.md
│   ├── analytics/SKILL.md
│   ├── precision-outreach/SKILL.md
│   ├── emergency-response/SKILL.md
│   └── public-relations/SKILL.md
├── data/                            # 模拟数据
│   ├── materials/index.json
│   ├── materials/items/mat-*.json (10-20条)
│   ├── analytics/*.json (3个平台)
│   ├── reviews/ (空目录)
│   └── accident-data/2025-summary.json
├── output/                          # 产出物目录（空）
│   ├── content/
│   ├── plans/
│   ├── reports/
│   ├── posters/
│   └── scripts/
├── templates/                       # 模板文件
│   ├── content-wechat.md
│   ├── content-weibo.md
│   ├── content-douyin.md
│   ├── review-checklist.md
│   ├── plan-monthly.md
│   └── report-monthly.md
├── task-plan.md                     # 任务计划与决策记录
├── test-results.md                  # 验证测试结果
└── README.md                        # 使用说明
```

### 2. 文档文件
- **`task-plan.md`** - 任务计划、决策记录、障碍记录
- **`test-results.md`** - 各 Skill 验证测试结果
- **`README.md`** - 包含：项目介绍、使用方法、测试示例

### 3. 每个 SKILL.md 必须包含
- 清晰的触发条件（When to Use）
- 详细的执行指令（Instructions）
- 规范的输出格式（Output Format）
- 至少1个使用示例

---

## ❌ 错误处理

### 如果遇到无法解决的问题

1. 在 task-plan.md 中记录：
   ```markdown
   ### 问题记录 [YYYY-MM-DD HH:MM]
   - 任务: [任务名称]
   - 问题描述: [具体问题]
   - 尝试过的方案: [你试过的所有方案]
   - 参考资源: [搜索到的文档/issue链接]
   - 状态: blocked / workaround-found
   - 建议: [对用户的建议]
   ```

2. 使用模拟数据或占位符继续其他任务

### 如果时间不够

1. 优先完成核心内容：
   - **Phase 0 + Phase 1 必须完成**（项目结构 + 3个P0 Skills）
   - Phase 2 时间允许完成（plan-manager + analytics）
   - Phase 3 尽量完成（3个P2 Skills）

2. 在 task-plan.md 中标记：
   - ✅ 已完成
   - 🚧 进行中
   - ⏸️ 暂未实现 (说明原因和建议)

---

## ✅ 质量要求

1. **Skill 可触发**：每个 Skill 有清晰、不冲突的触发条件
2. **输出规范**：输出格式符合 PRD 要求，便于后续处理
3. **指令完整**：Instructions 足够详细，LLM 能正确执行
4. **示例丰富**：提供足够的使用示例
5. **数据合理**：模拟数据真实可信，覆盖典型场景

---

## 🎯 验收标准

### MVP 必须完成 (最低要求)

- ✅ 项目目录结构完整
- ✅ `skills/content-producer/SKILL.md` - 能生成多平台文案
- ✅ `skills/media-hub/SKILL.md` - 能搜索素材和标引
- ✅ `skills/content-reviewer/SKILL.md` - 能审核内容并分级
- ✅ 模拟数据已准备（素材、传播数据、事故数据）
- ✅ 模板文件已创建（3个内容模板 + 审核清单）
- ✅ task-plan.md 完整记录

### 理想情况 (时间允许)

- ✅ 所有 8 个 Skills 完成
- ✅ 端到端链路验证通过
- ✅ test-results.md 记录验证结果
- ✅ README.md 包含完整使用说明

---

## 🌙 开始工作

1. 仔细阅读 `PRD-交通安全宣传教育智能化平台.md`
2. 创建 `task-plan.md` 并规划任务
3. 开始 Phase 0：创建目录结构和模拟数据
4. 按顺序开发 P0 → P1 → P2 Skills
5. 每个 Skill 完成后进行简单验证
6. 记录所有重要决策到 task-plan.md
7. 明天早上我来验收

**记住：慢慢做，做对最重要。晚安！💤**
