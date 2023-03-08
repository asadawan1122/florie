import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../../styles'

interface H5Props {
  style?: TextStyle | undefined
  numberOfLines?: number | undefined
}

const H5: React.FC<H5Props> = props => {
  const { style, numberOfLines } = props
  return <Text numberOfLines={numberOfLines} style={{ ...styles.label, ...style }}>{props.children}</Text>
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  label: {
    color: ColorSet.blackLight,
    ...Fonts.size.small,
    fontFamily: FamilySet.medium,
  },
})

export default H5
