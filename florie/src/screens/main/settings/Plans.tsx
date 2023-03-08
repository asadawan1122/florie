import React, { useEffect, useRef, useState, createRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Keyboard, Animated, Platform, UIManager, } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H3, Button, ErrorContainer, Loader, Paragraph, H4, H5, BottomSheet, Input } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { screenWidth } from '../../../styles/screenSize'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { getDataWithoutId,  } from '../../../networking/DashboardApiService'
import { submitData } from '../../../networking/PlanApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils/'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
const actionSheetRef = createRef()

const PlansScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [plans, setPlans] = useState([]);
    const [price, setPrice] = useState<string>('')
    const plan1 = plans.length != 0 && plans[0]
    const plan2 = plans.length != 0 && plans[1]

    const [carouselItems, setCarouselItems] = useState(
        [
            { image: Images.plan1, title: 'Yield Basic', invested: true, redemption: true, price: '$2000 - $49999', selected: false, description: 'This plan will run on Weekdays, with 0.9% ROI on every invested amount. This plan will run for 90 days and will start immediately' },
            { image: Images.plan2, title: 'Yield Standard', invested: true, redemption: true, price: '$50000 - $200000', selected: true, description: 'This plan will run on Weekdays, with 1.9% ROI on every invested amount. This plan will run for 90 days and will start immediately' },
        ]
    )

    const onChangeText = () => {
        if (error.length > 0) {
            setError('')
            setIsErrorVisible(true)
        } else {
            setIsErrorVisible(false)
            setError('')
        }
    }
    useEffect(() => {
        getAllPlan()
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

    const getAllPlan = async () => {
        setIsLoading(true)
        const response: any = await getDataWithoutId(api.plans)
        if (response != null) {
            setPlans(response.data)
        }
        setIsLoading(false)
    }

    const onPressCloseSheet = () => {
        actionSheetRef.current?.setModalVisible(false)
    }

    const onPressConfirmPlan = async () => {
        setIsLoading(true)
        const data = {price}
        const selectedPlan = plans[activeIndex]
        const id = selectedPlan?._id
        await submitData(api.selectPlan, data, id)
        setIsLoading(false)
    }
    
    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.carouselView]}>
                <View style={styles.planImageContainer}>
                    <Image source={item.image} style={appStyle.iconLg} />
                </View>
                <View style={[appStyle.aiCenter, appStyle.pb15, appStyle.pt30]}>
                    <H3 style={styles.carouselTitle}>{item.title}</H3>
                    <View
                        style={{
                            width: 40,
                            height: 4,
                            backgroundColor: ColorSet.purple,
                            borderRadius: 7
                        }}
                    />
                </View>

                <View style={appStyle.flex1}>
                    <Paragraph style={styles.carouselDescription}>{item.description}</Paragraph>
                </View>
                <View style={[appStyle.pv20, appStyle.aiCenter]}>
                    <H4 style={{ fontFamily: FamilySet.medium, color: ColorSet.greyDark, ...appStyle.pb10 }}>Invested Capital Back: {item.invested ? 'Yes' : 'No'}</H4>
                    <H4 style={{ fontFamily: FamilySet.medium, color: ColorSet.greyDark }}>Early Redemption Of Capital: {item.redemption ? 'Yes' : 'No'}</H4>
                </View>

                <H5>Plan Price Ranges From</H5>
                <H3 style={{ color: ColorSet.purple, ...appStyle.pt5 }}>{item.price}</H3>
            </View>
        );
    }


    return (
        <SafeAreaView style={[appStyle.safeContainer]}>
            <View style={appStyle.headerSubPage}>
                <HeaderBackButton onPress={() => navigation.goBack()} />
                <Animated.View
                    style={{
                        flex: 1,
                    }}>
                    <H3>
                        Plans
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
                    <View>
                        <ErrorContainer
                            isVisible={isErrorVisible}
                            label={error}
                            onClose={() => setIsErrorVisible(false)}
                        />
                        <ErrorContainer label={'this is a error text'} status={'info'} />
                        <View style={appStyle.pt15}>
                            <View style={{ marginHorizontal: -20 }}>
                                <View style={styles.carouselContainer}>
                                    <Carousel
                                        layout={'default'}
                                        // ref={(ref) => (carousel = ref)}
                                        data={carouselItems}
                                        sliderWidth={screenWidth.width100}
                                        itemWidth={screenWidth.width100}
                                        renderItem={renderItem.bind(this)}
                                        activeSlideAlignment={'start'}
                                        // autoplay
                                        // loop
                                        onSnapToItem={(index) => setActiveIndex(index)}
                                    />
                                    <View style={styles.paginationContainer}>
                                        <Pagination
                                            dotsLength={carouselItems.length}
                                            activeDotIndex={activeIndex}
                                            containerStyle={styles.dotContainerStyle}
                                            dotStyle={styles.dotStyle}
                                            inactiveDotStyle={styles.inactiveDotStyle}
                                            inactiveDotOpacity={1}
                                            inactiveDotScale={1}
                                        />
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>

                </View>
            </KeyboardAwareScrollView>
            <View style={[appStyle.aiCenter, appStyle.ph20, appStyle.pb20]}>
                <Button
                    onPress={() => actionSheetRef.current?.setModalVisible(true)}
                    containerStyle={appStyle.mt15}
                    style={{ ...Fonts.size.small }}
                // disable={buttonDisabled ? true : false}
                >
                    Select Plan
                </Button>
            </View>

            <BottomSheet bottomSheetRef={actionSheetRef}
                bottomCloseBtn={false}
                closeOnTouchBackdrop
            >
                <View>
                    <View style={[appStyle.asFlexEnd]}>
                        <TouchableOpacity
                            style={appStyle.iconContainer}
                            onPress={onPressCloseSheet}
                            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
                            <Image style={appStyle.iconMd} source={Images.cross} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSheetContainer}>
                        <TouchableOpacity
                            style={[appStyle.pb15]}>
                            <H4 style={appStyle.menuItemText}>Are you sure want to continue?</H4>
                        </TouchableOpacity>
                            <Input
                                label="Enter amount"
                                value={price}
                                keyboardType="numeric"
                                setValue={setPrice}
                                onChangeText={onChangeText}
                            />
                        <Button onPress={onPressConfirmPlan}>Confirm plan</Button>
                    </View>
                </View>
            </BottomSheet>

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
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomSheetContainer:{
        height:ScreenSize.screenHeight.height30
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: ColorSet.purple,
        shadowColor: 'rgba(0,0,0,0.16)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3.0,
        elevation: 2,
    },
    dotContainerStyle: { backgroundColor: 'transparent', paddingVertical: 14 },
    inactiveDotStyle: {
        backgroundColor: '#C4C4C4',
    },
    paginationContainer: {
        paddingTop: 10
    },
    carouselView: {
        flex: 1,
        paddingHorizontal: 22,
        alignItems: 'center',
        width: screenWidth.width100 - 30,
        height: 'auto',
        backgroundColor: '#E9ECEF',
        borderWidth: 1.5,
        borderColor: '#ddd',
        shadowColor: "rgba(0,0,0,0.55)",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.16,
        shadowRadius: 14.78,

        elevation: 22,
        paddingVertical: 25,
        marginTop: 20,
        marginBottom: 30,
        marginHorizontal: 20,
        borderRadius: 16

    },
    carouselTitle: {
        fontSize: 16,
        lineHeight: 20,
        color: ColorSet.blackMid,
        textAlign: 'center',
        paddingBottom: 5,
        // borderBottomColor: '#000',
        // borderBottomWidth: 2
    },
    carouselDescription: {
        fontSize: 12,
        fontFamily: FamilySet.regular,
        lineHeight: 16,
        color: ColorSet.blackMid,
        textAlign: 'center',
        // flex:1
        // display:'none'
    },
    carouselContainer: {
        position: 'relative',
    },
    planImageContainer: {
        backgroundColor: '#ede7f6',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 300,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    }
})

export default PlansScreen
