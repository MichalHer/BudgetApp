import axios from "axios";
import { API_URL } from "../configs/api.config";
import { Navigate } from "react-router-dom";

class AuthService {
    
    login(username: string, password: string) {
        var bodyFormData = new FormData();
        bodyFormData.append('username', username);
        bodyFormData.append('password', password);

        return axios({
            method: "post",
            url: API_URL + "/login",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(response => {
            if (response.data) {
                localStorage.setItem ("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username: string, email: string, password: string) {
        return axios.post(API_URL + "/users/", {
            nick: username,
            password: password
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

export default new AuthService();