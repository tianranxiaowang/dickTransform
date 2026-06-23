const EPSILON = 0.000001;

export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function getPointBounds(points) {
  if (!points.length) {
    return null;
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

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
  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    total += distance(points[index - 1], points[index]);
  }

  return total;
}

export function resamplePath(points, sampleCount) {
  if (sampleCount <= 0) {
    return [];
  }

  if (!points.length) {
    return [];
  }

  const totalLength = pathLength(points);

  if (points.length === 1 || totalLength <= EPSILON) {
    const point = points[0];
    return Array.from({ length: sampleCount }, () => ({ x: point.x, y: point.y }));
  }

  if (sampleCount === 1) {
    return [{ x: points[0].x, y: points[0].y }];
  }

  const samples = [];
  let segmentStart = points[0];
  let segmentEndIndex = 1;
  let distanceAtSegmentStart = 0;
  let segmentLength = distance(segmentStart, points[segmentEndIndex]);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const targetDistance = (totalLength * sampleIndex) / (sampleCount - 1);

    while (
      segmentEndIndex < points.length - 1 &&
      distanceAtSegmentStart + segmentLength < targetDistance
    ) {
      distanceAtSegmentStart += segmentLength;
      segmentStart = points[segmentEndIndex];
      segmentEndIndex += 1;
      segmentLength = distance(segmentStart, points[segmentEndIndex]);
    }

    if (segmentLength <= EPSILON) {
      samples.push({ x: segmentStart.x, y: segmentStart.y });
      continue;
    }

    const segmentProgress = (targetDistance - distanceAtSegmentStart) / segmentLength;
    const segmentEnd = points[segmentEndIndex];
    samples.push({
      x: segmentStart.x + (segmentEnd.x - segmentStart.x) * segmentProgress,
      y: segmentStart.y + (segmentEnd.y - segmentStart.y) * segmentProgress,
    });
  }

  return samples;
}

export function resampleStrokes(strokes, sampleCount) {
  if (sampleCount <= 0) {
    return [];
  }

  const drawableStrokes = strokes.filter((stroke) => stroke.length > 0);

  if (!drawableStrokes.length) {
    return Array.from({ length: sampleCount }, () => ({ x: 0, y: 0 }));
  }

  if (drawableStrokes.length === 1) {
    return resamplePath(drawableStrokes[0], sampleCount);
  }

  const lengths = drawableStrokes.map(pathLength);
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);

  if (totalLength <= EPSILON) {
    const representativePoints = drawableStrokes.map((stroke) => stroke[0]);
    return Array.from({ length: sampleCount }, (_, index) => {
      const point = representativePoints[index % representativePoints.length];
      return { x: point.x, y: point.y };
    });
  }

  const zeroLengthIndices = [];
  const nonZeroIndices = [];
  lengths.forEach((length, index) => {
    if (length <= EPSILON) {
      zeroLengthIndices.push(index);
    } else {
      nonZeroIndices.push(index);
    }
  });

  const allocations = lengths.map(() => ({ count: 0, remainder: 0 }));
  let allocatedCount = 0;
  let remainingCount = sampleCount;

  for (const index of zeroLengthIndices) {
    if (remainingCount <= 0) {
      break;
    }
    allocations[index].count = 1;
    allocatedCount += 1;
    remainingCount -= 1;
  }

  if (remainingCount > 0) {
    const nonZeroTotalLength = nonZeroIndices.reduce((sum, index) => sum + lengths[index], 0);
    const canGiveEachStrokeSample = remainingCount >= nonZeroIndices.length;

    for (const index of nonZeroIndices) {
      const exact = (lengths[index] / nonZeroTotalLength) * remainingCount;
      const count = canGiveEachStrokeSample ? Math.max(1, Math.floor(exact)) : Math.floor(exact);
      allocations[index].count = count;
      allocations[index].remainder = exact - Math.floor(exact);
      allocatedCount += count;
    }

    while (allocatedCount < sampleCount) {
      let bestIndex = nonZeroIndices[0];
      for (const index of nonZeroIndices) {
        if (allocations[index].remainder > allocations[bestIndex].remainder) {
          bestIndex = index;
        }
      }

      allocations[bestIndex].count += 1;
      allocations[bestIndex].remainder = 0;
      allocatedCount += 1;
    }

    while (allocatedCount > sampleCount) {
      let bestIndex = -1;
      const minimumCount = canGiveEachStrokeSample ? 1 : 0;
      for (const index of nonZeroIndices) {
        if (
          allocations[index].count > minimumCount &&
          (bestIndex === -1 || allocations[index].remainder < allocations[bestIndex].remainder)
        ) {
          bestIndex = index;
        }
      }

      if (bestIndex === -1) {
        break;
      }

      allocations[bestIndex].count -= 1;
      allocatedCount -= 1;
    }
  }

  const samples = drawableStrokes.flatMap((stroke, index) =>
    resamplePath(stroke, allocations[index].count),
  );

  return samples.slice(0, sampleCount);
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
  if (!points.length || !targetBounds || !drawingBounds) {
    return [];
  }

  const requestedSize = Math.max(drawingBounds.width, drawingBounds.height, minFinalSize);
  const maxWidth = Math.max(EPSILON, canvasWidth - margin * 2);
  const maxHeight = Math.max(EPSILON, canvasHeight - margin * 2);
  const targetWidth = Math.max(targetBounds.width, EPSILON);
  const targetHeight = Math.max(targetBounds.height, EPSILON);
  const scale = Math.min(
    requestedSize / Math.max(targetWidth, targetHeight),
    maxWidth / targetWidth,
    maxHeight / targetHeight,
  );
  const fittedWidth = targetWidth * scale;
  const fittedHeight = targetHeight * scale;
  const centerX = clamp(
    drawingBounds.centerX,
    margin + fittedWidth / 2,
    canvasWidth - margin - fittedWidth / 2,
  );
  const centerY = clamp(
    drawingBounds.centerY,
    margin + fittedHeight / 2,
    canvasHeight - margin - fittedHeight / 2,
  );

  return points.map((point) => ({
    ...point,
    x: centerX + (point.x - targetBounds.centerX) * scale,
    y: centerY + (point.y - targetBounds.centerY) * scale,
  }));
}

export function buildMorphPairs({ sourcePoints, targetPoints }) {
  if (!sourcePoints.length || !targetPoints.length) {
    return [];
  }

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
  const clampedValue = clamp(value, 0, 1);

  if (clampedValue < 0.5) {
    return 4 * clampedValue * clampedValue * clampedValue;
  }

  return 1 - Math.pow(-2 * clampedValue + 2, 3) / 2;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
