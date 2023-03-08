import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, Keyboard, RefreshControl, UIManager, Image, Animated, TouchableOpacity, ImageBackground } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, Button, Input, Loader, Paragraph, H3, H4, H5, BottomSheet } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { screenHeight, screenWidth } from '../../../styles/screenSize'
import { removeDataFromStorage } from '../../../utils/storage'
import { getData } from '../../../networking/DashboardApiService'
import { api, imagePath } from '../../../networking/Environment'
import { GET_USER_DATA } from '../../../redux/Actions'
import { useDispatch, useSelector } from 'react-redux'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const actionSheetRef = createRef()
const logoutActionSheetRef = createRef()

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [headerShown, setHeaderShown] = useState(false)

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  // const dispatch = useDispatch()
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const { user } = useSelector(state => state.userReducer)

  const dispatch = useDispatch()
  useEffect(() => {
    getUserObj()
    return
    const unsubscribe = navigation.addListener('didFocus', () => {
      getUserObj()
    })
    return () => unsubscribe.remove()
  }, [navigation])



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


  const onRefresh = () => {
    getUserObj()
}
  const getUserObj = async () => {
    setIsLoading(true)
    const result: any = await getData(api.getUserDetail)
    if (result != null) {
      dispatch({
        type: GET_USER_DATA,
        payload: result.data,
      });
    }
    setIsLoading(false)
  }


  const onPressCloseSheet = () => {
    actionSheetRef.current?.setModalVisible(false)
    logoutActionSheetRef.current?.setModalVisible(false)
  }

  const onPressSupportTicket = () => {
    actionSheetRef.current?.setModalVisible(false)
    logoutActionSheetRef.current?.setModalVisible(false)
    navigation.navigate('Tickets')
  }

  const onPressFaqs = () => {
    actionSheetRef.current?.setModalVisible(false)
    logoutActionSheetRef.current?.setModalVisible(false)
    navigation.navigate('Faqs')
  }

  
  const onPressLogout = async () => {
    logoutActionSheetRef.current?.setModalVisible(false)
    await removeDataFromStorage('user')
    await removeDataFromStorage('token')
    await removeDataFromStorage('isAppLock')
    await removeDataFromStorage('appLockPassword')
    navigation.navigate('Login')
  }


  return (
    <SafeAreaView style={[appStyle.safeContainer]}>

      <View style={[appStyle.header]}>
        {/* <HeaderBackButton onPress={() => navigation.goBack()} /> */}

        <Animated.View
          style={[appStyle.flex1, appStyle.ph20]}>
          <H2>
            Settings
          </H2>
          <Paragraph>Your profile settings and management</Paragraph>
        </Animated.View>

      </View>

      <KeyboardAwareScrollView
         refreshControl={
          <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
          />
      }
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
        <View style={[appStyle.wrapper]}>
          <View>
            <ImageBackground source={Images.settingsBg} style={styles.cover}
              resizeMode='cover'>
              <View style={styles.profileContainer}>
                {user?.profilePicture ?
                  <Image style={styles.profile} source={{ uri: imagePath + user?.profilePicture }} />
                  :
                  <Image style={styles.profile} source={Images.profile} />
                }

              </View>

            </ImageBackground>
            <View style={[appStyle.asCenter, appStyle.pt15, appStyle.aiCenter]}>
              <H2 style={{ color: ColorSet.black }}>{user?.firstname + ' ' + user?.lastname}</H2>
              <H5 style={{ color: ColorSet.grey }}>{user?.email}</H5>
            </View>
          </View>

          <View style={[appStyle.mt30]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Account')}
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.projects} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Account Management</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageCryptoAddress')}
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.crypto} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Crypto Addresses</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Referral')}
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={[appStyle.iconMd, { tintColor: ColorSet.purple }]} source={Images.tab4} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Referral</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Activity')}
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.activity} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Activity</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.setModalVisible(true)
              }
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.support} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Support</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={appStyle.menuCard}
            >
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.notification} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Notifications</H4>
                </View>
              </View>
              <View>
                <Image source={Images.right} style={appStyle.iconMd} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => logoutActionSheetRef.current?.setModalVisible(true)}
              style={appStyle.menuCard}>
              <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                <View style={styles.cardIconContainer}>
                  <Image style={appStyle.iconMd} source={Images.logout} />
                </View>
                <View>
                  <H4 style={styles.cardText}>Logout</H4>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
      // message={'Verifying your information...'}
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
              onPress={onPressSupportTicket}
              style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
            >
              <View style={[appStyle.mr10]}>
                <Image style={appStyle.iconSm} source={Images.ticket} />
              </View>
              <H4 style={appStyle.menuItemText}>Support Tickets</H4>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressFaqs}
              style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
            >
              <View style={[appStyle.mr10]}>
                <Image style={appStyle.iconSm} source={Images.help} />
              </View>
              <H4 style={appStyle.menuItemText}>Faqs</H4>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet bottomSheetRef={logoutActionSheetRef}
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
              <H4 style={appStyle.menuItemText}>Are you sure you want to logout?</H4>
            </TouchableOpacity>
            <View style={appStyle.rowBtw}>
              <View style={appStyle.btnSmall}>
                <Button onPress={onPressLogout}>Yes</Button>
              </View>
              <View style={appStyle.btnSmall}>
                <Button onPress={onPressCloseSheet} containerStyle={{ backgroundColor: ColorSet.red }}>No</Button>
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 'auto',
  },
  profileContainer: {
    borderRadius: 400,
    // padding: 20,
    overflow: 'hidden',
    width: screenWidth.width35,
    height: screenWidth.width35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "rgba(0,0,0,0.6)",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  profile: {
    width: screenWidth.width35 - 10,
    height: screenWidth.width35 - 10,
    borderRadius: 200,
    resizeMode: 'cover'
  },
  cardIconContainer: {
    padding: 7,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    // alignSelf: 'flex-start',
    marginRight: 10
  },
  cardText: {
    letterSpacing: 0.3,
    color: '#2C2C2C',
    paddingBottom: 5,
    paddingTop: 10
  },
})

export default SettingsScreen
