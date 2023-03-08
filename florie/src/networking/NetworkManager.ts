import { getDataFromStorage } from '../utils/storage'
import { baseURL,  graphBaseURL } from './Environment'
export const AUTHORIZE = 'AUTHORIZE'
export const NETWORK_ERROR = 'NETWORK ERROR'
export const EXPIRED_STATE = 3000204

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum Status {
     SUCCESS = 200,
     ERROR = 400,
     AUTHENTICATION_FAIL = 401,
     NOT_FOUND = 400,
   }

var defaultHeaders: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const callApi = async (endPoint, method, data, isBearer, multipart, isPageUrl) => {
  var url = isPageUrl ? graphBaseURL + endPoint : baseURL + endPoint

  if (isBearer) {
    const token = await getDataFromStorage('token')
    defaultHeaders['Authorization'] = 'Bearer ' + token
  } else {
    delete defaultHeaders.Authorization
  }
  if (multipart) {
    defaultHeaders['Content-Type'] = 'multipart/form-data'
  }
  else {
    defaultHeaders['Content-Type'] = 'application/json'
  }
  try {
    let response = await fetch(url, {
      method: method,
      headers: defaultHeaders,
      body: method == 'GET' ? null : multipart ? data : JSON.stringify(data),
    })
    const status = response.status
    let responseJson = await response.json()
    responseJson['status'] = status == 404 ? 400:status
    
    return responseJson
  } catch (error) {
    console.log('error:', error)
  }
}

export const fetchData = async (
  uri: string,
  method = Method.GET,
  data = null,
  isBearer = true,
  multipart = false,
  isPageUrl = false,
) => {
  const resData = await callApi(uri, method, data, isBearer, multipart, isPageUrl, )
  return resData
}
