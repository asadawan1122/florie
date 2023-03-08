import React from 'react'
import { Image, } from 'react-native'

import { Images } from '../constants/assets/images'
import { View } from 'react-native-animatable'
import { ColorSet, FamilySet } from '../styles'
import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'

import {
  Dashboard,
  Funds,
  InlineTransfer,
  U2UTransfer,
  Data,
  Health,
  Projects,
  Innovations,
  Referral,
  ReferredUsers,
  ReferredStats,
  Settings,
  Profile,
  Account,
  Document,
  ManageCryptoAddress,
  AddCryptoAddress,
  Activity,
  Tickets,
  Faqs,
  AddTicket,
  Chat,
  Invest,
  Deposit,
  DepositHistory,
  Withdraw,
  WithdrawHistory,
  Plans,
  Notifications,
  TwoFaOtp,
  AddKycDocument

} from '../screens'
//add new screen to this stack here

const DashboardStack = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)
DashboardStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

const FundsStack = createStackNavigator(
  {
    Funds: {
      screen: Funds,
    },
    InlineTransfer: {
      screen: InlineTransfer,
    },
    U2UTransfer: {
      screen: U2UTransfer,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)
FundsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

const DataStack = createStackNavigator(
  {
    Data: {
      screen: Data,
    },
    Health: {
      screen: Health,
    },
    Projects: {
      screen: Projects,
    },
    Innovations: {
      screen: Innovations,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)
DataStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

const ReferralStack = createStackNavigator(
  {
    Invest: {
      screen: Invest
    },
    Deposit: {
      screen: Deposit
    },
    DepositHistory: {
      screen: DepositHistory
    },
    Withdraw: {
      screen: Withdraw
    },
    WithdrawHistory: {
      screen: WithdrawHistory
    },
    Plans: {
      screen: Plans
    },
    // Referral: {
    //   screen: Referral,
    // },
    // ReferredUsers: {
    //   screen: ReferredUsers,
    // },
    // ReferredStats: {
    //   screen: ReferredStats,
    // },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)
ReferralStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
    },
    Account: {
      screen: Account,
    },
    Profile: {
      screen: Profile,
    },
    Document: {
      screen: Document,
    },
    AddKycDocument:{
      screen:AddKycDocument
    },
    ManageCryptoAddress: {
      screen: ManageCryptoAddress,
    },
    AddCryptoAddress: {
      screen: AddCryptoAddress,
    },
    Activity: {
      screen: Activity
    },
    Tickets: {
      screen: Tickets
    },
    AddTicket: {
      screen: AddTicket
    },
    Chat: {
      screen: Chat
    },
    Faqs: {
      screen: Faqs
    },
  
  
    Notifications: {
      screen: Notifications
    },
    Referral: {
      screen: Referral,
    },
    ReferredUsers: {
      screen: ReferredUsers,
    },
    ReferredStats: {
      screen: ReferredStats,
    },
    TwoFaOtp:{
      screen: TwoFaOtp,
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)
SettingsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}
const TabNavigator = createMaterialBottomTabNavigator(
  {
    tab1: {
      screen: DashboardStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, tintColor }) => (
          focused ?
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab1}
            />
            :
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab1Outline}
            />
        ),
      },
    },
    tab2: {
      screen: FundsStack,
      navigationOptions: {
        tabBarLabel: 'Funds',
        tabBarIcon: ({ focused, tintColor }) => (
          focused ?
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab2}
            />
            :
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab2Outline}
            />
        ),
      },
    },
    tab3: {
      screen: DataStack,
      navigationOptions: {
        tabBarLabel: 'Data',
        tabBarIcon: ({ focused, tintColor }) => (
          focused ?
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab3}
            />
            :
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab3Outline}
            />
        ),
      },
    },
    tab4: {
      screen: ReferralStack,
      navigationOptions: {
        tabBarLabel: 'Referrals',
        tabBarIcon: ({ focused, tintColor }) => (

          focused ?
            <Image
              style={{
                resizeMode: 'contain',
                height: 20,
                width: 20,
                marginTop:4,
                tintColor: tintColor,
              }}
              source={Images.invest}
            />
            :
            <Image
              style={{
                resizeMode: 'contain',
                height: 20,
                width: 20,
                marginTop:4,
                tintColor: tintColor,
              }}
              source={Images.investOutline}
            />

        ),
      },
    },
    tab5: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused, tintColor }) => (
          focused ?
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab5}
            />
            :
            <Image
              style={{
                resizeMode: 'contain',
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={Images.tab5Outline}
            />

        ),
      },
    },
  },
  {
    initialRouteName: 'tab1',
    activeColor: '#673BB7',
    activeBackgroundColor: '#ffffff',
    inactiveBackgroundColor: '#ffffff',
    labeled: false,
    inactiveColor: '#673BB7',
    barStyle: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
)

export default createAppContainer(TabNavigator)
