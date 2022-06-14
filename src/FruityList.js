import * as FruityListUtils from './FruityListUtils'

/**
 * 
 * @param {*} index 
 * @param {*} data 
 * @param {*} param2 
 * @param {*} param3 
 * @returns 
 */
export const onCellLayout = (index, data, { nativeEvent, timeStamp }, { low, high }) => {
  FruityListUtils.metricsAddFrame({
    index,
    height: nativeEvent.layout.height,
    width: nativeEvent.layout.width,
    timestamp: timeStamp,
  })

  FruityListUtils.metricsArrangeFrames(
    Math.max(0, high - 2),
    Math.min(data.length, high + 2),
  )

  const {
    low: visibleLow,
    high: visibleHigh,
  } = FruityListUtils.metricsFindInRangeFrames(0, FruityListUtils.metrics.layout.height)

  return (state) => {
    const visibleRangeFree = FruityListUtils.metrics.frames.get(visibleHigh).end < FruityListUtils.metrics.layout.height
    const overscanRangeFree = (
      data.length >= high &&
      FruityListUtils.metrics.frames.has(high - 1) &&
      FruityListUtils.metrics.frames.get(high - 1).end < FruityListUtils.metrics.layout.height * 5
    )

    if (visibleRangeFree || overscanRangeFree) {
      return ({ low: 0, high: high + 1 })
    } else {
      return state
    }
  }
}

/**
 * 
 * @param {*} param0 
 */
export const onContainerScroll = (data, { nativeEvent, timeStamp }, { low, high }) => {
  FruityListUtils.metrics.contentOffset = {
    x: nativeEvent.contentOffset.x,
    y: nativeEvent.contentOffset.y,
  }

  const { low: visibleLow, high: visibleHigh } = FruityListUtils.metricsFindInRangeFrames(
    FruityListUtils.metrics.contentOffset.y,
    FruityListUtils.metrics.contentOffset.y + FruityListUtils.metrics.layout.height
  )

  return (state) => {
    const overscanRangeFree = (
      data.length >= visibleHigh &&
      visibleHigh + 1 >= high &&
      FruityListUtils.metrics.frames.has(visibleHigh - 1)
    )

    if (overscanRangeFree) {
      return ({ low: 0, high: high + 1 })
    }

    return state
  }
}

/**
 * 
 * @param {*} param0 
 */
export const onContainerLayout = ({ nativeEvent, timeStamp }) => {
  FruityListUtils.metrics.layout = {
    width: nativeEvent.layout.width,
    height: nativeEvent.layout.height,
  }
}

