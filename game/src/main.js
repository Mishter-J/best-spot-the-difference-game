// main.js — one job: run the game. It owns the state machine (menu,
// playing, level complete, game over, win), wires the HUD, the timer, the
// hints and the input together, and stages screenshot states from ?shot=.

import {
  LEVELS, CLICK_RADIUS, WRONG_TIME_PENALTY, WRONG_SCORE_PENALTY,
  FIND_SCORE, TIME_BONUS_PER_SECOND, HINTS_PER_LEVEL, PANEL_W, PANEL_H,
} from './config.js';
import { differencesFor } from './differences.js';
import { SoundFX } from './audio.js';
import { CountdownTimer } from './timer.js';
import { HintManager } from './hints.js';
import { Input } from './input.js';
import { Renderer } from './render.js';

const $ = (id) => document.getElementById(id);

const canvas = $('game-canvas');
const renderer = new Renderer(canvas);
const sound = new SoundFX();
const timer = new CountdownTimer();
const hints = new HintManager();

const state = {
  screen: 'menu', // menu | playing | levelComplete | gameOver | win
  levelIndex: 0,
  level: LEVELS[0],
  differences: differencesFor(LEVELS[0].id),
  found: new Set(),
  foundAt: new Map(),
  score: 0,
  totalFound: 0,
  flash: null,
  hintId: null,
  cursor: { x: 312, y: 216 },
  cursorVisible: false,
  lastSecond: -1,
};

const input = new Input(canvas, {
  onTry: (x, y) => tryClick(x, y),
  onTryLeft: () => setMessage('The differences hide in the RIGHT picture — click there!'),
  onHint: () => useHint(),
  onMute: () => toggleMute(),
  onRestart: () => restartLevel(),
  onAnyGesture: () => sound.unlock(),
});
// One cursor object shared with input: the renderer draws it, the input
// moves it, and tryClick reads it — never rebound, only mutated.
state.cursor = input.cursor;
state.cursorVisible = false;

function setMessage(text) {
  $('message').textContent = text;
}

function updateHud() {
  const remaining = state.differences.length - state.found.size;
  $('level-name').textContent = `Level ${state.levelIndex + 1}/3 · ${state.level.name}`;
  $('counter').textContent =
    `Found ${state.found.size} of ${state.differences.length} · ${remaining} left`;
  $('score').textContent = `Score ${state.score}`;
  $('hint-btn').textContent = `💡 Hint (${hints.remaining})`;
  $('hint-btn').disabled = hints.remaining === 0 || state.screen !== 'playing';
  const bar = $('timer-fill');
  bar.style.width = `${Math.max(0, timer.fractionLeft * 100)}%`;
  bar.classList.toggle('low', timer.fractionLeft < 0.25);
  $('timer-text').textContent = `${timer.secondsLeft}s`;
}

function showOverlay(id) {
  for (const o of document.querySelectorAll('.overlay')) o.classList.add('hidden');
  if (id) $(id).classList.remove('hidden');
}

function startLevel(index) {
  state.levelIndex = index;
  state.level = LEVELS[index];
  state.differences = differencesFor(state.level.id);
  state.found = new Set();
  state.foundAt = new Map();
  state.flash = null;
  state.hintId = null;
  hints.reset(HINTS_PER_LEVEL);
  timer.start(state.level.timeLimitSec);
  state.screen = 'playing';
  state.lastSecond = -1;
  input.cursor.x = PANEL_W / 2;
  input.cursor.y = PANEL_H / 2;
  input.cursorVisible = false;
  state.cursorVisible = false;
  setMessage(`${state.level.name} — ${state.level.subtitle} Find every difference on the right!`);
  $('level-sub').textContent = state.level.subtitle;
  showOverlay(null);
  updateHud();
}

