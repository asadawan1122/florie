import {Method, fetchData} from './NetworkManager';
import {ResponseCode} from '../styles';
import SimpleToast from 'react-native-simple-toast';
const NETWORK_ERROR = 'Network error';


export const transferFund = async (endpoint: any, data: any) => {
  
     const result = await fetchData(endpoint, Method.POST, data);
     if (result && result.status == ResponseCode.success) {
       return result;
     } else if (result && result.status == ResponseCode.error) {
       SimpleToast.show(result.message);
       return null;
     } else {
       SimpleToast.show(NETWORK_ERROR);
       return null;
     }
   };