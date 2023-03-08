import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, TextInput } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, Button, Input, Link, ErrorContainer, Loader, H2, Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
// import { useDispatch } from 'react-redux'
import { submitDataWithoutParam } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'
import { useSelector } from 'react-redux'



if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const AddTicketScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [subject, setSubject] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const { user } = useSelector(state => state.userReducer)

    const buttonDisabled = subject == '' || message == ''

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
            message,
            subject,
            userId:user?._id
        }
        const response: any = await submitDataWithoutParam(api.submitTicket, data)
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
                        Add Ticket
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
                        <H2>Add Ticket</H2>
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
                                    label={'Subject'}
                                    value={subject}
                                    setValue={setSubject}
                                    onChangeText={onChangeText}
                                />
                            </View>
                            <View style={[styles.textContainer]}>
                                <TextInput
                                    placeholder='Enter your message'
                                    style={styles.input}
                                    value={message}
                                    multiline
                                    scrollEnabled
                                    onChangeText={(message) => setMessage(message)}
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
                    onPress={onPressSubmit}
                >
                    Submit
                </Button>
            </View>
            <Loader
                isLoading={isLoading}
                // shadow={false}
                layout={'outside'}
               
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
    },
    input: {
        borderRadius: 10,
        ...Fonts.size.small,
        fontFamily: FamilySet.medium,
        color: ColorSet.black,
        borderWidth: 1,
        marginTop: 15,
        position: 'relative',
        shadowColor: 'rgba(0,0,0,0.66)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3.0,

        elevation: 6,
        height: 170,
        backgroundColor: ColorSet.white,
        borderColor: ColorSet.greyAccordian,
        textAlignVertical: 'top',
        padding: 15
    },
    label: {
        color: ColorSet.red,
        ...Fonts.size.small,
        fontFamily: FamilySet.medium,
    },
})

export default AddTicketScreen
