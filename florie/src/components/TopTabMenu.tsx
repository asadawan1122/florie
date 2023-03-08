import React from 'react'
import { StyleSheet, Text, ViewStyle, View, TouchableOpacity } from 'react-native'
import { H2, H5, Button, Input, Loader, Paragraph } from '../components'
import appStyle from '../assets/styles/appStyle'

import { Images } from '../constants/assets/images'
import { ColorSet } from '../styles'
import { Colors } from 'react-native-paper'


interface TopTabMenuProps {
  label1?: string | undefined
  label2?: string | undefined
  // style?: ViewStyle
  // data?: Array<Type> | undefined
}

const TopTabMenu: React.FC<TopTabMenuProps> = ({
  // style,
  label1,
  label2,
  // data,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0)

  const handleSelection = (index) => {
    setSelectedTab(index)
  }
  return (
    <View style={[styles.tabContainer, appStyle.mt10]}>
      <TouchableOpacity
        onPress={() => handleSelection(0)}
        style={[
          styles.tab,
          {
            backgroundColor: selectedTab === 0 ? ColorSet.purple : 'transparent'
          },
        ]}>
      <H5 style={selectedTab == 0 && styles.tabText}>{label1}</H5>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleSelection(1)}
        style={[
          styles.tab,
          {
            backgroundColor: selectedTab === 1 ? ColorSet.purple : 'transparent'
          },
        ]}>
        <H5 style={selectedTab == 1 && styles.tabText}>{label2}</H5>
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabContainer: {
    borderRadius: 5,
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.16,
    shadowRadius: 3.0,

    elevation: 10,
    marginHorizontal: 15,
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
  },
  tabText:{
    color: ColorSet.white 
  }

})

export default TopTabMenu
