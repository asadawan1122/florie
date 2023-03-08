import React, { useEffect } from 'react'
import { View, Image, StyleSheet, StatusBar, ImageBackground, Text } from 'react-native'
import { Images } from '../../constants/assets/images'
import { getData } from '../../networking/DashboardApiService'
import { ScreenSize } from '../../styles'
import { getDataFromStorage } from '../../utils/storage'
import SecureStoreHandler from '../../utils/secureStoreHandler'

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

  useEffect(() => {
    userData()
  }, [])

  const performTimeConsumingTask = () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('splash')
      }, 3000),
    )
  }

  const userData = async () => {
    let appLockStatus  = false
    await performTimeConsumingTask()
    const data = await getDataFromStorage('user')
    if (data != null) {
      const appLock = await getDataFromStorage('isAppLock')
      const isBiometricsOn = await SecureStoreHandler.loadIsBiometricsOn()
      if(appLock != null ){
         appLockStatus = appLock.status
      }
      if (appLockStatus == true || isBiometricsOn) {
        navigation.navigate('AppLock')
        return
      }
      navigation.navigate('BottomTabNavigation')
      return
    }
    navigation.navigate('Auth')
  }

  return (
    <>

      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={[styles.container]}>
        <ImageBackground source={Images.bgSplash} style={styles.bgImage}>
          <Image style={styles.image} source={Images.logo} />
          {/* <Text>sjjs</Text> */}
        </ImageBackground>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: ScreenSize.screenWidth.width50,
    alignSelf: "center",
    // height: ScreenSize.screenWidth.width60,
    resizeMode: 'contain',
    marginTop: ScreenSize.screenWidth.width15
  },
  bgImage: {
    width: '100%',
    height: ScreenSize.screenHeight.height100,
  },
})

export default SplashScreen
