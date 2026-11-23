import { trace, initialCode } from "../content/agent-trace.js";
export function stateAt(index, { decision = null, manual = true } = {}) {
  const end = Math.max(0, Math.min(trace.length - 1, index));
  const state = {
    index: end,
    code: initialCode,
    previewStage: "initial",
    build: "idle",
    diff: null,
    context: [],
    logs: [],
    activeNode: "user",
    activeFile: null,
    approval: "none",
  };
  for (const event of trace.slice(0, end + 1)) {
    const { context, approval, ...effects } = event.effects;
    Object.assign(state, effects);
    if (context) state.context.push({ id: event.id, text: context });
    if (event.tool)
      state.logs.push({
        id: event.id,
        tool: event.tool,
        target: event.target,
        input: event.input,
        result: event.result,
      });
    if (approval) state.approval = manual ? "waiting" : "approved";
  }
  state.event = trace[end];
  if (end > 5) state.approval = "approved"; // Seeking past a gate restores the approved historical path.
  if (end === 5 && manual && decision)
    state.approval = decision === "deny" ? "denied" : "approved";
  if (state.approval === "denied")
    state.event = {
      ...state.event,
      title: "用户拒绝：文件未修改",
      result: "此次 Edit 未执行。可重新批准，或回到前一步调整请求。",
    };
  return state;
}