function tryClick(x, y) {
  if (state.screen !== 'playing') return;
  state.cursor.x = x;
  state.cursor.y = y;
  state.cursorVisible = true;
  const now = performance.now();
  let best = null;
  let bestDist = Infinity;
  for (const d of state.differences) {
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  if (best && bestDist <= best.r + CLICK_RADIUS) {
    state.found.add(best.id);
    state.foundAt.set(best.id, now);
    state.score += FIND_SCORE;
    state.totalFound += 1;
    sound.found();
    setMessage(`✅ ${best.label}`);
    if (state.found.size === state.differences.length) {
      levelComplete();
    }
  } else {
    state.flash = { x, y, at: now };
    timer.penalize(WRONG_TIME_PENALTY);
    state.score = Math.max(0, state.score - WRONG_SCORE_PENALTY);
    sound.wrong();
    setMessage(`❌ Not quite — −${WRONG_TIME_PENALTY}s and −${WRONG_SCORE_PENALTY} points. Look closer!`);
  }
  updateHud();
}

function useHint() {
  if (state.screen !== 'playing') return;
  const unfound = state.differences.filter((d) => !state.found.has(d.id));
  const id = hints.use(unfound, performance.now());
  if (id) {
    sound.hint();
    setMessage('💡 Hint: watch the pulsing ring — a difference hides there!');
  } else {
    setMessage('No hints left on this level.');
  }
  updateHud();
}

function toggleMute() {
  const muted = sound.toggleMute();
  $('mute-btn').textContent = muted ? '🔇 Muted' : '🔊 Sound';
}

function restartLevel() {
  if (state.screen === 'playing' || state.screen === 'gameOver') startLevel(state.levelIndex);
}

function levelComplete() {
  timer.stop();
  const bonus = timer.secondsLeft * TIME_BONUS_PER_SECOND;
  state.score += bonus;
  sound.levelClear();
  state.screen = 'levelComplete';
  $('level-stats').textContent =
    `All ${state.differences.length} differences found! Time bonus +${bonus} ( ${timer.secondsLeft}s left × ${TIME_BONUS_PER_SECOND} ).`;
  $('level-score').textContent = `Score: ${state.score}`;
  const last = state.levelIndex === LEVELS.length - 1;
  $('next-btn').textContent = last ? 'See your results 🏆' : 'Next level →';
  showOverlay('overlay-level');
  updateHud();
}

function gameOver() {
  timer.stop();
  sound.timeUp();
  state.screen = 'gameOver';
  $('over-stats').textContent =
    `Time ran out on ${state.level.name} with ${state.found.size} of ${state.differences.length} found.`;
  showOverlay('overlay-over');
  updateHud();
}

function winGame() {
  state.screen = 'win';
  sound.win();
  $('win-stats').textContent =
    `You found all ${state.totalFound} differences across 3 scenes!`;
  $('win-score').textContent = `Final score: ${state.score}`;
  showOverlay('overlay-win');
  updateHud();
}

$('start-btn').addEventListener('click', () => {
  sound.unlock();
  startLevel(0);
});
$('next-btn').addEventListener('click', () => {
  sound.unlock();
  if (state.levelIndex === LEVELS.length - 1) winGame();
  else startLevel(state.levelIndex + 1);
});
$('retry-btn').addEventListener('click', () => {
  sound.unlock();
  startLevel(state.levelIndex);
});
$('again-btn').addEventListener('click', () => {
  sound.unlock();
  state.score = 0;
  state.totalFound = 0;
  startLevel(0);
});
$('hint-btn').addEventListener('click', () => {
  sound.unlock();
  useHint();
});
$('mute-btn').addEventListener('click', () => {
  sound.unlock();
  toggleMute();
});
$('restart-btn').addEventListener('click', () => {
  sound.unlock();
  restartLevel();
});

// ------------------------------------------------------------------ loop
function frame(now) {
  if (state.screen === 'playing') {
    timer.tick(now);
    if (timer.secondsLeft !== state.lastSecond) {
      state.lastSecond = timer.secondsLeft;
      updateHud();
    }
    state.hintId = hints.active(now);
    if (timer.expired) gameOver();
  }
  state.cursorVisible = input.cursorVisible || state.cursorVisible;
  renderer.draw(state, now);
  requestAnimationFrame(frame);
}

// ------------------------------------------------- screenshot staging
// ?shot=menu | play | garden | win — stages a state for screenshots, the
// same way the kit's starter stages its shots. Only with the query param.
function stageShot() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  if (shot === 'play' || shot === 'garden') {
    const idx = shot === 'garden' ? 1 : 0;
    const keep = shot === 'garden' ? 2 : 3;
    startLevel(idx);
    const now = performance.now();
    state.differences.slice(0, keep).forEach((d) => {
      state.found.add(d.id);
      state.foundAt.set(d.id, now - 1000); // settled markers, no pop
    });
    state.score = keep * FIND_SCORE;
    state.totalFound = keep;
    timer.remainingMs = timer.limitMs - 45000; // 45 s already played
    setMessage('Find the rest — the clock is ticking!');
    updateHud();
  } else if (shot === 'win') {
    // Stage the end state on the last scene, all its differences found.
    state.levelIndex = LEVELS.length - 1;
    state.level = LEVELS[state.levelIndex];
    state.differences = differencesFor(state.level.id);
    const now = performance.now();
    state.differences.forEach((d) => {
      state.found.add(d.id);
      state.foundAt.set(d.id, now - 1000); // settled markers, no pop
    });
    state.score = 2850;
    state.totalFound = 21;
    timer.start(state.level.timeLimitSec);
    timer.stop();
    state.screen = 'win';
    $('win-stats').textContent = 'You found all 21 differences across 3 scenes!';
    $('win-score').textContent = 'Final score: 2850';
    showOverlay('overlay-win');
    updateHud();
  } else if (shot === 'menu') {
    // Title screen with a full timer bar and hints, as before a first game.
    timer.start(LEVELS[0].timeLimitSec);
    timer.stop();
    hints.reset(HINTS_PER_LEVEL);
    updateHud();
  }
  // shot=menu (or anything else) leaves the title screen as it is.
}

stageShot();
updateHud();
requestAnimationFrame(frame);

// Test hook for automated play-testing (not part of the game UI).
window.__spotdiff = { state, startLevel, tryClick, useHint, timer, LEVELS };
