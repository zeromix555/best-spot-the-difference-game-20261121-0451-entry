// The three pictures, drawn entirely in code: no image files, no copied art. Each scene is
// drawn twice — variant 0 (left picture) and variant 1 (right picture) — and the differences
// between the two are listed in DIFFS, in picture-local 560x420 coordinates, with a name the
// game announces when the player finds one.

export const SCENES = [
  { name: 'Sunny Meadow', tagline: 'A quiet garden, a sunny morning.' },
  { name: 'Beach Day', tagline: 'Sand, sea and a very lazy afternoon.' },
  { name: 'Campfire Night', tagline: 'Stars out, fire lit, marshmallows ready.' },
];

export const DIFFS = [
  [
    { x: 200, y: 70, name: 'The bird vanished from the sky' },
    { x: 62, y: 62, name: 'The sun put on sunglasses' },
    { x: 330, y: 378, name: 'A tulip changed colour' },
    { x: 352, y: 112, name: 'The chimney smoke disappeared' },
    { x: 150, y: 282, name: 'The butterfly flew away' },
    { x: 510, y: 267, name: 'A letter fell off the wooden sign' },
    { x: 448, y: 334, name: 'The frog hopped away from the pond' },
  ],
  [
    { x: 122, y: 178, name: 'The sailboat sailed away' },
    { x: 482, y: 382, name: 'The crab scuttled off' },
    { x: 200, y: 332, name: 'The beach ball changed colour' },
    { x: 516, y: 148, name: 'A coconut fell from the palm' },
    { x: 92, y: 382, name: 'The starfish changed colour' },
    { x: 300, y: 258, name: 'A stripe went missing from the umbrella' },
    { x: 428, y: 336, name: 'The little spade disappeared' },
  ],
  [
    { x: 482, y: 152, name: 'The owl flew off its branch' },
    { x: 82, y: 72, name: 'The moon changed its phase' },
    { x: 212, y: 318, name: 'The marshmallow is gone from the stick' },
    { x: 352, y: 202, name: 'The lantern light changed colour' },
    { x: 452, y: 302, name: 'A pine tree vanished' },
    { x: 282, y: 322, name: 'The tent door changed colour' },
    { x: 402, y: 62, name: 'A star blinked out' },
  ],
];

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 44 * s, y, 18 * s, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
  ctx.fillStyle = petal;
  ctx.beginPath();
  ctx.arc(x - 8, y - 4, 7, 0, Math.PI * 2);
  ctx.arc(x + 8, y - 4, 7, 0, Math.PI * 2);
  ctx.arc(x, y - 10, 8, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x, y - 4, 4, '#ffeb3b');
}

function pine(ctx, x, y, s, color) {
  rect(ctx, x - 4 * s, y, 8 * s, 16 * s, '#6d4c41');
  poly(ctx, [[x, y - 52 * s], [x - 24 * s, y - 8 * s], [x + 24 * s, y - 8 * s]], color);
  poly(ctx, [[x, y - 72 * s], [x - 18 * s, y - 34 * s], [x + 18 * s, y - 34 * s]], color);
}

