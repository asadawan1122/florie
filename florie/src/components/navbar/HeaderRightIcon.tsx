import React from 'react'
import { StyleSheet, Image, Text, View, ImageSourcePropType } from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { ColorSet } from '../../styles'

interface HeaderRightIconProps {
  onPressIconOne?: (() => void) | undefined
  onPressIconTwo?: (() => void) | undefined
  onPressIconThree?: (() => void) | undefined
  onLayout?: (() => void) | undefined
  iconOne?: ImageSourcePropType | null
  iconeTwo?: ImageSourcePropType | null
  iconTwoValue?: number | undefined
  iconThreeValue?: number | undefined
  iconeThree?: ImageSourcePropType | null
}

const HeaderRightIcon: React.FC<HeaderRightIconProps> = props => {
  const {
    iconOne,
    iconeTwo,
    iconeThree,
    onPressIconThree,
    onPressIconOne,
    onPressIconTwo,
    iconTwoValue,
    iconThreeValue,
    onLayout,
  } = props
  return (
    <View style={[styles.headerRight]}>
      {iconOne && (
        <TouchableOpacity onLayout={onLayout} onPress={onPressIconOne}>
          <Image style={styles.image} source={iconOne} />
        </TouchableOpacity>
      )}
      {iconeTwo &&
        (iconTwoValue != undefined ? (
          <View>
            <TouchableOpacity onPress={onPressIconTwo}>
              <Image style={styles.image} source={iconeTwo} />
            </TouchableOpacity>
            <View style={styles.cartTopView}>
              <Text style={{ fontSize: 8, color: ColorSet.white }}>
                {iconTwoValue}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={onPressIconTwo}>
            <Image style={styles.image} source={iconeTwo} />
          </TouchableOpacity>
        ))}
      {iconeThree &&
        (iconThreeValue != undefined ? (
          <View>
            <TouchableOpacity onPress={onPressIconThree}>
              <Image style={styles.image} source={iconeThree} />
            </TouchableOpacity>
            <View style={styles.cartTopView}>
              <Text style={{ fontSize: 8, color: ColorSet.white }}>
                {iconThreeValue}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={onPressIconThree}>
            <Image style={styles.image} source={iconeThree} />
          </TouchableOpacity>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  cartTopView: {
    position: 'absolute',
    backgroundColor: ColorSet.theme,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    top: -4,
    left: 5,
  },
  headerRight: {
    marginRight: 20,

    position: 'absolute',
    zIndex: 99,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 25,
    height: 27,
    resizeMode: 'contain',
    marginLeft: 10,
  },
})

export default HeaderRightIcon
