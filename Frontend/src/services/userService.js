// Frontend/src/services/userService.js

import api from '../api/axios'; // Siguraduhing tama ang path papunta sa iyong axios.js file

let userCache = null;

export const userService = {
    getFullDetails: async (forceRefresh = false) => {
        try {
            if (userCache && !forceRefresh) {
                return userCache;
            }
            // Gumamit ng 'api' (ang iyong custom axios instance) sa halip na basta api.get kung magkaiba sila
            const response = await api.get('/user-details');
            userCache = response.data;
            return userCache;
        } catch (error) {
            console.error("Error fetching user details:", error.response?.data || error.message);
            throw error;
        }
    },

    // BAGONG FUNCTION: Para sa pag-update ng profile gamit ang Axios
    updateProfile: async (formData) => {
        try {
            // I-post ang FormData gamit ang iyong secure axios instance
            const response = await api.post('/update-profile-full', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            // BURAHIN ANG CACHE para sa susunod na tawag, pinakabagong data na ang makuha sa server
            userCache = null; 
            
            return response.data;
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            throw error;
        }
    },

    getDisplayName: async () => {
        const data = await userService.getFullDetails();
        return `${data.firstName} ${data.lastName}`;
    },

    clearCache: () => {
        userCache = null;
    }
};