import api from '../api/axios';

export const glossaryService = {
    // Kukunin ang lahat ng medical glossary entries
    getAllGlossary: async () => {
        try {
            const response = await api.get('/glossary/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching glossary from database:", error);
            throw error;
        }
    },

    // Kukunin ang entry gamit ang ID
    getGlossaryById: async (id) => {
        try {
            const response = await api.get(`/glossary/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching glossary with ID ${id}:`, error);
            throw error;
        }
    }
};