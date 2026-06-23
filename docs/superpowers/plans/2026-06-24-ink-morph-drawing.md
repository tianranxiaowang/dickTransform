# Ink Morph Drawing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free single-page web app where a player's black canvas drawing morphs into a scaled and centered target outline.

**Architecture:** The app uses static HTML, CSS, and browser Canvas 2D. Pure geometry and morphing functions live in small ES modules with Node tests; browser-specific pointer input and rendering live in `src/main.js`.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Canvas 2D API, Node built-in test runner.

---

## File Structure

- `package.json`: Defines ES module mode and verification scripts.
- `index.html`: Hosts the app shell, canvas, status text, and two controls.
- `src/styles.css`: Responsive layout and canvas/control styling.
- `src/inkMorph.js`: Pure geometry, resampling, fitting, easing, and morph pairing helpers.
- `src/targetShape.js`: Normalized target outline paths and target sampling helpers.
- `src/main.js`: Browser entry point for pointer drawing, canvas rendering, animation, and UI state.
- `tests/static-assets.test.mjs`: Verifies the static shell references the required assets and controls.
- `tests/inkMorph.test.mjs`: Verifies pure geometry and morphing behavior.
- `tests/targetShape.test.mjs`: Verifies target path coverage and sampling.

## Task 1: Static App Shell

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/styles.css`
- Create: `tests/static-assets.test.mjs`

- [ ] **Step 1: Write the failing static asset test**

Create `tests/static-assets.test.mjs`:

```js
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

