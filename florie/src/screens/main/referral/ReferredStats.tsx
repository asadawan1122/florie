import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform, UIManager, Image, Animated } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, ColorSet } from '../../../styles'
import { H2, Loader, Paragraph, H5, H4, H3 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { getData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'

const ReferredStatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [headerShown, setHeaderShown] = useState(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [statArray, setStatArray] = useState([]);

    useEffect(() => {
        getAllReferralStats()
    }, []);

    const getAllReferralStats = async () => {
        setIsLoading(true)
        const response: any = await getData(api.getUserReferralStats)
        if (response != null) {
            setStatArray(response?.message)
        }
        setIsLoading(false)
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

    if (
        Platform.OS === 'android' &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    return (
        <SafeAreaView style={[appStyle.safeContainer]}>
            {!focused && (
                <View style={appStyle.headerSubPage}>
                    <HeaderBackButton onPress={() => navigation.goBack()} />
                    <Animated.View
                        style={{
                            flex: 1,
                            transform: [{ translateY: translation }],
                            opacity: opacity,

                        }}>
                        <H3 style={styles.headerFixedTitle}>
                            Statistics
                        </H3>
                    </Animated.View>
                </View>
            )}

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
                style={appStyle.flex1}
            >

                <View style={[appStyle.wrapper]}>
                    {!focused && (
                        <View style={[appStyle.headerTitleContainerSubpage, appStyle.ph20]}>
                            <H2>Statistics</H2>
                            <Paragraph>Referral Commissions</Paragraph>
                        </View>
                    )}

                    <View style={[appStyle.flex1, appStyle.pt20]}>
                        {statArray?.length ?
                            statArray?.map((data, index) => (
                                <View key={index} style={styles.card}>
                                    <View>
                                        <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                            <View style={appStyle.flex1}>
                                                <H4 style={{ color: ColorSet.grey }}>#1</H4>
                                                <View style={[appStyle.flex1, appStyle.pt10]}>
                                                    <H5>Referral ID:</H5>
                                                    <H3 style={appStyle.pt5}>{data?._id}</H3>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                                            <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                <View style={appStyle.flex1}>
                                                    <H5>Amount</H5>
                                                    <H5 style={appStyle.cardDescText}>${data?.amount}</H5>
                                                </View>
                                                <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                                    <H5>Level</H5>
                                                    <H5 style={appStyle.cardDescText}>{data?.levelName}</H5>
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
            </KeyboardAwareScrollView>

            <Loader
                isLoading={isLoading}
                layout={'outside'}
            />

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    title: {
        ...Fonts.size.medium,
    },
    headerFixedTitle: {
        ...Fonts.size.medium,
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
    cardIconContainer: {
        marginRight: 15,
        alignSelf: 'flex-start',
    }
})

export default ReferredStatsScreen
