import './style.css';

const ideas = ['我的个人主页', '校园活动', '旅行与摄影', '音乐与电影', '科普知识', '一个小游戏', '一个实用工具'];
let ideaIndex = 0;
document.title = `${import.meta.env.VITE_SITE_NAME || 'My First Website'} · 创作起点`;
document.querySelector('#app').innerHTML = `
  <header><a href="#" aria-label="回到首页" class="brand">[ &nbsp; / &nbsp; ]</a><span>MY FIRST WEB PROJECT</span></header>
  <main>
    <p class="eyebrow">一切，从你的想法开始</p>
    <h1>把一个想法，<br>变成一个<span>网页。</span></h1>
    <p class="intro">打开终端，告诉 AI 你想创造什么。</p>
    <button id="inspire" type="button">给我一点灵感 <span aria-hidden="true">✦</span></button>
    <p id="idea" role="status">你的下一个作品，会是什么？</p>
    <div class="note"><span>01 / 描述想法</span><span>02 / 浏览器预览</span><span>03 / 继续创造</span></div>
  </main>
  <footer><span>Made with WSL · VS Code · npm · AI Agent</span><span>THE NEXT CHAPTER IS YOURS.</span></footer>`;
document.querySelector('#inspire').addEventListener('click', () => {
  document.querySelector('#idea').textContent = `试试看：${ideas[ideaIndex++ % ideas.length]}`;
});
