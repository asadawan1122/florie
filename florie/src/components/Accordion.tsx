import React, { useState, useRef, useEffect, Children, ReactElement } from 'react'
import { StyleSheet, View, Animated, Easing, LayoutAnimation, Platform, UIManager, ViewStyle, TextStyle, ViewProps, Image } from 'react-native'

import { Images } from '../constants/assets/images'
import { ColorSet } from '../styles'
import { H4 } from '.'
import appStyle from '../assets/styles/appStyle'

import { TouchableOpacity } from 'react-native-gesture-handler'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface AccordionProps {
  rightIcon?: boolean | null
  onPress?: (() => void) | undefined
  divider?: boolean | null
  align?: string | undefined
  containerStyle?: ViewStyle | undefined
  headerStyle?: ViewStyle | undefined
  bodyStyle?: ViewStyle | undefined
  label?: ReactElement | undefined
  toggler?: ReactElement | undefined
  labelStyle?: TextStyle | undefined
}

const Accordion: React.FC<AccordionProps> = props => {
  const spinValue = useRef(new Animated.Value(0)).current

  const [expanded, setExpanded] = useState(false)

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-180deg'], })

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(false)
    Animated.timing(spinValue, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }, [])

  const onPressToggleSheet = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(!expanded)
    Animated.timing(spinValue, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const { containerStyle, rightIcon, label, labelStyle, toggler , headerStyle, bodyStyle} = props

  return (
    <Animated.View
      style={{
        ...styles.bottomSheet,
        ...containerStyle,
      }}>
      <View
        style={{
          ...styles.bottomSheetHeader, ...headerStyle
        }}
      >
        <View
          style={[
            appStyle.flex1,
            { flexDirection: 'row', alignSelf:'center' },
          ]}>
          {label}
        </View>

        <TouchableOpacity
          onPress={onPressToggleSheet}
          style={[styles.sheetIconContainer]}
        >
          <Animated.Image
            style={[
              styles.sheetIcon,
              {
                transform: [{ rotate: spin }],
              },
            ]}
            source={Images.down}
          />
        </TouchableOpacity>


      </View>
      <View style={[appStyle.flex1,appStyle.w100]}>

      {expanded && (
        <View
          style={[
            styles.bottomSheetBody, bodyStyle,
            {
              paddingLeft: rightIcon == true ? 47 : 0,
              paddingVertical: rightIcon == true ? 5 : 10,
            },
          ]}>
          {props.children}
        </View>
      )}
      </View>

      {/* <View style={[appStyle.dividerTop]} /> */}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSheet: {
    backgroundColor: '#fff',
  },
  sheetIconContainer: {
    padding: 8,
    // paddingRight: 0,
    marginRight: 15,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  sheetIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSheetBody: {
    flex: 1,
  },
})

export default Accordion
