import './style.css';
import {mountHero} from './scenes/hero.js';
import {mountLoop} from './scenes/agent-loop.js';
import {mountChapters} from './scenes/chapters.js';
document.querySelector('#app').innerHTML=`
<a class="skip-link" href="#lab">跳到交互实验台</a>
<header class="site-header"><a class="brand" href="#"><span class="brand-icon">✳</span> Inside the Agent<span class="edition"> / 交互式讲义</span></a><nav aria-label="章节导航"><a href="#architecture">认识 Agent</a><a href="#loop">工作循环</a><a href="#permissions">工具与权限</a><a href="#context">上下文</a><a href="#extensions">能力扩展</a></nav><a class="nav-cta" href="https://github.com/LIZZYGREAT/Agent-Sharing/tree/demo">开始创作</a></header>
<main>
<section class="hero section-shell"><div class="hero-heading"><p class="eyebrow">以 CLAUDE CODE 为例 · AN INTERACTIVE FIELD GUIDE</p><h1>AI Agent 是怎样<br><em>完成任务</em>的？</h1><div class="hero-bottom"><p>从一句需求，到读取文件、修改代码、<br>执行工具和验证结果。让每一步，都看得见。</p><a class="primary link-button" href="#loop">进入交互实验</a></div></div><div id="hero-scene"></div><p class="simulation-note">本网站使用可重复的教学模拟数据，无需 API、账户或网络请求；展示可观察的工具行为，不展示模型内部思维。</p></section>
<section id="architecture" class="section-shell"><div class="section-heading"><p class="eyebrow">认识 AGENT</p><h2>回答一个问题，<br>和完成一件事。</h2><p>模型负责理解与提出下一步。Agent 控制层把请求连接到工具、权限和真实的项目环境。</p></div><div class="comparison"><div class="comparison-intro"><span class="eyebrow">同一句需求，两种工作方式</span><h3>“给网页加一个抽签按钮。”</h3><div class="segmented"><button id="chat-mode" aria-pressed="true">只生成回答</button><button id="agent-mode" aria-pressed="false">让 Agent 执行</button></div></div><div id="comparison-output" aria-live="polite"></div></div><div class="architecture-strip"><span><b class="user">U</b> 用户</span><i>目标 / 反馈</i><span><b class="harness">A</b> Claude Code<small>控制层 / Harness</small></span><i>请求 / 返回</i><span><b class="model">M</b> 模型服务<small>理解与提出工具请求</small></span><i>经由控制层</i><span><b class="tools">T</b> 工具<small>本地文件与运行环境</small></span></div><p class="caption">控制层管理上下文并处理工具权限；工具执行后的结果，会反馈到后续模型调用中。</p></section>
<section id="loop" class="section-shell loop-section"><div class="section-heading"><p class="eyebrow">核心实验</p><h2>任务不是一次回答。<br>而是一轮轮反馈。</h2><p>沿着 13 个事件，跟随一次网页改造。故意引入一个样式路径错误，再观察 Agent 如何根据构建反馈修复它。</p></div><div id="lab" tabindex="-1"></div></section>
<div id="extra-chapters"></div>
</main><footer class="section-shell site-footer"><a class="brand" href="#">✳ Inside the Agent</a><p>AI 写好了代码，然后呢？<br>从 Linux 入门到 AI Agent 开发实战</p><a href="https://github.com/LIZZYGREAT/Agent-Sharing">查看项目源码</a></footer>`;
mountHero(document.querySelector('#hero-scene'));
const loop=mountLoop(document.querySelector('#lab'));
mountChapters(document.querySelector('#extra-chapters'),loop);
const output=document.querySelector('#comparison-output');
function compare(agent){
 document.querySelector('#chat-mode').setAttribute('aria-pressed',!agent);document.querySelector('#agent-mode').setAttribute('aria-pressed',agent);
 output.innerHTML=agent?'<span class="tool-tag">执行记录</span><pre>Read src/main.js\nEdit src/main.js\nBash npm run build\n✓ Build passed</pre><p class="success-text">文件已修改 · 终端已验证</p>':'<span class="tool-tag">模型回答</span><p>你可以创建一个 button，再绑定点击事件，从名单中随机选择一个社团……</p><p class="muted">项目文件没有变化，终端没有执行命令。</p>';
}
document.querySelector('#chat-mode').onclick=()=>compare(false);document.querySelector('#agent-mode').onclick=()=>compare(true);compare(false);
if(import.meta.hot)import.meta.hot.dispose(()=>loop.destroy());
