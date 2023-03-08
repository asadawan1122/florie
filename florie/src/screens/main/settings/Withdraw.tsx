import React, { useEffect, useRef, useState, createRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, TextInput } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, H4, Button, Input, Link, ErrorContainer, Loader, H2, BottomSheet } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
// import { useDispatch } from 'react-redux'
import { submitData, getData, getDataWithoutId } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'


if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const gatewayActionSheetRef = createRef()
const cryptoAddressActionSheetRef = createRef()

const DepositScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [addressName, setAddressName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const [transactionType] = useState<string>('Withdrawal')
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const [gatewayAddresses, setGatewayAddresses] = useState([]);
    const [cryptoAddresses, setCryptoAddresses] = useState([]);
    const [amount, setAmount] = useState<string>('')

    const [selectedGatewayAddress, setSelectedGatewayAddress] = useState<string>('')
    const [selectedExchangeAddress, setSelectedExchangeAddress] = useState<string>('')

    const buttonDisabled = amount == '' || selectedGatewayAddress == '' || selectedExchangeAddress == ''

    useEffect(() => {

        getAllAddress()
    }, [])

    const getAllAddress = async () => {

        setIsLoading(true)
        const cryptoGatewaysAddressResponse: any = await getDataWithoutId(api.getAllCryptoGateway)
        const cryptoExchangeAddressResponse: any = await getData(api.getAllUserCryptoAddress)
        if (cryptoGatewaysAddressResponse != null) {
            setGatewayAddresses(cryptoGatewaysAddressResponse.data)
        }
        if (cryptoExchangeAddressResponse != null) {
            setCryptoAddresses(cryptoExchangeAddressResponse.data)
        }
        setIsLoading(false)
    }

    const onChangeText = () => {
        if (error.length > 0) {
            setError('')
            setIsErrorVisible(true)
        }
    }
    const selectAddress = (data: any, type: any) => {
        gatewayActionSheetRef.current?.setModalVisible(false)
        cryptoAddressActionSheetRef.current?.setModalVisible(false)
        if (type === 'gateway') {
            setSelectedGatewayAddress(data?.addressName)
            return
        }
        setSelectedExchangeAddress(data?.name)

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

    const onPressSubmit = async () => {
        Keyboard.dismiss()
        setIsLoading(true)
        const data = {
            CryptoAddress: selectedGatewayAddress,
            addressType: selectedExchangeAddress,
            amount: amount,
            transactionType: transactionType
        }
        const response: any = await submitData(api.withdraw, data)

        if (response != null) {
            Helper.showToast(response.message)
            navigation.goBack()
        }
        setIsLoading(false)
    }
    const onPressCloseSheet = () => {

        gatewayActionSheetRef.current?.setModalVisible(false)
        cryptoAddressActionSheetRef.current?.setModalVisible(false)
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
                        Withdraw
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
                        <H2>Withdraw</H2>
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
                                    value={'Withdrawal'}
                                    setValue={setAddressName}
                                    onChangeText={onChangeText}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.textContainer]}>
                                <Input
                                    label={'Amount'}
                                    value={amount}
                                    setValue={setAmount}
                                    onChangeText={onChangeText}
                                    keyboardType={'numeric'}
                                />
                            </View>

                            <TouchableOpacity style={[styles.textContainer]}
                                onPress={() => gatewayActionSheetRef.current?.setModalVisible(true)}>

                                <Input
                                    label={'Available Crypto Gateways'}
                                    value={selectedGatewayAddress}
                                    setValue={setAddressName}
                                    editable={false}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.textContainer]}
                                onPress={() => cryptoAddressActionSheetRef.current?.setModalVisible(true)}>
                                <Input
                                    label={'Crypto-Exchange --Select Crypto Address'}
                                    value={selectedExchangeAddress}
                                    setValue={setAddressName}
                                    editable={false}
                                />
                            </TouchableOpacity>



                        </View>
                    </View>

                </View>
            </KeyboardAwareScrollView>
            <View style={[appStyle.aiCenter, appStyle.ph20, appStyle.pb20]}>
                <Button
                    onPress={onPressSubmit}
                    containerStyle={appStyle.mt15}
                    style={{ ...Fonts.size.small }}
                    disable={buttonDisabled ? true : false}
                >
                    Submit
                </Button>
            </View>



            <BottomSheet bottomSheetRef={cryptoAddressActionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop>
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Available Crypto Gateways</H3>
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
                                    onPress={() => selectAddress(data, 'exchange')}

                                    style={appStyle.menuItem}>
                                    <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>{data?.name}</H4>
                                </TouchableOpacity>
                            ))

                        }
                    </View>

                </View>
            </BottomSheet>

            <BottomSheet bottomSheetRef={gatewayActionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop>
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
                        borderBottomWidth: 1,
                        borderColor: '#C6C8CB',
                        marginHorizontal: -20,
                    }]}>
                        <H3>Crypto-Exchange --Select Crypto Address</H3>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={appStyle.pt15}>
                        {
                            gatewayAddresses?.map((data, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => selectAddress(data, 'gateway')}
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
})

export default DepositScreen
