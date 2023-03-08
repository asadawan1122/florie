import React, { useEffect, useRef, useState, createRef } from 'react'
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Image, Animated, Modal, Platform, UIManager, Keyboard } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H3, H4, H5, Button, Input, ErrorContainer, Loader, H2, BottomSheet, Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenWidth } from '../../../styles/screenSize'
// import { useDispatch } from 'react-redux'
import { submitData, getDataWithoutId } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'
import Clipboard from '@react-native-community/clipboard'
import { WebView } from 'react-native-webview';
import { showToast } from '../../../utils/helpers'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const actionSheetRef = createRef()
const cryptoExchangeActionSheetRef = createRef()
const cryptoAddressActionSheetRef = createRef()

const DepositScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [addressName, setAddressName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const [depositType, setDepositType] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [transactionType] = useState<string>('Deposit')
    const [cryptoAddresses, setCryptoAddresses] = useState([]);
    const [address, setAddress] = useState<string>('')
    const [addressType] = useState<string>('BTC')
    const [referenceCode, setReferenceCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [cardNumber, setCardNumber] = useState<string>('')
    const [cardCVC, setCardCVC] = useState<string>('')
    const [cardExpMonth, setCardExpMonth] = useState<string>('')
    const [cardExpYear, setCardExpYear] = useState<string>('')

    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');


    const nameError = name.length === 0 || name.length > 2 ? undefined : 'Enter name'
    const cardNumberError = cardNumber.length === 0 || cardNumber.length == 16 ? undefined : 'Enter valid card number'
    const cardExpMonthError = cardExpMonth.length === 0 || cardExpMonth.length === 2 ? undefined : 'Card month format (MM)'
    const cardExpYearError = cardExpYear.length === 0 || cardExpYear.length === 2 ? undefined : 'Card year format (YY)'
    const cardCVCError = cardCVC.length === 0 || cardCVC.length > 2 ? undefined : 'CVC should be greater than two'
    const stripeButtonDisabled = amount == '' || name == '' || cardNumber == '' || cardExpMonth == '' || cardExpYear == '' || cardCVC == '' || cardNumberError || cardExpMonthError || cardExpYearError || cardCVCError
    const cryptoExchangeButtonDisabled = amount == '' || address == ''
    const paypalButtonDisabled = false


    useEffect(() => {

        getAllCryptoAddress()
    }, [])

    const getAllCryptoAddress = async () => {

        setIsLoading(true)
        const response: any = await getDataWithoutId(api.getAllCryptoGateway)
        if (response != null) {
            setCryptoAddresses(response.data)
        }
        setIsLoading(false)
    }

    const onChangeText = () => {
        if (error.length > 0) {
            setError('')
            setIsErrorVisible(true)
        }
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


    const onPressCopyLink = (link: any, msg: any) => {
        Clipboard.setString(link)
        // Alert.alert('copied', link)
        Helper.showToast(msg)
    }

    const selectDepositType = (depositType) => {
        setDepositType(depositType)
        actionSheetRef.current?.setModalVisible(false)
    }


    const onPressDepositType = () => {
        actionSheetRef.current?.setModalVisible(true)
    }
    const onPressCloseSheet = () => {
        actionSheetRef.current?.setModalVisible(false)
        cryptoExchangeActionSheetRef.current?.setModalVisible(false)
        cryptoAddressActionSheetRef.current?.setModalVisible(false)
    }

    const depositWithStripe = async () => {

        Keyboard.dismiss()
        setIsLoading(true)
        const data = { cardNumber, amount, cardCVC, cardExpMonth, cardExpYear, depositType, name, transactionType }
        const response: any = await submitData(api.depositAmountWithStripe, data)
        if (response != null) {
            Helper.showToast(response.message)
            navigation.goBack()
        }
        setIsLoading(false)
    }
    const depositWithCryptoExchange = async () => {
        cryptoExchangeActionSheetRef.current?.setModalVisible(false)
        setIsLoading(true)
        const data = { address, addressType, amount, depositType, referenceCode, transactionType }
        const response: any = await submitData(api.depositAmountWithCryptoExchange, data)
        if (response != null) {
            Helper.showToast(response.message)
            navigation.goBack()
        }
        setIsLoading(false)
    }


    const generateReferenceCode = async () => {
        setIsLoading(true)
        const response: any = await getDataWithoutId(api.generateReferenceCodeForDeposit)

        if (response != null) {
            setReferenceCode(response.data)
            cryptoExchangeActionSheetRef.current?.setModalVisible(true)
        }
        setIsLoading(false)
    }

    const selectAddress = (data: any) => {
        console.log('selected address', data)
        const name = data?.addressName
        cryptoAddressActionSheetRef.current?.setModalVisible(false)
        setAddress(name)
    }
    const depositWithPaypal = async (paidAmount:number) => {

        Keyboard.dismiss()
        setIsLoading(true)
        const data = { amount:Math.round(paidAmount) }
        const response: any = await submitData(api.depositAmountWithPaypal, data)
        console.log('response', response)
        showToast(response.message)
        setIsLoading(false)
    }
    const onMessage = (e) => {
        let data = e.nativeEvent.data;
        setShowGateway(false);
        console.log(data);
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
            console.log('payment response', payment)
            const amountObj = payment.purchase_units
            const paidAmount = amountObj[0].amount.value
            depositWithPaypal(paidAmount)
        } else {
            alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
        }
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
                        Deposit
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
                        <H2>Deposit</H2>
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
                                    label={'Transaction Type'}
                                    value={'Deposit'}
                                    setValue={setAddressName}
                                    onChangeText={onChangeText}
                                    editable={false}
                                />
                            </View>
                            <TouchableOpacity style={[styles.textContainer]}
                                onPress={onPressDepositType}>
                                <Input
                                    label={'Available Deposit Types'}
                                    editable={false}
                                    setValue={setAddressName}
                                    value={depositType}
                                />
                            </TouchableOpacity>
                            {depositType != 'Paypal' &&
                                <View style={[styles.textContainer]}>
                                    <Input
                                        label={'Amount'}
                                        value={amount}
                                        setValue={setAmount}
                                        onChangeText={onChangeText}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            }

                            {depositType === 'Crypto-Exchange' &&
                                <TouchableOpacity style={[styles.textContainer]}
                                    onPress={() => cryptoAddressActionSheetRef.current?.setModalVisible(true)}>
                                    <Input
                                        label={'Crypto-Exchange --Crypto Address'}
                                        value={address}
                                        setValue={setAddress}
                                        onChangeText={onChangeText}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            }

                            {depositType === 'Stripe' &&
                                <View style={appStyle.mt30}>
                                    <H4>STRIPE --Credit Card Information</H4>
                                    <Input
                                        label={'Name'}
                                        value={name}
                                        errorText={nameError}
                                        setValue={setName}
                                        onChangeText={onChangeText}
                                    />

                                    <Input
                                        label={'Card number'}
                                        value={cardNumber}
                                        setValue={setCardNumber}
                                        onChangeText={onChangeText}
                                        keyboardType='numeric'
                                        errorText={cardNumberError}
                                    />
                                    <View style={styles.inputSmallContainer}>
                                        <View style={styles.inputSmall}>
                                            <Input
                                                label={'Expiry month'}
                                                value={cardExpMonth}
                                                setValue={setCardExpMonth}
                                                onChangeText={onChangeText}
                                                keyboardType='numeric'
                                                errorText={cardExpMonthError}
                                            />
                                        </View>
                                        <View style={styles.inputSmall}>
                                            <Input
                                                label={'Expiry Year'}
                                                value={cardExpYear}
                                                setValue={setCardExpYear}
                                                onChangeText={onChangeText}
                                                keyboardType='numeric'
                                                errorText={cardExpYearError}
                                            />
                                        </View>
                                        <View style={styles.inputSmall}>
                                            <Input
                                                label={'CVC'}
                                                value={cardCVC}
                                                setValue={setCardCVC}
                                                onChangeText={onChangeText}
                                                keyboardType='numeric'
                                                errorText={cardCVCError}
                                            />
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>

                    {showGateway ? (
                        <Modal
                            visible={showGateway}
                            onDismiss={() => setShowGateway(false)}
                            onRequestClose={() => setShowGateway(false)}
                            animationType={'fade'}
                            transparent>
                            <View style={styles.webViewCon}>
                                <View style={styles.wbHead}>
                                    <TouchableOpacity
                                        style={{ padding: 13 }}
                                        onPress={() => setShowGateway(false)}>
                                        <Image source={Images.close} />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#00457C',
                                        }}>
                                        PayPal GateWay
                                    </Text>
                                    <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                                        <ActivityIndicator size={24} color={progClr} />
                                    </View>
                                </View>
                                <WebView
                                    source={{ uri: 'https://my-pay-web.web.app/' }}
                                    style={{ flex: 1 }}
                                    onLoadStart={() => {
                                        setProg(true);
                                        setProgClr('#000');
                                    }}
                                    onLoadProgress={() => {
                                        setProg(true);
                                        setProgClr('#00457C');
                                    }}
                                    onLoadEnd={() => {
                                        setProg(false);
                                    }}
                                    onLoad={() => {
                                        setProg(false);
                                    }}
                                    onMessage={onMessage}
                                />
                            </View>
                        </Modal>
                    ) : null}
                </View>
            </KeyboardAwareScrollView>
            <View style={[appStyle.aiCenter, appStyle.ph20, appStyle.pb20]}>
                {depositType === 'Crypto-Exchange' &&
                    <Button
                        onPress={generateReferenceCode}
                        containerStyle={appStyle.mt15}
                        style={{ ...Fonts.size.small }}
                        disable={cryptoExchangeButtonDisabled ? true : false}>
                        Pay with crypto exchange
                    </Button>
                }

                {depositType === 'Stripe' &&
                    <Button
                        onPress={depositWithStripe}
                        containerStyle={appStyle.mt15}
                        style={{ ...Fonts.size.small }}
                        disable={stripeButtonDisabled ? true : false}>
                        Pay with stripe
                    </Button>
                }
                {depositType === 'Paypal' &&
                    <Button
                        onPress={() => setShowGateway(true)}
                        containerStyle={appStyle.mt15}
                        style={{ ...Fonts.size.small }}
                        disable={paypalButtonDisabled ? true : false}
                    >
                        Pay with paypal
                    </Button>
                }



            </View>

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
                        <H3>Available Deposit Types</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={appStyle.pt15}>
                        <TouchableOpacity

                            onPress={() => selectDepositType('Stripe')}
                            style={appStyle.menuItem}>
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Stripe -- (Automatic)</H4>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => selectDepositType('Crypto-Exchange')}
                            style={appStyle.menuItem}>
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Crypto-Exchange -- (Manual)</H4>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => selectDepositType('Paypal')}
                            style={appStyle.menuItem}>
                            <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Paypal -- (Automatic)</H4>
                        </TouchableOpacity>
                    </View>

                </View>
            </BottomSheet>

            <BottomSheet bottomSheetRef={cryptoExchangeActionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop
            >
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Pre-Confirmation Transaction Info</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSheetContainer}>
                        <H5 style={styles.sheetText}>You are depositing ${amount} in BTC</H5>
                        <H5 style={styles.sheetText}>Transfer ${amount} in BTC to the following address</H5>
                        <TouchableOpacity style={[appStyle.row]} onPress={() => onPressCopyLink(amount, 'Address copied')}>
                            <H5 style={styles.sheetText}>Address: <H5 style={styles.copyText}>{address}</H5></H5>
                        </TouchableOpacity>
                        <TouchableOpacity style={[appStyle.row]} onPress={() => onPressCopyLink(amount, 'Reference code copied')}>
                            <H5 style={styles.sheetText}>Please use reference code: <H5 style={styles.copyText}>{referenceCode}</H5>  to complete your transaction</H5>
                        </TouchableOpacity>
                        <H5 style={styles.sheetText}>*Click the text to copy!*</H5>
                        <H5> *please make sure you have made the payment*</H5>
                        <Button
                            onPress={depositWithCryptoExchange}
                            containerStyle={appStyle.mt15}
                            style={{ ...Fonts.size.small }}>
                            I have made the payment
                        </Button>
                    </View>

                </View>
            </BottomSheet>

            <BottomSheet bottomSheetRef={cryptoAddressActionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop>
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Crypto-Exchange --Select Available Cryto Address</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={appStyle.pt15}>
                        {
                            cryptoAddresses?.map((data, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => selectAddress(data)}
                                    style={appStyle.menuItem}>
                                    <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>{data?.addressName}</H4>
                                </TouchableOpacity>
                            ))

                        }
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
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputSmallContainer: {
        flexDirection: 'row',
    },
    inputSmall: {
        width: screenWidth.width30,
        marginHorizontal: 2

    },
    bottomSheetContainer: {
        height: ScreenSize.screenHeight.height50
    },
    sheetText: {
        paddingVertical: 10
    },
    icon: {
        height: 15, width: 15, resizeMode: 'contain'
    },
    copyText: {
        color: ColorSet.purple
    },
    //webview
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    },
})

export default DepositScreen
