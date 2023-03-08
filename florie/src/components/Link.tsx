import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../styles'

interface LinkProps {
  onPress?: (() => void) | undefined
  align?: string | undefined
  label?: string | undefined
  linkStyle?: TextStyle | undefined
  containerStyle?: ViewStyle | undefined
}

const Link: React.FC<LinkProps> = props => {
  const { onPress, align, label, linkStyle, containerStyle } = props

  return (
    <View
      style={{
        ...styles.container,
        ...containerStyle,
        alignSelf:
          align == 'start'
            ? 'flex-start'
            : align == 'end'
              ? 'flex-end'
              : 'center',
      }}>
      {label !== null && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={onPress} style={styles.link}>
        <Text style={{ ...styles.label, ...linkStyle }}>{props.children}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: ColorSet.blackMid,
    ...Fonts.size.small,
    fontFamily: FamilySet.medium,
  },
  link: {
    marginLeft: 5,
  },
})

export default Link
