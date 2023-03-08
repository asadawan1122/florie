import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Vibration } from 'react-native'

import * as Animatable from 'react-native-animatable'

import appStyle from '../assets/styles/appStyle'
import { Images } from '../constants/assets/images'
import { ColorSet, FamilySet } from '../styles'
import { H4 } from '.'



interface ErrorContainerProps {
  status?: String | undefined
  label?: String | undefined
  isVisible?: boolean | true
  onClose?: () => void | undefined
}

const ErrorContainer: React.FC<ErrorContainerProps> = props => {
  const { status, label, isVisible, onClose } = props

  return (
    <>
      {isVisible && (
        Vibration.vibrate(150)
      )}
      {isVisible && (
        <Animatable.View
          animation={'shake'}
          style={[
            styles.errorContainer,
            {
              backgroundColor:
                status == 'sucess'
                  ? 'rgba(46, 214, 163, 0.15)'
                  : status == 'info'
                    ? 'rgba(255, 180, 92, 0.15)'
                    : 'rgba(255, 91, 91, 0.15)',
              borderColor:
                status == 'sucess'
                  ? '#2ED6A3'
                  : status == 'info'
                    ? '#FFB45C'
                    : '#FF5B5B',
            },
          ]}>
          <View style={[appStyle.flex1, appStyle.pl10]}>
            <H4
              style={{
                fontFamily: FamilySet.medium,
                color:
                  status == 'sucess'
                    ? '#2ED6A3'
                    : status == 'info'
                      ? '#FFB45C'
                      : '#FF5B5B',
              }}>
              {label}
            </H4>
          </View>
          {
            onClose !== undefined &&
            <TouchableOpacity
              style={{
                height: '100%',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}
              onPress={onClose}>
              <Image
                source={Images.close}
                style={{
                  tintColor: ColorSet.grey,
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          }
        </Animatable.View>
      )
      }
    </>
  )
}

const styles = StyleSheet.create({
  moveRight: {
    alignSelf: 'flex-end',
    height: 200,
    width: 200,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 10,
  },
})

export default ErrorContainer