test('index.html wires the drawing app shell', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<canvas[^>]+id="drawingCanvas"/);
  assert.match(html, /id="finishButton"/);
  assert.match(html, /id="resetButton"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /href="\.\/src\/styles\.css"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/static-assets.test.mjs
```

Expected: FAIL with `ENOENT` because `index.html` does not exist yet.

- [ ] **Step 3: Add the static shell**

Create `package.json`:

```json
{
  "name": "ink-morph-drawing",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check": "node --check src/inkMorph.js && node --check src/targetShape.js && node --check src/main.js && node --test",
    "test": "node --test",
    "serve": "python3 -m http.server 4173"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>画完它就变形</title>
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <main class="app" aria-label="画布变形小游戏">
      <section class="stage" aria-label="绘画区域">
        <canvas id="drawingCanvas" aria-label="白色绘画画布"></canvas>
      </section>

      <section class="controls" aria-label="画布控制">
        <p id="statusText" class="status" aria-live="polite">随便画点什么。</p>
        <div class="buttonRow">
          <button id="finishButton" class="primaryButton" type="button" disabled>画完了</button>
          <button id="resetButton" class="secondaryButton" type="button">重画</button>
        </div>
      </section>
    </main>

    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

Create `src/styles.css`:

```css
:root {
  color: #151515;
  background: #ecebe4;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html,
body {
  min-width: 320px;
  min-height: 100%;
  margin: 0;
}

body {
  min-height: 100vh;
}

button {
  font: inherit;
}

.app {
  display: grid;
  grid-template-rows: minmax(360px, 1fr) auto;
  min-height: 100vh;
  padding: 18px;
  gap: 14px;
}

.stage {
  min-height: 0;
  border: 2px solid #151515;
  background: #ffffff;
  overflow: hidden;
}

#drawingCanvas {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 360px;
  background: #ffffff;
  cursor: crosshair;
  touch-action: none;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.status {
  min-width: 0;
  margin: 0;
  color: #282828;
  font-size: 15px;
  line-height: 1.4;
}

.buttonRow {
  display: flex;
  flex: 0 0 auto;
  gap: 10px;
}

.primaryButton,
.secondaryButton {
  min-width: 92px;
  min-height: 42px;
  border: 2px solid #151515;
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
}

.primaryButton {
  color: #ffffff;
  background: #d43f2f;
}

.secondaryButton {
  color: #151515;
  background: #ffffff;
}

.primaryButton:disabled {
  color: #777777;
  background: #d7d5ce;
  cursor: not-allowed;
}

.primaryButton:not(:disabled):hover,
.secondaryButton:hover {
  transform: translateY(-1px);
}

@media (max-width: 620px) {
  .app {
    grid-template-rows: minmax(420px, 1fr) auto;
    padding: 10px;
  }

  .controls {
    align-items: stretch;
    flex-direction: column;
  }

  .buttonRow {
    width: 100%;
  }

  .primaryButton,
  .secondaryButton {
    flex: 1 1 0;
  }
}
```

Create a temporary `src/main.js` so the module reference is valid:

```js
const canvas = document.querySelector('#drawingCanvas');
const context = canvas.getContext('2d');

context.fillStyle = '#ffffff';
context.fillRect(0, 0, canvas.width, canvas.height);
```

- [ ] **Step 4: Run the static test**

Run:

```bash
node --test tests/static-assets.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json index.html src/styles.css src/main.js tests/static-assets.test.mjs
git commit -m "feat: add static drawing app shell"
```

## Task 2: Morph Geometry Helpers

**Files:**
- Create: `src/inkMorph.js`
- Create: `tests/inkMorph.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing geometry tests**

Create `tests/inkMorph.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMorphPairs,
  easeInOutCubic,
  fitPointsToDrawingBounds,
  getPointBounds,
  resamplePath,
  resampleStrokes,
} from '../src/inkMorph.js';

test('getPointBounds returns null for empty input', () => {
  assert.equal(getPointBounds([]), null);
});

test('getPointBounds calculates a rectangle around points', () => {
  assert.deepEqual(
    getPointBounds([
      { x: 10, y: 30 },
      { x: 30, y: 5 },
      { x: 20, y: 40 },
    ]),
    {
      minX: 10,
      minY: 5,
      maxX: 30,
      maxY: 40,
      width: 20,
      height: 35,
      centerX: 20,
      centerY: 22.5,
    },
  );
});

test('resamplePath returns evenly distributed points', () => {
  const samples = resamplePath(
    [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    3,
  );

  assert.deepEqual(samples, [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 10, y: 0 },
  ]);
});

test('resampleStrokes preserves requested sample count', () => {
  const samples = resampleStrokes(
    [
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ],
      [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
      ],
    ],
    8,
  );

  assert.equal(samples.length, 8);
  assert.deepEqual(samples[0], { x: 0, y: 0 });
  assert.deepEqual(samples.at(-1), { x: 20, y: 10 });
});

test('fitPointsToDrawingBounds scales and centers target points', () => {
  const fitted = fitPointsToDrawingBounds({
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ],
    targetBounds: {
      minX: 0,
      minY: 0,
      maxX: 100,
      maxY: 100,
      width: 100,
      height: 100,
      centerX: 50,
      centerY: 50,
    },
    drawingBounds: {
      minX: 100,
      minY: 200,
      maxX: 300,
      maxY: 400,
      width: 200,
      height: 200,
      centerX: 200,
      centerY: 300,
    },
    canvasWidth: 600,
    canvasHeight: 600,
    minFinalSize: 120,
    margin: 20,
  });

  assert.deepEqual(fitted, [
    { x: 100, y: 200 },
    { x: 300, y: 400 },
  ]);
});

test('buildMorphPairs creates one pair per source point', () => {
  const pairs = buildMorphPairs({
    sourcePoints: [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ],
    targetPoints: [
      { x: 20, y: 20, pathId: 'a', sequence: 0 },
      { x: 30, y: 30, pathId: 'a', sequence: 1 },
    ],
  });

  assert.equal(pairs.length, 2);
  assert.deepEqual(pairs[1], {
    start: { x: 10, y: 10 },
    end: { x: 30, y: 30 },
    pathId: 'a',
    sequence: 1,
  });
});

