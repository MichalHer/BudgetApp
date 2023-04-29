import axios from 'axios';
import authHeader from './auth.header';
import { API_URL } from '../configs/api.config';

class OperationsService {
  getOperations( since?:any|null, to?:any|null, category_id?:number|null, account_id?:number|null, prediction_id?:number|null  ) {
    let params:string ='?'
    if(since) params += `${since}&`
    if(to) params += `${to}&`
    if(category_id) params += `${category_id}&`
    if(account_id) params += `${account_id}&`
    if(prediction_id) params += `${prediction_id}&`
    params = params.substring(0, params.length - 1)
    return axios.get(API_URL + '/operations/'+params, { headers: authHeader() });
  }
}

export default new OperationsService();