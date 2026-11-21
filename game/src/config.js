// config.js — one job: every tunable number of the game in one place.
// Scene space is 624 x 432 per panel; the canvas holds two panels side by
// side with a 16 px gap and 8 px padding, so it is 1280 x 448 in all.

export const PANEL_W = 624;
export const PANEL_H = 432;
export const PANEL_GAP = 16;
export const PANEL_PAD = 8;
export const CANVAS_W = PANEL_W * 2 + PANEL_GAP + PANEL_PAD * 2;
export const CANVAS_H = PANEL_H + PANEL_PAD * 2;

// Click tolerance around a difference centre, in scene pixels.
export const CLICK_RADIUS = 30;
// A wrong click costs this many seconds and this many score points.
export const WRONG_TIME_PENALTY = 5;
export const WRONG_SCORE_PENALTY = 25;
export const FIND_SCORE = 100;
export const TIME_BONUS_PER_SECOND = 5;
// Hints per level and how long a hint pulse stays visible (ms).
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2600;

export const LEVELS = [
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    subtitle: 'Morning light, a sleepy cat and five sneaky changes.',
    timeLimitSec: 120,
    difficulty: 1,
  },
  {
    id: 'garden',
    name: 'Sunny Garden',
    subtitle: 'Bees, blooms and seven changes hiding in plain sight.',
    timeLimitSec: 150,
    difficulty: 2,
  },
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, dumplings and nine changes after dark.',
    timeLimitSec: 180,
    difficulty: 3,
  },
];

// Crosshair movement speed for keyboard play, scene px per keypress.
export const CURSOR_STEP = 14;
// Pop animation length for a found marker, in ms.
export const POP_MS = 420;
