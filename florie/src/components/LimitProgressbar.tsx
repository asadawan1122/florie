import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import appStyle from '../assets/styles/appStyle'
import { ColorSet, FamilySet } from '../styles'
import { screenWidth } from '../styles/screenSize'
import StringsOfLanguage from '../assets/localization/Strings'

import * as Progress from 'react-native-progress'

interface LimitProgressbarProps {
  minText?: string | undefined
  barValue?: number | undefined
}

const LimitProgressbar: React.FC<LimitProgressbarProps> = props => {
  const { minText, barValue } = props

  return (
    <View style={styles.barTopView}>
      <View style={appStyle.pb10}>
        <Text style={styles.minTextView}>
          {StringsOfLanguage['shopping_cart.min_order_value']}{' '}
          {minText}
        </Text>
      </View>
      <Progress.Bar
        children={
          <View style={styles.barTextView}>
            <Text style={styles.barTextStyle}>{minText}</Text>
          </View>
        }
        height={15}
        borderRadius={20}
        color={ColorSet.required}
        unfilledColor={ColorSet.redPlus}
        borderWidth={0}
        progress={barValue}
        width={screenWidth.width90}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  barTopView: {
    backgroundColor: ColorSet.extraRed,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  minTextView: {
    fontSize: 13,
    color: ColorSet.white,
    fontFamily: FamilySet.bold,
  },
  barTextView: {
    position: 'absolute',
    right: 10,
  },
  barTextStyle: {
    color: ColorSet.white,
    textAlign: 'center',
    fontSize: 10,
  },
})

export default LimitProgressbar
