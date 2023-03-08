import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, UIManager, TouchableOpacity, Image, Animated, Text, useWindowDimensions, ScrollView } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { Loader, Paragraph, Accordion, Button, H5, H4, H3, BottomSheet } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import * as Animatable from 'react-native-animatable'
import { redeemInvestment } from '../../../networking/InvestmentApiService'
import { getData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { DateHelper, Helper } from '../../../utils/'
const actionSheetRef = createRef()

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const ActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [headerShown, setHeaderShown] = useState(false)
    const [planId, setPlanId] = useState<string>('')


    // const dispatch = useDispatch()
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [index, setIndex] = useState(0)
    const [investmentHistory, setInvestmentHistory] = useState([]);
    const [interestHistory, setInterestHistory] = useState([]);
    const [inlineHistory, setInlineHistory] = useState([]);
    const [depositHistory, setDepositHistory] = useState([]);
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);

    const [routes] = useState([
        { key: 'first', title: 'Investments' },
        { key: 'second', title: 'Interest' },
        { key: 'third', title: 'Inline' },
        // { key: 'fourth', title: 'Deposit' },
        // { key: 'fifth', title: 'Withdrawal' },
        { key: 'sixth', title: 'Activity' },
    ])

    const layout = useWindowDimensions()

    useEffect(() => {
        getAllHistory()
    }, []);


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


    const getAllHistory = async () => {
        setIsLoading(true)
        const response1: any = await getData(api.investmentHistory)
        const response2: any = await getData(api.interestHistory)
        const response3: any = await getData(api.inlineHistory)
        // const response4: any = await getData(api.depositHistory)
        // const response5: any = await getData(api.withdrawHistory)
        const response6: any = await getData(api.transactionHistory)

        var reversed_arr1 = Helper.reverseArray(response1?.data)
        setInvestmentHistory(reversed_arr1)
        var reversed_arr2 = Helper.reverseArray(response2?.data)
        setInterestHistory(reversed_arr2)
        var reversed_arr3 = Helper.reverseArray(response3?.data)
        setInlineHistory(reversed_arr3)
        // setDepositHistory(response4?.data)
        // setWithdrawHistory(response5?.data)
        var reversed_arr6 = Helper.reverseArray(response6?.data)
        setActivityHistory(reversed_arr6)
        setIsLoading(false)
    }

    const getStatusColor = (status: string) => {
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


    const FirstRoute = () => (
        <View style={[appStyle.flex1, appStyle.pt20]}>
            <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
                {investmentHistory.length ?
                    investmentHistory?.map((data, index) => (
                        <View key={index} style={styles.card}>
                            <View>
                                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                    <View style={appStyle.flex1}>
                                        <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
                                        <H3 style={{ ...appStyle.pt5, color: ColorSet.purple }}>${data?.userInvestAmount}</H3>
                                        <H4 style={appStyle.pt2}>{data?.planName}</H4>
                                    </View>
                                    <View>
                                        {data?.isRedeem &&

                                            <Button
                                                onPress={() => openModal(data?.userPlanID)}
                                                style={{ ...Fonts.size.small }}
                                                containerStyle={styles.smBtn}>Redeem</Button>
                                        }
                                    </View>
                                </View>
                                <Accordion
                                    label={
                                        <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                                            <Image style={appStyle.iconSm} source={Images.date} />
                                            <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
                                        </View>
                                    }>
                                    <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                                        <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                            <View style={appStyle.flex1}>
                                                <H5>How Often Runs?</H5>
                                                <H5 style={appStyle.cardDescText}>{data?.howOftenRun}</H5>
                                            </View>
                                            <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                                <H5>ROI</H5>
                                                <H5 style={appStyle.cardDescText}>{data?.percentage}%</H5>
                                            </View>
                                        </View>
                                        <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                            <View style={appStyle.flex1}>
                                                <H5>Allow Redeem</H5>
                                                <H5 style={appStyle.cardDescText}>{data?.isRedeem ? 'Yes' : 'No'}</H5>
                                            </View>
                                            <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                                <H5>Days To Run</H5>
                                                <H5 style={appStyle.cardDescText}>{data?.daysToRun} Days</H5>
                                            </View>
                                        </View>
                                    </View>
                                </Accordion>
                            </View>
                        </View>
                    ))
                    :
                    <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
                }
            </ScrollView>
        </View>
    )

    const SecondRoute = () => (
        <View style={[appStyle.flex1, appStyle.pt20]}>
            <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
                {interestHistory.length ?
                    interestHistory?.map((data, index) => (
                        <View key={index} style={styles.card}>
                            <View>
                                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                    <View style={appStyle.flex1}>
                                        <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>

                                        <H4 style={{ ...appStyle.pt5 }}>{data?._id}</H4>
                                        <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                            <H5>Invested Amount:</H5>
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
                                        <View style={appStyle.flex1}>
                                            <H5>Plan Name</H5>
                                            <H5 style={appStyle.cardDescText}>{data?.planName}</H5>
                                        </View>
                                        <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                            <H5>Profit</H5>
                                            <H5 style={{ ...appStyle.cardDescText, color: ColorSet.purple }}>${data?.profit}</H5>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                    :
                    <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
                }

            </ScrollView>
        </View>
    )

    const ThirdRoute = () => (
        <View style={[appStyle.flex1, appStyle.pt20]}>
            <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
                {inlineHistory.length ?
                    inlineHistory?.map((data, index) => (
                        <View key={index} style={styles.card}>
                            <View>
                                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                    <View style={appStyle.flex1}>
                                        <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
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
                                        <View style={appStyle.flex1}>
                                            <H5>Payment Mode</H5>
                                            <H5 style={appStyle.cardDescText}>{data?.transactionType}</H5>
                                        </View>
                                        <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
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
            </ScrollView>
        </View>
    )

    // const FourthRoute = () => (

    //     <View style={[appStyle.flex1, appStyle.pt20]}>
    //         <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
    //             {depositHistory.length ?
    //                 depositHistory?.map((data, index) => (

    //                     <View key={index} style={styles.card}>
    //                         <View>
    //                             <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
    //                                 <View style={appStyle.flex1}>
    //                                     <H4 style={{ color: ColorSet.grey }}>#{data?.id}</H4>

    //                                     <H4 style={{ ...appStyle.pt5 }}>{data?._id}</H4>
    //                                     <View style={[appStyle.rowBtw, appStyle.pt10]}>
    //                                         <H5>Amount:</H5>
    //                                         <H3 style={{ color: ColorSet.purple }}>${data?.amount}</H3>
    //                                     </View>
    //                                 </View>
    //                             </View>
    //                             <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
    //                                 <Image style={appStyle.iconSm} source={Images.date} />
    //                                 <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
    //                             </View>
    //                             <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
    //                                 <View style={[appStyle.rowBtw, appStyle.pt10]}>
    //                                     <View style={[appStyle.flex1]}>
    //                                         <H5>Status</H5>
    //                                         <H5 style={{ ...appStyle.cardDescText, color: getStatusColor(data?.status) }}>{data?.status}</H5>
    //                                     </View>
    //                                 </View>
    //                             </View>
    //                         </View>
    //                     </View>
    //                 ))
    //                 :
    //                 <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
    //             }
    //         </ScrollView>
    //     </View>
    // )

    // const FifthRoute = () => (
    //     <View style={[appStyle.flex1, appStyle.pt20]}>
    //         <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
    //             {withdrawHistory.length ?
    //                 withdrawHistory?.map((data, index) => (
    //                     <View key={index} style={styles.card}>
    //                         <View>
    //                             <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
    //                                 <View style={appStyle.flex1}>
    //                                     <H4 style={{ color: ColorSet.grey }}>#{data?.id}</H4>

    //                                     <H4 style={{ ...appStyle.pt5 }}>{data?._id}</H4>
    //                                     <View style={[appStyle.rowBtw, appStyle.pt10]}>
    //                                         <H5>Amount:</H5>
    //                                         <H3 style={{ color: ColorSet.purple }}>${data?.amount}</H3>
    //                                     </View>
    //                                 </View>
    //                             </View>
    //                             <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
    //                                 <Image style={appStyle.iconSm} source={Images.date} />
    //                                 <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
    //                             </View>
    //                             <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
    //                                 <View style={[appStyle.rowBtw, appStyle.pt10]}>
    //                                     <View style={[appStyle.flex1]}>
    //                                         <H5>Status</H5>
    //                                         <H5 style={{ ...appStyle.cardDescText, color: getStatusColor(data?.status) }}>{data?.status}</H5>
    //                                     </View>
    //                                 </View>
    //                             </View>
    //                         </View>
    //                     </View>
    //                 ))
    //                 :
    //                 <Paragraph style={appStyle.statusMessage}>No data found</Paragraph>
    //             }
    //         </ScrollView>
    //     </View>
    // )

    const SixthRoute = () => (
        <View style={[appStyle.flex1, appStyle.pt20]}>
            <ScrollView contentContainerStyle={styles.scrollContainerTabs}>
                {activityHistory.length ?
                    activityHistory?.map((data, index) => (
                        <View key={index} style={styles.card}>
                            <View>
                                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                    <View style={appStyle.flex1}>
                                        <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>

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
                                            <H5>Activity Mode</H5>
                                            <H5 style={{ ...appStyle.cardDescText }}>{data?.transactionType}</H5>
                                        </View>
                                        <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                            <H5>Deposit</H5>
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
            </ScrollView>
        </View>
    )

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
        // fourth: FourthRoute,
        // fifth: FifthRoute,
        sixth: SixthRoute,
    })

    const redeem = async () => {

        actionSheetRef.current?.setModalVisible(false)
        setIsLoading(true)
        const response: any = await redeemInvestment(api.redeemInvestment, planId)
        setIsLoading(false)
    }

    const openModal = (planId) => {

        setPlanId(planId)
        actionSheetRef.current?.setModalVisible(true)
    }


    const onPressCloseSheet = () => {
        actionSheetRef.current?.setModalVisible(false)
    }
    return (
        <SafeAreaView style={[appStyle.safeContainer]}>
            <View style={appStyle.headerSubPage}>
                <HeaderBackButton onPress={() => navigation.goBack()} />
                <Animated.View
                    style={{
                        flex: 1,
                    }}>
                    <H3 style={styles.headerFixedTitle}>
                        Activity
                    </H3>
                </Animated.View>
            </View>

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
                    <View style={[appStyle.headerTitleContainerSubpage, appStyle.ph20]}>
                        {/* {descView && */}
                        <Animatable.View
                            animation={'fadeInUp'}>
                            <H4 style={{ color: ColorSet.purple }}>
                                {index === 0 ? 'Running Investments'
                                    : index === 1 ? 'Interest History'
                                        : index === 2 ? 'Inline Transaction History'
                                            // : index === 3 ? 'Deposit History'
                                                // : index === 4 ? 'Withdrawal History'
                                                    : index === 3 ? 'Activity History'
                                                        : 'Your activity & history'
                                }
                            </H4>
                        </Animatable.View>
                        {/* } */}

                    </View>
                    <View style={[appStyle.flex1]}>
                        <TabView
                            style={styles.tabBar}
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={{ width: layout.width }}
                            renderTabBar={props => (
                                <TabBar
                                    {...props}
                                    bounces={true}
                                    style={styles.tabBarContainer}
                                    pressColor={ColorSet.purpleLight}
                                    tabStyle={styles.tabStyle}
                                    scrollEnabled={true}
                                    activeColor={'#000'}
                                    // getLabelText={({ route }) => route.title}
                                    inactiveColor={'#ccc'}
                                    indicatorStyle={{ backgroundColor: ColorSet.purple }}
                                    renderLabel={({ route, color, focused }) => (
                                        <View>
                                            <View style={[styles.badge, { backgroundColor: focused ? ColorSet.purple : 'transparent' }]} />
                                            <H3
                                                style={{
                                                    color,
                                                    fontFamily: FamilySet.regular
                                                }}>
                                                {route.title}
                                            </H3>
                                        </View>

                                    )}
                                />
                            )}
                        />
                    </View>

                </View>
            </KeyboardAwareScrollView>
            <BottomSheet bottomSheetRef={actionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop
            >
                <View>
                    <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.asFlexEnd]}>
                        <TouchableOpacity

                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={onPressCloseSheet}
                            style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}
                        >
                            <H4 style={appStyle.menuItemText}>Are you sure you want to redeem?</H4>
                        </TouchableOpacity>
                        <View style={appStyle.rowBtw}>
                            <View style={appStyle.btnSmall}>
                                <Button onPress={redeem}>Yes</Button>
                            </View>
                            <View style={appStyle.btnSmall}>
                                <Button onPress={onPressCloseSheet} containerStyle={{ backgroundColor: ColorSet.red }}>No</Button>
                            </View>
                        </View>
                    </View>
                </View>
            </BottomSheet>
            <Loader
                isLoading={isLoading}
                // shadow={false}
                layout={'outside'}
            // message={'Fetching data...'}
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
    },
    tabBarContainer: {
        backgroundColor: '#fff', shadowColor: "rgba(0,0,0,0.66)",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    },
    tabBar: {
        marginTop: 10,
        marginHorizontal: -15,
    },
    tabsContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E5FCE3',
    },
    badge: {
        width: 4, height: 4, borderRadius: 12, marginBottom: 5,
    },
    tabStyle: { flexWrap: 'wrap', width: 'auto' },
    smBtn: { width: 'auto', height: 40, paddingHorizontal: 15 },
    scrollContainerTabs: { flexGrow: 1, paddingHorizontal: 15 }
})

export default ActivityScreen
