import {
  buildMorphPairs,
  easeInOutCubic,
  fitPointsToDrawingBounds,
  getPointBounds,
  resampleStrokes,
} from './inkMorph.js';
import { getTargetBounds, sampleTargetPaths } from './targetShape.js';

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

const morph = {
  sampleCount: 1600,
  durationMs: 1900,
  minFinalSize: 190,
  margin: 28,
  pairs: [],
};

resizeCanvas();
finishButton.disabled = false;
drawScene();

canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('pointermove', handlePointerMove);
canvas.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointercancel', handlePointerUp);
window.addEventListener('resize', handleResize);
finishButton.addEventListener('click', startMorph);
resetButton.addEventListener('click', resetDrawing);

function handlePointerDown(event) {
  if (!isDrawableMode() || state.activePointerId !== null) {
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
  morph.pairs = [];
  finishButton.disabled = false;
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
  if (state.mode === 'complete' && morph.pairs.length) {
    drawMorphFrame(1);
    return;
  }

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

    if (
      nextPoint &&
      nextPoint.pathId === point.pathId &&
      Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y) < 34
    ) {
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

function isDrawableMode() {
  return state.mode === 'idle' || state.mode === 'drawing' || state.mode === 'empty';
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
