import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../styles'

import CountDown from 'react-native-countdown-component'

interface CountDownInputProps {
  until?: Number | undefined
  size?: Number | undefined
  onPress?: (() => void) | undefined
  onFinish?: (() => void) | undefined
}

const CountDownInput: React.FC<CountDownInputProps> = props => {
  const { until, onPress, onFinish, size } = props

  return (
    <View style={styles.container}>
      <CountDown
        until={until}
        onFinish={onFinish}
        onPress={onPress}
        size={10}
        timeToShow={['M', 'S']}
        timeLabels={{ m: null, s: null }}
        digitStyle={styles.digitContainer}
        digitTxtStyle={styles.text}
        showSeparator
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  digitContainer: {
    backgroundColor: '#FFF',
    margin: 0,
    padding: 0,
    width: 18,
    height: 15,
  },
  text: {
    color: ColorSet.grey,
    ...Fonts.size.small,
    fontFamily: FamilySet.regular,
  },
})

export default CountDownInput
