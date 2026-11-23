# 把一个想法，变成一个网页

这是《AI 写好了代码，然后呢？》课堂的 **demo 起点**。主题由你决定：个人主页、社团活动、旅行摄影、音乐电影、科普、小游戏、实用工具都可以。

## 启动

先按 [安装配置手册](docs/安装配置手册.md) 准备 WSL、VS Code、Node.js 与 CLI Agent。需要 Node.js 22.12+，推荐 Node.js 24 LTS。

```bash
git clone -b demo git@github.com:LIZZYGREAT/Agent-Sharing.git
cd Agent-Sharing
git switch -c my-first-site
npm ci
npm run dev
```

打开终端打印的地址（通常 http://localhost:5173）。停止服务按 Ctrl+C。WSL 中在项目目录运行 `code .`；若端口占用，Vite 会打印新的端口。

## 开始创作

在项目目录运行 `claude` 或 `codex`，输入：

> 请先阅读当前项目文件，说明首页入口和运行命令。然后帮我把页面改造成【我选择的主题】，整体风格是【我喜欢的设计方向】。请先完成一个能够运行的版本，保留清晰的页面结构，完成后运行 npm run build 检查，并告诉我如何在浏览器预览。

浏览器验证后，再描述一个具体修改，例如“把首页设计得更像音乐杂志，并让卡片点击后出现详情”。

- `index.html`：网页入口与标题。
- `src/main.js`：页面内容和“给我一点灵感”按钮。
- `src/style.css`：颜色、布局、字体与手机适配，修改后自动刷新。
- `public/`：图片等公开资源。
- `.env.example`：公开配置示例；可复制为 `.env` 并重启 Vite。`VITE_` 变量会进入浏览器，不能放密钥。
- `AGENTS.md`：项目说明；`CLAUDE.md` 导入同一份说明，兼容不同版本 CLI。

## 检查与保存

```bash
npm run build
npm run preview
# 预览生产构建，按 Ctrl+C 停止
git status
git diff
git add .
git commit -m "Build my first AI-assisted website"
```

`node_modules/`、`dist/`、`.env`、`.venv/` 不会被提交。包安装异常时检查 Node 版本、网络与 npm registry，保留 lockfile 并重新 `npm ci`。

## 讲师成品

[complete 分支](https://github.com/LIZZYGREAT/Agent-Sharing/tree/complete) 提供 Inside the Agent 交互教学网站；两个分支使用相同启动命令。
