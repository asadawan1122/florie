import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, RefreshControl,  Animated, Platform, UIManager } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet} from '../../../styles'
import { H3,Loader, H2,  H5, H4,Paragraph } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { getData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { DateHelper } from '../../../utils/'



if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}


const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [notifications, setNotifications] = useState([]);



    useEffect(() => {
        getAllNotification()
    }, []);

    const getAllNotification = async () => {
        setIsLoading(true)
        const response: any = await getData(api.notifications)
        if (response != null) {
            setNotifications(response?.data)
        }
        setIsLoading(false)
    }
    const onRefresh = () => {
        getAllNotification()
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
                        Notifications
                    </H3>
                </Animated.View>
            </View>

            <KeyboardAwareScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
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
                        <H2>Notifications</H2>
                    </View>

                    <View style={[appStyle.flex1]}>
                    {notifications.length ?
                    notifications?.map((data, index) => (
                        <View key={index} style={[styles.notificationContainer, {
                            borderColor:data?.type === 'success' ? ColorSet.green: ColorSet.red
                        }]}>
                            <H4>{data?.text}</H4>
                            <H5 style={{ color: ColorSet.grey }}>{DateHelper.getFormattedDate(data?.createdAt)}</H5>
                        </View>
                      ))
                      :
                      <Paragraph style={appStyle.statusMessage}>No notification</Paragraph>
                  }
                    </View>

                </View>
            </KeyboardAwareScrollView>
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
    notificationContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        // borderBottomRightRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        borderColor: ColorSet.red,
        borderWidth: 0,
        borderLeftWidth: 4,

    }
})

export default NotificationsScreen
