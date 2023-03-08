import {Method, fetchData} from './NetworkManager';
import {ResponseCode} from '../styles';
import SimpleToast from 'react-native-simple-toast';
const NETWORK_ERROR = 'Network error';

export const redeemInvestment = async (endpoint: any, id:any) => {
     const route = endpoint + id;
     const result = await fetchData(route, Method.GET, null);
     if (result && result.status == ResponseCode.success) {
       return result;
     } else if (result && (result.status == ResponseCode.error || result.status == ResponseCode.notFound)) {
       SimpleToast.show(result.message);
       return null;
     } else {
       SimpleToast.show(NETWORK_ERROR);
       return null;
     }
   };
