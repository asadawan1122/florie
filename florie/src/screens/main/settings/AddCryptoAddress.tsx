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
// import { useDispatch } from 'react-redux'
import { submitData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const AddCryptoAddress: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [addressName, setAddressName] = useState<string>('')
    const [cryptoAddress, setCryptoAddress] = useState<string>('')
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)

    const buttonDisabled = addressName == '' || cryptoAddress == ''

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
        const data = {
            name: addressName,
            address: cryptoAddress
        }
        const response: any = await submitData(api.addCryptoAddress, data)
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
                        Add Crypto Address
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
                        <H2>Add Crypto Address</H2>
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
                                    label={'Address Name'}
                                    value={addressName}
                                    setValue={setAddressName}
                                    onChangeText={onChangeText}
                                />
                            </View>
                            <View style={[styles.textContainer]}>
                                <Input
                                    label={'Crypto Address'}
                                    value={cryptoAddress}
                                    setValue={setCryptoAddress}
                                    onChangeText={onChangeText}
                                />
                            </View>
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
                    Add Address
                </Button>
            </View>
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

export default AddCryptoAddress
