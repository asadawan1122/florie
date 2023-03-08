import React from 'react'
import { StyleSheet, Image, View } from 'react-native'

import { Images } from '../../constants/assets/images'

import { TouchableOpacity } from 'react-native-gesture-handler'

interface BackButtonProps {
  onPress: (() => void) | undefined
}

const HeaderBackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <View style={[styles.header]}>
      <TouchableOpacity onPress={onPress} style={{ paddingRight: 20 }}>
        <Image style={styles.image} source={Images.back} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    position: 'absolute',
    zIndex: 99,
  },
  image: {
    width: 16,
    height: 18,
    resizeMode: 'contain',
  },
})

export default HeaderBackButton
