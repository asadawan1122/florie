import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, Button, Input, Link, ErrorContainer, Loader, H2, Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { transferFund } from '../../../networking/FundApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'
import { getDataFromStorage } from '../../../utils/storage'


if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const U2UTransferScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)

    const emailFormatError = email.length === 0 ? undefined : emailFormat.test(email) ? undefined : 'Enter an email address in the format: yourname@example.com'
    const amountError = amount.length === 0 ? undefined : amount < '1' ? "Amount should be greater than 0" : undefined
    const buttonDisabled = email.length === 0 || emailFormatError  || amount === '' || amountError 
  
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


    const onPressSubmit = async () => {
        Keyboard.dismiss()
        setIsLoading(true)
        const user = await getDataFromStorage('user')
        const data = {
            amount: amount,
            balanceType: 'deposit',
            receiver: email,
            sender: user?.email,
        }
        const response: any = await transferFund(api.userToUserTransfer, data)
        if (response != null) {
            Helper.showToast(response.message)
            navigation.goBack()
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
                        User to User Transfer
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
                        <H2>User to User Transfer</H2>
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
                                    label={'User Email'}
                                    value={email}
                                    setValue={setEmail}
                                    errorText={emailFormatError}
                                    onChangeText={onChangeText}
                                />
                            </View>
                            <View style={[styles.textContainer]}>
                                <Input
                                    label={'Amount'}
                                    value={amount}
                                    setValue={setAmount}
                                    errorText={amountError}
                                    onChangeText={onChangeText}
                                    keyboardType='numeric'
                                />
                            </View>
                            {/* <View style={[styles.textContainer]}>
                                <Input
                                    label={'Which Balance Do You Want To Use?'}
                                    value={email}
                                    setValue={setEmail}
                                    errorText={emailFormatError}
                                    onChangeText={onChangeText}
                                />
                            </View> */}
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
    btnText: {
        color: ColorSet.purple,
        ...Fonts.size.large,
        fontFamily: FamilySet.regular,
    },
    heading: {
        color: ColorSet.purple,
        textDecorationLine: 'underline',
        marginRight: 20,
        fontFamily: FamilySet.bold
    }
})

export default U2UTransferScreen
