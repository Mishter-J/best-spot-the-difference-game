// input.js — one job: turn mouse and keyboard into game actions.
// Mouse: click a panel to try a difference. Keyboard: arrow keys move a
// crosshair on the right panel, Enter/Space clicks where it stands, H asks
// for a hint, M mutes, R restarts the level. All coordinates are converted
// to scene pixels (624 x 432) so clicks line up with the art at any scale.

import { PANEL_W, PANEL_H, PANEL_GAP, PANEL_PAD, CURSOR_STEP } from './config.js';

export class Input {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} handlers { onTry(x, y), onHint(), onMute(), onRestart(), onAnyGesture() }
   */
  constructor(canvas, handlers) {
    this.canvas = canvas;
    this.handlers = handlers;
    // Crosshair position on the RIGHT panel, in scene pixels.
    this.cursor = { x: PANEL_W / 2, y: PANEL_H / 2 };
    this.cursorVisible = false;

    canvas.addEventListener('pointerdown', (e) => this.onPointer(e));
    canvas.addEventListener('pointermove', (e) => this.onMove(e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }
  /** Map a pointer event to { panel: 'left'|'right'|null, x, y } in scene px. */
  locate(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const inPanel = (ox) => {
      const x = cx - ox;
      const y = cy - PANEL_PAD;
      if (x < 0 || x >= PANEL_W || y < 0 || y >= PANEL_H) return null;
      return { x, y };
    };
    const left = inPanel(PANEL_PAD);
    if (left) return { panel: 'left', ...left };
    const right = inPanel(PANEL_PAD + PANEL_W + PANEL_GAP);
    if (right) return { panel: 'right', ...right };
    return { panel: null, x: cx, y: cy };
  }

  onPointer(e) {
    this.handlers.onAnyGesture();
    const hit = this.locate(e);
    if (hit.panel === 'right') {
      this.cursor.x = hit.x;
      this.cursor.y = hit.y;
      this.cursorVisible = true;
      this.handlers.onTry(hit.x, hit.y);
    } else if (hit.panel === 'left') {
      this.handlers.onTryLeft();
    }
  }

  onMove(e) {
    const hit = this.locate(e);
    if (hit.panel === 'right') {
      this.cursor.x = hit.x;
      this.cursor.y = hit.y;
      this.cursorVisible = true;
    }
  }

  onKey(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.cursorVisible = true;
      this.handlers.onAnyGesture();
      if (e.key === 'ArrowLeft') this.cursor.x = Math.max(0, this.cursor.x - CURSOR_STEP);
      if (e.key === 'ArrowRight') this.cursor.x = Math.min(PANEL_W, this.cursor.x + CURSOR_STEP);
      if (e.key === 'ArrowUp') this.cursor.y = Math.max(0, this.cursor.y - CURSOR_STEP);
      if (e.key === 'ArrowDown') this.cursor.y = Math.min(PANEL_H, this.cursor.y + CURSOR_STEP);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.cursorVisible = true;
      this.handlers.onAnyGesture();
      this.handlers.onTry(this.cursor.x, this.cursor.y);
      return;
    }
    if (e.key === 'h' || e.key === 'H') {
      this.handlers.onHint();
      return;
    }
    if (e.key === 'm' || e.key === 'M') {
      this.handlers.onMute();
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      this.handlers.onRestart();
    }
  }
}
