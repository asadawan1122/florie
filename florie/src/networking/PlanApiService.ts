import {Method, fetchData} from './NetworkManager';
import {Storage} from '../utils';
import SimpleToast from 'react-native-simple-toast';

export const submitData = async (endpoint: any, data: any, id = null) => {
     const user = await Storage.getDataFromStorage('user');
     let route = endpoint + user._id;
     if (id) {
       route = endpoint + user._id + '/' + id;
     }
     const result = await fetchData(route, Method.POST, data);
     SimpleToast.show(result.message);
    
   };