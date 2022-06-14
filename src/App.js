import React, { useEffect } from 'react';
import { View, ScrollView, Text} from 'react-native'
import * as FruityList from './FruityList'

function FruityListComponent({ data }) {
  const [{low, high}, setLowHigh] = React.useState({ low: 0, high: 0 })

  useEffect(() => {
    if (low === 0 && high === 0 && data.length > 0) {
      setLowHigh({ low: 0, high: 1 })
    }
  }, [low, high])

  /**
   * 
   * @param {*} index 
   * @returns 
   */
  const onCellLayout = (index) => ({ nativeEvent, timeStamp }) => {
    const nextState = FruityList.onCellLayout(index, data, { nativeEvent, timeStamp }, { low, high })
    setLowHigh(nextState)
  }

  /**
   * 
   * @param {*} param0 
   */
  const onContainerLayout = ({ nativeEvent, timeStamp }) => {
    FruityList.onContainerLayout({ nativeEvent, timeStamp })
  }

  /**
   * 
   * @param {*} param0 
   */
  const onContainerScroll = ({ nativeEvent, timeStamp }) => {
    const nextState = FruityList.onContainerScroll(data, { nativeEvent, timeStamp }, { low, high })
    setLowHigh(nextState)
  }

  return (
    <ScrollView onLayout={onContainerLayout} scrollEventThrottle={16} onScroll={onContainerScroll}>
      {data.slice(low, high).map((itemIndex) => (
        <View key={itemIndex} onLayout={onCellLayout(itemIndex)} style={styles.item}>
          <Text>{itemIndex}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function App() {
  const framesPool = Array.from(Array(200).keys())

  return (
    <FruityListComponent data={framesPool} />
  );
}

const styles = {
  item: {
    width: 500,
    height: 100,
    backgroundColor: 'red',
  },
}

export default App;
