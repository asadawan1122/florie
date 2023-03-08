import {Method, fetchData} from './NetworkManager';
import {ResponseCode} from '../styles';
import SimpleToast from 'react-native-simple-toast';
const NETWORK_ERROR = 'Network error';

export const deleteTicket = async (endpoint: any, id:any) => {
     const route = endpoint + id;
     const result = await fetchData(route, Method.GET, null);
     if (result && result.status == ResponseCode.success) {
       return result;
     } else if (result && (result.status == ResponseCode.error || result.status == ResponseCode.notFound)) {
       SimpleToast.show(result.message);
       return null;
     } else {
      //  SimpleToast.show(NETWORK_ERROR);
       return null;
     }
   };

   export const getData = async (endpoint: any, id:any) => {
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


  export const submitData = async (endpoint: any, data: any, id: any) => {
    let route = endpoint + id;
    const result = await fetchData(route, Method.POST, data);
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