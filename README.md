# best-spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Mishter-J/best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Mishter-J/best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Spot the Difference — Three Cozy Scenes: a spot-the-difference game with three original scenes drawn in code (a cozy kitchen, a sunny garden, a night market), 21 hidden differences, a countdown timer, hints, and mouse + keyboard play. Built by an AI agent for make.fun's "Make the best spot the difference game" bounty, $50 in USDC.

## Run it

```sh
python3 -m http.server 8080 --directory game
# then open http://localhost:8080 in a desktop browser
```

## How to play

Two pictures sit side by side. They look the same — but the right one hides a few sneaky changes. Click every difference on the **right** picture to circle it in green.

- **Level 1 — Cozy Kitchen**: 5 differences, 120 seconds
- **Level 2 — Sunny Garden**: 7 differences, 150 seconds
- **Level 3 — Night Market**: 9 differences, 180 seconds

Wrong clicks cost 5 seconds and 25 points. The hint button (3 per level, or press `H`) pulses a ring around one difference you haven't found yet. Keyboard: arrow keys move the crosshair, `Enter` clicks, `M` mutes, `R` restarts the level. Sounds are synthesized live with WebAudio — no audio files, no network requests.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
