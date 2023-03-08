import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Text } from 'react-native'
import appStyle from '../../assets/styles/appStyle'
import { ColorSet, ResponseCode, Fonts, FamilySet, ScreenSize } from '../../styles'
import { Images } from '../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../utils/formatter'
import { H1, H3, Button, Input, Link, ErrorContainer, Loader } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GET_USER_DATA } from '../../redux/Actions'

// import { useDispatch } from 'react-redux'
import SecureStoreHandler from '../../utils/secureStoreHandler'
import { FACE_ID, PASSCODE, setSupportedBiometricType, TOUCH_ID } from '../../utils/biometrics'

import { callApi } from '../../networking/AuthApiService'
import { storeDataToStorage } from '../../utils/storage'
import { api } from '../../networking/Environment'

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const emailFormatError = email.length === 0 ? undefined : emailFormat.test(email) ? undefined : 'Enter an email address in the format: yourname@example.com'
  const passwordFormatError = password !== '' ? passwordFormat.test(password) ? undefined : 'Must be at least 8 characters long and contain at least one letter, one number and one special character' : undefined
  const buttonDisabled = password.length < 4 || email.length === 0 || password === ''

  const [supportedBiometry, setSupportedBiometry] = useState<string | null>(null)
  const [biometryTypeText, setBiometryTypeText] = useState<string>('')
  const [isBiometricsOn, setIsBiometricsOn] = useState<boolean>(false)
  const [hasStoredCredentials, setHasStoredCredentials] = useState<boolean>(false)
  const [supportedBiometryType, setSupportedBiometryType] = useState<string | null>(null)


  const onChangeText = () => {
    if (error.length > 0) {
      setError('')
      setIsErrorVisible(true)
    } else {
      setIsErrorVisible(false)
      setError('')
    }
  }
  useEffect(() => {
    checkBiometricsEnabled()
  }, [])

  const onPressLogin = async (email:string, password:string) => {

    Keyboard.dismiss()
    setIsLoading(true)
    const data = { email:email.toLowerCase(), password }
    const response: any = await callApi(api.login, data)
    if (response != null) {
      await saveBiometricCredentials(email, password)
      await storeDataToStorage('user', response.data.user)
      if(response?.data?.user?.token){
        await storeDataToStorage('token', response.data.user.token)
      }
      setIsLoading(false)
      navigation.navigate('BottomTabNavigation')
      return
    }
    setIsLoading(false)
  }

  const checkBiometricsEnabled = async () => {

    await setSupportedBiometricType()
    const isBiometricsOn = await SecureStoreHandler.loadIsBiometricsOn()
    setIsBiometricsOn(isBiometricsOn)
    const hasCredentials = await SecureStoreHandler.loadHasCredentials()
    setHasStoredCredentials(hasCredentials)
    if (isBiometricsOn) {
      const biometryType = await SecureStoreHandler.loadSupportedBiometrics()
      setSupportedBiometryType(biometryType)
      if (biometryType) {
        setSupportedBiometry(biometryType)
        biometryType === TOUCH_ID ? setBiometryTypeText('Touch ID') :
          biometryType === FACE_ID ? setBiometryTypeText('Face ID') :
            setBiometryTypeText('Biometric with passcode')
      } else {
        setIsBiometricsOn(false)
      }
    }
  }
  const saveBiometricCredentials = async (userName: string, password: string) => {
    try {
      await setSupportedBiometricType()
      const biometryType = await SecureStoreHandler.loadSupportedBiometrics()
      setSupportedBiometryType(biometryType)
      await SecureStoreHandler.saveCredentials(userName, password)
    } catch (error) {
      console.log('save credentials error', error)
      await SecureStoreHandler.saveSupportedBiometrics(null)
      await SecureStoreHandler.saveBiometricsSettings(null)
    }
  }

  const getBiometricsIcon = () => {
    switch (supportedBiometry) {
      case TOUCH_ID:
        return Images.touchID
      case FACE_ID:
        return Images.faceID
      case PASSCODE:
        return Images.passcode
      default:
        return Images.passcode
    }
  }

  const loginUsingBiometricsHandler = async () => {
    const credentials: any = await SecureStoreHandler.getStoredCredentials()
    console.log('credentialss', credentials)
    if (credentials && !credentials?.error) {
      await onPressLogin(credentials?.username, credentials?.password)
    } else {
      console.log('error', credentials?.error)
    }
  }

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.wrapper, appStyle.mt30, appStyle.jcSpaceBetween]}>
          <View style={appStyle.rowBtw}>
            <View>
              <Image style={styles.image} source={Images.appIcon} />
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <H1 style={styles.heading}>Sign in</H1>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <H1>Sign up</H1>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View>
              <H1 style={{ color: ColorSet.purple }}>
                Hi, Welcome Back
              </H1>
            </View>
            <ErrorContainer
              isVisible={isErrorVisible}
              label={error}
              onClose={() => setIsErrorVisible(false)}
            />
            <ErrorContainer label={'this is a error text'} status={'info'} />
            <View>
              <View style={[styles.textContainer]}>
                <Input
                  label="Email"
                  value={email}
                  keyboardType="email-address"
                  setValue={setEmail}
                  // errorText={emailFormatError}
                  onChangeText={onChangeText}
                />
                <Input
                  label="Password"
                  value={password}
                  setValue={setPassword}
                  isSecure={true}
                  // errorText={passwordFormatError}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={appStyle.asFlexEnd}>
                <Link linkStyle={styles.bold} onPress={() => navigation.navigate('ForgotPassword')}>
                  Forgot Password?
                </Link>
              </View>
            </View>
          </View>
          <View style={styles.primaryButtonContainer}>
            {supportedBiometry !== null && isBiometricsOn && hasStoredCredentials &&
              <TouchableOpacity
                activeOpacity={1}
                style={styles.biometricsView}
                onPress={loginUsingBiometricsHandler}>
                <Text style={styles.biometricsText}>Login with </Text>
                <Text style={styles.biometricsText}>{biometryTypeText + ' '}</Text>
                {supportedBiometry !== PASSCODE &&
                  <Image
                    source={getBiometricsIcon()}
                    style={styles.biometricsIcon} />}
              </TouchableOpacity>
              } 
          </View>

          <View style={[appStyle.aiCenter, appStyle.row, appStyle.asFlexEnd]}>
            <H1 style={{ color: ColorSet.purple, fontWeight: "bold" }}>Sign in</H1>
            <Button
              containerStyle={styles.button}
              disable={buttonDisabled ? true : false}
              icon={Images.arrowForward}
              onPress={()=>onPressLogin(email, password)}
            >
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={[appStyle.pb20, appStyle.ph20]}>
        <Link
          linkStyle={styles.bold}
          onPress={() => navigation.navigate('Signup')}
          label="Not have an account?">
          Sign up
        </Link>
      </View>
      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
      // message={'Verifying your information...'}
      />
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
  bold: { fontFamily: FamilySet.bold },
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
    marginRight: 20,
    fontFamily: FamilySet.bold
  },
  primaryButtonContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  biometricsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    marginBottom: 20
  },
  biometricsIcon: {
    width: 32,
    aspectRatio: 1,
    height: 'auto'
  },
  loginText: {
    ...Fonts.size.small,
    color: ColorSet.theme
  },
  biometricsText: {
    ...Fonts.size.small,
    color: ColorSet.purple
  },
})

export default LoginScreen
