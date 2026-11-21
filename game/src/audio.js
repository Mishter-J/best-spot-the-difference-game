// audio.js — one job: every sound the game makes, synthesized live.
// No audio files: short WebAudio oscillator notes, so the game needs no
// network and no assets. Sounds are unlocked on the first user gesture.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  unlock() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  note(freq, startIn, dur, type = 'sine', gain = 0.12) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + startIn;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** Two-note chime when a difference is found. */
  found() {
    this.note(659.25, 0, 0.14);
    this.note(880, 0.09, 0.22);
  }

  /** Low buzz when a click misses. */
  wrong() {
    this.note(160, 0, 0.18, 'sawtooth', 0.06);
  }

  /** Soft blip when a hint is used. */
  hint() {
    this.note(523.25, 0, 0.1, 'triangle', 0.1);
    this.note(783.99, 0.07, 0.14, 'triangle', 0.1);
  }

  /** Rising arpeggio when a level is cleared. */
  levelClear() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.note(f, i * 0.09, 0.18));
  }

  /** Little fanfare when the whole game is won. */
  win() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) =>
      this.note(f, i * 0.11, 0.2));
  }

  /** Sad two-note fall when time runs out. */
  timeUp() {
    this.note(392, 0, 0.2, 'triangle', 0.1);
    this.note(311.13, 0.16, 0.3, 'triangle', 0.1);
  }
}
