export function previewMarkup(stage) {
 const ready=stage!=='initial';
 return `<div class="mini-site ${ready?'ready':''}"><div class="mini-nav"><span>✦ CAMPUS CLUB</span><span>2026 / 秋日相遇</span></div><div class="mini-body"><span class="mini-kicker">${ready?'社团幸运夜':'YOUR NEXT IDEA'}</span><h3>${ready?'今晚，幸运<br>属于谁？':'我的网页'}</h3><p>${ready?'一次随机的相遇，开启新的故事。':'从一个简单的页面开始。'}</p>${ready?'<button class="draw" type="button">抽取一个社团</button><p class="draw-result" role="status">等待你的幸运时刻</p>':'<div class="preview-placeholder">等待 Agent 添加功能</div>'}</div><div class="mini-footer">${ready?'摄影 · 音乐 · 天文 · 机器人':'HTML + CSS + JAVASCRIPT'}</div></div>`;
}
export function bindDraw(root) {
 root.querySelector('.draw')?.addEventListener('click',()=>{
  const names=['摄影社','音乐社','天文社','机器人社'];
  root.querySelector('.draw-result').textContent=`抽签结果：${names[Math.floor(Math.random()*names.length)]}`;
 });
}
