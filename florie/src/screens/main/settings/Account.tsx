import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, Keyboard, BackHandler, UIManager, Image, Animated, TouchableOpacity } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { Loader, Paragraph, H3, H4, BottomSheet, Button, Input } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { screenHeight, screenWidth } from '../../../styles/screenSize'
import { HeaderBackButton } from 'react-navigation-stack'
import ToggleSwitch from 'toggle-switch-react-native'
import { useSelector } from 'react-redux'
import { submitData,submitDataWithoutParam } from '../../../networking/DashboardApiService'
import { api, imagePath } from '../../../networking/Environment'
import { Helper } from '../../../utils/'
import SecureStoreHandler from '../../../utils/secureStoreHandler'
import { FACE_ID, PASSCODE, setSupportedBiometricType, TOUCH_ID } from '../../../utils/biometrics'
import { getDataFromStorage, storeDataToStorage } from '../../../utils/storage'
import { showToast } from '../../../utils/helpers'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const actionSheetRef = createRef()

const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [headerShown, setHeaderShown] = useState(false)
    const [notificationSwitch, setNotificationSwitch] = useState(false)
    const [authSwitch, setAuthSwitch] = useState(true)
    const [biometricSwitch, setBiometricSwitch] = useState(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const { user } = useSelector(state => state.userReducer)
    const [supportedBiometry, setSupportedBiometry] = useState<string | null>(null)
    const [supportedBiometryType, setSupportedBiometryType] = useState<string | null>(null)
    const [biometryTypeText, setBiometryTypeText] = useState<string>('')
    const [isBiometricsOn, setIsBiometricsOn] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isAppLock, setIsAppLock] = useState<boolean>(false)


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

    useEffect(() => {
        checkBiometricsEnabled()
        setNotificationSwitch(user?.emailNotifications)
        setAuthSwitch(user?.isTwoFaEnabled)
        updateAppLockStatus()
    }, [])

    const updateAppLockStatus = async () => {

        const appLockStatus = await getDataFromStorage('isAppLock')
        setIsAppLock(Boolean(appLockStatus.status))
    }

    const onChangeText = () => {
        if (error.length > 0) {
            setError('')
            setIsErrorVisible(true)
        } else {
            setIsErrorVisible(false)
            setError('')
        }
    }

    const updateTwoFactorAuthentication = async () => {
        setAuthSwitch(!authSwitch)
        const data = {
            status: !authSwitch,
            userId: user?._id
        }
        const response: any = await submitDataWithoutParam(api.update2FA, data)
        if (response != null) {
            if (data.status == true) {
                navigation.navigate('TwoFaOtp',{email:user?.email})
                return
            }
        }
    }

    const updateEmailNotification = async () => {
        setNotificationSwitch(!notificationSwitch)
        const data = {
            emailNotifications: !notificationSwitch,
        }
        const response: any = await submitData(api.updateNotification, data)
        if (response != null) {
            Helper.showToast(response.message)
        }
    }


    const onSwitchBiometrics = async () => {

        setBiometricSwitch(!biometricSwitch)
        if (!biometricSwitch == true) {
            setIsBiometricsOn(true)
            const biometryType = await SecureStoreHandler.loadSupportedBiometrics()
            await SecureStoreHandler.saveIsBiometricsOn(true)
            await SecureStoreHandler.saveBiometricsSettings(biometryType)
            await SecureStoreHandler.saveHasCredentials(true)
        } else {
            setIsBiometricsOn(false)
            await SecureStoreHandler.deleteBiometricsSettings()
            await SecureStoreHandler.saveHasCredentials(false)
        }
    }


    const onPressCloseSheet = () => {
        actionSheetRef.current?.setModalVisible(false)
    }
    const checkBiometricsEnabled = async () => {
        await setSupportedBiometricType()
        const isBiometricsOn = await SecureStoreHandler.loadIsBiometricsOn()
        console.log('setIsBiometricsOn------>', isBiometricsOn)
        setIsBiometricsOn(isBiometricsOn ? true : false)
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
    const onSwitchAppLock = async () => {
        if (!isAppLock == true) {
            actionSheetRef.current?.setModalVisible(true)
            return
        }
        setIsAppLock(false)
        await storeDataToStorage('isAppLock', { status: !isAppLock })
        Helper.showToast('App lock turn off')

    }
    const onPressSetAppLock = async () => {
        if (password.length > 3) {
            actionSheetRef.current?.setModalVisible(false)
            setIsAppLock(true)
            await storeDataToStorage('isAppLock', { status: !isAppLock })
            await storeDataToStorage('appLockPassword', { password: password })
            Helper.showToast('App lock status turn on')
            return
        }
        Helper.showToast('password should be at least 4 characters')
    }

    return (
        <SafeAreaView style={[appStyle.safeContainer]}>

            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={appStyle.scrollContainer}
                stickyHeaderIndices={[!focused ? 1 : 0]}
                onScroll={(event: { nativeEvent: { contentOffset: { y: any } } }) => {
                    const scrolling = event.nativeEvent.contentOffset.y
                    if (scrolling > 40) {
                        setHeaderShown(true)
                    } else {
                        setHeaderShown(false)
                    }
                }}
                scrollEventThrottle={16}>
                <View style={[appStyle.wrapper]}>
                    <View style={styles.header}>
                        <HeaderBackButton onPress={() => navigation.goBack()} />
                        <H3>
                            Account Management
                        </H3>
                    </View>
                    <View style={[appStyle.row, appStyle.aiCenter, appStyle.divider]}>
                        <View style={styles.profileContainer}>

                            {user?.profilePicture ?
                                <Image style={styles.profile} source={{ uri: imagePath + user?.profilePicture }} />
                                :
                                <Image style={styles.profile} source={Images.profile} />
                            }

                        </View>

                        <View style={[appStyle.asCenter]}>
                            <H4 style={{ color: ColorSet.grey, ...appStyle.pb5 }}>Welcome</H4>
                            <H3 style={{ color: ColorSet.black }}>{user?.firstname + ' ' + user?.lastname}</H3>
                        </View>
                    </View>

                    <View style={[appStyle.mt10]}>
                        <View style={[appStyle.rowWrap, appStyle.jcSpaceBetween, appStyle.pt20]}>
                            <View
                                style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto]}
                            >
                                <View style={[appStyle.rowBtw, appStyle.pb5]}>
                                    <H4 style={styles.cardText}>2-Factor Authorization</H4>
                                    <ToggleSwitch
                                        isOn={authSwitch}
                                        onColor={ColorSet.purple}
                                        offColor={ColorSet.greyMid}
                                        size="small"
                                        onToggle={updateTwoFactorAuthentication}
                                    />
                                </View>

                                <Paragraph>Enable/Disable 2FA on your account</Paragraph>

                            </View>
                            <View
                                style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto]}
                            >
                                <View style={[appStyle.rowBtw, appStyle.pb5]}>
                                    <H4 style={styles.cardText}>Email Notifications</H4>
                                    <ToggleSwitch
                                        isOn={notificationSwitch}
                                        onColor={ColorSet.purple}
                                        offColor={ColorSet.greyMid}
                                        size="small"
                                        onToggle={updateEmailNotification}
                                    />
                                </View>

                                <Paragraph>Enable/Disable email notifications on your account</Paragraph>
                            </View>
                            {supportedBiometry !== null ?
                                <View
                                    style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto]}>
                                    <View style={[appStyle.rowBtw, appStyle.pb5]}>
                                        <H4 style={styles.cardText}>Biometric Authentication</H4>
                                        <ToggleSwitch
                                            isOn={isBiometricsOn}
                                            onColor={ColorSet.purple}
                                            offColor={ColorSet.greyMid}
                                            size="small"
                                            onToggle={onSwitchBiometrics}
                                        />
                                    </View>
                                    <Paragraph>Enable/Disable biometric authentication</Paragraph>
                                </View>
                                :
                                <View
                                    style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto]}>
                                    <View style={[appStyle.rowBtw, appStyle.pb5]}>
                                        <H4 style={styles.cardText}>App lock</H4>
                                        <ToggleSwitch
                                            isOn={isAppLock}
                                            onColor={ColorSet.purple}
                                            offColor={ColorSet.greyMid}
                                            size="small"
                                            onToggle={onSwitchAppLock}
                                        />
                                    </View>
                                    <Paragraph>Enable/Disable App lock</Paragraph>
                                </View>

                            }

                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile')}
                            style={appStyle.menuCard}
                        >
                            <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                                <View style={styles.menuIconContainer}>
                                    <Image style={appStyle.iconMd} source={Images.profileIcon} />
                                </View>
                                <View>
                                    <H4 style={styles.cardText}>Profile Information</H4>
                                    <Paragraph>Manage your profile</Paragraph>
                                </View>
                            </View>
                            <View>
                                <Image source={Images.right} style={appStyle.iconMd} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Document')}
                            style={appStyle.menuCard}>
                            <View style={[appStyle.flex1, appStyle.row, appStyle.aiCenter]}>
                                <View style={styles.menuIconContainer}>
                                    <Image style={appStyle.iconMd} source={Images.document} />
                                </View>
                                <View>
                                    <H4 style={styles.cardText}>KYC Document</H4>
                                    <Paragraph>Your KYC Information</Paragraph>

                                </View>
                            </View>
                            <View>
                                <Image source={Images.right} style={appStyle.iconMd} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <BottomSheet bottomSheetRef={actionSheetRef}
                    bottomCloseBtn={false}
                    closeOnTouchBackdrop>
                    <View>
                        <View style={[appStyle.asFlexEnd]}>
                            <TouchableOpacity
                                style={appStyle.iconContainer}
                                onPress={onPressCloseSheet}
                                hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                                <Image style={appStyle.iconMd} source={Images.cross} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bottomSheetContainer}>
                            <TouchableOpacity
                                style={[appStyle.pb15]}>
                                <H4 style={appStyle.menuItemText}>Please enter your new password</H4>
                            </TouchableOpacity>
                            <Input
                                label="Enter new password"
                                value={password}
                                isSecure
                                // keyboardType="numeric"
                                setValue={setPassword}
                                onChangeText={onChangeText}
                            />
                            <Button onPress={onPressSetAppLock}>Confirm lock</Button>
                        </View>
                    </View>
                </BottomSheet>
            </KeyboardAwareScrollView>

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
    cover: {
        width: '100%',
        height: 'auto',
    },
    profileContainer: {
        borderRadius: 400,
        // padding: 20,
        overflow: 'hidden',
        width: screenWidth.width20,
        height: screenWidth.width20,
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
        // marginTop: 20
        marginRight: 10
    },
    profile: {
        width: screenWidth.width20 - 10,
        height: screenWidth.width20 - 10,
        borderRadius: 200,
        resizeMode: 'cover'
    },
    menuIconContainer: {
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
        // paddingTop: 10
    },
    bottomSheetContainer: {
        height: ScreenSize.screenHeight.height30
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        marginLeft:-15

    }
})

export default AccountScreen
