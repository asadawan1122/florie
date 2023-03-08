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
import { storeDataToStorage, getDataFromStorage } from '../../utils/storage'
import { api } from '../../networking/Environment'
import { showToast } from '../../utils/helpers'

const AppLockPassword: React.FC<{ navigation: any }> = ({ navigation }) => {
     const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [password, setPassword] = useState<string>('')
     const [error, setError] = useState<string>('')

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

     const onPressLogin = async (email: string, password: string) => {

          Keyboard.dismiss()
          setIsLoading(true)
          const data = { email: email.toLowerCase(), password }
          const response: any = await callApi(api.login, data)
          if (response != null) {
               await saveBiometricCredentials(email, password)
               await storeDataToStorage('user', response.data.user)
               await storeDataToStorage('token', response.data.user.token)
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
          if (credentials && !credentials?.error) {
               await onPressLogin(credentials?.username, credentials?.password)
          } else {
               console.log('error', credentials?.error)
          }
     }

     const loginWithPasscode = async () => {

          const appLockData = await getDataFromStorage('appLockPassword')
          const lockPassword = appLockData.password
          console.log('locked password',lockPassword)
          if (password == lockPassword) {
               navigation.navigate('BottomTabNavigation')
               return
          }
          showToast('Invalid password')
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

                              </View>
                         </View>
                         {supportedBiometry == null &&

                              <View>
                                   <View>
                                        <H1 style={{ color: ColorSet.purple }}>
                                             Please enter password
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
                                                  label="Password"
                                                  value={password}
                                                  setValue={setPassword}
                                                  isSecure={true}
                                                  onChangeText={onChangeText}
                                             />
                                        </View>

                                   </View>
                              </View>
                         }

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
                         {supportedBiometry == null &&
                              <Button
                                   onPress={() => loginWithPasscode()}>
                                   Submit
                              </Button>
                         }
                         <View />
                    </View>
               </KeyboardAwareScrollView>

               <Loader
                    isLoading={isLoading}
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

export default AppLockPassword
