import React, { useState } from 'react'
import {
  StyleSheet,
  View,

  StatusBar,
} from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent barStyle={'dark-content'} />
      <Provider store={store}>
    
        <AppNavigator />
      
      </Provider>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
export default App