test('easeInOutCubic clamps and eases values', () => {
  assert.equal(easeInOutCubic(-1), 0);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(easeInOutCubic(2), 1);
  assert.equal(easeInOutCubic(0.5), 0.5);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
node --test tests/inkMorph.test.mjs
```

Expected: FAIL with a module-not-found error for `src/inkMorph.js`.

- [ ] **Step 3: Implement the geometry module**

Create `src/inkMorph.js`:

```js
const EPSILON = 0.000001;

export function getPointBounds(points) {
  if (!points.length) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

export function pathLength(points) {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    length += distance(points[index - 1], points[index]);
  }

  return length;
}

export function resamplePath(points, sampleCount) {
  if (sampleCount <= 0) {
    return [];
  }

  if (!points.length) {
    return [];
  }

  if (points.length === 1 || sampleCount === 1) {
    return Array.from({ length: sampleCount }, () => ({ ...points[0] }));
  }

  const totalLength = pathLength(points);

  if (totalLength < EPSILON) {
    return Array.from({ length: sampleCount }, () => ({ ...points[0] }));
  }

  const samples = [];
  const interval = totalLength / Math.max(1, sampleCount - 1);
  let segmentIndex = 1;
  let distanceBeforeSegment = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const targetDistance = sampleIndex === sampleCount - 1 ? totalLength : sampleIndex * interval;

    while (
      segmentIndex < points.length - 1 &&
      distanceBeforeSegment + distance(points[segmentIndex - 1], points[segmentIndex]) < targetDistance
    ) {
      distanceBeforeSegment += distance(points[segmentIndex - 1], points[segmentIndex]);
      segmentIndex += 1;
    }

    const start = points[segmentIndex - 1];
    const end = points[segmentIndex];
    const segmentLength = Math.max(EPSILON, distance(start, end));
    const localT = (targetDistance - distanceBeforeSegment) / segmentLength;

    samples.push({
      x: lerp(start.x, end.x, localT),
      y: lerp(start.y, end.y, localT),
    });
  }

  return samples;
}

export function resampleStrokes(strokes, sampleCount) {
  const drawableStrokes = strokes.filter((stroke) => stroke.length > 0);

  if (!drawableStrokes.length || sampleCount <= 0) {
    return [];
  }

  const lengths = drawableStrokes.map((stroke) => Math.max(EPSILON, pathLength(stroke)));
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  const allocations = allocateSamples(lengths, totalLength, sampleCount);
  const samples = [];

  drawableStrokes.forEach((stroke, index) => {
    samples.push(...resamplePath(stroke, allocations[index]));
  });

  return normalizeSampleCount(samples, sampleCount);
}

export function fitPointsToDrawingBounds({
  points,
  targetBounds,
  drawingBounds,
  canvasWidth,
  canvasHeight,
  minFinalSize,
  margin,
}) {
  const safeCanvasWidth = Math.max(1, canvasWidth - margin * 2);
  const safeCanvasHeight = Math.max(1, canvasHeight - margin * 2);
  const requestedSize = Math.max(drawingBounds.width, drawingBounds.height, minFinalSize);
  const finalSize = Math.min(requestedSize, safeCanvasWidth, safeCanvasHeight);
  const scale = finalSize / Math.max(targetBounds.width, targetBounds.height, EPSILON);
  const halfWidth = (targetBounds.width * scale) / 2;
  const halfHeight = (targetBounds.height * scale) / 2;
  const centerX = clamp(drawingBounds.centerX, margin + halfWidth, canvasWidth - margin - halfWidth);
  const centerY = clamp(drawingBounds.centerY, margin + halfHeight, canvasHeight - margin - halfHeight);

  return points.map((point) => ({
    ...point,
    x: centerX + (point.x - targetBounds.centerX) * scale,
    y: centerY + (point.y - targetBounds.centerY) * scale,
  }));
}

export function buildMorphPairs({ sourcePoints, targetPoints }) {
  return sourcePoints.map((sourcePoint, index) => {
    const targetPoint = targetPoints[index % targetPoints.length];

    return {
      start: { x: sourcePoint.x, y: sourcePoint.y },
      end: { x: targetPoint.x, y: targetPoint.y },
      pathId: targetPoint.pathId,
      sequence: targetPoint.sequence,
    };
  });
}

export function easeInOutCubic(value) {
  const t = clamp(value, 0, 1);

  if (t < 0.5) {
    return 4 * t * t * t;
  }

  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function allocateSamples(lengths, totalLength, sampleCount) {
  const rawAllocations = lengths.map((length) => (length / totalLength) * sampleCount);
  const allocations = rawAllocations.map((value) => Math.max(1, Math.floor(value)));
  let remaining = sampleCount - allocations.reduce((sum, value) => sum + value, 0);

  const rankedFractions = rawAllocations
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  let rankIndex = 0;
  while (remaining > 0) {
    allocations[rankedFractions[rankIndex % rankedFractions.length].index] += 1;
    remaining -= 1;
    rankIndex += 1;
  }

  while (remaining < 0) {
    const largestIndex = allocations.indexOf(Math.max(...allocations));
    if (allocations[largestIndex] > 1) {
      allocations[largestIndex] -= 1;
      remaining += 1;
    } else {
      break;
    }
  }

  return allocations;
}

function normalizeSampleCount(samples, sampleCount) {
  if (samples.length === sampleCount) {
    return samples;
  }

  if (samples.length > sampleCount) {
    return resamplePath(samples, sampleCount);
  }

  const normalized = [...samples];
  while (normalized.length < sampleCount) {
    normalized.push({ ...samples.at(-1) });
  }

  return normalized;
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
```

- [ ] **Step 4: Run the geometry tests**

Run:

```bash
node --test tests/inkMorph.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run the full check**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json src/inkMorph.js tests/inkMorph.test.mjs
git commit -m "feat: add ink morph geometry helpers"
```

## Task 3: Target Shape Data and Sampling

**Files:**
- Create: `src/targetShape.js`
- Create: `tests/targetShape.test.mjs`

- [ ] **Step 1: Write failing target shape tests**

Create `tests/targetShape.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TARGET_PATHS,
  getTargetBounds,
  sampleTargetPaths,
} from '../src/targetShape.js';

test('target shape contains multiple drawable paths', () => {
  assert.ok(TARGET_PATHS.length >= 5);
  assert.ok(TARGET_PATHS.every((path) => path.id && path.points.length >= 2));
});

test('getTargetBounds covers normalized target coordinates', () => {
  const bounds = getTargetBounds();

  assert.ok(bounds.width > 70);
  assert.ok(bounds.height > 80);
  assert.ok(bounds.centerX > 40);
  assert.ok(bounds.centerY > 40);
});

test('sampleTargetPaths returns ordered points with path ids', () => {
  const samples = sampleTargetPaths(120);

  assert.equal(samples.length, 120);
  assert.ok(samples.every((sample) => typeof sample.pathId === 'string'));
  assert.ok(samples.every((sample) => Number.isInteger(sample.sequence)));
});
```

- [ ] **Step 2: Run the target tests to verify they fail**

Run:

```bash
node --test tests/targetShape.test.mjs
```

Expected: FAIL with a module-not-found error for `src/targetShape.js`.

- [ ] **Step 3: Implement target shape data**

Create `src/targetShape.js`:

```js
import { getPointBounds, pathLength, resamplePath } from './inkMorph.js';

export const TARGET_PATHS = [
  {
    id: 'main-outline',
    points: [
      { x: 38, y: 82 },
      { x: 38, y: 55 },
      { x: 41, y: 43 },
      { x: 45, y: 30 },
      { x: 49, y: 23 },
      { x: 56, y: 20 },
      { x: 66, y: 18 },
      { x: 74, y: 19 },
      { x: 80, y: 24 },
      { x: 84, y: 33 },
      { x: 88, y: 46 },
      { x: 92, y: 62 },
      { x: 95, y: 80 },
      { x: 95, y: 96 },
    ],
  },
  {
    id: 'left-base',
    points: [
      { x: 38, y: 84 },
      { x: 29, y: 83 },
      { x: 20, y: 87 },
      { x: 14, y: 95 },
      { x: 9, y: 105 },
      { x: 7, y: 116 },
      { x: 10, y: 126 },
      { x: 18, y: 134 },
      { x: 31, y: 138 },
      { x: 44, y: 139 },
      { x: 55, y: 135 },
      { x: 62, y: 126 },
      { x: 63, y: 113 },
      { x: 60, y: 101 },
      { x: 53, y: 92 },
      { x: 43, y: 86 },
    ],
  },
  {
    id: 'right-base',
    points: [
      { x: 94, y: 96 },
      { x: 103, y: 94 },
      { x: 115, y: 96 },
      { x: 126, y: 102 },
      { x: 132, y: 111 },
      { x: 132, y: 121 },
      { x: 126, y: 131 },
      { x: 116, y: 140 },
      { x: 103, y: 143 },
      { x: 89, y: 143 },
      { x: 78, y: 140 },
      { x: 68, y: 133 },
      { x: 61, y: 123 },
      { x: 58, y: 114 },
      { x: 61, y: 108 },
      { x: 72, y: 101 },
      { x: 84, y: 97 },
      { x: 94, y: 96 },
    ],
  },
  {
    id: 'inner-curve',
    points: [
      { x: 42, y: 53 },
      { x: 50, y: 54 },
      { x: 62, y: 59 },
      { x: 73, y: 65 },
      { x: 83, y: 71 },
      { x: 94, y: 72 },
      { x: 101, y: 71 },
    ],
  },
  {
    id: 'top-mark',
    points: [
      { x: 70, y: 25 },
      { x: 69.5, y: 29 },
      { x: 69.7, y: 34 },
      { x: 70.5, y: 35 },
      { x: 71, y: 28 },
    ],
  },
  {
    id: 'left-join',
    points: [
      { x: 44, y: 86 },
      { x: 49, y: 86 },
      { x: 54, y: 88 },
    ],
  },
];

export function getTargetBounds(paths = TARGET_PATHS) {
  return getPointBounds(paths.flatMap((path) => path.points));
}

export function sampleTargetPaths(totalSamples) {
  const drawablePaths = TARGET_PATHS.filter((path) => path.points.length > 1);
  const lengths = drawablePaths.map((path) => Math.max(0.000001, pathLength(path.points)));
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  const allocations = allocateTargetSamples(lengths, totalLength, totalSamples);
  const samples = [];

  drawablePaths.forEach((path, pathIndex) => {
    const pathSamples = resamplePath(path.points, allocations[pathIndex]);

    pathSamples.forEach((point) => {
      samples.push({
        ...point,
        pathId: path.id,
        sequence: samples.length,
      });
    });
  });

  return normalizeTargetSamples(samples, totalSamples);
}

function allocateTargetSamples(lengths, totalLength, totalSamples) {
  const rawAllocations = lengths.map((length) => (length / totalLength) * totalSamples);
  const allocations = rawAllocations.map((value) => Math.max(2, Math.floor(value)));
  let remaining = totalSamples - allocations.reduce((sum, value) => sum + value, 0);
  const rankedFractions = rawAllocations
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  let rankIndex = 0;
  while (remaining > 0) {
    allocations[rankedFractions[rankIndex % rankedFractions.length].index] += 1;
    remaining -= 1;
    rankIndex += 1;
  }

  while (remaining < 0) {
    const largestIndex = allocations.indexOf(Math.max(...allocations));
    if (allocations[largestIndex] > 2) {
      allocations[largestIndex] -= 1;
      remaining += 1;
    } else {
      break;
    }
  }

  return allocations;
}

function normalizeTargetSamples(samples, totalSamples) {
  if (samples.length === totalSamples) {
    return samples;
  }

  if (samples.length > totalSamples) {
    return samples.slice(0, totalSamples);
  }

  const normalized = [...samples];
  while (normalized.length < totalSamples) {
    const lastSample = normalized.at(-1);
    normalized.push({
      ...lastSample,
      sequence: normalized.length,
    });
  }

  return normalized;
}
```

- [ ] **Step 4: Run target shape tests**

Run:

```bash
node --test tests/targetShape.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run the full check**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/targetShape.js tests/targetShape.test.mjs
git commit -m "feat: add target outline sampling"
```

## Task 4: Canvas Drawing Runtime

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Replace the temporary browser entry with drawing runtime**

Update `src/main.js`:

```js
const canvas = document.querySelector('#drawingCanvas');
const statusText = document.querySelector('#statusText');
const finishButton = document.querySelector('#finishButton');
const resetButton = document.querySelector('#resetButton');
const context = canvas.getContext('2d');

const state = {
  mode: 'idle',
  strokes: [],
  activeStroke: null,
  activePointerId: null,
  animationFrame: null,
};

const ink = {
  strokeStyle: '#111111',
  lineWidth: 5,
};

resizeCanvas();
drawScene();

canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('pointermove', handlePointerMove);
canvas.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointercancel', handlePointerUp);
window.addEventListener('resize', handleResize);
finishButton.addEventListener('click', () => {
  statusText.textContent = '变形功能马上接上。';
});
resetButton.addEventListener('click', resetDrawing);

function handlePointerDown(event) {
  if (state.mode === 'morphing') {
    return;
  }

  event.preventDefault();
  const point = getCanvasPoint(event);
  state.mode = 'drawing';
  state.activePointerId = event.pointerId;
  state.activeStroke = [point];
  state.strokes.push(state.activeStroke);
  canvas.setPointerCapture(event.pointerId);
  finishButton.disabled = false;
  statusText.textContent = '画好了就点完成。';
  drawScene();
}

function handlePointerMove(event) {
  if (event.pointerId !== state.activePointerId || !state.activeStroke) {
    return;
  }

  event.preventDefault();
  const point = getCanvasPoint(event);
  const previousPoint = state.activeStroke.at(-1);

  if (!previousPoint || Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) >= 2) {
    state.activeStroke.push(point);
    drawScene();
  }
}

function handlePointerUp(event) {
  if (event.pointerId !== state.activePointerId) {
    return;
  }

  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }

  state.activeStroke = null;
  state.activePointerId = null;
  state.mode = state.strokes.length ? 'idle' : 'empty';
}

