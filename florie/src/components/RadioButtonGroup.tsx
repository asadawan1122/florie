import React from 'react'
import { StyleSheet, Image, ViewStyle, View, TouchableOpacity } from 'react-native'

import { Images } from '../constants/assets/images'
import { ColorSet } from '../styles'
import { H4 } from '.'


interface RadioButtonGroupProps {
  label?: string | undefined
  onPressRadioButton?: () => void | undefined
  style?: ViewStyle
  data?: Array<Type> | undefined
}

interface Type {
  label: string
  isSelected: Boolean
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  style,
  label,
  data,
  onPressRadioButton,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleSelection = index => {
    var selectedId = selectedIndex
    setSelectedIndex(index)
  }

  return data.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.radioButtonContainer}
        onPress={() => handleSelection(index)}>
        <View style={styles.checkBoxContainer}>
          <Image
            style={styles.icon}
            source={
              index === selectedIndex ? Images.radioCheck : Images.radioUncheck
            }
          />
        </View>
        <H4
          style={{
            color:
              index === selectedIndex ? ColorSet.black : ColorSet.greyDarker,
          }}>
          {item.label}
        </H4>
      </TouchableOpacity>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  checkBoxContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginRight: 14,
    marginLeft: 0,
  },
  radioButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
})

export default RadioButtonGroup
