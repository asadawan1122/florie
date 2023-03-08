import {Method, fetchData} from './NetworkManager';
import {api} from './Environment';
import SimpleToast from 'react-native-simple-toast';
import {ResponseCode} from '../styles';

const NETWORK_ERROR = 'Network error';

export const callApi = async (endpoint: any, data: any) => {

  const result = await fetchData(endpoint, Method.POST, data);
  console.log('result ========>', result)
  if (result && (result.status == ResponseCode.success || result.status == ResponseCode.successWithCondition)) {
    return result;
  } else if(!result) {
    SimpleToast.show(NETWORK_ERROR);
    return null;
  } else {
    SimpleToast.show(result.message);
    return null;
  } 
};
