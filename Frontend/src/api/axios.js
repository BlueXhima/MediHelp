// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Mahalaga ito para maipadala ang refreshToken cookie
});

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
                const res = await axios.post('http://localhost:5000/api/refresh', {}, { withCredentials: true });
                
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