import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { SplashScreen } from '../screens'
import { LoginScreen } from '../screens'
import { SignupScreen } from '../screens'
import { ForgotPasswordScreen } from '../screens'
import { ResetPasswordScreen } from '../screens'
import { OtpScreen } from '../screens'
import { AppLockPassword } from '../screens'
import BottomTabNavigation from './BottomTabNavigator'

const SplashStack = createStackNavigator(
  {
    Splash: SplashScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)


const AppLockStack = createStackNavigator(
  {
    AppLockPassword: AppLockPassword,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    ForgotPassword: ForgotPasswordScreen,
    ResetPassword: ResetPasswordScreen,
    OtpScreen: OtpScreen,

  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)

export default createAppContainer(
  createSwitchNavigator(
    {
      Splash: SplashStack,
      AppLock: AppLockStack,
      Auth: AuthStack,
      BottomTabNavigation: BottomTabNavigation,

    },

    {
      initialRouteName: 'Splash',
    },
  ),
)
