// Boot and the one loop: input is read every frame, the world advances in fixed 1/60 s
// steps, and the renderer paints what is there. The game moves between five screens:
// title, play, paused, level complete and game over.
//
// ?shot=start|play|play2|end (with &seed=N, ignored — the pictures are fixed) stages that
// scene instead of running the loop, paints it twice and sets window.__shotReady for a
// screenshot.
import { BEST_KEY, PANEL, STEP } from './config.js';
import { createWorld, EVENT_FOUND, EVENT_HINT, EVENT_LEVEL, EVENT_OVER, EVENT_WRONG } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_NEXT, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer, SCREEN_LEVEL, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { createSound } from './sound.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const sound = createSound();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best time then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, (x, y) => renderer.toField(x, y));
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen changes and finds.
  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.reset();
    accumulator = 0;
    screen = SCREEN_PLAY;
    announce('Playing. Find 7 differences in each of 3 pictures.');
  }

  function endGame() {
    screen = SCREEN_OVER;
    if (best === 0 || world.state.totalMs < best) {
      best = world.state.totalMs;
      saveBest(best);
    }
    announce(`You found them all in ${Math.round(world.state.totalMs / 1000)} seconds. Best ${Math.round(best / 1000)}.`);
  }

  /** A click in field coordinates: inside a picture it is a guess, anywhere else it confirms. */
  function handleClick(point) {
    sound.unlock();
    if (screen === SCREEN_TITLE || screen === SCREEN_OVER) {
      startGame();
      return;
    }
    if (screen === SCREEN_LEVEL) {
      if (world.state.level < 2) {
        world.startLevel(world.state.level + 1);
        screen = SCREEN_PLAY;
        announce(`Level ${world.state.level + 1}. Find 7 differences.`);
      } else {
        endGame();
      }
      return;
    }
    if (screen !== SCREEN_PLAY) return;
    for (const [panelX, panel] of [[PANEL.leftX, 0], [PANEL.rightX, 1]]) {
      if (point.x >= panelX && point.x < panelX + PANEL.width && point.y >= PANEL.top && point.y < PANEL.top + PANEL.height) {
        const events = world.click(point.x - panelX, point.y - PANEL.top);
        if (events & EVENT_FOUND) {
          sound.found();
          announce(`${world.state.lastFoundName}. ${world.remaining()} to go.`);
        } else if (events & EVENT_WRONG) {
          sound.wrong();
          announce('Not a difference. Keep looking.');
        }
        if (events & EVENT_LEVEL) {
          sound.level();
          screen = SCREEN_LEVEL;
          announce('Level complete! All 7 differences found.');
        }
        if (events & EVENT_OVER) {
          sound.win();
          endGame();
        }
        return;
      }
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_RESTART) {
      startGame();
      return;
    }
    if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_OVER)) startGame();
    else if (actions & ACTION_CONFIRM && screen === SCREEN_LEVEL) {
      if (world.state.level < 2) {
        world.startLevel(world.state.level + 1);
        screen = SCREEN_PLAY;
      } else endGame();
    } else if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    } else if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && screen === SCREEN_PAUSED) {
      screen = SCREEN_PLAY;
      announce('Playing.');
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      if (world.hint() & EVENT_HINT) {
        sound.hint();
        announce('Hint: look at the glowing circle.');
      }
    }
    if (actions & ACTION_NEXT && screen === SCREEN_LEVEL && world.state.level < 2) {
      world.startLevel(world.state.level + 1);
      screen = SCREEN_PLAY;
      announce(`Level ${world.state.level + 1}. Find 7 differences.`);
    }
    for (const point of input.takeClicks()) handleClick(point);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP && screen === SCREEN_PLAY) {
        world.step(STEP);
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, best);
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
