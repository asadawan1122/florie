import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Platform, RefreshControl, UIManager, Image, Animated, TouchableOpacity } from 'react-native'
import appStyle from '../../../assets/styles/appStyle'
import { Fonts, ScreenSize } from '../../../styles'
import { Images } from '../../../constants/assets/images'
import { H2, Loader, Paragraph, H3, H4 } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getDataWithoutId } from '../../../networking/DashboardApiService'
import { api } from '../../../networking/Environment'
import { useDispatch } from 'react-redux'
import { GET_STATS } from '../../../redux/Actions'

const DataScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [focused, setFocused] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [headerShown, setHeaderShown] = useState(false)
  const translation = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const dispatch = useDispatch()


  useEffect(() => {
    getAllData()
  }, []);

  const getAllData = async () => {
    setIsLoading(true)
    const response1: any = await getDataWithoutId(api.getAllPortfolioHealths)
    const response2: any = await getDataWithoutId(api.getAllInnovations)
    const response3: any = await getDataWithoutId(api.getAllCompanyProjectStats)
    var result:any = []
     result['portfoiloHealth'] = response1?.data
     result['innovation'] = response2?.data
     result['companyProjects'] = response3?.data
    
    if (response1 != null) {
      dispatch({
        type: GET_STATS,
        payload: result,
      });
    }
    setIsLoading(false)
  }
  const onRefresh = () => {
    getAllData()
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

      <View style={[appStyle.header]}>
        {/* <HeaderBackButton onPress={() => navigation.goBack()} /> */}
        <Animated.View
          style={[appStyle.flex1, appStyle.ph20]}>
          <H2>
            Data
          </H2>
          <Paragraph>View your data history</Paragraph>
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
          <View style={[appStyle.rowWrap, appStyle.jcSpaceBetween, appStyle.pt20]}>

            <TouchableOpacity
              onPress={() => navigation.navigate('Health')}
              style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto, appStyle.mb40]}>
              <View style={[appStyle.row, appStyle.pb5]}>
                <View style={styles.cardIconContainer}>
                  <Image style={[appStyle.iconMd]} source={Images.portfolio} />
                </View>
                <H4 style={styles.cardText}>Health</H4>
              </View>
              <Paragraph>Portfolio health and stats</Paragraph>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Projects')}
              style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto, appStyle.mb40]}>
              <View style={[appStyle.row, appStyle.pb5]}>
                <View style={styles.cardIconContainer}>
                  <Image style={[appStyle.iconMd]} source={Images.projects} />
                </View>
                <H4 style={styles.cardText}>Stats</H4>
              </View>
              <Paragraph>Company Project Stats</Paragraph>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Innovations')}
              style={[appStyle.detailCard, appStyle.w100, appStyle.hAuto, appStyle.mb40]}>
              <View style={[appStyle.row, appStyle.pb5]}>
                <View style={styles.cardIconContainer}>
                  <Image style={[appStyle.iconMd]} source={Images.innovation} />
                </View>
                <H4 style={styles.cardText}>Innovations</H4>
              </View>
              <Paragraph>Innovators and statistics</Paragraph>
            </TouchableOpacity>
            
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Loader
        isLoading={isLoading}
        // shadow={false}
        layout={'outside'}
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
})

export default DataScreen
