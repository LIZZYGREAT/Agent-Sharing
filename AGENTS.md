# 项目说明

Vite + 原生 HTML / CSS / JavaScript，使用 npm。Node.js 22.12+（推荐 24 LTS）。

- `npm ci` 安装锁定依赖；`npm run dev` 启动；`npm run build` 检查生产构建。
- `index.html` 是入口；`src/main.js` 管理内容和互动；`src/style.css` 管理样式；`public/` 放静态资源。
- 根据用户需求自由设计页面，可替换主题、布局、视觉与互动。
- 保持文件职责清晰，兼顾手机、键盘和减少动态效果设置。
- 前端不保存真实 API Key，CLI Agent 的密钥由用户个人配置管理。

## complete 分支

- 主题为 Inside the Agent；数据位于 `src/content/`，可重建状态和计时控制位于 `src/core/`。
- 修改事件或播放器后执行 `npm test`，完成后执行 `npm run build`。
- `npm run test:browser` 是可选浏览器验收，需要预先准备 Playwright Chromium 和运行中的开发服务。
- 教学模拟必须明确标注；权限、项目记忆与扩展机制依据官方资料。不要呈现未公开的内部推理。
