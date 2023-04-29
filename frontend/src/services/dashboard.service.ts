import axios from 'axios';
import authHeader from './auth.header';
import { API_URL } from '../configs/api.config';

class DashboardService {
    getDashboardContent() {
        return axios.get(API_URL + '/operations/', { headers: authHeader() });
    }
}

export default new DashboardService();