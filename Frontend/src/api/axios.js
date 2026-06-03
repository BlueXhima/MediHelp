// Frontend/src/api/axios.js
import axios from 'axios';
import 'dotenv/config';

// Subukan nating i-log kung ano ang nakikita niya
console.log("Process ENV:", process.env.VITE_APP_API_URL);

// Gagamit tayo ng environment variable. 
const API_BASE_URL = process.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // Mahalaga ito para maipadala ang refreshToken cookie
});

// I-LOG NATIN PARA MAKITA NATIN SA BROWSER CONSOLE KUNG ANO ANG NABABASA NIYA
console.log("Current API Base URL is:", API_BASE_URL);

// Interceptor para sa Response
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kung 401 (Expired Token) at hindi pa nasubukang i-refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // TATAWAGIN DITO ANG IYONG exports.refreshToken
                const res = await axios.post(`${API_BASE_URL}/refresh`, {}, { withCredentials: true });
                
                const { accessToken } = res.data;
                
                // I-update ang header para sa susunod na request
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                
                return api(originalRequest); // Ulitin ang orihinal na request
            } catch (refreshError) {
                // Pag pati refresh token expired na, logout na ang user
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
