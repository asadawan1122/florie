import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../../styles'

interface H2Props {
  style?: TextStyle | undefined
}

const H2: React.FC<H2Props> = props => {
  const { style } = props
  return <Text style={{ ...styles.label, ...style }}>{props.children}</Text>
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  label: {
    color: ColorSet.black,
    ...Fonts.size.xmedium,
    fontFamily: FamilySet.bold,
  },
})

export default H2
