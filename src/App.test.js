import * as FruityListUtils from './FruityListUtils'

const shuffleArray = unshuffled => unshuffled
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)


describe('fruity-utils', () => {
  beforeEach(() => {
    FruityListUtils.metrics.frames = new Map()
  })
  
  test('metrics#metricsArrangeFrames', () => {
    const generateFrameBlank = (index) => ({ index, height: 200, width: 200, timestamp: 1654854625990 })

    /**
     * Sequential, inverted order
     */
    FruityListUtils.metricsAddFrame(generateFrameBlank(2))
    FruityListUtils.metricsAddFrame(generateFrameBlank(1))
    FruityListUtils.metricsAddFrame(generateFrameBlank(0))
    FruityListUtils.metricsArrangeFrames()

    expect(FruityListUtils.metrics.frames.size).toEqual(3)
    FruityListUtils.metrics.frames.forEach((frame, index) => {
      expect(frame.start).toEqual(index * 200)
      expect(frame.end).toEqual(index * 200 + 200)
    })
  })

  test('metrics#metricsFindInRangeFrames', () => {
    const generateFrameBlank = (index) => ({ index, height: 200, width: 200, timestamp: 1654854625990 })

    /**
     * Sequential, inverted order
     */
    for (let ii = 0; ii < 20; ii++) {
      FruityListUtils.metricsAddFrame(generateFrameBlank(ii))
      FruityListUtils.metricsArrangeFrames()
    }

    expect(FruityListUtils.metricsFindInRangeFrames(0, 900)).toMatchObject({ low: 0, high: 4 })
    expect(FruityListUtils.metricsFindInRangeFrames(500, 900)).toMatchObject({ low: 2, high: 4 })
  })


  test('metrics#overall', () => {
    const generateFrameBlank = (index) => ({ index, height: 200, width: 200, timestamp: 1654854625990 })

    const framesPool = shuffleArray(Array.from(Array(20).keys()).map(generateFrameBlank))

    /**
     * Sequential, inverted order
     */
    framesPool.forEach(item => {
      FruityListUtils.metricsAddFrame(generateFrameBlank(item.index))
      FruityListUtils.metricsArrangeFrames()
    })

    expect(FruityListUtils.metricsFindInRangeFrames(0, 900)).toMatchObject({ low: 0, high: 4 })
    expect(FruityListUtils.metricsFindInRangeFrames(500, 900)).toMatchObject({ low: 2, high: 4 })
  })
})
