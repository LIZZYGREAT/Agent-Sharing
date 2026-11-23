import { trace } from "../content/agent-trace.js";
import { stateAt } from "./state-reducer.js";
export class TracePlayer {
  constructor(
    onChange,
    { manual = true, interval = 1700, scheduler = globalThis } = {},
  ) {
    this.onChange = onChange;
    this.manual = manual;
    this.interval = interval;
    this.scheduler = scheduler;
    this.index = 0;
    this.speed = 1;
    this.playing = false;
    this.decision = null;
    this.timer = null;
  }
  get state() {
    return {
      ...stateAt(this.index, this),
      playing: this.playing,
      speed: this.speed,
      manual: this.manual,
    };
  }
  emit() {
    this.onChange(this.state);
  }
  pause() {
    this.playing = false;
    this.scheduler.clearTimeout(this.timer);
    this.timer = null;
    this.emit();
  }
  seek(index) {
    this.pause();
    this.index = Math.max(0, Math.min(trace.length - 1, Math.trunc(index)));
    this.decision = null;
    this.emit();
  }
  next() {
    if (["waiting", "denied"].includes(this.state.approval)) {
      this.pause();
      return false;
    }
    if (this.index === trace.length - 1) {
      this.pause();
      return false;
    }
    this.index++;
    this.emit();
    if (this.state.approval === "waiting" || this.index === trace.length - 1)
      this.pause();
    return true;
  }
  previous() {
    this.seek(this.index - 1);
  }
  replay() {
    this.seek(0);
  }
  play() {
    if (["waiting", "denied"].includes(this.state.approval)) return;
    if (this.index === trace.length - 1) this.seek(0);
    this.playing = true;
    this.emit();
    this.schedule();
  }
  schedule() {
    this.scheduler.clearTimeout(this.timer);
    if (this.playing)
      this.timer = this.scheduler.setTimeout(() => {
        if (this.next() && this.playing) this.schedule();
      }, this.interval / this.speed);
  }
  toggle() {
    this.playing ? this.pause() : this.play();
  }
  setSpeed(speed) {
    if (![0.75, 1, 1.5].includes(Number(speed))) return;
    this.speed = Number(speed);
    if (this.playing) this.schedule();
    this.emit();
  }
  setManual(manual) {
    this.pause();
    this.manual = manual;
    this.decision = null;
    this.emit();
  }
  approve() {
    if (this.index !== 5) return;
    this.decision = "allow";
    this.next();
  }
  reject() {
    if (this.index !== 5) return;
    this.decision = "deny";
    this.pause();
  }
  destroy() {
    this.scheduler.clearTimeout(this.timer);
    this.playing = false;
  }
}
