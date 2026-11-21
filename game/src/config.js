// Every tuning number and colour in one place. The playfield is a fixed 1280x720 logical
// area; the renderer scales it to the window, so no rule below depends on the screen size.
// Two picture panels sit side by side; each picture is drawn in a 560x420 local space.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** One picture panel, in field coordinates. */
export const PANEL = { width: 560, height: 420, top: 118, leftX: 40, rightX: 680 };

export const LEVELS = 3;
export const DIFFS_PER_LEVEL = 7;
export const HINTS_PER_LEVEL = 3;
export const MAX_MISTAKES = 5;

/** Radius, in picture-local pixels, inside which a click counts as hitting a difference. */
export const HIT_RADIUS = 34;

export const PALETTE = {
  backdrop: '#20242e',
  hud: '#2b3040',
  text: '#f2f4f7',
  muted: '#9aa3b2',
  accent: '#ffd166',
  good: '#58d68d',
  bad: '#ef5350',
  panel: '#252b38',
  frame: '#3a4152',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best (fastest) total time is kept between visits (this browser only). */
export const BEST_KEY = 'spot-the-difference.best-ms';
