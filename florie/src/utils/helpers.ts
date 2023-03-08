import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDataFromStorage } from './storage'
import SimpleToast from 'react-native-simple-toast'

export function filterArrayWithValue(value, array) {
  array = array.filter(item => item._id !== value)
  return array
}

export async function verifySession() {
  let data = getDataFromStorage('language')
  var nav = 'OnBoarding'
  if (data != null) {
    nav = 'OnBoarding'
  }
  return nav
}

export async function verifyAuth() {
  let data = getDataFromStorage('auth')
  var nav = 'OnlineOrders'
  if (data == null) {
    nav = 'Login'
  }
  return nav
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export function showToast(message:any){
  SimpleToast.show(message, SimpleToast.LONG)
}

export function removeFromArray(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

export function reverseArray(arr: []) {
  var new_arr = arr.reverse()
  return new_arr
}

