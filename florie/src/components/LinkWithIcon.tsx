import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, Image, View, ViewStyle, ImageSourcePropType, ImageStyle } from 'react-native'

import appStyle from '../assets/styles/appStyle'
import { categoryURL, imageProductURL } from '../networking/Environment'
import { ColorSet, Fonts, FamilySet } from '../styles'
import { screenWidth } from '../styles/screenSize'

interface LinkWithIconProps {
  onPress?: (() => void) | undefined
  divider?: boolean | null
  align?: string | undefined
  iconSource?: ImageSourcePropType | undefined
  leftIconSource?: ImageSourcePropType | undefined
  leftIconSourceUri?: ImageSourcePropType | undefined
  containerStyle?: ViewStyle | undefined
  labelStyle?: TextStyle | undefined
  iconStyle?: ImageStyle | undefined
  leftIconStyle?: ImageStyle | undefined
  subTitle?: string | undefined
}

const LinkWithIcon: React.FC<LinkWithIconProps> = props => {
  const {
    onPress,
    iconSource,
    leftIconSource,
    leftIconSourceUri,
    containerStyle,
    divider,
    labelStyle,
    iconStyle,
    leftIconStyle,
    subTitle,
  } = props

  return (
    <View>
      <TouchableOpacity
        style={{
          ...styles.container,
          ...containerStyle,
          paddingVertical: 10,
        }}
        onPress={onPress}>
        {leftIconSource !== undefined && (
          <Image
            style={{ ...styles.leftIcon, ...leftIconStyle }}
            source={
              leftIconSourceUri ?
                { uri: categoryURL + leftIconSource }
                :
                leftIconSource
            }
          />
        )}
        <View style={styles.centerView}>
          <Text
            style={{
              ...styles.label,
              ...labelStyle,
              paddingLeft: leftIconSource != undefined ? 20 : 0,
              width: leftIconSource != undefined ? screenWidth.width55 : null,
            }}>
            {props.children}
          </Text>
          {subTitle && <Text style={[appStyle.aiFlexEnd]}>{subTitle}</Text>}
        </View>
        <Image style={{ ...styles.icon, ...iconStyle }} source={iconSource} />
      </TouchableOpacity>
      {divider == true ? <View style={appStyle.divider} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: ColorSet.blackLight,
    ...Fonts.size.small,
    fontFamily: FamilySet.medium,
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  leftIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  centerView: {
    paddingRight: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default LinkWithIcon
