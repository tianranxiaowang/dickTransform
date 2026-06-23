import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TARGET_PATHS,
  getTargetBounds,
  sampleTargetPaths,
} from '../src/targetShape.js';
import { pathLength } from '../src/inkMorph.js';

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
  assertSequentialSamples(samples);
});

test('sampleTargetPaths returns no points for zero samples', () => {
  assert.deepEqual(sampleTargetPaths(0), []);
});

test('sampleTargetPaths gives a single sample to the longest path', () => {
  const [sample] = sampleTargetPaths(1);

  assert.equal(sample.pathId, getLongestTargetPathId());
  assertSequentialSamples([sample]);
});

test('sampleTargetPaths keeps small sample sequences gapless', () => {
  const samples = sampleTargetPaths(5);

  assert.equal(samples.length, 5);
  assertSequentialSamples(samples);
});

test('sampleTargetPaths does not bias small counts toward first paths', () => {
  const samples = sampleTargetPaths(5);
  const pathIds = samples.map((sample) => sample.pathId);
  const sampledPathIndexes = pathIds.map((pathId) => TARGET_PATHS.findIndex((path) => path.id === pathId));

  assert.ok(sampledPathIndexes.some((index) => index >= 5));
  assert.ok(new Set(pathIds).size > 2);
});

function assertSequentialSamples(samples) {
  samples.forEach((sample, index) => {
    assert.equal(sample.sequence, index);
  });
}

function getLongestTargetPathId() {
  return TARGET_PATHS.reduce((longestPath, path) => {
    if (pathLength(path.points) > pathLength(longestPath.points)) {
      return path;
    }

    return longestPath;
  }).id;
}
