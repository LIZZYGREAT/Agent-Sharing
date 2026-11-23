export const task = '请把当前网页改造成一个社团抽签活动页面，加入一个抽取结果的按钮，并检查能否正常构建。';
export const initialCode = "import './style.css';\n\ndocument.querySelector('#app').innerHTML = '<h1>我的网页</h1>';";
export const brokenCode = "import './theme.css';\n\nconst names = ['摄影社', '音乐社', '天文社', '机器人社'];\ndocument.querySelector('#app').innerHTML = `\n  <h1>今晚，幸运属于谁？</h1>\n  <button id=\"draw\">抽取一个社团</button>\n  <p id=\"result\" aria-live=\"polite\">等待抽签</p>`;\ndocument.querySelector('#draw').onclick = () => {\n  const name = names[Math.floor(Math.random() * names.length)];\n  document.querySelector('#result').textContent = name;\n};";
export const fixedCode = brokenCode.replace('./theme.css', './style.css');
const event = (id, title, phase, node, tool, target, input, result, effects = {}) => ({
 id:`step-${String(id).padStart(2,'0')}`, title, phase, actor:tool?'tool':'agent', tool, target, input, result,
 effects:{activeNode:node,activeFile:target?.includes('.')?target:null,...effects}
});
// These are deterministic teaching events, not a Claude Code wire protocol or hidden reasoning.
export const trace = [
 event(1,'一句需求，任务开始','上下文','user',null,null,task,'用户定义目标与验收条件。',{context:task}),
 event(2,'先认识这个项目','上下文','harness','Glob / Read','AGENTS.md','读取项目说明并列出 src/*','Vite + 原生 JS；使用 npm；完成后检查构建。',{context:'AGENTS.md：项目约定、文件职责、运行命令'}),
 event(3,'模型请求读取文件','上下文','model','Read','src/main.js','{"file_path":"src/main.js"}','请求交给 Agent 控制层，尚未返回内容。'),
 event(4,'工具把文件内容带回来','上下文','tools','Read','src/main.js','读取 src/main.js',initialCode,{context:'src/main.js：欢迎页入口与现有样式引用'}),
 event(5,'提出一份具体修改','操作','model','Edit','src/main.js','添加社团名单、抽取按钮和点击事件','待应用的修改请求；此时文件尚未变化。',{diff:'proposed'}),
 event(6,'执行之前，检查权限','操作','harness','Edit','src/main.js','检查 Edit(src/main.js) 的权限','手动批准演示：等待用户决定。',{approval:'ask'}),
 event(7,'用户允许本次修改','操作','user','Edit','src/main.js','用户批准本次 Edit 请求','许可通过，交由编辑工具执行。'),
 event(8,'修改落到了文件里','操作','files','Edit','src/main.js','应用抽签功能代码',brokenCode,{code:brokenCode,previewStage:'edited',diff:'applied',context:'Edit 结果：src/main.js 已修改'}),
 event(9,'运行构建来验证','验证','tools','Bash','terminal','npm run build','启动 Vite 生产构建。',{build:'running'}),
 event(10,'错误也是下一轮的上下文','验证','tools','Bash','terminal','npm run build','✕ Build failed\nCould not resolve "./theme.css" from "src/main.js"\nexit code: 1',{build:'failed',context:'构建失败：theme.css 不存在；实际文件是 style.css'}),
 event(11,'根据反馈修正路径','操作','files','Edit','src/main.js','把 ./theme.css 修改为 ./style.css','引用已修复；等待重新验证。',{code:fixedCode,previewStage:'fixed',build:'pending',diff:'fix',context:'Edit 结果：样式引用修复为 ./style.css'}),
 event(12,'再次验证，构建成功','验证','tools','Bash','terminal','npm run build','✓ modules transformed\n✓ built successfully\nexit code: 0',{build:'passed',context:'Bash 结果：生产构建成功，exit code 0'}),
 event(13,'带着验证结果交付','完成','harness',null,null,'向用户汇报完成情况','已添加社团抽签功能，修复样式路径，并通过 npm run build。建议在浏览器点击抽签按钮检查效果。',{previewStage:'complete'})
];
