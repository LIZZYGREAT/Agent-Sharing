import {trace} from '../content/agent-trace.js';
import {TracePlayer} from '../core/trace-player.js';
import {previewMarkup,bindDraw} from '../components/mini-preview.js';
import {escapeHTML as esc} from '../components/format.js';
export function mountLoop(root) {
 root.innerHTML=`<div class="lab-top"><div><span class="eyebrow">INTERACTIVE LAB / 教学模拟</span><h3>给社团网页添加抽签功能</h3></div><button id="presentation" aria-pressed="false">演示视图</button></div>
 <div class="lab-controls" aria-label="任务播放控制"><button id="play" class="primary">播放</button><button id="prev">上一步</button><button id="next">下一步</button><button id="reset">重播</button><label>速度 <select id="speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select></label><label class="manual"><input id="manual" type="checkbox" checked> 手动批准演示</label><span id="position"></span></div>
 <div class="lab-grid"><div class="action-panel"><div class="panel-label">当前行动 <span id="phase"></span></div><div id="event-copy" aria-live="polite"></div><div id="gate"></div><details open class="tool-details"><summary>工具请求与返回</summary><div id="tool-inspector"></div></details></div>
 <div class="flow-panel"><div class="panel-label">工作循环 <span>AGENTIC LOOP</span></div><div class="flow"><div class="flow-node" data-node="user"><span class="symbol user">U</span><div>用户<small>目标与反馈</small></div></div><div class="connector">↓</div><div class="flow-node" data-node="harness"><span class="symbol harness">A</span><div>Claude Code<small>上下文 · 权限 · 工具调度</small></div></div><div class="connector">↕ 请求 / 结果</div><div class="flow-node" data-node="model"><span class="symbol model">M</span><div>模型服务<small>理解任务，提出下一步</small></div></div><div class="connector">↓ 工具请求经由控制层</div><div class="flow-node" data-node="tools"><span class="symbol tools">T</span><div>工具执行<small>Read · Edit · Bash</small></div></div><div class="connector">↕ 访问与反馈</div><div class="flow-node" data-node="files"><span class="symbol files">F</span><div>项目与环境<small>文件 · 终端 · 构建结果</small></div></div></div><p class="flow-note">获取上下文 → 执行操作 → 验证结果<br>工具结果进入下一轮模型调用。</p></div>
 <div class="workspace-panel"><div class="panel-label">项目 / 浏览器 <span id="build-badge"></span></div><div id="file-tree" class="file-tree"></div><div class="browser-bar"><span>● ● ●</span><span>localhost:5173 · 模拟预览</span></div><div id="mini-preview"></div></div></div>
 <div class="timeline" aria-label="事件时间线">${trace.map((e,i)=>`<button data-step="${i}" title="${esc(e.title)}"><span>${String(i+1).padStart(2,'0')}</span>${esc(e.title)}</button>`).join('')}</div>
 <details class="evidence" open><summary>文件差异与终端证据</summary><div class="evidence-grid"><div><div class="panel-label">src/main.js <span id="diff-label"></span></div><pre id="diff"></pre></div><div><div class="panel-label">TERMINAL <span>工具返回值</span></div><pre id="terminal"></pre></div></div></details><p class="lab-help">键盘：← / → 单步，空格播放或暂停。点击时间线可还原对应历史状态；跳到审批之后会还原已批准的路径。</p>`;
 let lastStage;
 const player=new TracePlayer(state=>{
  root.querySelector('#position').textContent=`${String(state.index+1).padStart(2,'0')} / ${trace.length}`;
  root.querySelector('#play').textContent=state.playing?'暂停':'播放';
  root.querySelector('#play').disabled=['waiting','denied'].includes(state.approval);
  root.querySelector('#prev').disabled=state.index===0;
  root.querySelector('#next').disabled=state.index===12||['waiting','denied'].includes(state.approval);
  root.querySelector('#phase').textContent=state.event.phase;
  root.querySelector('#event-copy').innerHTML=`<p class="step-label">STEP ${String(state.index+1).padStart(2,'0')}</p><h3>${esc(state.event.title)}</h3><p>${esc(state.event.result)}</p>`;
  const gate=root.querySelector('#gate');
  gate.innerHTML=['waiting','denied'].includes(state.approval)?`<div class="permission-gate"><strong>${state.approval==='denied'?'已拒绝 · 未执行':'等待批准 · Edit src/main.js'}</strong><p>手动演示模式：批准后才会修改文件。</p><button id="approve" class="primary">批准本次修改</button> <button id="deny" ${state.approval==='denied'?'disabled':''}>拒绝</button></div>`:'';
  gate.querySelector('#approve')?.addEventListener('click',()=>player.approve());gate.querySelector('#deny')?.addEventListener('click',()=>player.reject());
  root.querySelector('#tool-inspector').innerHTML=state.event.tool?`<span class="tool-tag">${esc(state.event.tool)}</span><dl><dt>目标</dt><dd>${esc(state.event.target)}</dd><dt>输入</dt><dd><pre>${esc(state.event.input)}</pre></dd><dt>返回 / 当前状态</dt><dd><pre>${esc(state.event.result)}</pre></dd></dl>`:'<p>用户与 Agent 的文本交互，尚无工具调用。</p>';
  root.querySelectorAll('[data-node]').forEach(n=>{const active=n.dataset.node===state.activeNode;n.classList.toggle('active',active);n.setAttribute('aria-current',String(active));});
  root.querySelector('#file-tree').innerHTML=['AGENTS.md','index.html','src/main.js','src/style.css'].map(f=>`<span class="${state.activeFile===f?'active':''}">▧ ${f}${f==='src/main.js'&&state.previewStage!=='initial'?' <b>M</b>':''}</span>`).join('');
  const labels={idle:'尚未构建',running:'执行中',failed:'✕ 构建失败',pending:'已修复 · 待验证',passed:'✓ Build passed'};
  const badge=root.querySelector('#build-badge');badge.textContent=labels[state.build];badge.className=state.build;
  if(lastStage!==state.previewStage){const preview=root.querySelector('#mini-preview');preview.innerHTML=previewMarkup(state.previewStage);bindDraw(preview);lastStage=state.previewStage;}
  root.querySelectorAll('[data-step]').forEach((n,i)=>{n.classList.toggle('current',i===state.index);n.classList.toggle('visited',i<state.index);n.setAttribute('aria-current',i===state.index?'step':'false');});
  root.querySelector('#diff-label').textContent={proposed:'待批准 / 尚未应用',applied:'已应用',fix:'修复路径'}[state.diff]||'尚无修改';
  root.querySelector('#diff').innerHTML=state.diff==='fix'?'<span class="removed">− import \'./theme.css\';</span>\n<span class="added">+ import \'./style.css\';</span>':state.diff?'<span class="removed">− &lt;h1&gt;我的网页&lt;/h1&gt;</span>\n<span class="added">+ import \'./theme.css\';\n+ 社团名单 + 抽签按钮 + 随机选择事件</span>':esc(state.code);
  root.querySelector('#terminal').textContent=state.index>=11?'$ npm run build\n✓ modules transformed\n✓ built successfully\nexit code: 0':state.index>=9?'$ npm run build\n✕ Could not resolve "./theme.css"\n  from "src/main.js"\nexit code: 1':state.index>=8?'$ npm run build\n正在执行…':'$ 等待构建命令';
  root.dispatchEvent(new CustomEvent('tracechange',{detail:state}));
 });
 root.querySelector('#play').onclick=()=>player.toggle();root.querySelector('#prev').onclick=()=>player.previous();root.querySelector('#next').onclick=()=>player.next();root.querySelector('#reset').onclick=()=>player.replay();
 root.querySelector('#speed').onchange=e=>player.setSpeed(e.target.value);root.querySelector('#manual').onchange=e=>player.setManual(e.target.checked);
 root.querySelectorAll('[data-step]').forEach(n=>n.onclick=()=>player.seek(Number(n.dataset.step)));
 root.querySelector('#presentation').onclick=e=>{const value=document.body.classList.toggle('presentation');e.target.setAttribute('aria-pressed',value);e.target.textContent=value?'退出演示视图':'演示视图';if(value)root.scrollIntoView({block:'start'});};
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,select,textarea,button,a,summary,[contenteditable]'))return;
  const rect=root.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;
  if(['ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')player.previous();else if(e.key==='ArrowRight')player.next();else player.toggle();}
 });
 player.emit();return player;
}
