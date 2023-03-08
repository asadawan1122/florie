import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform,  UIManager, Image, Animated } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, ColorSet } from '../../../styles'
import { H2,  Loader, Accordion, H5, H4, H3 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import { getDataWithoutId } from '../../../networking/DashboardApiService'
import { api  } from '../../../networking/Environment'



if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const FaqsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [headerShown, setHeaderShown] = useState(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [faqs, setFaqs] = useState([])
    useEffect(() => {
        getFaqs()
    }, [])

    const getFaqs = async () => {
        setIsLoading(true)
        const result: any = await getDataWithoutId(api.faqs)
        if (result != null) {
            setFaqs(result.data)
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
                        Faqs
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
                        <H2>Faqs</H2>
                    </View>

                    <View style={[appStyle.flex1, appStyle.pt20]}>
                        {faqs.length > 0 ? (
                            faqs.map((item, index) => {
                                return (
                                    <Accordion
                                        key={index}
                                        containerStyle={styles.faqItemContainer}
                                        headerStyle={appStyle.aiFlexStart}

                                        label={
                                            <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl5, appStyle.flex1]}>
                                                <H5 style={appStyle.pl5}>{item?.question}</H5>
                                            </View>
                                        }
                                    >
                                        <View style={[appStyle.dividerTop, appStyle.ph15, appStyle.flex1]}>
                                            <View style={appStyle.flex1}>
                                                <H5 style={appStyle.cardDescText}>{item?.answer}</H5>
                                            </View>
                                        </View>
                                    </Accordion>
                                );
                            })
                        ) : (
                            <View style={[appStyle.flex1, appStyle.aiCenter, appStyle.jcCenter]}>
                                {/* <H4 style={{ color: ColorSet.greyDarker, textAlign: 'center' }}>No data found.</H4> */}
                            </View>
                        )}


                    </View>

                </View>
            </KeyboardAwareScrollView>

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
    faqItemContainer: {
        shadowColor: "rgba(0,0,0,0.66)",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,

        elevation: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        paddingVertical: 10,
        alignItems: 'flex-start'
    }
})

export default FaqsScreen