function resetDrawing() {
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }

  state.mode = 'idle';
  state.strokes = [];
  state.activeStroke = null;
  state.activePointerId = null;
  state.animationFrame = null;
  finishButton.disabled = true;
  statusText.textContent = '随便画点什么。';
  drawScene();
}

function handleResize() {
  resizeCanvas();
  drawScene();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawScene() {
  clearCanvas();
  drawStrokes(state.strokes);
}

function clearCanvas() {
  context.save();
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.restore();
}

function drawStrokes(strokes) {
  context.save();
  context.strokeStyle = ink.strokeStyle;
  context.fillStyle = ink.strokeStyle;
  context.lineWidth = ink.lineWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  for (const stroke of strokes) {
    if (stroke.length === 1) {
      context.beginPath();
      context.arc(stroke[0].x, stroke[0].y, ink.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
      continue;
    }

    context.beginPath();
    context.moveTo(stroke[0].x, stroke[0].y);

    for (let index = 1; index < stroke.length; index += 1) {
      context.lineTo(stroke[index].x, stroke[index].y);
    }

    context.stroke();
  }

  context.restore();
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
```

- [ ] **Step 2: Run syntax and test checks**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 3: Manually verify drawing**

Run:

```bash
npm run serve
```

Open `http://localhost:4173`, draw on the canvas, and verify:

- The page is white canvas plus two controls.
- The black brush follows pointer movement.
- `画完了` is disabled before drawing and enabled after drawing.
- `重画` clears the drawing.

- [ ] **Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: add canvas drawing runtime"
```

## Task 5: Ink Absorption Morph Animation

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Add imports and morph constants**

At the top of `src/main.js`, add:

```js
import {
  buildMorphPairs,
  easeInOutCubic,
  fitPointsToDrawingBounds,
  getPointBounds,
  resampleStrokes,
} from './inkMorph.js';
import { getTargetBounds, sampleTargetPaths } from './targetShape.js';
```

Below the `ink` constant, add:

```js
const morph = {
  sampleCount: 900,
  durationMs: 1900,
  minFinalSize: 190,
  margin: 28,
  pairs: [],
};
```

- [ ] **Step 2: Replace the temporary finish click handler**

Replace:

```js
finishButton.addEventListener('click', () => {
  statusText.textContent = '变形功能马上接上。';
});
```

With:

```js
finishButton.addEventListener('click', startMorph);
```

- [ ] **Step 3: Add morph preparation and animation functions**

Add these functions before `getCanvasPoint`:

```js
function startMorph() {
  if (state.mode === 'morphing') {
    return;
  }

  const sourcePoints = resampleStrokes(state.strokes, morph.sampleCount);
  const drawingBounds = getPointBounds(state.strokes.flat());

  if (!sourcePoints.length || !drawingBounds) {
    statusText.textContent = '先画一点东西。';
    return;
  }

  const targetSamples = sampleTargetPaths(morph.sampleCount);
  const fittedTargetPoints = fitPointsToDrawingBounds({
    points: targetSamples,
    targetBounds: getTargetBounds(),
    drawingBounds,
    canvasWidth: canvas.clientWidth,
    canvasHeight: canvas.clientHeight,
    minFinalSize: morph.minFinalSize,
    margin: morph.margin,
  });

  morph.pairs = buildMorphPairs({
    sourcePoints,
    targetPoints: fittedTargetPoints,
  });

  state.mode = 'morphing';
  state.activeStroke = null;
  state.activePointerId = null;
  finishButton.disabled = true;
  statusText.textContent = '墨水正在自己找位置。';

  const startedAt = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - startedAt) / morph.durationMs);
    drawMorphFrame(progress);

    if (progress < 1) {
      state.animationFrame = requestAnimationFrame(tick);
      return;
    }

    state.mode = 'complete';
    state.animationFrame = null;
    statusText.textContent = '它已经变好了。';
    drawMorphFrame(1);
  }

  state.animationFrame = requestAnimationFrame(tick);
}

