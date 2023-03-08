import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform, Keyboard, UIManager, Image, Animated } from 'react-native'
import appStyle from '../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ResponseCode, } from '../../styles'
import { Images } from '../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../utils/formatter'
import { H2, Button, Input, Loader, HeaderBackButton, Paragraph, ErrorContainer } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { updatePassword } from '../../networking/AuthApiService'
import SimpleToast from 'react-native-simple-toast'
import { callApi } from '../../networking/AuthApiService'
import { api } from '../../networking/Environment'
import { Helper } from '../../utils/'

// import { useDispatch } from 'react-redux'
const ResetPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>('')
  const [headerShown, setHeaderShown] = useState(false)
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  // const dispatch = useDispatch()
  const emailFormatError = email.length === 0 ? undefined : emailFormat.test(email) ? undefined : 'Enter an email address in the format: yourname@example.com'
  const matchingPasswordsError = confirmPassword !== '' ? password === confirmPassword ? undefined : "Your passwords do not match" : undefined
  const passwordFormatError = password !== '' ? passwordFormat.test(password) ? undefined : "Must be at least 8 characters long and contain at least one letter, one number and one special character" : undefined
  const codeError = code.length === 0 ? undefined : code.length < 5 ? "Minimum 8 digits" : undefined

  const buttonDisabled = password.length < 4 || matchingPasswordsError || passwordFormatError || password === '' || confirmPassword === '' || code === ''

  useEffect(() => {

    Animated.timing(translation, {
      toValue: headerShown ? 0 : -50,
      duration: 200,
      useNativeDriver: true,
    }).start()
    Animated.timing(opacity, {
      toValue: headerShown ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start()
    const params = navigation.state.params
    setEmail(params.email)
  }, [headerShown])

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  const onChangeText = () => {
    if (error.length > 0) {
      setError('')
      setIsErrorVisible(true)
    }
  }

  const onResetPassword = async () => {

    Keyboard.dismiss()
    setIsLoading(true)
    const data = {
      verificationCode: code,
      email: email,
      password: password
    }
    const response: any = await callApi(api.updatePassword, data)
    setIsLoading(false)
    if (response != null) {
      Helper.showToast(response.message)
      navigation.navigate('Login')
    }
  }


  return (
    <SafeAreaView style={[appStyle.safeContainer]}>

      {!focused && (
        <View style={appStyle.header}>
          <HeaderBackButton onPress={() => navigation.goBack()} />
          <Animated.View
            style={{
              alignItems: 'flex-start',
              flex: 1,
              transform: [{ translateY: translation }],
              opacity: opacity,
              marginLeft: 50,
            }}>
            <H2 style={styles.headerFixedTitle}>
              Reset Password
            </H2>

          </Animated.View>

        </View>
      )}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}
        stickyHeaderIndices={[!focused ? 1 : 0]}
        onScroll={event => {
          const scrolling = event.nativeEvent.contentOffset.y
          if (scrolling > 40) {
            setHeaderShown(true)
          } else {
            setHeaderShown(false)
          }
        }}
        scrollEventThrottle={16}>
        {!focused && (
          <View style={appStyle.ml20}>
            <H2 style={styles.title}>Reset password</H2>
          </View>
        )}
        <View style={[appStyle.wrapper, appStyle.mt30]}>
          <Paragraph style={{ fontFamily: FamilySet.bold }}>Provide email to your account.</Paragraph>
          <View>
            <ErrorContainer
              isVisible={isErrorVisible}
              label={error}
              onClose={() => setIsErrorVisible(false)}
            />
            <View style={[styles.textContainer]}>
              <Input
                label="Email"
                value={email}
                keyboardType="email-address"
                setValue={setEmail}
                onChangeText={onChangeText}
                editable={false}
              />
              <Input
                label="Code"
                value={code}
                keyboardType="numeric"
                setValue={setCode}
                errorText={codeError}
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
            </View>
          </View>
          <View style={appStyle.mt40}>
            <Button onPress={onResetPassword} disable={buttonDisabled ? true : false}>
              Reset Password
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
        message={'Updating...'}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    ...Fonts.size.medium,

  },
  image: {
    height: ScreenSize.screenWidth.width50,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerFixedTitle: {
    ...Fonts.size.medium,
  },
})

export default ResetPasswordScreen
