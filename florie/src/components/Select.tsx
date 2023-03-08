import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'

import { Images } from '../constants/assets/images'
import { ColorSet, Fonts, FamilySet } from '../styles'

interface SelectProps {
  onChangeText?: Function
  onPress?: (() => void) | undefined
  label?: string
}

const Select: React.FC<SelectProps> = props => {
  const { label, onPress } = props
  const [bgColor, setBgColor] = useState(false)

  const onFocus = () => {
    setBgColor(true)
  }
  const onBlur = () => {
    setBgColor(false)
  }

  return (
    <TouchableOpacity
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      style={[
        styles.select,
        {
          backgroundColor: bgColor ? ColorSet.greenLight : ColorSet.greyLight,
        },
      ]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.iconContainer}>
        <Image
          source={Images.dropdownArrow}
          style={[
            styles.icon,
            {
              tintColor: bgColor ? ColorSet.greenMid : ColorSet.grey,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  select: {
    height: 54,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 15,
    position: 'relative',
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 6,
  },
  label: {
    ...Fonts.size.normal,
    fontFamily: FamilySet.medium,
    color: ColorSet.black,
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})

export default Select
