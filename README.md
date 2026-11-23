# Inside the Agent

**AI Agent 是怎样完成任务的？——以 Claude Code 为例。**

这是《AI 写好了代码，然后呢？》90 分钟讲座的 **complete 讲师成品**。课堂创作请使用 [demo 分支](https://github.com/LIZZYGREAT/Agent-Sharing/tree/demo)。

## 运行

Node.js 22.12+，推荐与 [安装配置手册](docs/安装配置手册.md) 一致使用 Node.js 24 LTS。

```bash
git clone -b complete https://github.com/LIZZYGREAT/Agent-Sharing.git
cd Agent-Sharing
npm ci
npm run dev
```

打开终端输出的地址，通常为 http://localhost:5173。按 Ctrl+C 停止。`npm run build` 生成 `dist/`；`npm run preview` 预览生产版本。端口占用时以终端打印地址为准。

网站使用 Vite + 原生 HTML / CSS / JavaScript。所有内容、字体回退、图形、模拟数据均可本地运行，不调用模型，不需要 API Key。完成首次安装后，断网仍可演示；离线备份见 [演示手册](docs/讲师演示手册.md)。

## 五个章节

1. **认识 Agent**：对比“只生成回答”和“真正执行”，区分模型、Agent 控制层与工具。
2. **核心实验台**：13 个确定性事件；读取文件、审批、修改、构建失败、路径修复、重新构建及交付。
3. **工具与权限**：Read / Search、Edit、Bash、MCP 示例，独立批准与拒绝实验。
4. **上下文与记忆**：与实验台同步的输入来源、点击读取与摘要压缩；容量条仅为教学示意。
5. **能力扩展**：Skills、MCP、Subagents、Hooks 加入工作流的位置，以及任务全景回顾。

开场约 22 秒，可暂停和重播。实验台支持播放、暂停、上一步、下一步、重播、任意事件跳转和 0.75× / 1× / 1.5× 速度。手动批准模式在步骤 6 停住；拒绝不会写入文件，可重新批准继续。直接跳到审批后的时间线会还原已批准的历史路径。

实验台在视窗内且焦点不在控件时，左右键单步、空格播放/暂停。**演示视图**隐藏辅助章节；再次点击退出。系统减少动态效果设置会关闭开场自动播放及过渡动画，所有信息与控制保留。

## 代码入口

```text
src/main.js                   页面结构、聊天对比与场景挂载
src/content/agent-trace.js     教学任务、13 步事件、示例代码
src/content/chapters.js        扩展说明与官方资料链接
src/core/state-reducer.js     从事件序列重建完整展示状态
src/core/trace-player.js      播放、跳转、计时、审批门控
src/scenes/                   开场、实验台与其余教学场景
src/components/               安全转义与迷你网页预览
src/styles/                   颜色、响应式布局、可控动效
```

增加事件时编辑 `agent-trace.js`，检查跳转和回退后的状态。展示状态 `effects` 为本项目的前端协议，不是 Claude Code 输出格式。不要把示例日志描述为真实执行或内部推理。

## 验证

```bash
npm test
npm run build
# 可选：首次准备浏览器（Linux 可能需要系统依赖）
npx playwright install --with-deps chromium
# 另一个终端保持 npm run dev 运行
npm run test:browser
# 生成可分享的浏览器录像与截图，输出 artifacts/
RECORD_DEMO=1 npm run test:browser
```

浏览器检查包含手机/桌面布局、全部事件快照、审批分支、构建修复、键盘与播放控制、上下文压缩、扩展章节、减少动态效果及控制台错误。浏览器依赖仅用于验收，学生 demo 不包含该依赖。

资料依据直接列在网站末尾。具体权限与项目说明加载行为以对应版本的 [Claude Code 官方文档](https://code.claude.com/docs/en/how-claude-code-works) 为准。

## 分支与课堂衔接

```bash
# 学生从课堂起点开始
git clone -b demo https://github.com/LIZZYGREAT/Agent-Sharing.git
cd Agent-Sharing
git switch -c my-first-site
npm ci
npm run dev
# 在项目目录运行 claude 或 codex，描述自己的主题
npm run build
git status
git diff
git add .
git commit -m "Build my first AI-assisted website"
```

`.env.example` 只展示公开配置；`VITE_` 值会进入浏览器，不要填真实密钥。`AGENTS.md` 说明项目职责，`CLAUDE.md` 导入它。完整讲解路线和验收情况见 [讲师演示手册](docs/讲师演示手册.md) 与 [验收记录](docs/验收记录.md)。
