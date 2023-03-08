import React from 'react'
import { StyleSheet, View } from 'react-native'

import { ColorSet } from '../../styles'

import { Chase } from 'react-native-animated-spinkit'
import { H5 } from '..'
import appStyle from '../../assets/styles/appStyle'

interface LoaderProps {
  isLoading?: boolean | undefined
  overlay?: boolean | undefined
  shadow?: boolean | undefined
  message?: String | undefined
  layout?: 'inside' | 'outside' | undefined
}

const Loader: React.FC<LoaderProps> = props => {
  const { isLoading, overlay, shadow, message, layout } = props

  return (
    <>
      {isLoading && (
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                overlay == false ? 'transparent' : 'rgba(255,255,255,0.52)',
            },
          ]}>
          <View
            style={[
              styles.loaderContainer,
              shadow == false ? null : styles.loaderContainerShadow,
            ]}>
            <Chase
              style={styles.loader}
              size={48}
              color={ColorSet.theme}
              animating={isLoading}></Chase>
            {layout == 'inside' ||
              (layout == undefined &&
                // {
                message && (
                  <View style={appStyle.pt5}>
                    <H5>{message}</H5>
                  </View>
                  // }
                ))}
          </View>
          {layout == 'outside' &&
            // {
            message && (
              <View style={appStyle.pt5}>
                <H5>{message}</H5>
              </View>
              // }
            )}
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    height: '100%',
    width: '100%',
    shadowColor: 'rgba(0,0,0,0.16)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 23,
  },
  loaderContainer: {
    alignItems: 'center',
    padding: 13,
  },
  loaderContainerShadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3.97,

    elevation: 17,
    borderRadius: 8,
    margin: 0,
  },
  loader: {},
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
})

export default Loader
