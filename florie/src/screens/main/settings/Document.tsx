import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, ImageBackground, Text } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, Button, Input, Link, ErrorContainer, Loader, H2, Paragraph, H5 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenHeight, screenWidth } from '../../../styles/screenSize'
import ImageView from 'react-native-image-view';
import { useSelector } from 'react-redux'
import { DateHelper } from '../../../utils'
import { imagePath } from '../../../networking/Environment'
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const DocumentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const [headerShown, setHeaderShown] = useState(false)
  const [isImageViewVisible, setIsImageViewVisible] = useState<boolean>(false)
  const { user } = useSelector(state => state.userReducer)
  const [images, setImages] = useState([])
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

  const onPressDocumentImage = (link: any) => {
    if (images.length) {
      setImages([])
    }
    let obj = {
      source: {
        uri: link,
      },
      width: screenWidth.width100 - 30,
      height: screenHeight.height100 / 1.5,
    }

    images.push(obj)
    // setImages(obj)
    setIsImageViewVisible(!isImageViewVisible)
  }
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <View style={appStyle.headerSubPage}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: translation }],
            opacity: opacity,
          }}>
          <H3>
            KYC Document
          </H3>
        </Animated.View>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}
        onScroll={event => {
          const scrolling = event.nativeEvent.contentOffset.y
          if (scrolling > 20) {
            setHeaderShown(true)
          } else {
            setHeaderShown(false)
          }
        }}
        scrollEventThrottle={16}
        style={appStyle.flex1}
      >
        <View style={[appStyle.wrapper]}>
          <View style={[appStyle.headerTitleContainerSubpage, appStyle.ph20]}>
            <H2>KYC Document</H2>
            <Paragraph>Your KYC Information</Paragraph>
          </View>

          <View style={appStyle.pt15}>
            <View style={styles.card}>
              <View>
                {user?.isKycVerified == false &&
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddKycDocument')}
                    hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
                    style={styles.btn}
                  >
                    <Image source={Images.add} style={appStyle.iconMd} />
                  </TouchableOpacity>
                } 

                <View style={appStyle.divider}>

                  <View style={[appStyle.rowBtw, appStyle.pt10]}>
                    <View style={appStyle.flex1}>
                      <H5>Status</H5>
                      <H5 style={appStyle.cardDescText}>{user?.isKycVerified ? 'Active' : 'Pending'}</H5>
                    </View>
                    <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                      <H5>Name On Document</H5>
                      <H5 style={appStyle.cardDescText}>{user?.nameOnDocument}</H5>
                    </View>
                  </View>
                  <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.pt10]}>
                    <View style={appStyle.flex1}>
                      <H5>Document Expiry Date</H5>
                      <H5 style={appStyle.cardDescText}>{user?.documentExpiry}</H5>
                    </View>
                    <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                      <H5>Nationality</H5>
                      <H5 style={appStyle.cardDescText}>{user?.country}</H5>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[appStyle.row]}>
            {user?.kycFront != "" &&
              <TouchableOpacity
                onPress={() => onPressDocumentImage(imagePath + user?.kycFront)}
                style={styles.documentImageContainer}>
                <Image style={styles.documentImage} source={{ uri: imagePath + user?.kycFront }} />
              </TouchableOpacity>


            }
            {user?.kycBack  != "" &&
              <TouchableOpacity
                onPress={() => onPressDocumentImage(imagePath + user?.kycBack)}
                style={styles.documentImageContainer}>
                <Image style={styles.documentImage} source={{ uri: imagePath + user?.kycBack }} />
              </TouchableOpacity>
            }
          </View>

          <ImageView
            images={images}
            imageIndex={0}
            isVisible={isImageViewVisible}
            renderFooter={() => (<View><Text>My footer</Text></View>)}
            onClose={onPressDocumentImage}
          />

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // padding: 15,
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: '#ddd',
    overflow: 'hidden',
    paddingBottom: 15
  },
  documentImage: {
    width: screenWidth.width50 - 15 - 5,
    height: screenWidth.width50 - 15 - 5,
    resizeMode: 'cover',
    borderRadius: 12
  },
  documentImageContainer: {
    marginBottom: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 5,
  },
  btn: {
    alignSelf: 'flex-end',
    paddingRight: 5
  }
})

export default DocumentScreen
