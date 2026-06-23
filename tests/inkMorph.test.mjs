import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMorphPairs,
  easeInOutCubic,
  fitPointsToDrawingBounds,
  getPointBounds,
  pathLength,
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

test('pathLength sums Euclidean segment lengths', () => {
  assert.equal(
    pathLength([
      { x: 0, y: 0 },
      { x: 3, y: 4 },
      { x: 6, y: 8 },
    ]),
    10,
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

test('resamplePath returns no samples for empty input', () => {
  assert.deepEqual(resamplePath([], 3), []);
});

test('resamplePath repeats one-point paths', () => {
  assert.deepEqual(resamplePath([{ x: 2, y: 3 }], 3), [
    { x: 2, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 3 },
  ]);
});

test('resamplePath repeats zero-length paths', () => {
  assert.deepEqual(
    resamplePath(
      [
        { x: 4, y: 5 },
        { x: 4, y: 5 },
      ],
      2,
    ),
    [
      { x: 4, y: 5 },
      { x: 4, y: 5 },
    ],
  );
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

test('resampleStrokes returns neutral samples when no drawable stroke remains', () => {
  assert.deepEqual(resampleStrokes([[]], 3), [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
});

test('resampleStrokes preserves discrete points for zero-length multi-stroke input', () => {
  const samples = resampleStrokes(
    [
      [{ x: 0, y: 0 }],
      [{ x: 100, y: 0 }],
    ],
    3,
  );
  const originalPositions = new Set(['0,0', '100,0']);

  assert.equal(samples.length, 3);
  for (const sample of samples) {
    assert.ok(originalPositions.has(`${sample.x},${sample.y}`));
  }
});

test('resampleStrokes preserves dot strokes alongside line strokes when samples allow', () => {
  const samples = resampleStrokes(
    [
      [{ x: 0, y: 0 }],
      [
        { x: 10, y: 0 },
        { x: 20, y: 0 },
      ],
    ],
    4,
  );

  assert.equal(samples.length, 4);
  assert.ok(samples.some((sample) => sample.x === 0 && sample.y === 0));
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

test('fitPointsToDrawingBounds preserves target point metadata', () => {
  const fitted = fitPointsToDrawingBounds({
    points: [
      { x: 0, y: 0, pathId: 'path-a', sequence: 0 },
      { x: 50, y: 50, pathId: 'path-a', sequence: 1 },
    ],
    targetBounds: {
      minX: 0,
      minY: 0,
      maxX: 50,
      maxY: 50,
      width: 50,
      height: 50,
      centerX: 25,
      centerY: 25,
    },
    drawingBounds: {
      minX: 100,
      minY: 100,
      maxX: 200,
      maxY: 200,
      width: 100,
      height: 100,
      centerX: 150,
      centerY: 150,
    },
    canvasWidth: 500,
    canvasHeight: 500,
    minFinalSize: 80,
    margin: 20,
  });

  assert.deepEqual(fitted, [
    { x: 100, y: 100, pathId: 'path-a', sequence: 0 },
    { x: 200, y: 200, pathId: 'path-a', sequence: 1 },
  ]);
});

test('fitPointsToDrawingBounds clamps fitted points inside canvas margin', () => {
  const margin = 20;
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
      minX: -60,
      minY: -40,
      maxX: 40,
      maxY: 60,
      width: 100,
      height: 100,
      centerX: -10,
      centerY: 10,
    },
    canvasWidth: 200,
    canvasHeight: 200,
    minFinalSize: 120,
    margin,
  });

  for (const point of fitted) {
    assert.ok(point.x >= margin);
    assert.ok(point.y >= margin);
    assert.ok(point.x <= 200 - margin);
    assert.ok(point.y <= 200 - margin);
  }
  assert.deepEqual(fitted, [
    { x: 20, y: 20 },
    { x: 140, y: 140 },
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

test('buildMorphPairs wraps target points for extra source points', () => {
  const pairs = buildMorphPairs({
    sourcePoints: [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ],
    targetPoints: [
      { x: 100, y: 100, pathId: 'a', sequence: 0 },
      { x: 200, y: 200, pathId: 'b', sequence: 1 },
    ],
  });

  assert.equal(pairs.length, 3);
  assert.deepEqual(pairs[2], {
    start: { x: 20, y: 20 },
    end: { x: 100, y: 100 },
    pathId: 'a',
    sequence: 0,
  });
});

test('buildMorphPairs returns empty pairs when target points are empty', () => {
  assert.doesNotThrow(() => {
    assert.deepEqual(
      buildMorphPairs({
        sourcePoints: [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ],
        targetPoints: [],
      }),
      [],
    );
  });
});

test('easeInOutCubic clamps and eases values', () => {
  assert.equal(easeInOutCubic(-1), 0);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(easeInOutCubic(2), 1);
  assert.equal(easeInOutCubic(0.5), 0.5);
});
