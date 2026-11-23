import { TracePlayer } from "../core/trace-player.js";
import { task } from "../content/agent-trace.js";
import { previewMarkup, bindDraw } from "../components/mini-preview.js";
export function mountHero(root) {
  root.innerHTML = `<div class="hero-window"><div class="window-title"><span>● ● ●</span><span>CLAUDE CODE / TASK SESSION</span><span>教学模拟</span></div><div class="hero-task"><span class="prompt-mark">❯</span><span id="typed-task"></span></div><div class="hero-route"><span>用户</span><i></i><span>Agent</span><i></i><span>工具</span><i></i><span>项目</span></div><div class="hero-result"><div><p class="eyebrow">LIVE ACTIVITY</p><h3 id="hero-action"></h3><p id="hero-status"></p><div class="hero-progress"><span></span></div></div><div id="hero-preview"></div></div><div class="hero-controls"><button id="hero-play">暂停开场</button><button id="hero-reset">重播开场</button><span>约 22 秒 · 可随时暂停</span></div></div>`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let lastStage;
  let typed = 0;
  const player = new TracePlayer(
    (state) => {
      if (state.index > 0) typed = task.length;
      root.querySelector("#typed-task").textContent = task.slice(0, typed);
      root.classList.toggle("paused", !state.playing);
      root.querySelector("#hero-action").textContent = state.event.title;
      root.querySelector("#hero-status").textContent =
        state.build === "passed"
          ? "✓ Build passed"
          : `${state.event.phase} / ${state.index + 1} of 13`;
      root.querySelector(".hero-progress span").style.width =
        `${((state.index + 1) / 13) * 100}%`;
      root.querySelector("#hero-play").textContent = state.playing
        ? "暂停开场"
        : "播放开场";
      root
        .querySelectorAll(".hero-route span")
        .forEach((n, i) =>
          n.classList.toggle(
            "active",
            i ===
              { user: 0, harness: 1, model: 1, tools: 2, files: 3 }[
                state.activeNode
              ],
          ),
        );
      if (lastStage !== state.previewStage) {
        root.querySelector("#hero-preview").innerHTML = previewMarkup(
          state.previewStage,
        );
        bindDraw(root);
        lastStage = state.previewStage;
      }
    },
    { manual: false },
  );
  root.querySelector("#hero-play").onclick = () => player.toggle();
  root.querySelector("#hero-reset").onclick = () => {
    typed = 0;
    player.replay();
    player.play();
  };
  const typing = setInterval(() => {
    if (player.playing && typed < task.length) {
      typed++;
      root.querySelector("#typed-task").textContent = task.slice(0, typed);
    }
  }, 35);
  player.emit();
  if (!reduced.matches) player.play();
  else {
    typed = task.length;
    player.emit();
  }
  reduced.addEventListener("change", (e) => {
    if (e.matches) player.pause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) player.pause();
  });
  const destroy = player.destroy.bind(player);
  player.destroy = () => {
    clearInterval(typing);
    destroy();
  };
  return player;
}
