import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, RefreshControl, Keyboard, Animated, Platform, UIManager, TextInput, KeyboardAvoidingView } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { ColorSet, Fonts, FamilySet, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { emailFormat, passwordFormat } from '../../../utils/formatter'
import { H1, H3, Button, Input, Link, ErrorContainer, Loader, H2, Paragraph, H4, H5 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderBackButton } from 'react-navigation-stack'
import AutoScroll from 'react-native-auto-scroll';
import { getData, submitData } from '../../../networking/SupportApiService'
import { api } from '../../../networking/Environment'
import { Helper } from '../../../utils'


if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const chatItems = [
    { messageBy: '_a123', dateCreated: '23-dec-2021', body: 'this is a message body', },
    { messageBy: '_a124', dateCreated: '23-dec-2021', body: 'this is a message bodys', }
]
const ChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const translation = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [headerShown, setHeaderShown] = useState(false)
    const [items, setItems] = useState([])
    const [ticketId, setTicketId] = useState<string>('')
    const [body, setBody] = useState('')
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

    // const buttonDisabled = addressName == '' || cryptoAddress == ''

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

    useEffect(() => {
        const params = navigation.state.params
        const id = params.id
        setTicketId(id)
        getMessages(id)
    }, [])

    const getMessages = async (id: any) => {
        setIsLoading(true)
        const result: any = await getData(api.getMessagesAgainstTicket, id)
        if (result != null) {
            setItems(result.data.messages)
        }
        setIsLoading(false)
    }
    const sendMessage = async () => {
        if (body) {

            // Keyboard.dismiss()
            const data = { message: body.trim() }
            const obj = { message: body, senderIsAdmin: false }
            items.push(obj)
            setBody('')
            const result: any = await submitData(api.sendMessage, data, ticketId)
            if (result != null) {
               
                Helper.showToast(result.message)
            }
            setIsLoading(false)
        }

    }
    const onRefresh = () => {
        getMessages(ticketId)
    }
    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                keyboardShouldPersistTaps="always"
                keyboardVerticalOffset={80}
                behavior={Platform.OS == 'ios' ? 'padding' : ''}
                style={{ flex: 1, backgroundColor: '#EFEFEF' }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={[appStyle.shadowHeader, { paddingVertical: 15, backgroundColor: ColorSet.purpleLight, }]}>
                    <View style={appStyle.rowBtw}>
                        <View style={[appStyle.row, appStyle.aiCenter]}>
                            <HeaderBackButton onPress={() => navigation.goBack()} />
                            <H3 >
                                Admin
                            </H3>
                        </View>
                        <TouchableOpacity onPress={() => onRefresh()}>
                            <Image style={styles.icon} source={Images.refresh} />
                        </TouchableOpacity>
                    </View>

                </View>
                <AutoScroll contentContainerStyle={styles.scrollContainer}>
                    <View>
                        {items.length > 0 ? (
                            items.map((item, index) => {
                                return (
                                    <View key={index} style={[styles.chatBody]}>
                                        {item?.senderIsAdmin === false ? (
                                            <View>
                                                <View style={styles.chatMessageWrapper}>
                                                    <View style={[styles.chatSenderContainer]}>
                                                        <H4 style={styles.chatSenderText}>
                                                            {item?.message}
                                                        </H4>
                                                        {/* <Paragraph style={styles.chatTimerText}>
                                                        {DateHelper.getTime(item?.createdAt)}
                                                    </Paragraph> */}
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.chatMessageWrapper}>
                                                <View style={[styles.chatReceiverContainer]}>
                                                    <H4 style={styles.chatReceiverText}>
                                                        {item.message}
                                                    </H4>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        ) : (
                            <View style={[appStyle.flex1, appStyle.aiCenter, appStyle.pv20]}>
                                <H5>
                                    Type a message...
                                </H5>
                            </View>
                        )}
                    </View>
                </AutoScroll>
                <View style={[styles.chatFooter]}>
                    <TextInput
                        onChangeText={body => setBody(body)}
                        multiline={true}
                        value={body}
                        style={styles.sendInput}
                        placeholder={'Type a message...'}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={styles.sendIconContainer}>
                        <Image
                            style={styles.sendIcon}
                            source={Images.send}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <Loader
                isLoading={isLoading}
                // shadow={false}
                layout={'outside'}
                message={'loading messages...'}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: ColorSet.white,
    },
    chatHeader: {
        backgroundColor: ColorSet.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 3.11,

        elevation: 14,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    chatBody: {
        backgroundColor: '#EFEFEF',
        flex: 1,
        width: '100%',
        paddingHorizontal: 15,
    },
    chatReceiverContainer: {
        backgroundColor: '#fff',
        maxWidth: '65%',
        alignSelf: 'flex-start',
        // marginVertical: 5,
        marginVertical: 15,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 0,
        },
        shadowOpacity: 0.06,
        shadowRadius: 0.06,

        elevation: 3,
    },

    chatSenderContainer: {
        backgroundColor: ColorSet.purple,
        maxWidth: '65%',
        alignSelf: 'flex-end',
        marginVertical: 15,
        borderRadius: 10,
        borderBottomRightRadius: 0,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 0.06,

        elevation: 3,
    },
    chatMessageWrapper: {
        position: 'relative',
    },
    chatTimerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    chatFooter: {
        backgroundColor: ColorSet.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 0.16,

        elevation: 3,
    },
    chatReceiverText: {
        fontSize: 14.5,
        fontFamily: FamilySet.regular,
        color: '#121212',
        padding: 10,
        textAlign: 'left'
    },
    chatSenderText: {
        fontSize: 14.5,
        fontFamily: FamilySet.regular,
        color: ColorSet.white,
        padding: 10,
        textAlign: 'left'
    },
    chatTimerText: {
        color: '#BEC2CE',
        fontSize: 14
    },
    sendInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: ColorSet.purple,
        marginLeft: 15,
        borderRadius: 12,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        backgroundColor: ColorSet.white
    },
    sendIconContainer: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    sendIcon: {
        resizeMode: 'contain',
        width: 40,
        height: 40,
    },
    icon: {
        marginRight: 15,
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})

export default ChatScreen
