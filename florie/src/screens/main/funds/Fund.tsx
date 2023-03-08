import React, { useRef, useState, useEffect, createRef } from 'react'
import { StyleSheet, View, Platform, TouchableOpacity, RefreshControl, UIManager, Image, Animated, ScrollView, useWindowDimensions } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet,ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2,  Loader, Paragraph, Accordion, BottomSheet, H5, H4, H3 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { getDataWithEmail } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { DateHelper } from '../../../utils/'

const actionSheetRef = createRef()
const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const [focused, setFocused] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [headerShown, setHeaderShown] = useState(false)
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'Received' },
    { key: 'second', title: 'Sent' },
  ])
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const [sentTransfers, setSentTransfers] = useState([]);
  const [receivedTransfers, setReceivedTransfers] = useState([]);

  useEffect(() => {
    getAllTransfers()
  }, []);

  const getAllTransfers = async () => {
    setIsLoading(true)
    const sentTransfersResponse: any = await getDataWithEmail(api.getAllSentTransfers)
    const receiveTransfersResponse: any = await getDataWithEmail(api.getAllReceivedTransfers)
    if (sentTransfersResponse != null) {
      setSentTransfers(sentTransfersResponse?.data)
    }
    if (receiveTransfersResponse != null) {
      setReceivedTransfers(receiveTransfersResponse?.data)
    }
    setIsLoading(false)
  }
  const onRefresh = () => {
    getAllTransfers()
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


  const onPressAddBtn = () => {
    // console.log('jsjsjs');
    actionSheetRef.current?.setModalVisible(true)
  }
  const onPressCloseSheet = () => {
    actionSheetRef.current?.setModalVisible(false)
  }

  const onPressInlineTransfer = async () => {
    await actionSheetRef.current?.setModalVisible(false)
    navigation.navigate('InlineTransfer')
  }

  const onPressU2UTransfer = async () => {
    await actionSheetRef.current?.setModalVisible(false)
    navigation.navigate('U2UTransfer')
  }


  const layout = useWindowDimensions()

  const getStatusColor = (status) => {
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
        {receivedTransfers.length ?
          receivedTransfers?.map((data, index) => (
            <View key={index} style={styles.card}>
              <View>
                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                  <View style={appStyle.flex1}>
                    <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
                    <H3 style={appStyle.pt5}>{data?._id}</H3>
                  </View>

                </View>
                <Accordion
                  label={
                    <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                      <Image style={appStyle.iconSm} source={Images.date} />
                      <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
                    </View>
                  }
                >
                  <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                      <View style={appStyle.flex1}>
                        <H5>Amount</H5>
                        <H5 style={appStyle.cardDescText}>${data?.amount}</H5>
                      </View>
                      <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                        <H5>Sender</H5>
                        <H5 style={appStyle.cardDescText}>{data?.sender}</H5>
                      </View>
                    </View>
                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                      <View style={appStyle.flex1}>
                        <H5>Receiver</H5>
                        <H5 style={appStyle.cardDescText}>{data?.receiver}</H5>
                      </View>
                      <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                        <H5>Status</H5>
                        <H5 style={{ color: getStatusColor(data?.status), ...Fonts.size.xsmall, paddingTop: 5 }}>{data?.status}</H5>
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
        {sentTransfers.length ?
          sentTransfers?.map((data, index) => (
            <View key={index} style={styles.card}>
              <View>
                <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.p15]}>
                  <View style={appStyle.flex1}>
                    <H4 style={{ color: ColorSet.grey }}>#{index + 1}</H4>
                    <H3 style={appStyle.pt5}>{data?._id}</H3>
                  </View>

                </View>
                <Accordion
                  label={
                    <View style={[appStyle.row, appStyle.aiCenter, appStyle.pl15]}>
                      <Image style={appStyle.iconSm} source={Images.date} />
                      <Paragraph style={appStyle.pl5}>{DateHelper.getFormattedDate(data?.createdAt)}</Paragraph>
                    </View>
                  }
                >
                  <View style={[appStyle.dividerTop, appStyle.mt10, appStyle.ph15]}>
                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                      <View style={appStyle.flex1}>
                        <H5>Amount</H5>
                        <H5 style={appStyle.cardDescText}>${data?.amount}</H5>
                      </View>
                      <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                        <H5>Sender</H5>
                        <H5 style={appStyle.cardDescText}>{data?.sender}</H5>
                      </View>
                    </View>
                    <View style={[appStyle.rowBtw, appStyle.pt10]}>
                      <View style={appStyle.flex1}>
                        <H5>Receiver</H5>
                        <H5 style={appStyle.cardDescText}>{data?.receiver}</H5>
                      </View>
                      <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                        <H5>Status</H5>
                        <H5 style={{ color: getStatusColor(data?.status), ...Fonts.size.xsmall, paddingTop: 5 }}>{data?.status}</H5>
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

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  })

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <View style={appStyle.header}>
        <Animated.View
          style={[appStyle.flex1, appStyle.ph20]}>
          <H2>
            Funds Transfer
          </H2>
          <Paragraph>Your funds transaction history</Paragraph>
        </Animated.View>
        <View style={[appStyle.row, appStyle.aiCenter, appStyle.jcSpaceBetween, appStyle.ph15]}>
          <View>
            <TouchableOpacity
              onPress={onPressAddBtn}
              hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
              style={appStyle.iconContainer}
            >
              <Image source={Images.add} style={appStyle.iconMd} />
            </TouchableOpacity>
          </View>
        </View>
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
        stickyHeaderIndices={[!focused ? 1 : 0]}
        onScroll={event => {
          const scrolling = event.nativeEvent.contentOffset.y
          if (scrolling > 20) {
            setHeaderShown(true)
          } else {
            setHeaderShown(false)
          }
        }}
        scrollEventThrottle={16}
      >

        {/* <TopTabMenu label1={'Sent'} label2={'Received'} /> */}
        <View style={[appStyle.wrapper, appStyle.mt0]}>
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
                  // scrollEnabled={true}
                  activeColor={'#000'}
                  // getLabelText={({ route }) => route.title}
                  inactiveColor={'#ccc'}
                  indicatorStyle={{ backgroundColor: ColorSet.purple }}
                  renderLabel={({ route, color, focused }) => (
                    <View>
                      {/* <View style={[styles.badge, { backgroundColor: focused ? ColorSet.purple : 'transparent' }]} /> */}
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

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
      />
      <BottomSheet bottomSheetRef={actionSheetRef}
        bottomCloseBtn={false}
        closeOnTouchBackdrop
      >
        <View>
          <View style={[appStyle.rowBtw, appStyle.pb5, appStyle.ph20, {
            borderBottomWidth: 1,
            borderColor: '#C6C8CB',
            marginHorizontal: -20,
          }]}>
            <H3>New funds transfer</H3>
            <TouchableOpacity
              style={appStyle.iconContainer}
              onPress={onPressCloseSheet}
              hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}>
              <Image style={appStyle.iconMd} source={Images.cross} />
            </TouchableOpacity>
          </View>

          <View style={appStyle.pt15}>
            <TouchableOpacity
              onPress={onPressInlineTransfer}
              style={appStyle.menuItem}
            >
              {/* <View style={[appStyle.mr5]}>
                <Image style={appStyle.iconSm} source={Images.rightArrow} />
              </View> */}
              <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>Inline Transfer</H4>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressU2UTransfer}
              style={appStyle.menuItem}
            >
              {/* <View style={[appStyle.mr5]}>
                <Image style={appStyle.iconSm} source={Images.arrowNextBlack} />
              </View> */}
              <H4 style={{ color: '#121212', fontFamily: FamilySet.medium }}>User to User Transfer</H4>
            </TouchableOpacity>
          </View>

        </View>
      </BottomSheet>
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
  // tabStyle: { flexWrap: 'wrap', width: 'auto' },
  smBtn: { width: 'auto', height: 40, paddingHorizontal: 15 },
  scrollContainerTabs: { flexGrow: 1, paddingHorizontal: 15 }
})

export default DashboardScreen
