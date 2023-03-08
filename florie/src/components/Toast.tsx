// import React from 'react'
// import { StyleSheet, View, Platform } from 'react-native'

// import { ColorSet, Fonts, FamilySet } from '../styles'

// import Toast from 'react-native-simple-toast';

// interface ToastProps {
//     until?: Number | undefined
//     size?: Number | undefined
//     onPress?: (() => void) | undefined
//     onFinish?: (() => void) | undefined
// }

// const ToastComponent: React.FC<ToastProps> = props => {
//     const { until, onPress, onFinish, size } = props

//     return (
//         Toast.show('This is a long toast.', Toast.LONG);
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         marginTop: Platform.OS == 'ios' ? 5 : 0,
//     },
//     digitContainer: {
//         backgroundColor: '#FFF',
//         margin: 0,
//         padding: 0,
//         width: 18,
//         height: 15,
//     },
//     text: {
//         color: ColorSet.grey,
//         ...Fonts.size.small,
//         fontFamily: FamilySet.regular,
//     },
// })

// export default ToastComponent
