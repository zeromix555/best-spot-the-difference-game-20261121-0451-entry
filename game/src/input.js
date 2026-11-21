// Keyboard and pointer input. Clicks are queued with their position in field coordinates
// (the caller supplies the client-to-field mapping); one-shot key presses (start, pause,
// hint, restart, next level) are queued as bit flags and taken once by the loop, so a press
// between two frames is never lost and never counted twice.

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_RESTART = 8;
export const ACTION_NEXT = 16;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const RESTART = new Set(['KeyR']);
const NEXT = new Set(['KeyN']);

export function createInput(target, toField) {
  let actions = 0;
  const clicks = [];

  window.addEventListener('keydown', (event) => {
    if (CONFIRM.has(event.code)) {
      if (!event.repeat) actions |= ACTION_CONFIRM;
    } else if (PAUSE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_PAUSE;
    } else if (HINT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_HINT;
    } else if (RESTART.has(event.code)) {
      if (!event.repeat) actions |= ACTION_RESTART;
    } else if (NEXT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_NEXT;
    } else return;
    event.preventDefault();
  });

  target.addEventListener('pointerdown', (event) => {
    const point = toField(event.clientX, event.clientY);
    clicks.push(point);
  });

  return {
    /** The one-shot presses since the last call, as ACTION_* flags. */
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    /** The clicks since the last call, as {x, y} in field coordinates. */
    takeClicks() {
      return clicks.splice(0, clicks.length);
    },
  };
}
