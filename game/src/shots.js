// The screenshot scenes behind ?shot=start|play|play2|end. Each one stages a real game
// state — the same world, the same rules, the same renderer — so the frame is what a short
// game really looks like and the same seed always gives the same frame. The play scenes are
// mid-game: some differences found and circled in green, several still unfound, and the
// counter up top saying how many remain.
import { DIFFS } from './scenes.js';
import { SCREEN_LEVEL, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

/** Click the centre of a difference, as a player would. */
function find(world, index) {
  const diff = DIFFS[world.state.level][index];
  world.click(diff.x, diff.y);
}

/**
 * Set `world` to the named scene and return the screen to draw over it and the best time
 * to show. Unknown names stage the title screen.
 */
export function stageShot(name, world) {
  world.reset();
  if (name === 'play') {
    world.state.elapsed = 74;
    find(world, 0);
    find(world, 2);
    find(world, 4);
    world.click(520, 120); // one honest miss, for the red X
    world.state.elapsed = 74;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'play2') {
    world.startLevel(1);
    world.state.elapsed = 131;
    find(world, 0);
    find(world, 1);
    find(world, 3);
    find(world, 4);
    find(world, 6);
    world.state.elapsed = 131;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'end') {
    for (let level = 0; level < 3; level += 1) {
      world.startLevel(level);
      world.state.elapsed = 60 + level * 25;
      for (let index = 0; index < DIFFS[level].length; index += 1) find(world, index);
      if (level < 2) world.startLevel(level + 1);
    }
    world.state.totalMs = 214000;
    world.state.elapsed = 214;
    return { screen: SCREEN_OVER, best: 198000 };
  }
  return { screen: SCREEN_TITLE, best: 0 };
}
