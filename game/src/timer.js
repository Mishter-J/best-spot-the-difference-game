// timer.js — one job: the level countdown, with time pressure you can
// feel. It ticks from wall-clock time so tab switches and pauses stay
// honest, and it can lose seconds on a wrong click.

export class CountdownTimer {
  constructor() {
    this.limitMs = 0;
    this.remainingMs = 0;
    this.running = false;
    this.lastTick = 0;
  }

  start(seconds) {
    this.limitMs = seconds * 1000;
    this.remainingMs = this.limitMs;
    this.running = true;
    this.lastTick = performance.now();
  }

  stop() {
    this.running = false;
  }

  /** Advance the clock; returns true while time is left. */
  tick(now) {
    if (!this.running) return this.remainingMs > 0;
    const dt = now - this.lastTick;
    this.lastTick = now;
    this.remainingMs = Math.max(0, this.remainingMs - dt);
    if (this.remainingMs === 0) this.running = false;
    return this.remainingMs > 0;
  }

  /** A wrong click costs seconds. */
  penalize(seconds) {
    this.remainingMs = Math.max(0, this.remainingMs - seconds * 1000);
    if (this.remainingMs === 0) this.running = false;
  }

  get secondsLeft() {
    return Math.ceil(this.remainingMs / 1000);
  }

  get fractionLeft() {
    return this.limitMs === 0 ? 0 : this.remainingMs / this.limitMs;
  }

  get expired() {
    return this.remainingMs <= 0;
  }
}
