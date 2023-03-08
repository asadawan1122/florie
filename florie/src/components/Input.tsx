import React, { useState } from 'react'
import { StyleSheet, View, KeyboardTypeOptions } from 'react-native'
import { Images } from '../constants/assets/images'
import { ColorSet, Fonts, FamilySet } from '../styles'
import appStyle from '../assets/styles/appStyle'
import { H5 } from '.'

import { TextInput } from 'react-native-paper'

interface InputProps {
  value?: string
  keyboardType?: KeyboardTypeOptions
  onChangeText?: Function
  setValue: Function
  autofocus?: boolean
  editable?: boolean
  required?: boolean
  disabled?: boolean
  label?: string
  errorText?: string
  isSecure?: boolean | undefined
  outlineColor?: string | undefined
}

const Input: React.FC<InputProps> = props => {
  const {
    onChangeText,
    keyboardType,
    setValue,
    autofocus,
    label,
    isSecure,
    value,
    errorText,
    outlineColor,
    required,
    disabled,
    editable
  } = props
  const [bgColor, setBgColor] = useState(false)
  const [showSecureInput, setShowSecureInput] = useState(true)
  const [error, setError] = useState(false)

  const onFocus = () => {
    setBgColor(true)
  }
  const onBlur = () => {
    setBgColor(false)
  }

  const changeHandler = (inputText: string) => {
    if (onChangeText) onChangeText()
    setValue(inputText)
  }

  const showHideInputHandler = () => setShowSecureInput(!showSecureInput)



  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: !disabled && bgColor ? ColorSet.blueLight : disabled ? ColorSet.greyLight
              : ColorSet.greyLight,
          },
        ]}
        label={(label ? label : null) + (required ? '*' : '')}
        value={value}
        mode={'outlined'}
        error={errorText && errorText ? true : false}
        theme={{
          colors: {
            primary: bgColor ? ColorSet.theme
              : ColorSet.greyLighter,
            text: ColorSet.black,
            placeholder: ColorSet.greyDark,
            error: ColorSet.redLight
          },
          roundness: 10,
          fonts: {
            medium: { fontFamily: FamilySet.medium, fontWeight: '600' },
          },

        }}
        onFocus={onFocus}
        onBlur={onBlur}
        outlineColor={ColorSet.greyLighter}
        onChangeText={changeHandler}
        keyboardType={keyboardType ?? 'default'}
        autoFocus={autofocus}
        disabled={disabled}
        editable={editable}
        secureTextEntry={isSecure && showSecureInput}

        right={
          isSecure && isSecure ? (
            <TextInput.Icon
              name={showSecureInput ? Images.hide : Images.show}
              color={showSecureInput ? ColorSet.theme : ColorSet.greyLighter}
              onPress={showHideInputHandler}
            />
          ) : null
        }
      />

      {errorText && errorText ? (
        <View style={appStyle.pt5}>
          <H5 style={styles.errorText}>{errorText}</H5>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  input: {
    borderRadius: 10,
    ...Fonts.size.small,
    fontFamily: FamilySet.medium,
    color: ColorSet.black,
    borderWidth: 0,
    marginTop: 15,
    position: 'relative',
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 4,
    height: 49
  },
  label: {
    color: ColorSet.red,
    ...Fonts.size.small,
    fontFamily: FamilySet.medium,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  errorText: { fontSize: 12, color: ColorSet.redLight },
})

export default Input
