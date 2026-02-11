# Skill 调用方案对比：API 直连 vs OpenClaw Gateway

## 背景

本项目（交通安全宣传教育智能化平台）有 8 个 AI Skill，每个 Skill 由一份 `SKILL.md` 定义其角色、能力和约束规则。Web 前端通过 API 路由调用 Skill，后端有两种真实调用方式可选，通过环境变量 `SKILL_MODE` 切换。

---

## 方案 A：API 直连（`SKILL_MODE=llm`）

Web 后端直接调用 LLM API（如 Anthropic Claude），自己管理 prompt 拼装。

### 调用链路

```
用户操作 (浏览器)
  │
  ▼
Next.js API Route (如 /api/skills/content-producer)
  │
  ▼
skill-router.ts → invokeSkill("content-producer", params)
  │
  ├─ 1. buildUserMessage()：将结构化参数转为自然语言 prompt
  │     例：{ topic: "酒驾", platform: "wechat" }
  │     →  "请为我生成一篇交通安全宣传内容。主题：酒驾，目标平台：微信公众号..."
  │
  ▼
llm.ts → callLLM(skillName, userMessage, params)
  │
  ├─ 2. readSkillPrompt()：读取 .agents/skills/{name}/SKILL.md → 作为 system prompt
  ├─ 3. buildContext()：读取相关 templates/ 和 data/ 文件 → 追加到 system prompt
  │     例：content-producer 会读 templates/content-wechat.md
  │         plan-manager 会读 data/analytics/*.json + data/accident-data/*.json
  ├─ 4. 拼装 system = SKILL.md + 模板/数据上下文
  │
  ▼
Anthropic SDK → messages.create({ model, system, messages: [{ role: "user", content }] })
  │
  ▼
Claude API（或中转服务如 api.neurax.xin）
  │
  ▼
返回 AI 生成的文本 → 回传给前端渲染
```

### 关键代码

```
web/src/lib/llm.ts          ← Anthropic SDK 封装，读 SKILL.md + 拼 context
web/src/lib/skill-router.ts ← buildUserMessage() 参数→自然语言转换
.agents/skills/*/SKILL.md   ← 每个 Skill 的定义文件（system prompt）
templates/                   ← 平台模板、审核清单、计划模板
data/                        ← 分析数据、事故数据 JSON
```

### 环境变量

```env
SKILL_MODE=llm
ANTHROPIC_API_KEY=sk-xxx
ANTHROPIC_BASE_URL=https://api.anthropic.com   # 或中转地址
ANTHROPIC_MODEL=claude-sonnet-4-20250514       # 可选，指定模型
```

---

## 方案 B：OpenClaw Gateway（`SKILL_MODE=openclaw`）

Web 后端将用户消息发给本地运行的 OpenClaw 实例，由 OpenClaw 自动匹配 Skill 并调用 LLM。

### 调用链路

```
用户操作 (浏览器)
  │
  ▼
Next.js API Route (如 /api/skills/content-producer)
  │
  ▼
skill-router.ts → invokeSkill("content-producer", params)
  │
  ├─ 1. buildUserMessage()：将结构化参数转为自然语言 prompt（同方案 A）
  │     + 嵌入必要数据（analytics/accident JSON）到消息体内
  │
  ▼
openclaw.ts → callOpenClaw(userMessage)
  │
  ├─ 2. HTTP POST http://127.0.0.1:18789/v1/chat/completions
  │     Headers: { Authorization: Bearer <token> }
  │     Body: { messages: [{ role: "user", content: userMessage }] }
  │
  ▼
OpenClaw Gateway (本地服务)
  │
  ├─ 3. Gateway 根据消息内容自动匹配 Skill
  │     （OpenClaw 读取 .agents/skills/*/SKILL.md 的触发条件）
  ├─ 4. 用匹配的 SKILL.md 作为 system prompt
  ├─ 5. 调用配置好的 LLM（由 OpenClaw 管理 API Key 和模型选择）
  │
  ▼
LLM API（OpenClaw 配置的模型，如 Claude/GPT/DeepSeek）
  │
  ▼
返回 OpenAI 兼容格式 → choices[0].message.content → 回传给前端渲染
```

### 关键代码

```
web/src/lib/openclaw.ts     ← HTTP 客户端，POST 到 Gateway
web/src/lib/skill-router.ts ← buildUserMessage() 参数→自然语言转换 + 数据嵌入
~/.openclaw/openclaw.json   ← OpenClaw 配置（Gateway 端口、认证、启用端点）
.agents/skills/*/SKILL.md   ← Skill 定义（由 OpenClaw 管理和读取）
```

