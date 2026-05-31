// src/services/emergencyService.js
import api from '../api/axios'; // Siguraduhing tama ang path papunta sa iyong custom axios instance

export const emergencyService = {
    // GET /emergency-contacts/:patientId
    getEmergencyContacts: async (patientId) => {
        try {
            const response = await api.get(`/emergency-contacts/${patientId}`);
            return response.data;
        } catch (error) {
            console.error("Error sa getEmergencyContacts service:", error);
            throw error;
        }
    },

    // POST /emergency-contact/:patientId
    addEmergencyContact: async (patientId, contactData) => {
        try {
            const response = await api.post(`/emergency-contact/${patientId}`, contactData);
            return response.data;
        } catch (error) {
            console.error("Error sa addEmergencyContact service:", error);
            throw error;
        }
    },

    // DELETE /emergency-contact/:contactId
    deleteEmergencyContact: async (contactId) => {
        try {
            // TANDAAN: Sa controller mo, `const { contactId } = req.params;` ang hinahanap.
            // Kaya ipapasa natin dito ang direct contact id.
            const response = await api.delete(`/emergency-contact/${contactId}`);
            return response.data;
        } catch (error) {
            console.error("Error sa deleteEmergencyContact service:", error);
            throw error;
        }
    }
};