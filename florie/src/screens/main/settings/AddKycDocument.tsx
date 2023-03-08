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
import { submitKycDocument, getData } from '../../../networking/DashboardApiService'
import { api, imagePath } from '../../../networking/Environment'
import { GET_USER_DATA } from '../../../redux/Actions'
import { Helper } from '../../../utils/'
import { Calendar } from 'react-native-calendars';



const bottomSheetPicker = createRef()
const bottomSheetDatePicker = createRef()
const actionSheetRef = createRef()

if (
     Platform.OS === 'android' &&
     UIManager.setLayoutAnimationEnabledExperimental
) {
     UIManager.setLayoutAnimationEnabledExperimental(true)
}

const AddKycDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
     const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [error, setError] = useState<string>('')
     const translation = useRef(new Animated.Value(-100)).current
     const opacity = useRef(new Animated.Value(0)).current
     const [headerShown, setHeaderShown] = useState(false)
     const [country, setCountry] = useState<string>('')
     const [documentExpiry, setDocumentExpiry] = useState<string>('')
     const [nameOnDocument, setNameOnDocument] = useState<string>('')
     const [documentType, setDocumentType] = useState<string>('')

     const [imageType, setImageType] = useState('')
     const [kycFrontImageUrl, setKycFrontImageUrl] = useState(null)
     const [kycBackImageUrl, setKycBackImageUrl] = useState(null)

     const [kycFrontImageBase64Url, setKycFrontImageBase64Url] = useState<string>('')
     const [kycBackImagBase64eUrl, setKycBackImageBase64Url] = useState<string>('')

     const dispatch = useDispatch()

     const buttonDisabled = kycFrontImageUrl == '' || documentType === '' || nameOnDocument === '' || documentExpiry === '' || country === ''
     const { user } = useSelector(state => state.userReducer)

     const onChangeText = () => {
          if (error.length > 0) {
               setError('')
               setIsErrorVisible(true)
          }
     }

     useEffect(() => {
          setNameOnDocument(user?.nameOnDocument)
          setDocumentType(user?.documentType)
          setDocumentExpiry(user?.documentExpiry)
          setCountry(user?.country)

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
          bottomSheetPicker.current?.setModalVisible(false)
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

                    if (imageType === 'front') {
                         setKycFrontImageUrl(images[0]?.path)
                         setKycFrontImageBase64Url(imgPreFix + image.data)
                         return
                    }
                    setKycBackImageUrl(images[0]?.path)
                    setKycBackImageBase64Url(imgPreFix + image.data)
               })
          } else {
               ImagePicker.openPicker({
                    width: 200,
                    height: 200,
                    cropping: true,
                    includeBase64: true
               }).then(image => {
                    // console.log('image----->', image)
                    var images = []
                    var path = {}
                    path['path'] = image.path
                    images.push(path)
                    if (imageType === 'front') {

                         setKycFrontImageUrl(images[0]?.path)
                         setKycFrontImageBase64Url(imgPreFix + image.data)
                         return
                    }
                    setKycBackImageUrl(images[0]?.path)
                    setKycBackImageBase64Url(imgPreFix + image.data)
               })
          }
     }

     const onPressUpdateProfile = async () => {

          Keyboard.dismiss()
          if (kycFrontImageUrl == null || kycBackImageUrl == null) {
               Helper.showToast('Images')
               return
          }
          setIsLoading(true)
          const userId = user?._id
          const data = {
               userId,
               country,
               documentExpiry,
               nameOnDocument,
               documentType,
               kycFront: kycFrontImageBase64Url,
               kycBack: kycBackImagBase64eUrl
          }
          const response: any = await submitKycDocument(api.submitKycDocument, data)
          if (response != null) {
               const result: any = await getData(api.getUserDetail)
               if (result != null) {
                    dispatch({
                         type: GET_USER_DATA,
                         payload: result.data,
                    });
               }
               Helper.showToast(response.message)
               navigation.goBack()
          }
          setIsLoading(false)
     }
     const showImageOptions = (imageType: any) => {
          setImageType(imageType)
          bottomSheetPicker.current?.setModalVisible()
     }

     const onPressCloseSheet = () => {
          actionSheetRef.current?.setModalVisible(false)

     }

     const onSelectDocumentType = (value) => {
          actionSheetRef.current?.setModalVisible(false)
          setDocumentType(value)
          // navigation.navigate('Tickets')
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
                              Your KYC Information
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
                              <H2>KYC Information</H2>
                              <Paragraph>Manage your KYC information</Paragraph>
                         </View>

                         <View style={appStyle.rowAround}>

                              <TouchableOpacity style={styles.profileContainer}
                                   onPress={() => showImageOptions('front')}>
                                   {kycFrontImageUrl == null ?
                                        <Image style={styles.profile} source={
                                             Images.profile} />
                                        :
                                        <Image style={styles.profile} source={{ uri: kycFrontImageUrl }} />
                                   }


                                   <View
                                        style={styles.editIconContainer} >
                                        <View style={styles.editIconInner}>
                                             <Image style={appStyle.iconSm} source={Images.camera} />
                                        </View>
                                   </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.profileContainer}
                                   onPress={() => showImageOptions('back')}
                              >
                                   {kycBackImageUrl == null ?
                                        <Image style={styles.profile} source={
                                             Images.profile} />
                                        :
                                        <Image style={styles.profile} source={{ uri: kycBackImageUrl }} />
                                   }


                                   <View
                                        style={styles.editIconContainer} >
                                        <View style={styles.editIconInner}>
                                             <Image style={appStyle.iconSm} source={Images.camera} />
                                        </View>
                                   </View>
                              </TouchableOpacity>
                         </View>

                         <View style={appStyle.rowAround}>
                              <Paragraph>Front photo</Paragraph>
                              <Paragraph>Back photo</Paragraph>

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
                                             label={'Name on document'}
                                             value={nameOnDocument}
                                             setValue={setNameOnDocument}
                                             onChangeText={onChangeText}
                                        />
                                   </View>

                                   <TouchableOpacity style={[styles.textContainer]}
                                        onPress={() => bottomSheetDatePicker.current?.setModalVisible()}
                                   >
                                        <Input
                                             label={'Document expiry date'}
                                             value={documentExpiry}
                                             setValue={setDocumentExpiry}
                                             onChangeText={onChangeText}
                                             editable={false}
                                        />
                                   </TouchableOpacity>

                                   <View style={[styles.textContainer]}>
                                        <Input
                                             label={'Country'}
                                             value={country}
                                             setValue={setCountry}
                                             onChangeText={onChangeText}
                                        />
                                   </View>


                                   <TouchableOpacity style={[styles.textContainer]}
                                        onPress={() => actionSheetRef.current?.setModalVisible(true)}
                                   >
                                        <Input
                                             label={'Document type e.g National Card'}
                                             value={documentType}
                                             setValue={setDocumentType}
                                             onChangeText={onChangeText}
                                             editable={false}
                                        />
                                   </TouchableOpacity>
                              </View>
                         </View>

                    </View>
               </KeyboardAwareScrollView>
               <View style={[appStyle.aiCenter, appStyle.ph20, appStyle.pb20]}>
                    <Button
                         containerStyle={appStyle.mt15}
                         style={{ ...Fonts.size.small }}
                         disable={buttonDisabled ? true : false}
                         onPress={onPressUpdateProfile}>
                         Submit
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


               <BottomSheet
                    bottomSheetRef={bottomSheetDatePicker}
                    closeOnTouchBackdrop
                    bottomCloseBtn={false}
                    overlayOpacity={0.34}

               >
                    <View style={{ paddingBottom: 30 }}>
                         <Calendar
                              theme={{
                                   arrowColor: ColorSet.purple,
                                   todayTextColor: ColorSet.purple,
                              }}

                              onDayPress={day => {
                                   setDocumentExpiry(day.dateString)
                              }}
                         />
                         <Button
                              onPress={() =>
                                   bottomSheetDatePicker.current?.setModalVisible(false)
                              }>
                              OK
                         </Button>
                    </View>
               </BottomSheet>



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
                                   onPress={() => onSelectDocumentType('Passport')}
                                   style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
                              >
                                   <View style={[appStyle.mr10]}>
                                        <Image style={appStyle.iconSm} source={Images.ticket} />
                                   </View>
                                   <H3 style={appStyle.menuItemText}>Passport</H3>
                              </TouchableOpacity>
                              <TouchableOpacity
                                   onPress={() => onSelectDocumentType('Driving License')}
                                   style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
                              >
                                   <View style={[appStyle.mr10]}>
                                        <Image style={appStyle.iconSm} source={Images.ticket} />
                                   </View>
                                   <H3 style={appStyle.menuItemText}>Driving License</H3>
                              </TouchableOpacity>
                              <TouchableOpacity
                                   onPress={() => onSelectDocumentType('National ID')}
                                   style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
                              >
                                   <View style={[appStyle.mr10]}>
                                        <Image style={appStyle.iconSm} source={Images.ticket} />
                                   </View>
                                   <H3 style={appStyle.menuItemText}>National ID</H3>
                              </TouchableOpacity>
                         </View>
                    </View>
               </BottomSheet>
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
          borderRadius: 200,
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

export default AddKycDocument
