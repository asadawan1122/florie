import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../../styles'

interface ParagraphProps {
  style?: TextStyle | undefined
  numberOfLines?: number | undefined

}

const Paragraph: React.FC<ParagraphProps> = props => {
  const { style, numberOfLines } = props
  return (
    <Text numberOfLines={numberOfLines} style={{ ...styles.paragraph, ...style }}>{props.children}</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  paragraph: {
    color: ColorSet.grey,
    ...Fonts.size.small,
    fontFamily: FamilySet.regular,
  },
})

export default Paragraph
