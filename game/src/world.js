// The game's rules and state, with no drawing and no browser in it: three levels, seven
// differences each, clicks that find them, hints, mistakes, and a timer. step() advances one
// fixed step and returns what happened as bit flags, so the caller can react without the
// world knowing about screens or sound.
import { DIFFS_PER_LEVEL, HIT_RADIUS, HINTS_PER_LEVEL, LEVELS, MAX_MISTAKES, STEP } from './config.js';
import { DIFFS } from './scenes.js';

export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL = 4;
export const EVENT_OVER = 8;
export const EVENT_HINT = 16;

export function createWorld() {
  const state = {
    level: 0,
    found: [],
    wrong: [],
    hint: null,
    hintUntil: 0,
    mistakes: 0,
    hintsLeft: HINTS_PER_LEVEL,
    elapsed: 0,
    totalMs: 0,
    won: false,
    levelDone: false,
    lastFoundName: '',
    flash: 0,
  };

  function reset() {
    state.level = 0;
    state.found = [];
    state.wrong = [];
    state.hint = null;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.mistakes = 0;
    state.elapsed = 0;
    state.totalMs = 0;
    state.won = false;
    state.levelDone = false;
    state.lastFoundName = '';
    state.flash = 0;
  }

  function startLevel(level) {
    state.level = level;
    state.found = [];
    state.wrong = [];
    state.hint = null;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.mistakes = 0;
    state.elapsed = 0;
    state.levelDone = false;
    state.lastFoundName = '';
    state.flash = 0;
  }

  function remaining() {
    return DIFFS_PER_LEVEL - state.found.length;
  }

  /** A click inside a picture, in picture-local coordinates. Returns event flags. */
  function click(x, y) {
    if (state.levelDone || state.won) return 0;
    const diffs = DIFFS[state.level];
    for (let index = 0; index < diffs.length; index += 1) {
      const diff = diffs[index];
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) {
        if (state.found.includes(index)) return 0; // already circled: no penalty
        state.found.push(index);
        state.lastFoundName = diff.name;
        state.flash = 0.6;
        if (state.hint === index) state.hint = null;
        if (state.found.length === DIFFS_PER_LEVEL) {
          state.levelDone = true;
          state.totalMs += Math.round(state.elapsed * 1000);
          if (state.level === LEVELS - 1) {
            state.won = true;
            return EVENT_FOUND | EVENT_LEVEL | EVENT_OVER;
          }
          return EVENT_FOUND | EVENT_LEVEL;
        }
        return EVENT_FOUND;
      }
    }
    state.mistakes += 1;
    state.wrong.push({ x, y, until: state.elapsed + 0.9 });
    if (state.mistakes >= MAX_MISTAKES) {
      state.mistakes = 0;
      state.wrong = [];
    }
    return EVENT_WRONG;
  }

  /** Reveal one still-hidden difference for a few seconds. */
  function hint() {
    if (state.levelDone || state.won || state.hintsLeft <= 0) return 0;
    const diffs = DIFFS[state.level];
    const hidden = [];
    for (let index = 0; index < diffs.length; index += 1) {
      if (!state.found.includes(index)) hidden.push(index);
    }
    if (hidden.length === 0) return 0;
    state.hint = hidden[Math.floor(hidden.length / 2)];
    state.hintUntil = state.elapsed + 4;
    state.hintsLeft -= 1;
    return EVENT_HINT;
  }

  function step(dt) {
    state.elapsed += dt;
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt);
    if (state.hint !== null && state.elapsed > state.hintUntil) state.hint = null;
    for (let i = state.wrong.length - 1; i >= 0; i -= 1) {
      if (state.elapsed > state.wrong[i].until) state.wrong.splice(i, 1);
    }
    return 0;
  }

  reset();
  return { state, reset, startLevel, click, hint, remaining, step };
}
