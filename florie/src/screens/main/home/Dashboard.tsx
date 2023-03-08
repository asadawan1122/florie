import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Platform, UIManager, View,RefreshControl, Image, Animated, TouchableOpacity, ScrollView } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, FamilySet, ScreenSize, ColorSet } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, Loader, Paragraph, H3, H4, H5 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { screenWidth } from '../../../styles/screenSize'
import ProgressCircle from 'react-native-progress-circle'
import { DateHelper } from '../../../utils/'
import * as Animatable from 'react-native-animatable';

import {
  LineChart,
} from "react-native-chart-kit";
import { getData, getDataWithoutId, graphData } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
const animationType = 'fadeInRight'
const imageAnimationType = 'zoomIn'
const graphAnimationType = 'fadeInLeft'
const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [headerShown, setHeaderShown] = useState(false)
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const [projectData, setProjectData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [graphValues, setGraphValues] = useState([1, 2, 3, 4]);
  const [graphLabels, setGraphLabels] = useState(['1', '2', '3', '4']);
  const [activeGraphTab, setActiveGraphTab] = useState<number>(1)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)


  useEffect(() => {
    getDashboardData();
    getGraphData(api.bitcoin, 1)
  }, []);

  
  const onRefresh = () => {
    getDashboardData();
    getGraphData(api.bitcoin, 1)
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

  }, [])



  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  const getDashboardData = async () => {
    const dashboardResponse: any = await getData(api.dashboardStats)
   
    const dashboardProjectsResponse: any = await getDataWithoutId(api.dashboardProjects)
    if (dashboardResponse != null) {
      setDashboardStats(dashboardResponse.data)
    }
    if (dashboardProjectsResponse != null) {
      setProjectData(dashboardProjectsResponse.data)
    }

  }

  const getGraphData = async (endpoint: any, tab: number) => {
    setActiveGraphTab(tab)
    setIsLoading(true)
    const response: any = await graphData(endpoint)
    if (response) {
      const valuesArray = []
      const labelsArray = []
      const prices = response.prices
      for (let i = 0; i < prices.length; i++) {
        const element = prices[i];
        const label = element[0]
        const value = element[1]
        labelsArray.push(DateHelper.getFormattedDateForGraph(label))
        valuesArray.push(value)
      }
      setGraphValues(valuesArray)
      setGraphLabels(labelsArray)
    }
    setIsLoading(false)

  }


  return (
    <SafeAreaView style={[appStyle.safeContainer]}>

      <View style={[appStyle.header]}>
        <Animated.View
          style={[appStyle.flex1, appStyle.ph20]}>
          <H2>
            Dashboard
          </H2>
          <Paragraph>Statistics & Information</Paragraph>
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
      >
        <View style={[appStyle.wrapper]}>
          {!isLoading &&
            <>
              <View style={[appStyle.pt20, appStyle.mhN20, appStyle.pl15]}>

                <ScrollView
                 showsHorizontalScrollIndicator={false}
                  contentContainerStyle={appStyle.scrollContainer}
                  horizontal>
                  <Animatable.View
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard]}>
                    <View
                      style={styles.dashCardUnderlay} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Deposit{'\n'}
                      Balance</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.depositBalance}</H2>
                  </Animatable.View>
                  <Animatable.View
                    delay={100}
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard]}
                  >
                    <View
                      style={styles.dashCardUnderlay} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Profit{'\n'}
                      Balance</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.profitBalance}</H2>
                  </Animatable.View>
                  <Animatable.View
                    animation={animationType}
                    delay={200}
                    style={[appStyle.detailCard, styles.dashboardDetailCard]}
                  >
                    <View
                      style={styles.dashCardUnderlay} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Referral{'\n'}
                      Balance</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.refBalance}</H2>
                  </Animatable.View>
                  <Animatable.View
                    delay={300}
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard]}
                  >
                    <View
                      style={styles.dashCardUnderlay} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Running{'\n'}
                      Investments</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>{dashboardStats?.totalInvestments}</H2>
                  </Animatable.View>

                </ScrollView>
              </View>

              <View style={[appStyle.mhN20, appStyle.pl15]}>
                <ScrollView
                 showsHorizontalScrollIndicator={false}
                  contentContainerStyle={appStyle.scrollContainer}
                  horizontal>
                  <Animatable.View
                    animation={animationType}
                    delay={500}
                    style={[appStyle.detailCard, styles.dashboardDetailCard, styles.dashboardDetailCardPurple]}
                  >
                    <View
                      style={[styles.dashCardUnderlay, styles.dashCardUnderlayPurple]} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Total{'\n'}
                      Deposited</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.deposittedBalance}</H2>
                  </Animatable.View>

                  <Animatable.View
                    delay={700}
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard, styles.dashboardDetailCardPurple]}
                  >
                    <View
                      style={[styles.dashCardUnderlay, styles.dashCardUnderlayPurple]} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Total{'\n'}
                      profit</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.totalProfit}</H2>
                  </Animatable.View>

                  <Animatable.View
                    delay={900}
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard, styles.dashboardDetailCardPurple]}
                  >
                    <View
                      style={[styles.dashCardUnderlay, styles.dashCardUnderlayPurple]} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Referral{'\n'}
                      commission</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.commissionBalance}</H2>
                  </Animatable.View>

                  <Animatable.View
                    delay={1100}
                    animation={animationType}
                    style={[appStyle.detailCard, styles.dashboardDetailCard, styles.dashboardDetailCardPurple]}>
                    <View
                      style={[styles.dashCardUnderlay, styles.dashCardUnderlayPurple]} />
                    <View
                      style={styles.dashGraphicContainer}
                    >
                      <Image style={styles.dashGraphic} source={Images.graphic} />
                    </View>
                    <H3 style={{ ...styles.cardText, ...styles.dashCardTitle }}>Total{'\n'}
                      Withdrawn</H3>
                    <H2 style={{ ...appStyle.pt10, ...styles.dashCardSub }}>${dashboardStats?.totalWithdrawalAmount}</H2>
                  </Animatable.View>

                </ScrollView>

              </View>




              <View style={[appStyle.mhN20]}>
                <ScrollView
                 showsHorizontalScrollIndicator={false}
                  contentContainerStyle={appStyle.scrollContainer}
                  horizontal>
                  {projectData?.map((data, index) => (
                    <Animatable.View
                      delay={1300}
                      animation={'lightSpeedIn'}
                      key={index}
                      style={[styles.dashInfoCard,{marginLeft:17, marginRight:index == 0?0:20}]}>
                      <View style={styles.dashInfoCardInner}>
                        <View>
                          <View style={[appStyle.row, appStyle.pb5]}>
                            <Image source={Images.lamp} style={[appStyle.iconSm, { tintColor: ColorSet.blue }]} />
                            <H5 style={styles.dashInfoCardSubTitle}>Project Name</H5>
                          </View>
                          <View>
                            <H3 style={{ color: ColorSet.blackMid }}>{data?.projectName}</H3>
                          </View>
                        </View>
                        <View style={appStyle.pt15}>
                          <View style={[appStyle.row, appStyle.pb5]}>
                            <Image source={Images.dollar} style={[appStyle.iconSm, { tintColor: ColorSet.blue }]} />
                            <H5 style={styles.dashInfoCardSubTitle}>Budget/Cost</H5>
                          </View>
                          <View>
                            <H3 style={{ color: ColorSet.blackMid }}>{data?.cost}</H3>
                          </View>
                        </View>
                      </View>
                      <View style={styles.dashInfoCardBtwBorder} />
                      <View style={styles.dashInfoCardInner}>
                        <View style={[appStyle.flex1, appStyle.aiFlexEnd]}>
                          <View>
                            <ProgressCircle
                              percent={Number((data?.percentComplete).slice(0, -1))}
                              radius={39}
                              borderWidth={8}
                              color={ColorSet.blue}
                              shadowColor={ColorSet.greyDarker}
                              bgColor="#fff"
                            >
                              <View style={[appStyle.ph5, appStyle.aiCenter]}>
                                <Paragraph style={{ ...Fonts.size.xmini, textAlign: 'center' }}>Completion</Paragraph>
                                <H4 style={{ color: ColorSet.blue }}>{data?.percentComplete}</H4>
                              </View>

                            </ProgressCircle>
                          </View>
                          <View style={[appStyle.row, appStyle.pt10]}>
                            <Image source={Images.date} style={[appStyle.iconSm]} />
                            <Paragraph style={{ ...appStyle.pl5, color: ColorSet.grey }}>{DateHelper.getFormattedDate(data.startDate)}</Paragraph>
                          </View>

                        </View>
                      </View>

                    </Animatable.View>
                  ))}

                </ScrollView>
              </View>


              <View style={styles.graphContainer}>

                <View style={[appStyle.mhN20, appStyle.pl15, appStyle.pt20]}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={appStyle.scrollContainer}
                    horizontal
                  >
                    <TouchableOpacity
                      onPress={() => getGraphData(api.bitcoin, 1)}
                      style={[styles.dashCoinCard, activeGraphTab == 1 && styles.dashCoinCardActive]}
                    >
                      <Animatable.View
                        delay={1500}
                        animation={imageAnimationType}>
                        <Image style={appStyle.iconLg} source={Images.coin1} />
                      </Animatable.View >

                      <View style={appStyle.pt10}>
                        {/* <H4 style={{ color: ColorSet.white }}>$49299</H4> */}
                        <H5>Bitcoin</H5>
                      </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => getGraphData(api.ethereum, 2)}
                      style={[styles.dashCoinCard, activeGraphTab == 2 && styles.dashCoinCardActive]}
                    >
                      <Animatable.View
                        delay={1600}
                        animation={imageAnimationType}>
                        <Image style={appStyle.iconLg} source={Images.coin2} />
                      </Animatable.View >

                      <View style={appStyle.pt10}>
                        {/* <H4>$4313.01</H4> */}
                        <H5>Ethereum</H5>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => getGraphData(api.binance, 3)}
                      style={[styles.dashCoinCard, activeGraphTab == 3 && styles.dashCoinCardActive]}
                    >
                      <Animatable.View
                        delay={1700}
                        animation={imageAnimationType}>
                        <Image style={appStyle.iconLg} source={Images.coin3} />
                      </Animatable.View >

                      <View style={appStyle.pt10}>
                        {/* <H4>$592.26</H4> */}
                        <H5>Binance</H5>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => getGraphData(api.tether, 4)}
                      style={[styles.dashCoinCard, activeGraphTab == 4 && styles.dashCoinCardActive]}
                    >
                      <Animatable.View
                        delay={1800}
                        animation={imageAnimationType}>
                        <Image style={appStyle.iconLg} source={Images.coin4} />
                      </Animatable.View>

                      <View style={appStyle.pt10}>
                        {/* <H4>$1</H4> */}
                        <H5>Tether</H5>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => getGraphData(api.solana)}
                      style={[styles.dashCoinCard, activeGraphTab == 0 && styles.dashCoinCardActive]}
                    >
                      <Animatable.View
                        delay={1900}
                        animation={imageAnimationType}>
                        <Image style={appStyle.iconLg} source={Images.coin5} />
                      </Animatable.View >

                      <View style={appStyle.pt10}>
                        {/* <H4>$188</H4> */}
                        <H5>Solana</H5>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>


                </View>

                <Animatable.View
                  delay={2000}
                  animation={graphAnimationType}
                  style={{ marginHorizontal: -15 }}>
                  <LineChart
                    data={{
                      labels: graphLabels,
                      datasets: [
                        {
                          data: graphValues
                        }
                      ]
                    }}
                    width={screenWidth.width100 - 30} // from react-native
                    height={220}
                    yAxisLabel="$"
                    // yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#367CDB",
                      backgroundGradientTo: "#ccc",

                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#367CDB"
                      }
                    }}
                    // bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                      alignSelf: 'center',
                    }}
                  />
                </Animatable.View>
              </View>
            </>
          }
        </View>
      </KeyboardAwareScrollView>

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
        message={'Fetching data...'}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cardText: {
    letterSpacing: 0.3,
    color: '#2C2C2C',
    paddingBottom: 5,
    paddingTop: 10
  },
  cardIconContainer: {
    padding: 7,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16.00,

    elevation: 24,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
  title: {
    ...Fonts.size.medium,
  },
  image: {
    height: ScreenSize.screenWidth.width50,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerFixedTitle: {
    ...Fonts.size.medium,
  },
  dashboardDetailCard: {
    backgroundColor: '#367CDB',
    justifyContent: 'space-evenly',
    padding: 15,
    height: screenWidth.width40 - 20,
    width: screenWidth.width35 - 10,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 4,
    borderRadius: 16,
    marginRight: 10
  },
  dashCardUnderlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: screenWidth.width40 - 20,
    width: screenWidth.width40 - 10,
    backgroundColor: 'rgba(54,124,219,0.8)',
    zIndex: 2
  },
  dashCardUnderlayPurple: {
    backgroundColor: 'rgba(94,53,177,0.8)',
  },
  dashGraphicContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1
  },
  dashGraphic: {
    height: screenWidth.width30 - 10,
    width: screenWidth.width30 - 10, resizeMode: 'contain'
  },
  dashCardTitle: {
    ...appStyle.pt0, color: '#fff', fontFamily: FamilySet.medium, position: 'relative', zIndex: 4
  },
  dashCardSub: {
    color: '#fff', position: 'relative', zIndex: 4
  },
  dashboardDetailCardPurple: {
    backgroundColor: '#5E35B1',
  },
  dashInfoCard: {
    width: screenWidth.width80,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginLeft: 15
  },
  dashInfoCardInner: {
    flex: 1,
    padding: 10
  },
  dashInfoCardSubTitle: { color: ColorSet.blue, ...Fonts.size.small, ...appStyle.pl5 },
  dashInfoCardBtwBorder: {
    height: '100%',
    width: 1,
    backgroundColor: '#ddd',
  },
  dashCoinCard: {
    backgroundColor: '#E9ECEF',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    marginRight: 10,
    minWidth: screenWidth.width25 - 5
  },
  dashCoinCardActive: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderColor: '#367CDB', backgroundColor: '#9FC3F5'
  },
  graphContainer: {
    backgroundColor: ColorSet.white,
    marginHorizontal: -15,
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  }
})

export default DashboardScreen
