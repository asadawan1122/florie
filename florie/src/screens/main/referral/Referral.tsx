import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform, Keyboard, BackHandler, UIManager, Image, Animated, TouchableOpacity, Alert } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, Button, Input, Loader, Paragraph, H3, H4, H5 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenHeight, screenWidth } from '../../../styles/screenSize'
import Clipboard from '@react-native-community/clipboard'
import SimpleToast from 'react-native-simple-toast'
import { getDataFromStorage } from '../../../utils/storage'
// import Toast from 'react-native-simple-toast';

const ReferralScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [headerShown, setHeaderShown] = useState(false)
  const [link, setLink] = useState<string>('https://florie.net/invest/registration/')
  const [user, setUser] = useState([])

  // const dispatch = useDispatch()
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    getUserObj()
  }, [])
  const getUserObj = async () => {
    const user = await getDataFromStorage('user')
    setUser(user)
  }
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

  const onPressCopyLink = () => {
    Clipboard.setString(link)
    // Alert.alert('copied', link)
    SimpleToast.show('Copied!')
  }

  return (

    <SafeAreaView style={[appStyle.safeContainer]}>
      <View style={[appStyle.header]}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Animated.View
          style={[appStyle.flex1, appStyle.ph20]}>
          <H2>
            Referrals
          </H2>
          <Paragraph>View your referrals related information</Paragraph>
        </Animated.View>
      </View>

     

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
        <View style={[appStyle.wrapper]}>
          <View style={[appStyle.rowWrap, appStyle.jcSpaceBetween, appStyle.pt20]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReferredUsers')}
              style={appStyle.detailCard}
            >
              <View style={styles.cardIconContainer}>
                <Image style={appStyle.iconMd} source={Images.users} />
              </View>
              <H4 style={styles.cardText}>Users</H4>
              <Paragraph>Referred Users</Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReferredStats')}
              style={appStyle.detailCard}
            >
              <View style={styles.cardIconContainer}>
                <Image style={appStyle.iconMd} source={Images.affiliate} />
              </View>
              <H4 style={styles.cardText}>Stats</H4>
              <Paragraph>Referral Statistics</Paragraph>
            </TouchableOpacity>
            <View style={[appStyle.detailCard, appStyle.w100, {
              height: 'auto', shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.16,
              shadowRadius: 16.00,

              elevation: 24,
            }]}>
              <View>
                <View style={appStyle.mb15}>
                  <H4 style={styles.cardText}>Your Referral Link</H4>
                </View>
                <View style={[appStyle.row, appStyle.aiCenter, {
                  borderRadius: 12,
                  backgroundColor: ColorSet.purpleLight,
                  paddingHorizontal: 10,
                  paddingVertical: 15
                }
                ]}>
                  <View style={[appStyle.mr10, styles.cardIconContainer, {

                  }]}>
                    <Image style={appStyle.iconSm} source={Images.link} />
                  </View>
                  <View style={{flex:1}}>
                  <H5 style={styles.link}>{link + user?.refereralCode}</H5>
                  </View>
                </View>
                <Button
                  containerStyle={appStyle.mt10}
                  onPress={() => onPressCopyLink()}
                >
                  Copy link
                </Button>
              </View>
            </View>
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
  cardText: {
    // lineHeight: 28,
    letterSpacing: 0.3,
    color: '#2C2C2C',
    paddingBottom: 5,
    paddingTop: 10
  },
  cardIconContainer: {
    padding: 7,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16.00,

    elevation: 24,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
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
  link: {
    fontFamily: FamilySet.medium,
    color: ColorSet.blackLight,
    ...Fonts.size.xsmall
  }
})

export default ReferralScreen
