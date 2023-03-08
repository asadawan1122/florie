import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, TouchableOpacity, Keyboard, BackHandler, UIManager, Image, Animated, Text } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, CardView, Input, Loader, TopTabMenu, Paragraph, Accordion, BottomSheet, Button, H5, H4, H3 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { getData, } from '../../../networking/DashboardApiService'
import { deleteTicket } from '../../../networking/SupportApiService'
import { api } from '../../../networking/Environment'
import { DateHelper, Helper } from '../../../utils/'



if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const actionSheetRef = createRef()

const TicketsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused,] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [ticketId, setTicketId] = useState<string>('')
    const [headerShown, setHeaderShown] = useState(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            getAllTickets()
        })
        return () => unsubscribe.remove()
    }, [navigation]);

    const getAllTickets = async () => {
        setIsLoading(true)
        const response: any = await getData(api.getSupportTickets)
        if (response != null) {
            setTickets(response?.data)
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

    const onPressHandleChat = (ticketId) => {
        navigation.navigate('Chat',{id:ticketId})
    }

    const onPressDelete = async () => {
        console.log('ticketId',ticketId)
        setIsLoading(true)
        actionSheetRef.current?.setModalVisible(false)
        const response: any = await deleteTicket(api.deleteTicket, ticketId)
        let newArray = Helper.filterArrayWithValue(ticketId, tickets)
        setTickets(newArray)
        if (response != null) {
         
            Helper.showToast(response.message)
        }
        setIsLoading(false)
    }
    const openActionSheet = (data) => {
        setTicketId(data._id)
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
                        transform: [{ translateY: translation }],
                        opacity: opacity,
                    }}>
                    <H3 style={styles.headerFixedTitle}>
                        Support Tickets
                    </H3>
                </Animated.View>
                <View style={appStyle.pr15}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddTicket')}
                        hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
                        style={appStyle.iconContainer}
                    >
                        <Image source={Images.add} style={appStyle.iconMd} />
                    </TouchableOpacity>
                </View>
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
                        <H2>Support Tickets</H2>
                    </View>

                    <View style={[appStyle.flex1, appStyle.pt20]}>
                        {tickets.length ?
                            tickets?.map((data, index) => (

                                <View key={index} style={styles.card}>
                                    <View>
                                        <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                                            <View style={appStyle.flex1}>
                                                <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
                                                <H3 style={appStyle.pt5}>{data?._id}</H3>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => openActionSheet(data)}
                                            >
                                                <Image style={appStyle.iconMd} source={Images.delete} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                                            <Image style={appStyle.iconSm} source={Images.date} />
                                            <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
                                        </View>
                                        <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15, {
                                            borderColor: ColorSet.green
                                        }]}>
                                            <View style={[appStyle.rowBtw, appStyle.pt10]}>
                                                <View style={appStyle.flex1}>
                                                    <H5>Status</H5>
                                                    <H5 style={{ ...appStyle.cardDescText, color: data?.status === 'Open' ? ColorSet.green : ColorSet.red }}>{data?.status}</H5>
                                                </View>
                                                <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                                                    {data?.status === 'Open' &&
                                                        <Button
                                                            onPress={() => onPressHandleChat(data?._id)}
                                                            style={{ ...Fonts.size.small }}
                                                            containerStyle={styles.smBtn}>
                                                            Message Admin</Button>
                                                    }
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            ))
                            :
                            <Paragraph style={appStyle.statusMessage}>No ticket</Paragraph>
                        }
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
                            style={[appStyle.row, appStyle.aiCenter, appStyle.pb15]}>
                            <H4 style={appStyle.menuItemText}>Are you sure you want to delete this ticket?</H4>
                        </TouchableOpacity>
                        <View style={appStyle.rowBtw}>
                            <View style={appStyle.btnSmall}>
                                <Button onPress={onPressDelete}>Yes</Button>
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
            // message={'Verifying your information...'}
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
    smBtn: { width: 'auto', height: 40, paddingHorizontal: 15 },
})

export default TicketsScreen
