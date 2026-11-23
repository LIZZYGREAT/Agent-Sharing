export const extensions = {
  skills: {
    title: "Skills",
    tag: "按需加入知识与工作流",
    phase: "获取上下文 / 执行操作",
    summary:
      "把可复用的方法写成技能。相关任务到来时按需加载，也可以由用户主动调用。",
    example:
      "抽签页要做无障碍检查：加载一份检查工作流，再检查按钮、焦点和状态播报。",
  },
  mcp: {
    title: "MCP",
    tag: "连接外部工具与服务",
    phase: "工具执行",
    summary:
      "通过 Model Context Protocol 接入外部工具或数据。可用工具增加了，核心请求与反馈循环仍然存在。",
    example: "从已授权的社团管理服务读取名单，将返回数据作为抽签页面的输入。",
  },
  subagents: {
    title: "Subagents",
    tag: "独立上下文中的子任务",
    phase: "独立循环 / 返回摘要",
    summary:
      "把有边界的任务交给拥有独立上下文的子 Agent。它运行自己的循环，再把结果带回主任务。",
    example: "让子 Agent 检查抽签逻辑，返回发现与建议；主 Agent 据此继续修改。",
  },
  hooks: {
    title: "Hooks",
    tag: "生命周期事件中的自动化",
    phase: "工具调用前后等事件",
    summary:
      "在指定生命周期事件触发预设自动化。适合团队约定与重复检查；具体行为由配置决定。",
    example: "文件修改后触发格式检查，把检查结果反馈给当前工作流程。",
  },
};
export const sources = [
  [
    "How Claude Code works",
    "https://code.claude.com/docs/en/how-claude-code-works",
    "核心循环、模型与工具",
  ],
  [
    "Extend Claude Code",
    "https://code.claude.com/docs/en/features-overview",
    "Skills、MCP、Subagents、Hooks",
  ],
  [
    "Configure permissions",
    "https://code.claude.com/docs/en/permissions",
    "权限规则与批准行为",
  ],
  [
    "How Claude remembers your project",
    "https://code.claude.com/docs/en/memory",
    "CLAUDE.md、AGENTS.md 与记忆",
  ],
  [
    "Missing Semester · Agentic Coding",
    "https://missing.csail.mit.edu/2026/agentic-coding/",
    "课堂延伸阅读",
  ],
];