function drawMorphFrame(progress) {
  clearCanvas();

  const eased = easeInOutCubic(progress);
  const currentPoints = morph.pairs.map((pair, index) => {
    const wobble = Math.sin(progress * Math.PI * 2 + index * 0.17) * (1 - eased) * 8;

    return {
      x: pair.start.x + (pair.end.x - pair.start.x) * eased + wobble * 0.18,
      y: pair.start.y + (pair.end.y - pair.start.y) * eased + wobble,
      pathId: pair.pathId,
      sequence: pair.sequence,
    };
  });

  if (progress < 0.88) {
    drawInkParticles(currentPoints, progress);
  } else {
    drawConnectedMorphLines(currentPoints);
  }
}

function drawInkParticles(points, progress) {
  context.save();
  context.fillStyle = ink.strokeStyle;
  context.strokeStyle = ink.strokeStyle;
  context.lineWidth = Math.max(2.5, ink.lineWidth * (0.8 + progress * 0.2));
  context.lineCap = 'round';
  context.lineJoin = 'round';

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const nextPoint = points[index + 1];

    if (nextPoint && nextPoint.pathId === point.pathId && Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y) < 34) {
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
    } else {
      context.beginPath();
      context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
}

function drawConnectedMorphLines(points) {
  const pointsByPath = groupPointsByPath(points);

  context.save();
  context.strokeStyle = ink.strokeStyle;
  context.lineWidth = ink.lineWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  for (const pathPoints of pointsByPath.values()) {
    if (pathPoints.length < 2) {
      continue;
    }

    pathPoints.sort((a, b) => a.sequence - b.sequence);
    context.beginPath();
    context.moveTo(pathPoints[0].x, pathPoints[0].y);

    for (let index = 1; index < pathPoints.length; index += 1) {
      context.lineTo(pathPoints[index].x, pathPoints[index].y);
    }

    context.stroke();
  }

  context.restore();
}

