import api from '../api/axios';

export const infographicService = {
    // Kukunin ang mga infographic resources at image mappings
    getAllInfographics: async () => {
        try {
            const response = await api.get('/infographics/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching infographics:", error);
            throw error;
        }
    },

    getInfographicById: async (id) => {
        try {
            const response = await api.get('/infographics/${id}');
            return response.data;
        } catch (error) {
            console.error(`Error fetching infographic with ID ${id}:`, error);
            throw error;
        }
    }
};