// ---------------------------------------------------------------- level 1: meadow
function drawMeadow(ctx, variant) {
  rect(ctx, 0, 0, 560, 420, '#8ec9ee');
  circle(ctx, 62, 62, 34, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(62 + Math.cos(a) * 42, 62 + Math.sin(a) * 42);
    ctx.lineTo(62 + Math.cos(a) * 52, 62 + Math.sin(a) * 52);
    ctx.stroke();
  }
  circle(ctx, 54, 58, 3, '#7a5c00');
  circle(ctx, 72, 58, 3, '#7a5c00');
  ctx.strokeStyle = '#7a5c00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(63, 68, 9, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  if (variant === 1) {
    rect(ctx, 44, 52, 16, 10, '#222831');
    rect(ctx, 66, 52, 16, 10, '#222831');
    rect(ctx, 60, 55, 7, 3, '#222831');
  }
  cloud(ctx, 300, 52, 1);
  cloud(ctx, 448, 92, 0.8);
  // Bird (difference 1): only in the left picture.
  if (variant === 0) {
    ctx.strokeStyle = '#33475b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(192, 70, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(208, 70, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  ellipse(ctx, 280, 470, 360, 120, '#7ec850');
  ellipse(ctx, 90, 450, 200, 90, '#6db844');
  // Pond with a duck and a lily pad; the frog (difference 7) sits on the pad, left only.
  ellipse(ctx, 480, 345, 70, 26, '#4aa3df');
  ellipse(ctx, 448, 340, 18, 7, '#3f9e57');
  if (variant === 0) {
    circle(ctx, 448, 334, 7, '#57ab5a');
    circle(ctx, 444, 329, 2, '#1b1b1b');
    circle(ctx, 452, 329, 2, '#1b1b1b');
  }
  ellipse(ctx, 505, 342, 14, 9, '#ffffff');
  circle(ctx, 513, 334, 7, '#ffffff');
  circle(ctx, 515, 332, 2, '#1b1b1b');
  poly(ctx, [[519, 334], [525, 332], [519, 337]], '#f39c12');
  // House.
  rect(ctx, 280, 210, 150, 110, '#f7d9a0');
  poly(ctx, [[268, 214], [355, 150], [442, 214]], '#c0392b');
  rect(ctx, 332, 128, 22, 44, '#8d6e63');
  if (variant === 0) {
    circle(ctx, 352, 112, 10, '#e8e8e8');
    circle(ctx, 360, 96, 12, '#e8e8e8');
    circle(ctx, 352, 78, 9, '#e8e8e8');
  }
  rect(ctx, 340, 262, 30, 58, '#7b4b2a');
  circle(ctx, 364, 292, 3, '#ffd93b');
  rect(ctx, 296, 232, 34, 34, '#bfe3f2');
  ctx.strokeStyle = '#7b4b2a';
  ctx.lineWidth = 3;
  ctx.strokeRect(296, 232, 34, 34);
  ctx.beginPath();
  ctx.moveTo(313, 232);
  ctx.lineTo(313, 266);
  ctx.moveTo(296, 249);
  ctx.lineTo(330, 249);
  ctx.stroke();
  rect(ctx, 384, 232, 34, 34, '#bfe3f2');
  ctx.strokeRect(384, 232, 34, 34);
  ctx.beginPath();
  ctx.moveTo(401, 232);
  ctx.lineTo(401, 266);
  ctx.moveTo(384, 249);
  ctx.lineTo(418, 249);
  ctx.stroke();
  // Tree with three apples.
  rect(ctx, 82, 220, 20, 90, '#6d4c41');
  circle(ctx, 92, 190, 44, '#2e9e44');
  circle(ctx, 62, 214, 30, '#37b24d');
  circle(ctx, 124, 214, 30, '#37b24d');
  circle(ctx, 72, 196, 6, '#e63946');
  circle(ctx, 108, 182, 6, '#e63946');
  circle(ctx, 96, 214, 6, '#e63946');
  // Cat sitting by the house.
  ellipse(ctx, 252, 330, 22, 16, '#f39c12');
  circle(ctx, 252, 306, 13, '#f39c12');
  poly(ctx, [[242, 298], [246, 286], [252, 296]], '#f39c12');
  poly(ctx, [[256, 296], [262, 286], [264, 298]], '#f39c12');
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(272, 330, 12, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Butterfly (difference 5): only in the left picture.
  if (variant === 0) {
    ellipse(ctx, 142, 278, 10, 7, '#9b59b6');
    ellipse(ctx, 158, 278, 10, 7, '#9b59b6');
    ellipse(ctx, 144, 290, 8, 6, '#e67e22');
    ellipse(ctx, 156, 290, 8, 6, '#e67e22');
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 276);
    ctx.lineTo(150, 290);
    ctx.stroke();
  }
  // Flowers along the bottom; one tulip (difference 3) is red left, purple right.
  flower(ctx, 40, 372, '#e63946');
  flower(ctx, 90, 380, '#ff8fab');
  flower(ctx, 180, 376, '#ffd93b');
  flower(ctx, 330, 378, variant === 0 ? '#e63946' : '#9b59b6');
  flower(ctx, 520, 384, '#ffd93b');
  // Wooden sign; one letter (difference 6) is missing on the right.
  rect(ctx, 506, 282, 6, 48, '#6d4c41');
  rect(ctx, 478, 252, 64, 30, '#a9713f');
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 2;
  ctx.strokeRect(478, 252, 64, 30);
  ctx.fillStyle = '#fff8e1';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant === 0 ? 'MEADOW' : 'MEDOW', 510, 267);
}

