export const metrics = {
  frames: new Map(),
  contentOffset: {x: 0, y: 0},
  layout: {width: 0, height: 0},
  heighestFramePosition: 0,
}

/**
 * Add a frame into metrics
 * 
 * @param {Object} frame
 */
export const metricsAddFrame = (frame) => {
  metrics.frames.set(frame.index, {
    height: frame.height,
    width: frame.width,
    timestamp: frame.timestamp,
  })
}

/**
 * Arrange and sort frames in metrics
 * 
 * @param {Number} low
 * @param {Number} high
 */
export const metricsArrangeFrames = (low, high) => {
  const lowIndex = low || 0;
  const highIndex = high + 1 || metrics.frames.size;

  for (let ii = lowIndex; ii < highIndex; ii++) {
    const current = metrics.frames.get(ii);
    const prev = metrics.frames.get(ii - 1);

    /**
     * Update start/end values based on previous items
     */
    if (current) {
      metrics.frames.set(ii, { ...current, start: (prev?.end || 0), end: (prev?.end || 0) + current.height });
    }
  }
}

/**
 * Find metrics that fit in range
 * 
 * @param {Number} startDistance
 * @param {Number} endDistance
 */
export const metricsFindInRangeFrames = (startDistance, endDistance) => {
  let lowIndex = 0;
  let highIndex = 0;

  for (let ii = 0; ii < metrics.frames.size; ii++) {
    const current = metrics.frames.get(ii);
    const next = metrics.frames.get(ii + 1);

    if (current && current.start <= startDistance) {
      lowIndex = ii;
    }

    if (current && current.end <= endDistance) {
      highIndex = ii;

      /**
       * lookup for the next value, if exists, break the loop
       */
      if (next && next.end >= endDistance) {
        highIndex = ii + 1;
        break;
      }
    }
  }

  return { low: lowIndex, high: highIndex }
}
