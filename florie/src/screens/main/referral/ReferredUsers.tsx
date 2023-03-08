import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, TouchableOpacity, Keyboard, BackHandler, UIManager, Image, Animated, Text } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, CardView, Input, Loader, TopTabMenu, Paragraph, Accordion, BottomSheet, Button, H5, H4, H3 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { getData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { DateHelper } from '../../../utils/'

const ReferredUsersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [headerShown, setHeaderShown] = useState(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [referralArray, setReferralArray] = useState([]);


    useEffect(() => {
        getAllUserReferral()
    }, []);

    const getAllUserReferral = async () => {
        setIsLoading(true)
        const response: any = await getData(api.getUserReferrals)
        if (response != null) {
            setReferralArray(response?.data)
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
                            User Referrals
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
                            <H2>Users</H2>
                            <Paragraph>Your Referred Users</Paragraph>
                        </View>
                    )}

                    <View style={[appStyle.flex1, appStyle.pt20]}>
                        {referralArray.length != 0 ?
                            referralArray.map((data, index) => {
                                let user = data?.user
                                return (
                                    <View key={index} style={styles.card}>
                                        <View>
                                            <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                                <View style={appStyle.flex1}>
                                                    <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
                                                    <H3 style={appStyle.pt5}>{user?.firstname + ' ' + user?.lastname}</H3>
                                                </View>
                                            </View>
                                            <Accordion
                                                label={
                                                    <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                                                        <Image style={appStyle.iconSm} source={Images.date} />
                                                        <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(user?.createdAt)}</Paragraph>
                                                    </View>
                                                }
                                            >
                                                <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                                                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                        <View style={appStyle.flex1}>
                                                            <H5>Referral ID</H5>
                                                            <H5 style={appStyle.cardDescText}>{user?._id}</H5>
                                                        </View>
                                                        <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                                            <H5>User's Email</H5>
                                                            <H5 style={appStyle.cardDescText}>{user?.email}</H5>
                                                        </View>
                                                    </View>
                                                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                        <View style={appStyle.flex1}>
                                                            <H5>User's Contact Number</H5>
                                                            <H5 style={appStyle.cardDescText}>{user?.phoneNumber}</H5>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Accordion>
                                        </View>
                                    </View>
                                )
                            })
                            :
                            <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
                        }
                    </View>

                </View>
            </KeyboardAwareScrollView>

            <Loader
                isLoading={isLoading}
                // shadow={false}
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

export default ReferredUsersScreen
