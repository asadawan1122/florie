import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, Keyboard, BackHandler, UIManager, Image, Animated, TouchableOpacity } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, Button, Input, Loader, Paragraph, H3, H4, BottomSheet } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenHeight, screenWidth } from '../../../styles/screenSize'
// import { useDispatch } from 'react-redux'
const actionSheetRef = createRef()
const actionSheetWidthdrawRef = createRef()

const InvestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [headerShown, setHeaderShown] = useState(false)

    // const dispatch = useDispatch()
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


    if (
        Platform.OS === 'android' &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    const onPressCloseSheet = (sheet: any) => {
        if (sheet == 'widthdraw') {
            actionSheetWidthdrawRef.current?.setModalVisible(false)
        }
        else{
            actionSheetRef.current?.setModalVisible(false)
        }
    }

    const onPressHandleDepositSheet = async (screen: any) => {
        await actionSheetRef.current?.setModalVisible(false)

        if (screen == 'deposit') {
            navigation.navigate('DepositHistory')
        }
        else {
            navigation.navigate('Deposit')
        }
    }

    const onPressHandleWithdrawSheet = async (screen: any) => {
        await actionSheetWidthdrawRef.current?.setModalVisible(false)
        if (screen == 'withdraw') {
            navigation.navigate('WithdrawHistory')
        }
        else {
            navigation.navigate('Withdraw')
        }
    }

    return (
        <SafeAreaView style={[appStyle.safeContainer]}>

            <View style={[appStyle.header]}>
                <Animated.View
                    style={[appStyle.flex1, appStyle.ph20]}>
                    <H2>
                        Investment System
                    </H2>
                    <Paragraph>Investment plans & transactions</Paragraph>
                </Animated.View>

            </View>
            {/* <View style={appStyle.headerSubPage}>
                <HeaderBackButton onPress={() => navigation.goBack()} />
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{ translateY: translation }],
                        opacity: opacity,
                    }}>
                    <H3>
                        Investment System
                    </H3>
                </Animated.View>
            </View> */}

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
                        {/* <TouchableOpacity
                            onPress={() => navigation.navigate('Deposit')}
                            style={appStyle.detailCard}
                        >
                            <View style={styles.cardIconContainer}>
                                <Image style={appStyle.iconMd} source={Images.deposit} />
                            </View>
                            <H4 style={styles.cardText}>Deposit</H4>
                            <Paragraph>Deposit transactions</Paragraph>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            // onPress={() => navigation.navigate('Deposit')}
                            onPress={() => actionSheetRef.current?.setModalVisible(true)}
                            style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto, appStyle.mb40]}>
                            <View style={[appStyle.row, appStyle.pb5]}>
                                <View style={styles.cardIconContainer}>
                                    <Image style={appStyle.iconMd} source={Images.deposit} />
                                </View>
                                <H4 style={styles.cardText}>Deposit</H4>
                            </View>
                            <Paragraph>Deposit transactions</Paragraph>
                        </TouchableOpacity>

                        <TouchableOpacity
                            // onPress={() => navigation.navigate('Withdraw')}
                            onPress={() => actionSheetWidthdrawRef.current?.setModalVisible(true)}
                            style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto, appStyle.mb40]}>
                            <View style={[appStyle.row, appStyle.pb5]}>
                                <View style={styles.cardIconContainer}>
                                    <Image style={appStyle.iconMd} source={Images.withdraw} />
                                </View>
                                <H4 style={styles.cardText}>Withdraw</H4>
                            </View>
                            <Paragraph>Withdrawal transactions</Paragraph>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Plans')}
                            style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto]}>
                            <View style={[appStyle.row, appStyle.pb5]}>
                                <View style={styles.cardIconContainer}>
                                    <Image style={[appStyle.iconMd]} source={Images.plan} />
                                </View>
                                <H4 style={styles.cardText}>Plans</H4>
                            </View>
                            <Paragraph>Select any plan</Paragraph>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <Loader
                isLoading={isLoading}
                // shadow={false}
                layout={'outside'}
                message={'Verifying your information...'}
            />
            <BottomSheet bottomSheetRef={actionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop
            >
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Deposit Transactions</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={appStyle.pt15}>
                        <TouchableOpacity
                            onPress={onPressHandleDepositSheet}
                            style={appStyle.menuItem}
                        >
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Deposit</H4>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressHandleDepositSheet('deposit')}
                            style={appStyle.menuItem}
                        >
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Deposit History</H4>
                        </TouchableOpacity>
                    </View>

                </View>
            </BottomSheet>

            <BottomSheet bottomSheetRef={actionSheetWidthdrawRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop
            >
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Withdrawal Transactions</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={() => onPressCloseSheet('widthdraw')}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={appStyle.pt15}>
                        <TouchableOpacity
                            onPress={onPressHandleWithdrawSheet}
                            style={appStyle.menuItem}
                        >
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Withdraw</H4>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressHandleWithdrawSheet('withdraw')}
                            style={appStyle.menuItem}
                        >
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Withdraw History</H4>
                        </TouchableOpacity>
                    </View>

                </View>
            </BottomSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    cardText: {
        letterSpacing: 0.3,
        color: '#2C2C2C',
        paddingBottom: 5,
        paddingTop: 10,
        paddingLeft: 10,
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
})

export default InvestScreen
