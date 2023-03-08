import React from 'react'
import { StyleSheet, TextStyle, TouchableOpacity, Image, View, ViewStyle, ImageSourcePropType, ImageStyle } from 'react-native'

import { FamilySet } from '../../styles'
import { H3 } from '..'

interface HomeLinkComponentProps {
  onPress?: (() => void) | undefined
  title?: string | undefined
  iconSource?: ImageSourcePropType | null
  iconStyle?: ImageStyle | undefined
  containerStyle?: ViewStyle | undefined
  textContainerStyle?: ViewStyle | undefined
  textStyle?: TextStyle | undefined
}

const HomeLinkComponent: React.FC<HomeLinkComponentProps> = props => {
  const {
    onPress,
    iconSource,
    title,
    iconStyle,
    containerStyle,
    textContainerStyle,
    textStyle,
  } = props

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container, ...containerStyle }}>
      <Image style={{ ...styles.icon, ...iconStyle }} source={iconSource} />
      <View
        style={{
          ...styles.textContainer,
          ...textContainerStyle,
        }}>
        <H3
          style={{
            ...textStyle,
            ...styles.text,
          }}>
          {title}
        </H3>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  textContainer: {
    borderBottomColor: '#D4D4D4',
    borderBottomWidth: 1.5,
    paddingVertical: 7,
    marginLeft: 20,
    flex: 1,
  },
  icon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  text: {
    fontFamily: FamilySet.medium,
  },
})

export default HomeLinkComponent
