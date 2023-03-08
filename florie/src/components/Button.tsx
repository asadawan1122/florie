import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, Image, ViewStyle, ImageSourcePropType } from 'react-native'
import { ColorSet, Fonts, FamilySet } from '../styles'

interface ButtonProps {
  style?: TextStyle | undefined
  containerStyle?: ViewStyle | undefined
  onPress?: (() => void) | undefined
  icon?: ImageSourcePropType | undefined
  disable?: boolean
}

const Button: React.FC<ButtonProps> = props => {
  const { style, disable, containerStyle, onPress, icon } = props

  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        {
          ...styles.container,
          ...containerStyle

        }, disable ? styles.disabled : null]}
      onPress={onPress}>
      {icon !== undefined && (
        <Image style={{ ...styles.image }} source={icon} />
      )}
      <Text style={{ ...styles.label, ...style }}>{props.children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorSet.purple,
    width: '100%',
    paddingHorizontal: 8,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 6,
    flexDirection: 'row',
  },
  disabled: {
    backgroundColor: ColorSet.greyAccordian,
  },
  image: {
    width: 40,
    // height: 20,
    resizeMode: 'contain',
    // marginRight: 10,
  },
  label: {
    color: ColorSet.white,
    ...Fonts.size.normal,
    fontFamily: FamilySet.medium,
  },
})

export default Button
