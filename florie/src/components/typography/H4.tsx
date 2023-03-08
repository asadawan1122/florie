import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../../styles'

interface H4Props {
  style?: TextStyle | undefined
  numberOfLines?: number | undefined
}

const H4: React.FC<H4Props> = props => {
  const { style, numberOfLines } = props
  return <Text numberOfLines={numberOfLines} style={{ ...styles.label, ...style }}>{props.children}</Text>
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  label: {
    color: ColorSet.black,
    ...Fonts.size.small,
    fontFamily: FamilySet.bold,
  },
})

export default H4
