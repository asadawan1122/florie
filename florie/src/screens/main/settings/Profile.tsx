import React, { useEffect, useRef, useState, createRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, ImageBackground } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H3, H4, Button, Input, BottomSheet, ErrorContainer, Loader, H2, Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenWidth } from '../../../styles/screenSize'
import ImagePicker from 'react-native-image-crop-picker'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, uploadImage } from '../../../networking/DashboardApiService'
import { api, imagePath } from '../../../networking/Environment'
import { GET_USER_DATA } from '../../../redux/Actions'
import { Helper } from '../../../utils/'
const bottomSheetPicker = createRef()


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const [headerShown, setHeaderShown] = useState(false)
  const [image, setImage] = React.useState(null)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const firstNameError = firstName.length === 0 ? undefined : firstName.length < 3 ? "First name cannot be empty" : undefined
  const lastNameError = lastName.length === 0 ? undefined : lastName.length < 3 ? "Last name cannot be empty" : undefined
  const dispatch = useDispatch()


  const buttonDisabled = firstName === '' || lastName === '' || phoneNumber === '' || country === '' || state === '' || city === '' || address === ''
  const { user } = useSelector(state => state.userReducer)

  const onChangeText = () => {
    if (error.length > 0) {
      setError('')
      setIsErrorVisible(true)
    }
  }

  useEffect(() => {
    setFirstName(user?.firstname)
    setLastName(user?.lastname)
    setPhoneNumber(user?.phoneNumber)
    setCountry(user?.country)
    setState(user?.state)
    setCity(user?.city)
    setAddress(user?.address)
  }, [])

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


  const imageUpload = type => {
    let imgPreFix = 'data:image/jpeg;base64,'

    if (type == 1) {
      ImagePicker.openCamera({
        width: 200,
        height: 200,
        cropping: true,
        includeBase64: true
      }).then(image => {
        var images = []
        var path = {}
        path['path'] = image.path
        images.push(path)
        setImage(imgPreFix + image.data)
      })
    } else {
      ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        includeBase64: true
      }).then(image => {
        var images = []
        var path = {}
        path['path'] = image.path
        images.push(path)
        setImage(imgPreFix + image.data)
      })
    }
    bottomSheetPicker.current?.setModalVisible(false)
  }

  const onPressUpdateProfile = async () => {
    console.log('image===>', image);
    Keyboard.dismiss()
    setIsLoading(true)
    const data = {
      firstname: firstName,
      lastname: lastName,
      phoneNumber: phoneNumber,
      country: country,
      state: state,
      city: city,
      address: address,
      userId: user?._id
    }
    const response: any = await updateProfile(api.updateProfile, data)
    if (image) {
      console.log('uploading profile photo')
      await uploadImage(api.uploadProfilePhoto, {image})
    }
    setIsLoading(false)
    if (response != null) {
      dispatch({
        type: GET_USER_DATA,
        payload: response.data,
      });
      Helper.showToast('Profile updated successfully')
      navigation.pop(2) 
    }
    setIsLoading(false)
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
            Profile Information
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
        style={appStyle.flex1}>
        <View style={[appStyle.wrapper]}>
          <View style={[appStyle.headerTitleContainerSubpage, appStyle.ph20]}>
            <H2>Profile Information</H2>
            <Paragraph>Manage your profile</Paragraph>
          </View>
          <View>
            <TouchableOpacity style={styles.profileContainer}
              onPress={() => bottomSheetPicker.current?.setModalVisible()}>
              {image == null ? (
                <Image style={styles.profile} source={
                  user?.profilePicture ? { uri: imagePath + user.profilePicture } : Images.profile} />
              ) : (
                <Image style={styles.profile} source={{ uri: image }} />
              )

              }

              <View
                style={styles.editIconContainer}
              >
                <View style={styles.editIconInner}>
                  <Image style={appStyle.iconSm} source={Images.camera} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <ErrorContainer
              isVisible={isErrorVisible}
              label={error}
              onClose={() => setIsErrorVisible(false)}
            />
            <ErrorContainer label={'this is a error text'} status={'info'} />

            <View style={appStyle.pt15}>
              <View style={[styles.textContainer]}>
                <Input
                  label={'First Name'}
                  value={firstName}
                  setValue={setFirstName}
                  errorText={firstNameError}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'Last Name'}
                  value={lastName}
                  setValue={setLastName}
                  errorText={lastNameError}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'Phone'}
                  value={phoneNumber}
                  setValue={setPhoneNumber}
                  onChangeText={onChangeText}
                  keyboardType='phone-pad'
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'Country'}
                  value={country}
                  setValue={setCountry}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'State'}
                  value={state}
                  setValue={setState}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'City'}
                  value={city}
                  setValue={setCity}
                  onChangeText={onChangeText}
                />
              </View>
              <View style={[styles.textContainer]}>
                <Input
                  label={'Address'}
                  value={address}
                  setValue={setAddress}
                  onChangeText={onChangeText}
                />
              </View>
            </View>
          </View>

        </View>
      </KeyboardAwareScrollView>
      <View style={[appStyle.aiCenter, appStyle.ph20, appStyle.pb20]}>
        <Button
          containerStyle={appStyle.mt15}
          style={{ ...Fonts.size.small }}
          disable={buttonDisabled ? true : false}
          onPress={onPressUpdateProfile}

        >
          Update Profile
        </Button>
      </View>

      <BottomSheet
        bottomSheetRef={bottomSheetPicker}
        closeOnTouchBackdrop
        bottomCloseBtn={false}
        overlayOpacity={0.34}>
        <View>
          <TouchableOpacity
            onPress={() => bottomSheetPicker.current?.setModalVisible(false)}
            style={[appStyle.asFlexEnd]}>
            <Image
              style={[styles.icon, { tintColor: ColorSet.grey }]}
              source={Images.close}
            />
          </TouchableOpacity>
          <View style={[appStyle.pv15, appStyle.aiCenter]}>
            <H3>Upload image</H3>
          </View>
          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity
              onPress={() => imageUpload(1)}
              style={[styles.uploadBtn]}>
              <Image style={styles.uploadIcon} source={Images.camera} />
              <H4 style={appStyle.pt5}>
                Take photo
              </H4>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => imageUpload(2)}
              style={[styles.uploadBtn]}>
              <Image style={styles.uploadIcon} source={Images.folder} />
              <H4 style={appStyle.pt5}>
                Upload photo
              </H4>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

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
  uploadBtn: {
    width: '46%',
    backgroundColor: ColorSet.blueLight,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
    borderColor: ColorSet.theme,
    borderWidth: 1.5,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadIcon: {
    width: 60,
    height: 45,
    resizeMode: 'contain',
    tintColor: ColorSet.theme,
  },
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
  heading: {
    color: ColorSet.purple,
    textDecorationLine: 'underline',
    marginRight: 20,
    fontFamily: FamilySet.bold
  },
  profileContainer: {
    borderRadius: 400,
    // padding: 20,
    // overflow: 'hidden',
    width: screenWidth.width30,
    height: screenWidth.width30,
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
    // borderWidth: 0.5,
    // borderColor: '#ddd',
    position: 'relative'
  },
  profile: {
    width: screenWidth.width30 - 10,
    height: screenWidth.width30 - 10,
    borderRadius: 200,
    resizeMode: 'cover'
  },
  editIconContainer: {
    borderRadius: 400,
    padding: 3,
    overflow: 'hidden',
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
    position: 'absolute',
    right: -4,
    bottom: 15
  },
  editIconInner: {
    backgroundColor: ColorSet.purple,
    padding: 3,
    borderRadius: 400
  }
})

export default ProfileScreen
