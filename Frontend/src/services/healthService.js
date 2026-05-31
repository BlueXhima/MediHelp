// src/services/healthService.js
import api from '../api/axios'; // Custom axios instance mo na may refresh token mechanism

export const healthService = {
    // GET /health-metrics/:patientId
    getLatestMetrics: async (patientId) => {
        try {
            const response = await api.get(`/health-metrics/${patientId}`);
            return response.data;
        } catch (error) {
            console.error("Error sa getLatestMetrics service:", error);
            throw error;
        }
    },

    // POST /health-metrics/:patientId (Kung balak mong magdagdag o mag-update ng bagong metrics)
    updateMetrics: async (patientId, metricsData) => {
        try {
            const response = await api.post(`/health-metrics/${patientId}`, metricsData);
            return response.data;
        } catch (error) {
            console.error("Error sa updateMetrics service:", error);
            throw error;
        }
    }
};