function groupPointsByPath(points) {
  const groups = new Map();

  for (const point of points) {
    if (!groups.has(point.pathId)) {
      groups.set(point.pathId, []);
    }

    groups.get(point.pathId).push(point);
  }

  return groups;
}
```

- [ ] **Step 4: Update reset to clear morph data**

Inside `resetDrawing`, after `state.animationFrame = null;`, add:

```js
morph.pairs = [];
```

- [ ] **Step 5: Run checks**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Manually verify the morph**

Run:

```bash
npm run serve
```

Open `http://localhost:4173`, then verify:

- Clicking `画完了` without drawing shows `先画一点东西。`.
- A normal scribble pulls into the target outline.
- The final outline is scaled around the drawing's original position.
- A very small mark still produces a usable minimum-size target.
- Drawing is ignored during the animation.
- `重画` cancels/clears the state after animation.

- [ ] **Step 7: Commit**

```bash
git add src/main.js
git commit -m "feat: animate ink into target outline"
```

## Task 6: Final Verification and Polish

**Files:**
- Modify: `src/styles.css`
- Modify: `src/main.js` if manual verification shows layout or animation defects.

- [ ] **Step 1: Run full automated checks**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 2: Verify desktop viewport**

Run:

```bash
npm run serve
```

Open `http://localhost:4173` in a browser at about `1280x800`. Verify:

