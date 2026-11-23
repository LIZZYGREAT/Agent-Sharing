import {extensions,sources} from '../content/chapters.js';
import {initialCode,brokenCode} from '../content/agent-trace.js';
import {escapeHTML as esc} from '../components/format.js';
export function mountChapters(root,loop) {
 root.innerHTML=`
 <section id="permissions" class="section-shell"><div class="section-heading"><p class="eyebrow">工具与权限</p><h2>能力来自工具。<br>边界来自权限。</h2><p>模型提出请求，控制层检查权限，再由工具访问目标。选择一个工具，看看它实际接收和返回什么。</p></div>
 <div class="tool-lab"><div class="tool-menu" role="group" aria-label="选择工具"><button data-tool="read" aria-pressed="true"><span class="tools">Read / Search</span><small>读取文件与搜索内容</small></button><button data-tool="edit" aria-pressed="false"><span class="files">Edit</span><small>修改项目文件</small></button><button data-tool="bash" aria-pressed="false"><span class="tools">Bash</span><small>在环境中运行命令</small></button><button data-tool="mcp" aria-pressed="false"><span class="model">MCP 工具</span><small>连接外部服务</small></button><label><input type="checkbox" id="tool-manual" checked> 手动批准演示</label></div><div class="tool-content"><div id="tool-example" aria-live="polite"></div><div id="tool-approval"></div><div id="tool-effect"></div></div></div>
 <p class="caption">这是权限边界的简化演示。真实确认取决于权限模式、规则与工具类型；读取或写入并非每次都会弹窗。网页中的批准仅改变模拟状态。</p></section>
 <section id="context" class="section-shell context-section"><div class="section-heading"><p class="eyebrow">上下文与项目记忆</p><h2>读到的信息，<br>成为下一步的依据。</h2><p>需求、项目说明、文件片段与工具反馈共同组成可用上下文。它不是项目的全部文件，也不是无限的记忆。</p></div>
 <div class="context-grid"><div><div class="panel-label">点击来源，模拟读入</div><div class="context-sources"><button data-source="rules">▧ AGENTS.md <small>稳定的项目约定</small></button><button data-source="file">▧ src/main.js <small>本次读取的代码片段</small></button><button data-source="build">▤ 构建输出 <small>验证失败或成功的证据</small></button></div><p class="caption">上方实验台的事件也会同步到右侧。回退事件会移除尚未发生的输入。</p><div class="memory-note"><h3>约定与会话，各有作用。</h3><p><code>CLAUDE.md / AGENTS.md</code> 保存可跨会话复用的项目说明；对话和工具结果服务当前任务。Claude Code 对 AGENTS.md 的加载行为随版本与配置变化，请查阅官方文档。</p></div></div><div class="context-window"><div class="panel-label">可见上下文 <span id="capacity-label"></span></div><div class="capacity" role="meter" aria-label="教学上下文容量" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><p class="caption">教学示意值，不代表实际 token 数量。</p><div id="context-items" aria-live="polite"></div><div class="context-buttons"><button id="compact">压缩上下文</button><button id="context-reset">重置读取</button></div><p id="compact-status" class="caption" role="status"></p></div></div></section>
 <section id="extensions" class="section-shell"><div class="section-heading"><p class="eyebrow">能力扩展与完整回顾</p><h2>同一个循环，<br>连接更多可能。</h2><p>扩展加入不同环节。选择一种能力，观察它如何参与刚才的抽签网页任务。</p></div><div class="extensions-layout"><div class="extension-map"><div class="extension-core"><span class="brand-icon">✳</span><strong>Agentic Loop</strong><small id="extension-phase"></small></div><div class="extension-options" role="group" aria-label="扩展能力">${Object.entries(extensions).map(([id,e])=>`<button data-extension="${id}" aria-pressed="false"><strong>${e.title}</strong><small>${e.tag}</small></button>`).join('')}</div></div><div id="extension-detail" aria-live="polite"></div></div>
 <div class="recap"><div><p class="eyebrow">把整个过程连起来</p><h3>用户定义目标。模型提出下一步。<br>工具执行，结果再回到循环。</h3><p>失败反馈帮助修正，验证证据支撑交付。你可以随时介入，补充目标或决定是否允许执行。</p></div><button id="show-overview">查看任务全景</button></div><div id="overview" hidden><div class="overview-track"><span>用户需求</span><i>→</i><span>读取项目</span><i>→</i><span>请求 / 批准</span><i>→</i><span>编辑文件</span><i>→</i><span>构建失败</span><i>→</i><span>修复 / 再验证</span><i>→</i><span>结果汇报</span></div><button id="return-lab">在实验台重播</button></div></section>
 <section class="create-section section-shell"><p class="eyebrow">YOUR TURN</p><h2>现在，轮到你的想法。</h2><p>从一个干净的起点出发，用自然语言创造自己的网页。</p><a class="primary link-button" href="https://github.com/LIZZYGREAT/Agent-Sharing/tree/demo">开始创建我的网站</a><a class="guide-link" href="https://github.com/LIZZYGREAT/Agent-Sharing/blob/demo/docs/安装配置手册.md">课堂安装配置指南</a></section>
 <section class="section-shell sources-section"><details><summary>资料依据与教学说明</summary><p>所有事件均为预设教学模拟；文件、构建结果与容量条为前端展示状态，不是实际执行记录或模型内部推理。内容核对日期：2026-11-23。</p><ul>${sources.map(([title,url,desc])=>`<li><a href="${url}" target="_blank" rel="noreferrer">${title}</a><span> · ${desc}</span></li>`).join('')}</ul><p>本演示无需 API Key。真实 CLI Agent 的模型服务配置由各自的个人环境管理。</p></details></section>`;
 mountTools(root);mountContext(root,loop);mountExtensions(root,loop);
}
function mountTools(root) {
 let selected='read',status='idle';
 const data={
  read:{tool:'Read',target:'src/main.js',input:'{"file_path":"src/main.js"}',result:initialCode},
  edit:{tool:'Edit',target:'src/main.js',input:'{"file_path":"src/main.js","change":"加入名单、抽签按钮与点击事件"}',result:'待应用修改；权限检查在实际执行前进行。'},
  bash:{tool:'Bash',target:'本地项目目录',input:'{"command":"npm run build"}',result:'✓ modules transformed\n✓ built successfully\nexit code: 0（教学示例）'},
  mcp:{tool:'MCP · list_clubs（示例工具）',target:'已授权的社团服务',input:'{"semester":"2026-autumn"}',result:'{"clubs":["摄影社","音乐社","天文社","机器人社"]}（预设返回）'}
 };
 function render(){
  const d=data[selected];const manual=root.querySelector('#tool-manual').checked;
  root.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===selected));
  root.querySelector('#tool-example').innerHTML=`<span class="tool-tag">${esc(d.tool)}</span><h3>${esc(d.target)}</h3><div class="tool-io"><div><p class="eyebrow">INPUT</p><pre>${esc(d.input)}</pre></div><div><p class="eyebrow">${selected==='edit'?'REQUEST':'OUTPUT'}</p><pre>${esc(d.result)}</pre></div></div>`;
  const gate=root.querySelector('#tool-approval');
  gate.innerHTML=selected==='edit'&&manual&&status!=='approved'?`<div class="permission-gate"><strong>${status==='denied'?'已拒绝 · 未执行 · 文件未修改':'请求批准：Edit src/main.js'}</strong><p>确认本次修改范围后再执行。</p><button id="tool-approve" class="primary">批准</button> <button id="tool-deny" ${status==='denied'?'disabled':''}>拒绝</button></div>`:'';
  gate.querySelector('#tool-approve')?.addEventListener('click',()=>{status='approved';render();});gate.querySelector('#tool-deny')?.addEventListener('click',()=>{status='denied';render();});
  root.querySelector('#tool-effect').innerHTML=selected==='edit'?status==='approved'||!manual?'<p class="success-text" role="status">✓ 编辑已执行 · 文件已修改</p><pre class="added">+ const names = [\'摄影社\', \'音乐社\', \'天文社\', \'机器人社\'];\n+ &lt;button id="draw"&gt;抽取一个社团&lt;/button&gt;\n+ 点击后随机选取名单中的一项</pre>':'<p class="muted">项目内容保持在执行前的状态。</p>':'<p class="caption">工具返回的信息可被用于下一轮模型调用。</p>';
 }
 root.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{selected=b.dataset.tool;status='idle';render();});
 root.querySelector('#tool-manual').onchange=()=>{status='idle';render();};render();
}
function mountContext(root,loop){
 const reads=new Set();let compact=false;
 const manualSources={rules:'AGENTS.md：Vite + 原生 JS；npm run build 检查',file:'src/main.js：现有页面结构、样式引用和抽签功能',build:'Bash：工具返回构建输出，后续据此验证或修复'};
 function render(){
  const entries=[...loop.state.context.map(c=>c.text),...Array.from(reads,id=>manualSources[id])];
  const unique=[...new Set(entries)];const capacity=Math.min(96,compact?18+unique.length*3:15+unique.length*9);
  root.querySelector('#capacity-label').textContent=`${capacity}% · 示意`;
  root.querySelector('.capacity').setAttribute('aria-valuenow',capacity);root.querySelector('.capacity span').style.width=`${capacity}%`;
  root.querySelector('#context-items').innerHTML=compact?`<article class="context-item"><span>摘要 · ${unique.length} 项来源</span><p>${esc(unique.join('；'))}</p></article>`:unique.map((t,i)=>`<article class="context-item"><span>输入 ${String(i+1).padStart(2,'0')}</span><p>${esc(t)}</p></article>`).join('');
  root.querySelector('#compact-status').textContent=compact?'压缩以摘要保留目标、约定和关键结果；细节可能丢失，必要时需要重新读取。':'输入更多内容会占用上下文空间。';
  root.querySelector('#compact').textContent=compact?'展开原始输入':'压缩上下文';
  root.querySelectorAll('[data-source]').forEach(b=>{b.setAttribute('aria-pressed',reads.has(b.dataset.source));});
 }
 root.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>{reads.add(b.dataset.source);compact=false;render();});
 root.querySelector('#compact').onclick=()=>{compact=!compact;render();};root.querySelector('#context-reset').onclick=()=>{reads.clear();compact=false;render();};
 document.querySelector('#lab').addEventListener('tracechange',render);render();
}
function mountExtensions(root,loop){
 function select(id){const e=extensions[id];root.querySelectorAll('[data-extension]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.extension===id));
  root.querySelector('#extension-phase').textContent=e.phase;
  root.querySelector('#extension-detail').innerHTML=`<p class="eyebrow">${esc(e.tag)}</p><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p><div class="extension-example"><span>放进刚才的任务</span><p>${esc(e.example)}</p></div>`;
 }
 root.querySelectorAll('[data-extension]').forEach(b=>b.onclick=()=>select(b.dataset.extension));select('skills');
 root.querySelector('#show-overview').onclick=e=>{const panel=root.querySelector('#overview');panel.hidden=!panel.hidden;e.target.textContent=panel.hidden?'查看任务全景':'收起任务全景';e.target.setAttribute('aria-expanded',!panel.hidden);};
 root.querySelector('#return-lab').onclick=()=>{loop.replay();document.querySelector('#lab').scrollIntoView({block:'start'});};
}
