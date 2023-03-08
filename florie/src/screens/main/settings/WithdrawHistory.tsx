import React, { useEffect, useRef, useState, createRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, TextInput, ScrollView } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, H4, Button, Input, Link, ErrorContainer, Loader, H2, BottomSheet, H5, Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
// import { useDispatch } from 'react-redux'
import { submitData, getData, getDataWithoutId } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { DateHelper, Helper } from '../../../utils/'


if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const gatewayActionSheetRef = createRef()
const cryptoAddressActionSheetRef = createRef()

const WithdrawHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const [transactionType] = useState<string>('Withdrawal')
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)

    const [withdrawHistory, setWithdrawHistory] = useState([]);


    useEffect(() => {
        getAllHistory()
    }, [])

    const getAllHistory = async () => {
        setIsLoading(true)
        const response: any = await getData(api.withdrawHistory)
        var reversed_arr = Helper.reverseArray(response?.data)
        setWithdrawHistory(reversed_arr)
        setIsLoading(false)
    }

    const getStatusColor = (status: any) => {
        let color = ColorSet.green
        if (status === 'Pending') {
            color = ColorSet.yellow
        }
        else if (status === 'Approved') {
            color = ColorSet.green
        }
        else {
            color = ColorSet.red
        }
        return color
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
                    Withdraw History
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
                        <H2>Withdraw History</H2>
                    </View>

                    <View>
                        <ErrorContainer
                            isVisible={isErrorVisible}
                            label={error}
                            onClose={() => setIsErrorVisible(false)}
                        />
                        <ErrorContainer label={'this is a error text'} status={'info'} />

                        <View style={appStyle.pt15}>
                            {withdrawHistory.length ?
                                withdrawHistory?.map((data, index) => (
                                    <View key={index} style={styles.card}>
                                        <View>
                                            <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                                <View style={appStyle.flex1}>
                                                    <H4 style={{ color: ColorSet.grey }}>#{data?.id}</H4>

                                                    <H4 style={{ ...appStyle.pt5 }}>{data?._id}</H4>
                                                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                        <H5>Amount:</H5>
                                                        <H3 style={{ color: ColorSet.purple }}>${data?.amount}</H3>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                                                <Image style={appStyle.iconSm} source={Images.date} />
                                                <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
                                            </View>
                                            <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                                                <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                    <View style={[appStyle.flex1]}>
                                                        <H5>Status</H5>
                                                        <H5 style={{ ...appStyle.cardDescText, color: getStatusColor(data?.status) }}>{data?.status}</H5>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))
                                :
                                <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
                            }

                        </View>
                    </View>

                </View>
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
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.26)',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.12,
        shadowRadius: 9.51,

        elevation: 23,
        borderRadius: 12,
        // padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        paddingBottom: 15
    },
})

export default WithdrawHistoryScreen
