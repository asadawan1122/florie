import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'

import { ColorSet, Fonts } from '../styles'

import OTPInputView from '@twotalltotems/react-native-otp-input'

const screenSize = Dimensions.get('window')

const otpContainerWidth = screenSize.width * 0.8

interface OtpInputProps {
  code?: string | undefined
  onCodeChanged?: (code: string) => void
  onCodeFilled?: (code: string) => void
}

const OtpInput: React.FC<OtpInputProps> = props => {
  const { code, onCodeChanged, onCodeFilled } = props

  return (
    <View style={styles.container}>
      <OTPInputView
        style={styles.otpContainer}
        pinCount={6}
        code={code}
        autoFocusOnLoad
        codeInputFieldStyle={styles.otp}
        codeInputHighlightStyle={styles.otpHighlighted}
        onCodeChanged={onCodeChanged}
        onCodeFilled={onCodeFilled}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  otpContainer: {
    width: otpContainerWidth,
    alignSelf: 'center',
    height: 50,
  },
  otp: {
    width: otpContainerWidth / 5.5 - 10,
    height: otpContainerWidth / 5.5 - 10,
    marginHorizontal: 2,
    borderRadius: 7,
    color: ColorSet.black,
    ...Fonts.size.medium,
    borderWidth: 0.5,
    borderColor: ColorSet.greyDark,
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 3,
    backgroundColor: ColorSet.greyLight,
  },
  otpHighlighted: {
    borderColor: ColorSet.theme,
    backgroundColor: ColorSet.blueLight,
  },
})

export default OtpInput
