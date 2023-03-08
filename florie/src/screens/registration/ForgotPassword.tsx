import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform, Keyboard, Alert, UIManager, Image, Animated } from 'react-native'
import appStyle from '../../assets/styles/appStyle'
import { Fonts, ResponseCode, ScreenSize } from '../../styles'
import { Images } from '../../constants/assets/images'
import { emailFormat, } from '../../utils/formatter'
import { H2, Button, Input, Loader, HeaderBackButton, Paragraph } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { callApi } from '../../networking/AuthApiService'
import { api } from '../../networking/Environment'


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [headerShown, setHeaderShown] = useState(false)

  // const dispatch = useDispatch()
  const emailFormatError = email.length === 0 ? undefined : emailFormat.test(email) ? undefined : 'Enter an email address in the format: yourname@example.com'
  const buttonDisabled = email.length === 0 || emailFormatError
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

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


  }, [headerShown])


  const onChangeText = () => {
    if (error.length > 0) {
      setError('')
      setIsErrorVisible(true)
    }
  }

  const onPressForgetPassword = async () => {
    Keyboard.dismiss()
    setIsLoading(true)
    const data = {email}
    const response: any = await callApi(api.forgetPassword, data)
    setIsLoading(false)
    if (response != null) {
      navigation.navigate('ResetPassword',{email})
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
              Forgot Password
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
        scrollEventThrottle={16}
      >

        {!focused && (

          <View style={appStyle.ml20}>
            <H2 style={styles.title}>Forgot password</H2>
          </View>
        )}

        <View style={[appStyle.wrapper, appStyle.mt30]}>
          <View>
            <View style={appStyle.aiCenter}>
              <Image style={styles.image} source={Images.forgotPasswordVector} />
            </View>

            <Paragraph style={appStyle.mt30}>Enter your email to get a verification code and change your password right away.
            </Paragraph>
            <View>
              <View style={[styles.textContainer]}>
                <Input
                  label="Email"
                  value={email}
                  keyboardType="email-address"
                  setValue={setEmail}
                  errorText={emailFormatError}
                  onChangeText={onChangeText}
                />
              </View>

            </View>
          </View>
          <View style={appStyle.mt40}>
            <Button
              onPress={onPressForgetPassword }
              disable={buttonDisabled ? true : false}>
              Send code
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
        message={'Verifying your information...'}
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

export default ForgotPasswordScreen
