import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import { H3, H4, H5, Paragraph } from '../components'

import appStyle from '../assets/styles/appStyle'
import { Images } from '../constants/assets/images'
import { ColorSet, FamilySet } from '../styles'
import { getDate } from '../utils/helpers'

interface CardViewProps {
     status?: string | undefined
     // date?: string | undefined
     // paymentMehtod1?: string | undefined
     // paymentMehtod2?: string | undefined
     // paymentMehtod3?: string | undefined
     // deliveryTime?: string | undefined
     // deliver?: boolean | false
}

const CardView: React.FC<CardViewProps> = props => {
     const {
          status,

     } = props

     return (
          <View style={styles.container}>
               <View>
                    <View style={appStyle.rowBtw}>
                         <Paragraph>Transaction Id</Paragraph>
                         <Paragraph>97392</Paragraph>
                    </View>
                    <View style={appStyle.rowBtw}>
                         <Paragraph>Amount</Paragraph>
                         <Paragraph>$53.3</Paragraph>
                    </View>

                    <View style={appStyle.rowBtw}>
                         <Paragraph>Sender</Paragraph>
                         <Paragraph>aryapankaj246@gmail.com</Paragraph>
                    </View>

                    <View style={appStyle.rowBtw}>
                         <Paragraph>Receiver</Paragraph>
                         <Paragraph>florieinvest@gmail.com</Paragraph>
                    </View>
                    <View style={appStyle.rowBtw}>
                         <Paragraph>Date</Paragraph>
                         <Paragraph>2021-10-08</Paragraph>
                    </View>

                    <View style={appStyle.rowBtw}>
                         <Paragraph>Status</Paragraph>
                         {status === '1' ?
                              <View style={[styles.status,{backgroundColor:ColorSet.green}]} />
                              :
                              <View style={[styles.status,,{backgroundColor:ColorSet.yellow}]} />
                         }
                    </View>
               </View>

          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          backgroundColor: '#fff',
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 10,
          borderRadius: 5,
          padding: 15,
          marginBottom: 20,
     },
     titleText: {
          fontSize: 16,
          fontFamily: FamilySet.medium,
     },
     descriptionView: {
          flexDirection: 'row',
          paddingTop: 5,
          alignItems: 'center',
     },
     iconView: {
          width: 15,
          height: 15,
          resizeMode: 'contain',
     },
     descriptionText: {
          color: ColorSet.grey,
          fontSize: 13,
          fontFamily: FamilySet.regular,
          paddingLeft: 10,
     },
     deliveryText: {
          fontSize: 14,
          fontFamily: FamilySet.regular,
     },
     status: {
          height: 10, width: 10, borderRadius: 5
     }
})

export default CardView
