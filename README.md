[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zeromix555/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zeromix555/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Built for the make.fun bounty: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451

# Spot the Difference

A complete, original spot-the-difference game that runs offline in a desktop browser
from static files. No libraries, no network requests, no copied art: every picture is
drawn in code (`game/src/scenes.js`).

## How to play

Two near-identical pictures sit side by side. Click a difference in either picture —
a green circle marks it on both sides. Find all 7 in a level to move on.

- **3 levels**: Sunny Meadow, Beach Day, Campfire Night — 7 differences each, 21 in all.
- **Counter**: the top bar always shows how many are found and how many remain.
- **Timer**: counts up per level; your best total time is saved in the browser.
- **Hints**: press `H` (3 per level) to pulse a glowing ring around one hidden difference.
- **Mistakes**: a wrong click flashes a red X and counts as a miss.
- **Sounds**: small synthesized chimes (WebAudio, no files) for finds, misses and wins.
- **Keys**: `Space`/`Enter` start and confirm, `P`/`Esc` pause, `H` hint, `R` restart,
  `N` next level. Mouse and keyboard both work.

## The differences

- **Sunny Meadow**: the bird, the sun's sunglasses, a tulip's colour, the chimney
  smoke, the butterfly, a letter on the wooden sign, the frog on the lily pad.
- **Beach Day**: the sailboat, the crab, the beach ball's colour, a coconut, the
  starfish's colour, an umbrella stripe, the little spade.
- **Campfire Night**: the owl, the moon's phase, the marshmallow, the lantern light,
  a pine tree, the tent door's colour, a star that blinked out.

## Play it

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

Or open `game/index.html` through any static server. Screenshots were taken from the
game's own code in headless Chrome: `?shot=play` and `?shot=play2` stage mid-game
states (some differences found and circled, several still unfound, counter visible),
`?shot=start` the title screen, `?shot=end` the win screen.

## Hand-in

`main.ts` (Node 22) copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored `vendor/makefun-game.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

MIT licensed. Built for the make.fun competition
`best-spot-the-difference-game-20261121-0451`.
