import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, ResponseCode } from '../../../styles'
import { H2, Paragraph, Link, HeaderBackButton, OtpInput, CountDownInput, Loader, ErrorContainer } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {  resendOtp } from '../../../networking/AuthApiService'
import { useSelector } from 'react-redux'
import { submitDataWithoutParam } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils'

const TwoFactorOtp: React.FC<{ navigation: any }> = ({ navigation }) => {
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
     const [error, setError] = useState<string>('')
     const [email, setEmail] = useState('')
     const [otptime, setOtptime] = useState(false)
     const { user } = useSelector(state => state.userReducer)

     useEffect(() => {
          const params = navigation.state.params
          const email = params.email
          setEmail(email)

     }, [])

     const onCodeFilled = async code => {

          setIsLoading(true)
          const data = {
               userId: user?._id,
               email: email,
               twoFaCode: code
          }
          console.log('paramss-->', data)
          const response: any = await submitDataWithoutParam(api.verify2FA, data)
          setIsLoading(false)

          if (response != null) {
               Helper.showToast(response.message)
               navigation.pop(2)
          }

     }

     const onPressResend = async () => {

          setIsErrorVisible(false)
          setError('')
          setIsLoading(true)
          const result: any = await resendOtp({ email })
          setIsLoading(false)
          if (result.status == ResponseCode.success) {
               console.log('code resend again')
          }
          else {
               setIsErrorVisible(true)
               setError(result.message)
          }
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

export default TwoFactorOtp