// ---------------------------------------------------------------- level 2: beach
function drawBeach(ctx, variant) {
  rect(ctx, 0, 0, 560, 420, '#7ec8f2');
  circle(ctx, 492, 58, 30, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(492 + Math.cos(a) * 38, 58 + Math.sin(a) * 38);
    ctx.lineTo(492 + Math.cos(a) * 47, 58 + Math.sin(a) * 47);
    ctx.stroke();
  }
  cloud(ctx, 120, 52, 1);
  cloud(ctx, 330, 80, 0.8);
  rect(ctx, 0, 150, 560, 110, '#2f8fd0');
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(60 + i * 110, 178 + (i % 2) * 34, 42, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Sailboat (difference 1): only in the left picture.
  if (variant === 0) {
    poly(ctx, [[122, 178], [122, 128], [152, 178]], '#ffffff');
    poly(ctx, [[126, 178], [126, 142], [104, 178]], '#ffd93b');
    poly(ctx, [[96, 178], [150, 178], [138, 192], [106, 192]], '#c0392b');
    rect(ctx, 120, 122, 3, 56, '#6d4c41');
  }
  rect(ctx, 0, 260, 560, 160, '#f2d492');
  ellipse(ctx, 280, 268, 200, 12, '#e8c87e');
  // Palm tree; one coconut (difference 4) is missing on the right.
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(520, 260);
  ctx.quadraticCurveTo(528, 200, 516, 152);
  ctx.stroke();
  ctx.strokeStyle = '#2e9e44';
  ctx.lineWidth = 9;
  for (const [dx, dy] of [[-34, -6], [-24, -26], [0, -32], [26, -24], [34, -4]]) {
    ctx.beginPath();
    ctx.moveTo(516, 152);
    ctx.quadraticCurveTo(516 + dx, 152 + dy, 516 + dx * 1.5, 152 + dy * 1.4);
    ctx.stroke();
  }
  circle(ctx, 508, 150, 7, '#6d4c41');
  circle(ctx, 524, 152, 7, '#6d4c41');
  if (variant === 0) circle(ctx, 516, 160, 7, '#6d4c41');
  // Umbrella; one stripe (difference 6) is missing on the right.
  rect(ctx, 297, 258, 6, 92, '#8d6e63');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(300, 226);
  ctx.arc(300, 258, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(300, 226);
  ctx.arc(300, 258, 62, Math.PI * 1.25, Math.PI * 1.75);
  ctx.closePath();
  ctx.fill();
  if (variant === 0) {
    ctx.fillStyle = '#ffd93b';
    ctx.beginPath();
    ctx.moveTo(300, 226);
    ctx.arc(300, 258, 62, Math.PI * 1.75, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  circle(ctx, 300, 226, 6, '#ffd93b');
  // Beach ball (difference 3): red stripes left, blue stripes right.
  circle(ctx, 200, 332, 30, '#ffffff');
  ctx.fillStyle = variant === 0 ? '#e63946' : '#2f6fd0';
  ctx.beginPath();
  ctx.moveTo(200, 332);
  ctx.arc(200, 332, 30, -Math.PI / 2, Math.PI / 6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(200, 332);
  ctx.arc(200, 332, 30, Math.PI * 0.55, Math.PI * 1.15);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 200, 332, 6, '#ffd93b');
  // Bucket and spade; the spade (difference 7) is missing on the right.
  poly(ctx, [[408, 322], [444, 322], [438, 356], [414, 356]], '#e63946');
  rect(ctx, 402, 316, 54, 8, '#c0392b');
  if (variant === 0) {
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(452, 322);
    ctx.lineTo(470, 292);
    ctx.stroke();
    poly(ctx, [[470, 292], [478, 280], [486, 294], [478, 302]], '#2f6fd0');
  }
  // Starfish (difference 5): orange left, pink right.
  ctx.fillStyle = variant === 0 ? '#f39c12' : '#ff8fab';
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(92 + Math.cos(a) * 20, 382 + Math.sin(a) * 20);
    ctx.lineTo(92 + Math.cos(a2) * 8, 382 + Math.sin(a2) * 8);
  }
  ctx.closePath();
  ctx.fill();
  // Crab (difference 2): only in the left picture.
  if (variant === 0) {
    ellipse(ctx, 482, 382, 18, 12, '#e63946');
    circle(ctx, 470, 372, 5, '#e63946');
    circle(ctx, 494, 372, 5, '#e63946');
    circle(ctx, 470, 369, 2, '#1b1b1b');
    circle(ctx, 494, 369, 2, '#1b1b1b');
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(482 + s * 14, 386);
      ctx.lineTo(482 + s * 24, 396);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(482 + s * 14, 380);
      ctx.lineTo(482 + s * 24, 380);
      ctx.stroke();
    }
  }
  // Towel and sunglasses on the sand.
  rect(ctx, 330, 372, 90, 26, '#2fb3a3');
  rect(ctx, 342, 378, 14, 14, '#ffffff');
  rect(ctx, 362, 378, 14, 14, '#ffffff');
  rect(ctx, 356, 384, 6, 3, '#222831');
}

// ---------------------------------------------------------------- level 3: night
function drawNight(ctx, variant) {
  rect(ctx, 0, 0, 560, 420, '#141b33');
  // Moon (difference 2): full with craters left, crescent right.
  circle(ctx, 82, 72, 30, '#f4f1de');
  if (variant === 0) {
    circle(ctx, 72, 64, 5, '#d8d2b8');
    circle(ctx, 92, 78, 7, '#d8d2b8');
    circle(ctx, 86, 58, 4, '#d8d2b8');
  } else {
    circle(ctx, 96, 62, 26, '#141b33');
  }
  ctx.fillStyle = '#ffffff';
  const stars = [[180, 50], [260, 90], [330, 44], [402, 62], [470, 40], [520, 96], [140, 130], [230, 40]];
  for (const [x, y] of stars) {
    if (variant === 1 && x === 402 && y === 62) continue; // difference 7: one star blinks out
    circle(ctx, x, y, 3, '#ffffff');
    ctx.fillRect(x - 6, y - 1, 12, 2);
    ctx.fillRect(x - 1, y - 6, 2, 12);
  }
  poly(ctx, [[0, 260], [120, 170], [240, 260]], '#1d2a4a');
  poly(ctx, [[180, 260], [320, 150], [460, 260]], '#24365e');
  poly(ctx, [[380, 260], [500, 180], [560, 260]], '#1d2a4a');
  circle(ctx, 320, 150, 12, '#f4f1de');
  rect(ctx, 0, 260, 560, 160, '#1e3d24');
  ellipse(ctx, 280, 430, 360, 60, '#18301c');
  pine(ctx, 60, 330, 1.1, '#14532d');
  pine(ctx, 140, 340, 0.9, '#14532d');
  if (variant === 0) pine(ctx, 452, 330, 1.2, '#14532d'); // difference 5: pine tree
  pine(ctx, 520, 340, 0.9, '#14532d');
  // Owl on a branch (difference 1): only in the left picture.
  if (variant === 0) {
    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(452, 168);
    ctx.lineTo(512, 168);
    ctx.stroke();
    ellipse(ctx, 482, 152, 16, 20, '#8d6e63');
    circle(ctx, 476, 146, 5, '#ffffff');
    circle(ctx, 488, 146, 5, '#ffffff');
    circle(ctx, 476, 146, 2, '#1b1b1b');
    circle(ctx, 488, 146, 2, '#1b1b1b');
    poly(ctx, [[482, 152], [478, 158], [486, 158]], '#f39c12');
  }
  // Tent; the door (difference 6) is red left, blue right.
  poly(ctx, [[220, 360], [282, 262], [344, 360]], '#e67e22');
  poly(ctx, [[262, 360], [282, 306], [302, 360]], variant === 0 ? '#c0392b' : '#2f6fd0');
  ctx.strokeStyle = '#7b4b2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(282, 262);
  ctx.lineTo(282, 306);
  ctx.stroke();
  // Campfire with a marshmallow stick (difference 3).
  ellipse(ctx, 180, 368, 52, 12, '#5d4037');
  rect(ctx, 152, 358, 56, 8, '#6d4c41');
  rect(ctx, 152, 358, 56, 8, '#8d6e63');
  ctx.fillStyle = '#ff9800';
  ctx.beginPath();
  ctx.moveTo(180, 330);
  ctx.quadraticCurveTo(196, 348, 180, 360);
  ctx.quadraticCurveTo(164, 348, 180, 330);
  ctx.fill();
  ctx.fillStyle = '#ff5722';
  ctx.beginPath();
  ctx.moveTo(180, 342);
  ctx.quadraticCurveTo(190, 352, 180, 360);
  ctx.quadraticCurveTo(170, 352, 180, 342);
  ctx.fill();
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(212, 318);
  ctx.lineTo(238, 292);
  ctx.stroke();
  if (variant === 0) {
    rect(ctx, 232, 282, 14, 12, '#ffffff');
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(232, 282, 14, 12);
  }
  // Lantern (difference 4): warm yellow left, green right.
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(352, 176);
  ctx.lineTo(352, 190);
  ctx.stroke();
  rect(ctx, 342, 190, 20, 26, variant === 0 ? '#ffd93b' : '#58d68d');
  ctx.fillStyle = 'rgba(255, 217, 59, 0.18)';
  if (variant === 0) {
    ctx.beginPath();
    ctx.arc(352, 203, 34, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(88, 214, 141, 0.18)';
    ctx.beginPath();
    ctx.arc(352, 203, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  // Backpack by the tent.
  rect(ctx, 120, 344, 34, 28, '#7b1fa2');
  rect(ctx, 128, 336, 18, 12, '#9c27b0');
}

/** Draw scene `level` (0..2), variant 0 = left picture, 1 = right picture. */
export function drawScene(ctx, level, variant) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 560, 420);
  ctx.clip();
  if (level === 0) drawMeadow(ctx, variant);
  else if (level === 1) drawBeach(ctx, variant);
  else drawNight(ctx, variant);
  ctx.restore();
}