- The canvas is visible without overlapping controls.
- The controls remain below the canvas.
- Text fits inside both buttons.
- The final target shape remains inside the canvas.

- [ ] **Step 3: Verify mobile-width viewport**

Use a browser viewport around `390x844`. Verify:

- The canvas remains usable.
- The two buttons fit on one row.
- Status text does not overlap the buttons.
- The morph target is clamped inside the canvas.

- [ ] **Step 4: Fix any verified polish issue with a scoped edit**

If the canvas height is too short on mobile, update the mobile CSS in `src/styles.css`:

```css
@media (max-width: 620px) {
  .app {
    grid-template-rows: minmax(420px, 1fr) auto;
    padding: 10px;
  }

  .controls {
    align-items: stretch;
    flex-direction: column;
  }

  .buttonRow {
    width: 100%;
  }

  .primaryButton,
  .secondaryButton {
    flex: 1 1 0;
  }
}
```

If the morph appears too dot-like near the end, lower the line phase threshold in `src/main.js`:

```js
if (progress < 0.8) {
  drawInkParticles(currentPoints, progress);
} else {
  drawConnectedMorphLines(currentPoints);
}
```

- [ ] **Step 5: Re-run checks after any polish edit**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit final polish only if files changed**

```bash
git status --short
git add src/styles.css src/main.js
git commit -m "polish: tune drawing page layout"
```

Skip the commit if `git status --short` shows no source changes.

## Self-Review

- Spec coverage: The plan covers the static single-page app, black-on-white drawing, finish/reset controls, player-bounds fitting, point-cloud morphing, edge cases, mouse/touch pointer handling, and verification.
- Placeholder scan: The plan contains no unfinished markers or unspecified implementation steps.
- Type consistency: The planned modules consistently use point objects shaped as `{ x, y }` plus target metadata `{ pathId, sequence }` during morph rendering.
