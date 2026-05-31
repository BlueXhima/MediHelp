import api from '../api/axios';

export const sopService = {
    // Kukunin ang lahat ng gabay para sa First Aid
    getAllFirstAid: async () => {
        try {
            const response = await api.get('/firstaid/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching first aid guides:", error);
            throw error;
        }
    },

    // Kukunin ang partikular na first aid steps gamit ang ID
    getFirstAidById: async (id) => {
        try {
            const response = await api.get(`/firstaid/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching first aid guide with ID ${id}:`, error);
            throw error;
        }
    }
};