### 环境变量

```env
SKILL_MODE=openclaw
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_AUTH_TOKEN=<token from openclaw config>
```

---

## 核心区别对比

| 维度 | 方案 A：API 直连 | 方案 B：OpenClaw Gateway |
|------|-----------------|------------------------|
| **谁读 SKILL.md** | Web 后端自己读文件，拼成 system prompt | OpenClaw 读取和管理 |
| **谁管理 API Key** | Web 项目的 `.env.local` | OpenClaw 的全局配置 |
| **谁选择模型** | Web 项目环境变量 `ANTHROPIC_MODEL` | OpenClaw 配置决定 |
| **Skill 路由** | 代码硬编码 skillName → 读对应 SKILL.md | OpenClaw 根据消息内容自动匹配 |
| **数据/模板注入** | 后端读文件拼到 system prompt 里 | 需嵌入到 user message 中（Gateway 无文件访问） |
| **协议格式** | Anthropic Messages API | OpenAI Chat Completions 兼容格式 |
| **网络依赖** | 直接访问外部 LLM API | 本地 Gateway → 再由 Gateway 访问 LLM API |
| **部署要求** | 只需 Web 服务 + API Key | 需额外运行 OpenClaw 服务 |

---

## 各自优缺点

### 方案 A：API 直连

**优点：**
- **部署简单**：只需 Web 项目 + 一个 API Key，无需额外服务
- **Prompt 控制精细**：可以把 SKILL.md、模板文件、数据文件完整拼入 system prompt，上下文最充分
- **调试直观**：直接看 system + user message，排查方便
- **模型可控**：直接指定用哪个模型、哪个 API 供应商

**缺点：**
- **耦合度高**：Skill 的读取、拼装逻辑全写在 Web 代码里，新增 Skill 需改代码
- **API Key 分散**：每个部署环境需单独配置 Key
- **无 Agent 能力**：只是单次 LLM 调用，无法利用 OpenClaw 的多轮对话、工具调用等 Agent 特性
- **无 Skill 生态**：不能复用 OpenClaw 社区的其他 Skill

### 方案 B：OpenClaw Gateway

**优点：**
- **Skill 解耦**：新增/修改 Skill 只需编辑 SKILL.md，无需改 Web 代码
- **统一管理**：API Key、模型选择、Skill 配置全部由 OpenClaw 集中管理
- **Agent 能力**：OpenClaw 支持多轮对话、工具调用、Skill 编排等高级特性
- **Skill 生态**：可直接安装社区 Skill，扩展能力
- **模型无关**：OpenClaw 可配置任意 LLM 后端（Claude/GPT/DeepSeek/本地模型）

**缺点：**
- **部署复杂**：需额外安装和运行 OpenClaw 服务
- **数据注入受限**：Gateway 通过聊天接口通信，无法直接读 Web 项目的数据文件，需把数据嵌入消息体（消息变长）
- **调试链路长**：Web → Gateway → LLM，多一跳，排查问题需看两端日志
- **本地依赖**：Gateway 需要持续运行，增加运维成本

---

## 适用场景建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **快速验证/Demo** | 方案 A | 配个 API Key 就能跑，零依赖 |
| **个人开发/小团队** | 方案 A | 部署简单，不需要维护额外服务 |
| **正式部署/生产环境** | 方案 B | Skill 解耦、统一管理、易扩展 |
| **需要多模型切换** | 方案 B | OpenClaw 统一管理模型配置 |
| **需要 Agent 高级能力** | 方案 B | 多轮对话、工具调用、Skill 编排 |
| **需要复用社区 Skill** | 方案 B | 直接 install，无需写代码 |
| **云端部署（无本地服务）** | 方案 A | 不依赖本地 Gateway |

---

## 共同部分

无论哪种方案，以下部分是共享的：

1. **前端页面**：完全相同，不感知后端用了哪种方案
2. **API 路由**：统一调用 `invokeSkill(skillName, params)`
3. **skill-router.ts**：统一入口，`buildUserMessage()` 将参数转为自然语言
4. **SKILL.md 文件**：两种方案都依赖相同的 Skill 定义文件
5. **切换方式**：只需改 `.env.local` 中的 `SKILL_MODE` 值，重启服务即可
