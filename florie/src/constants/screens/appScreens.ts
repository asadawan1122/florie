import {FC} from 'react';
import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';

import {Screen} from './screens';
import {OnBoardingScreen , LoginScreen} from '../../screens';

export type AppStackParamList = {
  OnBoardingScreen: undefined;
  LoginScreen: undefined;
};


type OnBoardingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screen.OnBoardingScreen
>;
type OnboardingScreenRouteProp = RouteProp<AppStackParamList, Screen.OnBoardingScreen>;
export type OnBoardingScreenProps = {
  navigation: OnBoardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

type LoginScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screen.LoginScreen
>;
type LoginScreenRouteProp = RouteProp<AppStackParamList, Screen.LoginScreen>;
export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

type AppScreensType = 
| FC<OnBoardingScreenProps>
| FC<LoginScreenProps>;

export const AppScreens: Array<{name: string; component: AppScreensType}> = [
  {
    name: Screen.OnBoardingScreen,
    component: OnBoardingScreen,
  },
  {
    name: Screen.LoginScreen,
    component: LoginScreen,
  },
];
