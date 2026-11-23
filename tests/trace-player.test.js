import test from "node:test";
import assert from "node:assert/strict";
import { stateAt } from "../src/core/state-reducer.js";
import { TracePlayer } from "../src/core/trace-player.js";
import { trace, initialCode, fixedCode } from "../src/content/agent-trace.js";

test("all snapshots are deterministic, and reversing removes future effects", () => {
  for (let i = trace.length - 1; i >= 0; i--)
    assert.deepEqual(stateAt(i), stateAt(i));
  assert.equal(stateAt(7).previewStage, "edited");
  assert.equal(stateAt(9).build, "failed");
  assert.equal(stateAt(10).code, fixedCode);
  assert.equal(stateAt(11).build, "passed");
  const p = new TracePlayer(() => {});
  p.seek(12);
  p.seek(0);
  assert.equal(p.state.code, initialCode);
  assert.equal(p.state.logs.length, 0);
  assert.equal(p.state.build, "idle");
});
test("approval gates prevent both manual next and autoplay; denial never mutates files", () => {
  const p = new TracePlayer(() => {});
  p.seek(5);
  assert.equal(p.next(), false);
  p.play();
  assert.equal(p.playing, false);
  p.reject();
  assert.equal(p.state.approval, "denied");
  assert.equal(p.next(), false);
  assert.equal(p.state.code, initialCode);
  p.approve();
  assert.equal(p.index, 6);
  p.next();
  assert.equal(p.state.previewStage, "edited");
  p.previous();
  p.previous();
  assert.equal(p.state.approval, "waiting");
});
test("timeline jumping restores approved history, replay clears decision, automatic mode skips wait", () => {
  const p = new TracePlayer(() => {});
  p.seek(100);
  assert.equal(p.index, 12);
  assert.equal(p.state.approval, "approved");
  p.replay();
  assert.equal(p.state.approval, "none");
  p.setManual(false);
  p.seek(5);
  assert.equal(p.next(), true);
  p.seek(-20);
  assert.equal(p.index, 0);
});
test("one timer, speed updates, pause, completion, cleanup", () => {
  let fn;
  let count = 0;
  let delay;
  const scheduler = {
    setTimeout: (f, d) => {
      fn = f;
      delay = d;
      count++;
      return count;
    },
    clearTimeout: () => {
      fn = null;
    },
  };
  const p = new TracePlayer(() => {}, { manual: false, scheduler });
  p.play();
  assert.equal(delay, 1700);
  p.setSpeed(1.5);
  assert.equal(delay, 1700 / 1.5);
  fn();
  assert.equal(p.index, 1);
  p.pause();
  assert.equal(fn, null);
  p.seek(11);
  p.play();
  fn();
  assert.equal(p.index, 12);
  assert.equal(p.playing, false);
  p.destroy();
  assert.equal(fn, null);
});
