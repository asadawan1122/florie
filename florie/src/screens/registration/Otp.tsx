import React, { useEffect, useState } from 'react'
import { StyleSheet, View,Keyboard } from 'react-native'
import appStyle from '../../assets/styles/appStyle'
import { ColorSet, ResponseCode } from '../../styles'
import { H2, Paragraph, Link, HeaderBackButton, OtpInput, CountDownInput, Loader, ErrorContainer } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { storeDataToStorage } from '../../utils/storage'
import { callApi } from '../../networking/AuthApiService'
import { api } from '../../networking/Environment'
import {Helper} from '../../utils/'

const ForgotOtpVerification: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [email, setEmail] = useState('')
  const [userArray, setUser] = useState('')
  const [otptime, setOtptime] = useState(false)

  useEffect(() => {
    const params = navigation.state.params
    const email = params.email
    const user = params.user
    console.log('user---->', user)
    setEmail(email)
    setUser(user)
  }, [])

  const onCodeFilled = async code => {

    Keyboard.dismiss()
    setIsLoading(true)
    const data = {email:email.toLowerCase(), code:code}
    console.log('paramsss',data)
    const response: any = await callApi(api.activateAccount, data)
    console.log('response',response)
    setIsLoading(false)
    if (response != null) {
      await storeDataToStorage('user', userArray.user)
      // await storeDataToStorage('token', response.data.token)
      setIsLoading(false)
      navigation.navigate('BottomTabNavigation')
    }
  }

  const onPressResend = async () => {
    Keyboard.dismiss()
    setIsLoading(true)
    const data = {email:email.toLowerCase()}
    const response: any = await callApi(api.resendOtp, data)
    setIsLoading(false)
    if (response != null) {
      Helper.showToast(response.message)
    }
    setIsLoading(false)
  }
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <View style={appStyle.header}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.wrapper, appStyle.jcCenter]}>
          <View style={[appStyle.mb30, appStyle.aiCenter]}>
            <H2 style={appStyle.mt20}>
              OTP Verification
            </H2>
            <Paragraph style={styles.desc}>
              We have sent you the otp code to your email address.
            </Paragraph>
            <ErrorContainer
              isVisible={isErrorVisible}
              label={error}
              onClose={() => setIsErrorVisible(false)}
            />
            <ErrorContainer label={'this is a error text'} status={'info'} />
            <View>
              <View style={[appStyle.row, appStyle.aiCenter]}>
                <Paragraph style={styles.desc}>
                  You can resend the code in
                </Paragraph>
                <CountDownInput onFinish={() => setOtptime(true)} until={30} />
              </View>
            </View>
          </View>
          <View>
            <View>
              <OtpInput
                onCodeFilled={
                  (otp) => onCodeFilled(otp)
                }
              />
            </View>
            <Link onPress={onPressResend} linkStyle={{ color: otptime == true && ColorSet.theme }}>
              Resend Code
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Loader
        isLoading={isLoading}
        layout={'outside'}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desc: {
    paddingTop: 5,
    textAlign: 'center',
  },
})

export default ForgotOtpVerification
