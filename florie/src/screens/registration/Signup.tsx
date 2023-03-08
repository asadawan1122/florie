import React, { useEffect, useState, createRef } from 'react'
import { StyleSheet, Image, View, TouchableOpacity,  Keyboard, } from 'react-native'
import appStyle from '../../assets/styles/appStyle'
import { ColorSet, ResponseCode,  Fonts, FamilySet } from '../../styles'
import { emailFormat, passwordFormat } from '../../utils/formatter'
import { Button, Input, Link, H3, H4, BottomSheet, ErrorContainer, Loader, H1 } from '../../components'
import { Images } from '../../constants/assets/images'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { callApi} from '../../networking/AuthApiService'
import { api } from '../../networking/Environment'
import {Helper} from '../../utils/'

const actionSheetRef = createRef()

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState<string>('')
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const firstNameError = firstName.length === 0 ? undefined : firstName.length < 3 ? "Enter name" : undefined
  const lastNameError = lastName.length === 0 ? undefined : lastName.length < 3 ? "Enter name" : undefined
  const emailFormatError = email.length === 0 ? undefined : emailFormat.test(email) ? undefined : "Enter an email address in the format: yourname@example.com"
  const matchingPasswordsError = confirmPassword !== '' ? password === confirmPassword ? undefined : "Your passwords do not match" : undefined
  const passwordFormatError = password !== '' ? passwordFormat.test(password) ? undefined : "Must be at least 8 characters long and contain at least one letter, one number and one special character" : undefined
  const phoneError = phone.length === 0 ? undefined : phone.length < 6 ? "Enter valid phone number" : undefined
  const referralCodeError = referralCode.length === 0 ? undefined : referralCode.length < 3 ? "Enter valid code" : undefined
  const buttonDisabled = password.length < 4 || email.length === 0 || emailFormatError || matchingPasswordsError || passwordFormatError || password === '' || confirmPassword === ''



  const onChangeText = () => {
    setIsErrorVisible(false)
    setError('')

  }

  const onPressRegister = async () => {


    Keyboard.dismiss()
    setIsLoading(true)
    const data = {
      firstname: firstName,
      lastname: lastName,
      email:email.toLowerCase(),
      password,
      phone
    }
    const response: any = await callApi(api.signup, data)
    setIsLoading(false)
    if (response != null) {
      if (response.status == ResponseCode.successWithCondition) {
        actionSheetRef.current?.setModalVisible(true)
      }
      else if(response.status == ResponseCode.success) {
        navigation.navigate('OtpScreen',{email:data.email, user:response.data})
      }
      else{
        Helper.showToast(response.message)
      }
    
    }
  }
  const onPressCloseSheet = () => {
    actionSheetRef.current?.setModalVisible(false)
  }

  const onPressResend = async () => {


    Keyboard.dismiss()
    actionSheetRef.current?.setModalVisible(false)
    setIsLoading(true)
    const data = {email:email.toLowerCase()}
    const response: any = await callApi(api.resendOtp, data)
    console.log('response', response)
    setIsLoading(false)
    if (response != null) {
      navigation.navigate('OtpScreen',{email})
    }
    setIsLoading(false)
  }

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>

      <View style={[appStyle.rowBtw, appStyle.m30]}>
        <View>
          <Image style={styles.image} source={Images.appIcon} />
        </View>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <H1 >Sign in</H1>
          </TouchableOpacity>
          <H1 style={styles.heading}>Sign up</H1>
        </View>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.wrapper]}>

          <View style={appStyle.mt40}>

            <H1 style={{ color: ColorSet.purple }}>
              Create Account
            </H1>

            <ErrorContainer
              isVisible={isErrorVisible}
              label={error}
              onClose={() => setIsErrorVisible(false)}
            />
            <ErrorContainer label={'this is a error text'} status={'info'} />
            <View style={[styles.textContainer]}>
              <Input
                label="First Name"
                value={firstName}
                setValue={setFirstName}
                errorText={firstNameError}
                onChangeText={onChangeText}
              />
              <Input
                label="Last Name"
                value={lastName}
                setValue={setLastName}
                errorText={lastNameError}
                onChangeText={onChangeText}
              />
              <Input
                label="Email"
                value={email}
                keyboardType="email-address"
                setValue={setEmail}
                errorText={emailFormatError}
                onChangeText={onChangeText}
              />
              <Input
                label="Password"
                value={password}
                setValue={setPassword}
                isSecure={true}
                errorText={passwordFormatError}
                onChangeText={onChangeText}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                required
                setValue={setConfirmPassword}
                isSecure={true}
                errorText={matchingPasswordsError}
                onChangeText={onChangeText}
              />

              <Input
                label="Phone Number"
                value={phone}
                keyboardType="phone-pad"
                setValue={setPhone}
                errorText={phoneError}
                onChangeText={onChangeText}
              />

              <Input
                label="Referral code?"
                value={referralCode}
                keyboardType="numeric"
                setValue={setReferralCode}
                errorText={referralCodeError}
                onChangeText={onChangeText}
              />

            </View>

          </View>
          <View style={[appStyle.aiCenter, appStyle.row, appStyle.asFlexEnd, appStyle.mt30]}>
            <H1 style={{ color: ColorSet.purple }}>Sign up</H1>
            <Button
              containerStyle={styles.button}
              disable={buttonDisabled ? true : false}
              icon={Images.arrowForward}
              onPress={onPressRegister}
            >
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={[appStyle.pb20, appStyle.ph20]}>
        <Link
          linkStyle={{ fontFamily: FamilySet.bold }}
          onPress={() => navigation.navigate('Login')}
          // onPress={() => actionSheetRef.current?.setModalVisible(true)}
          label="Already have an account?">
          Sign in
        </Link>
      </View>
      <Loader
        isLoading={isLoading}
        layout={'outside'}
        message={'Verifying your information...'}
      />

      <BottomSheet bottomSheetRef={actionSheetRef}
        bottomCloseBtn={false}
        closeOnTouchBackdrop
      >
        <View>
          <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.asFlexEnd]}>
            <TouchableOpacity
              style={appStyle.iconContainer}
              onPress={onPressCloseSheet}
              hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
              <Image style={appStyle.iconMd} source={Images.cross} />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={onPressCloseSheet}
              style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
            >
              <H4 style={appStyle.menuItemText}>Your account is not verified, verify again? </H4>
            </TouchableOpacity>
            <View style={appStyle.rowBtw}>
              <View style={appStyle.btnSmall}>
                <Button onPress={onPressResend}>Yes</Button>
              </View>
              <View style={appStyle.btnSmall}>
                <Button onPress={onPressCloseSheet} containerStyle={{backgroundColor:ColorSet.red}}>No</Button>
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topView: {
    alignItems: 'center',
    marginTop: '20%',
  },
  image: {
    width: 30,
    height: 75,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    width: 70,
    height: 70,
    marginLeft: 30
    // marginTop:30,

  },
  btnText: {
    color: ColorSet.purple,
    ...Fonts.size.large,
    fontFamily: FamilySet.regular,

  },
  heading: {
    color: ColorSet.purple,
    textDecorationLine: 'underline',
    marginLeft: 20,
  }
})


export default SignUpScreen
