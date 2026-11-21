// scenes.js — one job: draw each scene, twice, from code alone.
// Every scene is drawn twice per frame: the LEFT panel with no differences
// applied (the original) and the RIGHT panel with all of them applied (the
// changed picture). `applied` is the Set of difference ids active in this
// panel. All art is original and procedural — no images, no copied art.

import { PANEL_W, PANEL_H } from './config.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

// ---------------------------------------------------------------- kitchen
// A cozy kitchen: window and clock on the wall, shelf of jars, a wooden
// counter with a fruit bowl, a mug, a spoon and a sleeping cat.
export function drawKitchen(ctx, applied) {
  // Wall and floor.
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = '#c98f5f';
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);
  ctx.fillStyle = '#b57e4e';
  for (let x = 0; x < PANEL_W; x += 52) ctx.fillRect(x, 340, 3, PANEL_H - 340);

  // Window with morning sky (left).
  ctx.fillStyle = '#8ec9e8';
  ctx.fillRect(36, 36, 150, 130);
  ctx.fillStyle = '#fff3b0';
  circle(ctx, 76, 76, 22); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, 140, 96, 30, 10); ctx.fill();
  ellipse(ctx, 120, 130, 24, 8); ctx.fill();
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 150, 130);
  line(ctx, 111, 36, 111, 166); ctx.stroke();
  line(ctx, 36, 101, 186, 101); ctx.stroke();
  // Curtains.
  ctx.fillStyle = '#e86a6a';
  ctx.fillRect(28, 28, 22, 146);
  ctx.fillRect(172, 28, 22, 146);

  // Wall clock (difference: hands move).
  ctx.fillStyle = '#ffffff';
  circle(ctx, 310, 62, 34); ctx.fill();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 4;
  circle(ctx, 310, 62, 34); ctx.stroke();
  ctx.fillStyle = '#5b4636';
  circle(ctx, 310, 62, 3); ctx.fill();
  ctx.lineWidth = 3;
  if (applied.has('clock')) {
    line(ctx, 310, 62, 310, 38); ctx.stroke(); // 12:00
    line(ctx, 310, 62, 330, 62); ctx.stroke();
  } else {
    line(ctx, 310, 62, 310, 40); ctx.stroke(); // 3:00
    line(ctx, 310, 62, 328, 62); ctx.stroke();
  }
  ctx.fillStyle = '#5b4636';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('12', 304, 42);
  ctx.fillText('3', 336, 66);
  ctx.fillText('6', 306, 92);
  ctx.fillText('9', 280, 66);

  // Shelf with jars (right of the window).
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(420, 96, 168, 10);
  ctx.fillStyle = '#d9a066';
  rr(ctx, 432, 62, 26, 34, 4); ctx.fill();
  ctx.fillStyle = '#7fb069';
  rr(ctx, 470, 58, 26, 38, 4); ctx.fill();
  ctx.fillStyle = '#e8b4b8';
  rr(ctx, 508, 64, 26, 32, 4); ctx.fill();
  ctx.fillStyle = '#f2d492';
  rr(ctx, 546, 60, 26, 36, 4); ctx.fill();

  // Potted herb on the counter (left of the bowl).
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(196, 330); ctx.lineTo(228, 330); ctx.lineTo(222, 356); ctx.lineTo(202, 356);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4e7a3a';
  ctx.lineWidth = 3;
  line(ctx, 212, 330, 206, 306); ctx.stroke();
  line(ctx, 212, 330, 220, 304); ctx.stroke();
  line(ctx, 212, 330, 212, 300); ctx.stroke();
  ctx.fillStyle = '#6aab4f';
  ellipse(ctx, 204, 302, 8, 6); ctx.fill();
  ellipse(ctx, 222, 300, 8, 6); ctx.fill();
  ellipse(ctx, 212, 296, 8, 6); ctx.fill();

  // Fruit bowl with apples (difference: an extra apple).
  ctx.fillStyle = '#5b7fa6';
  ctx.beginPath();
  ctx.ellipse(246, 352, 46, 14, 0, 0, Math.PI);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e05252';
  circle(ctx, 228, 340, 11); ctx.fill();
  circle(ctx, 262, 338, 11); ctx.fill();
  circle(ctx, 246, 332, 11); ctx.fill();
  if (applied.has('apple')) {
    circle(ctx, 246, 352, 11); ctx.fill();
  }
  ctx.fillStyle = '#7fb069';
  ellipse(ctx, 246, 322, 6, 4); ctx.fill();

  // Kettle on the stove (right).
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(400, 300, 120, 8);
  ctx.fillStyle = '#9aa5b1';
  ellipse(ctx, 452, 292, 26, 20); ctx.fill();
  ctx.fillRect(452, 266, 8, 12);
  line(ctx, 476, 282, 496, 268); ctx.stroke();
  ctx.strokeStyle = '#9aa5b1';
  ctx.lineWidth = 4;
  line(ctx, 476, 282, 496, 268); ctx.stroke();

  // Mug (difference: red vs teal).
  ctx.fillStyle = applied.has('mug') ? '#2a9d8f' : '#e05252';
  rr(ctx, 448, 300, 30, 26, 4); ctx.fill();
  ctx.strokeStyle = applied.has('mug') ? '#2a9d8f' : '#e05252';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(482, 313, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Spoon on the counter (difference: it vanishes).
  if (!applied.has('spoon')) {
    ctx.fillStyle = '#c0c8d0';
    ellipse(ctx, 120, 350, 7, 12); ctx.fill();
    ctx.fillRect(117, 350, 6, 26);
  }

  // Bread board and loaf.
  ctx.fillStyle = '#d9a066';
  rr(ctx, 520, 336, 72, 12, 4); ctx.fill();
  ctx.fillStyle = '#e8b96a';
  ellipse(ctx, 556, 332, 22, 10); ctx.fill();
  ctx.strokeStyle = '#b57e4e';
  ctx.lineWidth = 2;
  line(ctx, 540, 326, 540, 338); ctx.stroke();
  line(ctx, 556, 324, 556, 340); ctx.stroke();
  line(ctx, 572, 326, 572, 338); ctx.stroke();

  // Sleeping cat, bottom right (difference: its tail is gone).
  ctx.fillStyle = '#f2a541';
  ellipse(ctx, 556, 398, 40, 16); ctx.fill();
  circle(ctx, 522, 388, 14); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(512, 378); ctx.lineTo(516, 366); ctx.lineTo(522, 378);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(528, 376); ctx.lineTo(534, 366); ctx.lineTo(538, 378);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 2;
  line(ctx, 516, 390, 522, 390); ctx.stroke();
  if (!applied.has('tail')) {
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(596, 396, 12, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  // Countertop edge and cabinet lines.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 296, PANEL_W, 8);
  ctx.strokeStyle = '#a06a3e';
  ctx.lineWidth = 2;
  for (let x = 104; x < PANEL_W; x += 104) {
    ctx.strokeRect(x, 312, 88, 108);
  }
}

// ----------------------------------------------------------------- garden
// A sunny garden: blue sky, a smiling sun, a fence with a bird, flower
// beds, a path of stepping stones, a watering can and a mushroom.
export function drawGarden(ctx, applied) {
  // Sky and grass.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(1, '#c9ecff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 260);
  ctx.fillStyle = '#7fb069';
  ctx.fillRect(0, 260, PANEL_W, PANEL_H - 260);
  ctx.fillStyle = '#6a9e58';
  ctx.fillRect(0, 260, PANEL_W, 10);

  // Sun (difference: it loses its smile).
  ctx.fillStyle = '#ffd23f';
  circle(ctx, 556, 56, 30); ctx.fill();
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 3;
  for (let a = 0; a < 8; a++) {
    const t = (a / 8) * Math.PI * 2;
    line(ctx, 556 + Math.cos(t) * 36, 56 + Math.sin(t) * 36,
      556 + Math.cos(t) * 44, 56 + Math.sin(t) * 44);
    ctx.stroke();
  }
  ctx.fillStyle = '#5b4636';
  circle(ctx, 546, 50, 3); ctx.fill();
  circle(ctx, 566, 50, 3); ctx.fill();
  if (!applied.has('smile')) {
    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(556, 58, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Clouds.
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, 120, 60, 42, 14); ctx.fill();
  ellipse(ctx, 150, 52, 30, 12); ctx.fill();
  ellipse(ctx, 330, 40, 36, 12); ctx.fill();

  // Fence.
  ctx.fillStyle = '#d9b48a';
  ctx.fillRect(0, 200, PANEL_W, 12);
  ctx.fillRect(0, 236, PANEL_W, 12);
  for (let x = 20; x < PANEL_W; x += 62) {
    ctx.fillRect(x, 180, 14, 84);
    ctx.beginPath();
    ctx.moveTo(x, 180); ctx.lineTo(x + 7, 168); ctx.lineTo(x + 14, 180);
    ctx.closePath(); ctx.fill();
  }

  // Bird on the fence (difference: it flies away).
  if (!applied.has('bird')) {
    ctx.fillStyle = '#4a7fb5';
    ellipse(ctx, 516, 84, 16, 10); ctx.fill();
    circle(ctx, 530, 74, 7); ctx.fill();
    ctx.fillStyle = '#f2a541';
    ctx.beginPath();
    ctx.moveTo(537, 74); ctx.lineTo(544, 76); ctx.lineTo(537, 78);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5b4636';
    circle(ctx, 532, 72, 2); ctx.fill();
    ctx.strokeStyle = '#4a7fb5';
    ctx.lineWidth = 3;
    line(ctx, 510, 92, 504, 100); ctx.stroke();
    line(ctx, 520, 92, 518, 100); ctx.stroke();
  }

  // Flower bed: tulips and a sunflower.
  const tulip = (x, y, color) => {
    ctx.strokeStyle = '#4e7a3a';
    ctx.lineWidth = 3;
    line(ctx, x, y, x, y + 34); ctx.stroke();
    ctx.fillStyle = color;
    circle(ctx, x, y - 6, 9); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 6); ctx.lineTo(x - 5, y - 16); ctx.lineTo(x, y - 8);
    ctx.lineTo(x + 5, y - 16); ctx.lineTo(x + 9, y - 6);
    ctx.closePath(); ctx.fill();
  };
  tulip(60, 300, '#e05252');
  tulip(90, 310, '#f2a541');
  tulip(360, 296, '#e05252');
  tulip(392, 308, '#b565d8');
  tulip(560, 300, '#f2a541');
  tulip(590, 312, '#e05252');
  // Sunflower.
  ctx.strokeStyle = '#4e7a3a';
  ctx.lineWidth = 4;
  line(ctx, 460, 300, 460, 340); ctx.stroke();
  ctx.fillStyle = '#ffd23f';
  for (let a = 0; a < 10; a++) {
    const t = (a / 10) * Math.PI * 2;
    ellipse(ctx, 460 + Math.cos(t) * 16, 288 + Math.sin(t) * 16, 7, 4);
    ctx.fill();
  }
  ctx.fillStyle = '#8a5a33';
  circle(ctx, 460, 288, 11); ctx.fill();

  // Butterfly (difference: orange wings vs blue wings).
  ctx.fillStyle = applied.has('butterfly') ? '#4a7fb5' : '#f27d16';
  ellipse(ctx, 100, 104, 14, 9); ctx.fill();
  ellipse(ctx, 124, 104, 14, 9); ctx.fill();
  ellipse(ctx, 102, 122, 11, 7); ctx.fill();
  ellipse(ctx, 122, 122, 11, 7); ctx.fill();
  ctx.fillStyle = '#5b4636';
  ellipse(ctx, 112, 112, 3, 10); ctx.fill();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 1.5;
  line(ctx, 110, 102, 104, 94); ctx.stroke();
  line(ctx, 114, 102, 120, 94); ctx.stroke();

  // Bees: one always, a second when the difference is applied.
  const bee = (x, y) => {
    ctx.fillStyle = '#ffd23f';
    ellipse(ctx, x, y, 9, 6); ctx.fill();
    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 2;
    line(ctx, x - 3, y - 5, x - 3, y + 5); ctx.stroke();
    line(ctx, x + 3, y - 5, x + 3, y + 5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ellipse(ctx, x - 2, y - 8, 5, 3); ctx.fill();
  };
  bee(210, 150);
  if (applied.has('bee')) bee(296, 176);

  // Path of stepping stones (difference: one stone is missing).
  ctx.fillStyle = '#b8b0a4';
  ellipse(ctx, 160, 404, 26, 10); ctx.fill();
  if (!applied.has('stone')) ellipse(ctx, 244, 404, 26, 10); ctx.fill();
  ellipse(ctx, 330, 404, 26, 10); ctx.fill();
  ellipse(ctx, 416, 404, 26, 10); ctx.fill();

  // Watering can (difference: it loses its spout).
  ctx.fillStyle = '#5b8c5a';
  rr(ctx, 150, 340, 44, 30, 6); ctx.fill();
  ctx.beginPath();
  ctx.arc(194, 352, 10, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#5b8c5a';
  ctx.lineWidth = 5;
  ctx.stroke();
  if (!applied.has('spout')) {
    ctx.strokeStyle = '#5b8c5a';
    ctx.lineWidth = 6;
    line(ctx, 150, 348, 128, 330); ctx.stroke();
    ctx.fillStyle = '#7fb069';
    circle(ctx, 124, 328, 5); ctx.fill();
    circle(ctx, 118, 336, 4); ctx.fill();
  }
  ctx.fillStyle = '#4e7a3a';
  ctx.fillRect(168, 330, 10, 8);

  // Mushroom (difference: red cap vs purple cap).
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(404, 372, 14, 22);
  ctx.fillStyle = applied.has('mushroom') ? '#b565d8' : '#e05252';
  ctx.beginPath();
  ctx.arc(411, 374, 22, Math.PI, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff';
  circle(ctx, 402, 364, 4); ctx.fill();
  circle(ctx, 418, 360, 5); ctx.fill();
  circle(ctx, 411, 370, 3); ctx.fill();

  // Grass tufts.
  ctx.strokeStyle = '#5b8c4a';
  ctx.lineWidth = 2;
  for (const [x, y] of [[40, 380], [330, 380], [500, 400], [80, 420], [560, 420]]) {
    line(ctx, x, y, x - 4, y - 10); ctx.stroke();
    line(ctx, x + 4, y, x + 4, y - 12); ctx.stroke();
    line(ctx, x + 8, y, x + 12, y - 9); ctx.stroke();
  }
}

// ------------------------------------------------------------------ market
// A night market: dark sky, a moon, string lights, two stalls, a vendor
// under an umbrella, a steamer, crates of oranges and a cat on a crate.
export function drawMarket(ctx, applied) {
  // Night sky and ground.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#1b2a52');
  sky.addColorStop(1, '#3d5a80');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = '#6b5d4f';
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);
  ctx.fillStyle = '#5a4d40';
  for (let x = 0; x < PANEL_W; x += 48) {
    ctx.fillRect(x, 330, 44, 4);
    ctx.fillRect(x + 24, 380, 44, 4);
  }

  // Stars.
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[40, 40, 2], [90, 90, 1.5], [180, 30, 2], [260, 80, 1.5],
    [340, 30, 2], [420, 70, 1.5], [480, 30, 2], [540, 110, 1.5], [600, 40, 2], [300, 120, 1.5]]) {
    circle(ctx, x, y, r); ctx.fill();
  }

  // Moon (difference: full vs crescent).
  ctx.fillStyle = '#f4f1de';
  circle(ctx, 572, 56, 24); ctx.fill();
  if (applied.has('moon')) {
    ctx.fillStyle = '#1b2a52';
    circle(ctx, 582, 50, 20); ctx.fill();
  } else {
    ctx.fillStyle = '#d8d2b8';
    circle(ctx, 564, 50, 4); ctx.fill();
    circle(ctx, 578, 62, 3); ctx.fill();
  }

  // String lights across the top (difference: one bulb goes dark).
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(312, 90, PANEL_W, 30);
  ctx.stroke();
  for (let i = 0; i < 11; i++) {
    const x = 28 + i * 57;
    const y = 30 + Math.sin((x / PANEL_W) * Math.PI) * 44;
    const dark = applied.has('bulb') && i === 3;
    ctx.fillStyle = dark ? '#4a4a4a' : ['#ffd23f', '#e05252', '#7fb069'][i % 3];
    circle(ctx, x, y + 8, 6); ctx.fill();
    if (!dark) {
      ctx.fillStyle = 'rgba(255,210,63,0.25)';
      circle(ctx, x, y + 8, 11); ctx.fill();
    }
  }

  // Left stall: awning, lantern, sign (differences: lantern colour, sign).
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(40, 150, 220, 10);
  ctx.fillStyle = '#e05252';
  for (let x = 40; x < 260; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 150); ctx.lineTo(x + 22, 150); ctx.lineTo(x + 22, 166); ctx.lineTo(x, 166);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#f7e8c8';
  for (let x = 62; x < 260; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 150); ctx.lineTo(x + 22, 150); ctx.lineTo(x + 22, 166); ctx.lineTo(x, 166);
    ctx.closePath(); ctx.fill();
  }
  // Paper lantern (difference: red vs green).
  ctx.fillStyle = applied.has('lantern') ? '#2a9d8f' : '#e05252';
  ellipse(ctx, 112, 86, 16, 20); ctx.fill();
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  line(ctx, 112, 62, 112, 110); ctx.stroke();
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(106, 60, 12, 5);
  ctx.fillRect(106, 108, 12, 5);
  // Sign board with dumplings (difference: three dumplings vs four).
  ctx.fillStyle = '#f2d492';
  rr(ctx, 270, 96, 88, 42, 6); ctx.fill();
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 3;
  rr(ctx, 270, 96, 88, 42, 6); ctx.stroke();
  ctx.fillStyle = '#5b4636';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('DUMPLING', 278, 114);
  ctx.fillStyle = '#ffffff';
  circle(ctx, 292, 128, 5); ctx.fill();
  circle(ctx, 306, 128, 5); ctx.fill();
  circle(ctx, 320, 128, 5); ctx.fill();
  if (applied.has('sign')) circle(ctx, 334, 128, 5); ctx.fill();

  // Steamer baskets on the left stall counter (difference: extra dumpling).
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(60, 300, 200, 10);
  ctx.fillStyle = '#c98f5f';
  ellipse(ctx, 172, 300, 34, 10); ctx.fill();
  ctx.fillRect(138, 282, 68, 18);
  ctx.fillStyle = '#ffffff';
  circle(ctx, 156, 282, 7); ctx.fill();
  circle(ctx, 172, 280, 7); ctx.fill();
  circle(ctx, 188, 282, 7); ctx.fill();
  if (applied.has('dumpling')) circle(ctx, 172, 292, 7); ctx.fill();

  // Crate of oranges (difference: one orange rolls away).
  ctx.fillStyle = '#a06a3e';
  ctx.fillRect(48, 372, 76, 34);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 2;
  line(ctx, 48, 386, 124, 386); ctx.stroke();
  ctx.fillStyle = '#f27d16';
  circle(ctx, 66, 366, 9); ctx.fill();
  circle(ctx, 86, 362, 9); ctx.fill();
  circle(ctx, 106, 366, 9); ctx.fill();
  circle(ctx, 76, 352, 9); ctx.fill();
  if (!applied.has('orange')) circle(ctx, 96, 352, 9); ctx.fill();

  // Vendor under the umbrella (differences: hat colour, umbrella stripe).
  // Umbrella.
  ctx.fillStyle = '#e05252';
  ctx.beginPath();
  ctx.arc(424, 196, 62, Math.PI, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = applied.has('umbrella') ? '#2a9d8f' : '#f7e8c8';
  ctx.beginPath();
  ctx.moveTo(424, 134);
  ctx.lineTo(446, 134);
  ctx.lineTo(436, 196);
  ctx.lineTo(412, 196);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 3;
  line(ctx, 424, 134, 424, 200); ctx.stroke();
  // Vendor.
  ctx.fillStyle = '#f2c89b';
  circle(ctx, 372, 176, 16); ctx.fill();
  ctx.fillStyle = applied.has('hat') ? '#e05252' : '#d9a066';
  ctx.beginPath();
  ctx.arc(372, 172, 20, Math.PI, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(348, 170, 48, 4);
  ctx.fillStyle = '#5b4636';
  circle(ctx, 366, 174, 2); ctx.fill();
  circle(ctx, 378, 174, 2); ctx.fill();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(372, 180, 6, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#4a7fb5';
  rr(ctx, 352, 192, 40, 46, 8); ctx.fill();
  ctx.fillStyle = '#f2c89b';
  circle(ctx, 354, 216, 6); ctx.fill();
  circle(ctx, 390, 216, 6); ctx.fill();

  // Right stall counter with jars.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(440, 300, 150, 10);
  ctx.fillStyle = '#d9a066';
  rr(ctx, 452, 268, 24, 32, 4); ctx.fill();
  ctx.fillStyle = '#7fb069';
  rr(ctx, 486, 264, 24, 36, 4); ctx.fill();
  ctx.fillStyle = '#e8b4b8';
  rr(ctx, 520, 268, 24, 32, 4); ctx.fill();
  ctx.fillStyle = '#f2d492';
  rr(ctx, 554, 266, 24, 34, 4); ctx.fill();

  // Cat on a crate (difference: the cat is gone).
  ctx.fillStyle = '#a06a3e';
  ctx.fillRect(480, 372, 70, 34);
  if (!applied.has('cat')) {
    ctx.fillStyle = '#5b5b5b';
    ellipse(ctx, 512, 366, 22, 12); ctx.fill();
    circle(ctx, 496, 358, 9); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(490, 352); ctx.lineTo(492, 344); ctx.lineTo(496, 352);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(500, 350); ctx.lineTo(504, 342); ctx.lineTo(506, 351);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5b5b5b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(532, 362, 8, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
}
