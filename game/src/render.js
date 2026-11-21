// Drawing only: the world's state and the current screen in, pixels out. The 1280x720
// playfield is scaled to fit the window and centred, the margin filled with the backdrop
// colour. Both pictures are drawn from the same scene code, markers circle what the player
// has found, and the counter up top always says how many are left.
import { DIFFS_PER_LEVEL, FIELD, FONT, HINTS_PER_LEVEL, MAX_MISTAKES, PALETTE, PANEL } from './config.js';
import { DIFFS, SCENES, drawScene } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'over';

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatMs(ms) {
  return formatTime(ms / 1000);
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  const fonts = new Map();
  function text(value, x, y, size, color, align, baseline) {
    if (!fonts.has(size)) fonts.set(size, `${size}px ${FONT}`);
    context.font = fonts.get(size);
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = baseline ?? 'alphabetic';
    context.fillText(value, x, y);
  }

  function drawPicture(level, variant, x) {
    context.save();
    context.translate(x, PANEL.top);
    context.fillStyle = '#000000';
    context.fillRect(-4, -4, PANEL.width + 8, PANEL.height + 8);
    context.fillStyle = PALETTE.frame;
    context.fillRect(-4, -4, PANEL.width + 8, 4);
    context.fillRect(-4, PANEL.height, PANEL.width + 8, 4);
    drawScene(context, level, variant);
    context.restore();
  }

  function drawMarker(x, y, radius, color, width, pulse) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.arc(x, y, radius + (pulse ?? 0), 0, Math.PI * 2);
    context.stroke();
  }

  function drawMarkers(state) {
    const diffs = DIFFS[state.level];
    const now = state.elapsed;
    for (const index of state.found) {
      const diff = diffs[index];
      for (const panelX of [PANEL.leftX, PANEL.rightX]) {
        drawMarker(panelX + diff.x, PANEL.top + diff.y, 26, PALETTE.good, 5);
        drawMarker(panelX + diff.x, PANEL.top + diff.y, 19, PALETTE.good, 2);
      }
    }
    if (state.hint !== null) {
      const diff = diffs[state.hint];
      const pulse = 4 + 3 * Math.sin(now * 6);
      for (const panelX of [PANEL.leftX, PANEL.rightX]) {
        drawMarker(panelX + diff.x, PANEL.top + diff.y, 26, PALETTE.accent, 4, pulse);
      }
    }
    for (const wrong of state.wrong) {
      const age = state.elapsed - (wrong.until - 0.9);
      const alpha = Math.max(0, 1 - age);
      context.save();
      context.globalAlpha = alpha;
      for (const panelX of [PANEL.leftX, PANEL.rightX]) {
        const cx = panelX + wrong.x;
        const cy = PANEL.top + wrong.y;
        context.strokeStyle = PALETTE.bad;
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(cx - 12, cy - 12);
        context.lineTo(cx + 12, cy + 12);
        context.moveTo(cx + 12, cy - 12);
        context.lineTo(cx - 12, cy + 12);
        context.stroke();
      }
      context.restore();
    }
  }

  function drawHud(state) {
    const found = state.found.length;
    const remaining = DIFFS_PER_LEVEL - found;
    context.fillStyle = PALETTE.hud;
    context.fillRect(0, 0, FIELD.width, 84);
    text('SPOT THE DIFFERENCE', 40, 34, 26, PALETTE.text, 'left');
    text(`${SCENES[state.level].name}  ·  Level ${state.level + 1} of 3`, 40, 64, 17, PALETTE.muted, 'left');
    const counter = remaining === 0 ? 'All found!' : `${found} / ${DIFFS_PER_LEVEL} found  ·  ${remaining} to go`;
    text(counter, FIELD.width / 2, 40, 30, remaining === 0 ? PALETTE.good : PALETTE.accent, 'center');
    text(`Time ${formatTime(state.elapsed)}`, FIELD.width / 2, 66, 17, PALETTE.muted, 'center');
    text(`Hints ${state.hintsLeft}  (H)`, FIELD.width - 40, 34, 20, PALETTE.text, 'right');
    const mistakes = '✕'.repeat(state.mistakes) + '·'.repeat(MAX_MISTAKES - state.mistakes);
    text(`Miss ${mistakes}`, FIELD.width - 40, 64, 17, state.mistakes > 0 ? PALETTE.bad : PALETTE.muted, 'right');
    text('LEFT', PANEL.leftX + PANEL.width / 2, PANEL.top - 10, 15, PALETTE.muted, 'center');
    text('RIGHT', PANEL.rightX + PANEL.width / 2, PANEL.top - 10, 15, PALETTE.muted, 'center');
    context.fillStyle = PALETTE.hud;
    context.fillRect(0, FIELD.height - 52, FIELD.width, 52);
    const tip = state.lastFoundName
      ? `✓ ${state.lastFoundName}`
      : 'Click a difference in either picture — it counts on both sides.';
    text(tip, 40, FIELD.height - 20, 18, state.lastFoundName ? PALETTE.good : PALETTE.muted, 'left');
    text('H hint  ·  R restart  ·  P pause  ·  N next level', FIELD.width - 40, FIELD.height - 20, 16, PALETTE.muted, 'right');
  }

  function drawPanel(title, lines, prompt) {
    const width = 640;
    const height = 150 + lines.length * 34 + 70;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;
    context.fillStyle = 'rgba(10, 12, 18, 0.72)';
    context.fillRect(0, 0, FIELD.width, FIELD.height);
    context.fillStyle = PALETTE.panel;
    context.fillRect(x, y, width, height);
    context.strokeStyle = PALETTE.accent;
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
    text(title, FIELD.width / 2, y + 66, 44, PALETTE.text, 'center');
    for (let index = 0; index < lines.length; index += 1) {
      text(lines[index], FIELD.width / 2, y + 124 + index * 34, 21, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 34, 22, PALETTE.accent, 'center');
  }

  /** Paint one frame: the pictures, the markers, then the HUD or a panel for the screen. */
  function draw(state, screen, bestMs) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawPicture(state.level, 0, PANEL.leftX);
    drawPicture(state.level, 1, PANEL.rightX);
    if (screen !== SCREEN_TITLE) drawMarkers(state);
    drawHud(state);
    if (screen === SCREEN_TITLE) {
      drawPanel('SPOT THE DIFFERENCE', [
        'Two pictures, seven differences. Find them all.',
        `${SCENES[0].name}  ·  ${SCENES[1].name}  ·  ${SCENES[2].name}`,
        bestMs > 0 ? `Best total time: ${formatMs(bestMs)}` : 'Three levels. No rush — but the clock is ticking.',
      ], 'Press Space or click to start');
    } else if (screen === SCREEN_PAUSED) {
      drawPanel('Paused', ['The pictures will wait for you.'], 'Press P to resume');
    } else if (screen === SCREEN_LEVEL) {
      const next = state.level + 1 < 3 ? SCENES[state.level + 1].name : '';
      drawPanel('Level complete!', [
        `${SCENES[state.level].name} — all 7 differences found.`,
        state.level + 1 < 3 ? `Next up: ${next}.` : '',
      ], state.level + 1 < 3 ? 'Press N or click for the next level' : 'Press Space for your result');
    } else if (screen === SCREEN_OVER) {
      drawPanel('You found them all!', [
        `All 21 differences across 3 levels in ${formatMs(state.totalMs)}.`,
        bestMs > 0 ? `Best total time: ${formatMs(bestMs)}` : '',
        'Every picture was drawn just for this game.',
      ], 'Press Space or click to play again');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return {
    draw,
    /** Convert a client (mouse) position to field coordinates. */
    toField(clientX, clientY) {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) * ratio - view.x) / view.scale,
        y: ((clientY - rect.top) * ratio - view.y) / view.scale,
      };
    },
  };
}
