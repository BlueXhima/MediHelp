// src/services/medicationService.js
import api from '../api/axios'; // Ginamit ang iyong custom secure axios instance

export const medicationService = {
    // Fetch all active medications for a specific patient
    getByPatientId: async (patientId) => {
        try {
            const response = await api.get(`/medications/${patientId}`);
            return response.data; // Nagbabalik ng { success: true, medications: [...] }
        } catch (error) {
            console.error(`Error fetching medications for patient ${patientId}:`, error);
            throw error;
        }
    },

    // Add a new medication entry
    create: async (patientId, medicationData) => {
        try {
            const response = await api.post(`/medication/${patientId}`, medicationData);
            return response.data;
        } catch (error) {
            console.error("Error creating medication transaction:", error);
            throw error;
        }
    },

    // Soft delete or remove a medication entry
    delete: async (medicationId) => {
        try {
            const response = await api.delete(`/medication/${medicationId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting medication record ID ${medicationId}:`, error);
            throw error;
        }
    }
};