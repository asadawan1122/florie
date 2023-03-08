import React from 'react'
import { StyleSheet, TextInput, Image, View, ImageSourcePropType, ViewStyle, KeyboardTypeOptions, Platform } from 'react-native'

import { ColorSet, Fonts, FamilySet } from '../styles'

import { TouchableOpacity } from 'react-native-gesture-handler'

interface SearchInputProps {
  value?: string
  tintColor?: string
  keyboardType?: KeyboardTypeOptions
  onChangeText?: Function
  onPressSearch?: (() => void) | undefined
  setValue?: Function
  autofocus?: boolean
  onFocus?: (() => void) | undefined
  onBlur?: (() => void) | undefined
  placeholder?: string | undefined
  containerStyle?: ViewStyle | undefined
  imageSource1?: ImageSourcePropType | null
  imageSource2?: ImageSourcePropType | null
  onPressImage?: (() => void) | undefined
  onEndEditing?: (() => void) | undefined
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const {
    onChangeText,
    keyboardType,
    setValue,
    autofocus,
    value,
    placeholder,
    imageSource1,
    imageSource2,
    containerStyle,
    tintColor,
    onPressImage,
    onEndEditing,
    onFocus,
    onBlur,
    onPressSearch
  } = props


  const changeHandler = (inputText: string) => {
    setValue(inputText)
  }

  const onPressCancle = () => {
    setValue('')
  }

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <TouchableOpacity
        onPress={onPressImage}
      >
        <Image
          style={[styles.icon, { tintColor: tintColor }]}
          source={imageSource1}
        />
      </TouchableOpacity>

      <TextInput
        onEndEditing={onEndEditing}
        style={[styles.input]}
        value={value}
        onChangeText={changeHandler}
        keyboardType={keyboardType ?? 'default'}
        autoFocus={autofocus}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={ColorSet.placeholder}
        clearButtonMode={'always'}
      />
      {value.length > 0 && (
        <TouchableOpacity
          hitSlop={{ top: 20, right: 20, left: 20, bottom: 20 }}
          onPress={onPressCancle}>
          <Image style={styles.cancel} source={imageSource2} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorSet.greyLight,
    borderRadius: 10,
    marginTop: 15,
    position: 'relative',
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS == 'ios' ? 15 : 5,

  },
  input: {
    ...Fonts.size.normal,
    fontFamily: FamilySet.regular,
    color: ColorSet.black,
    flex: 1,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 10,
  },
  cancel: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
})

export default SearchInput
