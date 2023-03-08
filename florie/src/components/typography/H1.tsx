import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../../styles'

interface H1Props {
  style?: TextStyle | undefined
}

const H1: React.FC<H1Props> = props => {
  const { style } = props
  return <Text style={{ ...styles.label, ...style }}>{props.children}</Text>
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  label: {
    color: ColorSet.black,
    ...Fonts.size.large,
    fontFamily: FamilySet.bold,
  },
})

export default H1
