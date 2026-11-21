// hints.js — one job: the hint button's behaviour.
// A hint spends one of the level's hints and pulses a ring around a random
// still-unfound difference for a few seconds. It never marks the difference
// as found — the player still has to click it.

import { HINT_PULSE_MS } from './config.js';

export class HintManager {
  constructor() {
    this.reset(0);
  }

  reset(count) {
    this.remaining = count;
    this.target = null; // the difference id being hinted, or null
    this.until = 0; // performance.now() timestamp the pulse ends at
  }

  /** Spend a hint on a random unfound difference. Returns the id or null. */
  use(unfound, now) {
    if (this.remaining <= 0 || unfound.length === 0) return null;
    this.remaining -= 1;
    this.target = unfound[Math.floor(Math.random() * unfound.length)].id;
    this.until = now + HINT_PULSE_MS;
    return this.target;
  }

  /** The id currently pulsing, or null when the pulse has faded. */
  active(now) {
    if (this.target && now < this.until) return this.target;
    this.target = null;
    return null;
  }

  /** 0..1 pulse strength for the ring animation. */
  pulse(now) {
    if (!this.target || now >= this.until) return 0;
    const elapsed = now - (this.until - HINT_PULSE_MS);
    return 0.5 + 0.5 * Math.sin((elapsed / 220) * Math.PI * 2);
  }
}
