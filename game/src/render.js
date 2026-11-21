// render.js — one job: paint one frame of the game.
// It draws the original scene on the left panel, the changed scene on the
// right, then the found markers (a green ring + check on both panels), the
// pulsing hint ring, the keyboard crosshair and any wrong-click flash.

import {
  PANEL_W, PANEL_H, PANEL_GAP, PANEL_PAD, CANVAS_W, CANVAS_H, POP_MS,
} from './config.js';
import { drawKitchen, drawGarden, drawMarket } from './scenes.js';

const DRAW = { kitchen: drawKitchen, garden: drawGarden, market: drawMarket };

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
  }

  panelOrigin(panel) {
    return panel === 'left'
      ? { x: PANEL_PAD, y: PANEL_PAD }
      : { x: PANEL_PAD + PANEL_W + PANEL_GAP, y: PANEL_PAD };
  }

  /** Draw one frame. `state` carries level, found ids, pop and flash info. */
  draw(state, now) {
    const { ctx } = this;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const drawScene = DRAW[state.level.id];
    const allIds = new Set(state.differences.map((d) => d.id));

    // Left panel: the original picture, no differences applied.
    ctx.save();
    ctx.translate(this.panelOrigin('left').x, this.panelOrigin('left').y);
    drawScene(ctx, new Set());
    ctx.restore();

    // Right panel: the changed picture, every difference applied.
    ctx.save();
    ctx.translate(this.panelOrigin('right').x, this.panelOrigin('right').y);
    drawScene(ctx, allIds);
    ctx.restore();

    // Panel frames.
    ctx.strokeStyle = '#f7e8c8';
    ctx.lineWidth = 3;
    for (const panel of ['left', 'right']) {
      const o = this.panelOrigin(panel);
      ctx.strokeRect(o.x - 1.5, o.y - 1.5, PANEL_W + 3, PANEL_H + 3);
    }

    // Found markers on both panels.
    for (const diff of state.differences) {
      if (!state.found.has(diff.id)) continue;
      const age = now - (state.foundAt.get(diff.id) ?? now);
      const pop = age < POP_MS ? 1 + 0.45 * (1 - age / POP_MS) : 1;
      for (const panel of ['left', 'right']) {
        const o = this.panelOrigin(panel);
        const x = o.x + diff.x;
        const y = o.y + diff.y;
        const r = diff.r * pop + 6;
        ctx.strokeStyle = '#2fbf71';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#2fbf71';
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x - 1, y + 4);
        ctx.lineTo(x + 6, y - 5);
        ctx.stroke();
      }
    }

    // Hint pulse: an amber ring breathing around one unfound difference.
    if (state.hintId) {
      const diff = state.differences.find((d) => d.id === state.hintId);
      if (diff) {
        const breathe = 0.5 + 0.5 * Math.sin((now / 220) * Math.PI * 2);
        const r = diff.r + 8 + breathe * 7;
        for (const panel of ['left', 'right']) {
          const o = this.panelOrigin(panel);
          ctx.strokeStyle = `rgba(255, 178, 44, ${0.55 + 0.45 * breathe})`;
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(o.x + diff.x, o.y + diff.y, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Wrong-click flash: a red X where the click landed, fading fast.
    if (state.flash && now - state.flash.at < 450) {
      const o = this.panelOrigin('right');
      const alpha = 1 - (now - state.flash.at) / 450;
      ctx.strokeStyle = `rgba(224, 82, 82, ${alpha})`;
      ctx.lineWidth = 4;
      const { x, y } = state.flash;
      ctx.beginPath();
      ctx.moveTo(o.x + x - 10, o.y + y - 10);
      ctx.lineTo(o.x + x + 10, o.y + y + 10);
      ctx.moveTo(o.x + x + 10, o.y + y - 10);
      ctx.lineTo(o.x + x - 10, o.y + y + 10);
      ctx.stroke();
    }

    // Keyboard crosshair on the right panel.
    if (state.cursorVisible) {
      const o = this.panelOrigin('right');
      const x = o.x + state.cursor.x;
      const y = o.y + state.cursor.y;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 18, y);
      ctx.lineTo(x - 8, y);
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 18, y);
      ctx.moveTo(x, y - 18);
      ctx.lineTo(x, y - 8);
      ctx.moveTo(x, y + 8);
      ctx.lineTo(x, y + 18);
      ctx.stroke();
    }
  }
}
