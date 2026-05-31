// src/services/medicalService.js
import api from '../api/axios'; 

const API_URL = ''; 

export const medicalService = {
    // 1. KUNIN ANG LAHAT NG MEDICAL RECORDS NG ISANG PATIENT
    getRecords: async (patientId) => {
        try {
            const response = await api.get(`${API_URL}/medical-records/${patientId}`);
            return response.data; 
        } catch (error) {
            console.error("Error in getRecords service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    // 2. MAGDAGDAG NG MEDICAL CONDITION
    addCondition: async (patientId, conditionData) => {
        try {
            const response = await api.post(`${API_URL}/medical-condition/${patientId}`, conditionData);
            return response.data; 
        } catch (error) {
            console.error("Error in addCondition service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    // 3. MAGDAGDAG NG ALLERGY
    addAllergy: async (patientId, allergyData) => {
        try {
            const response = await api.post(`${API_URL}/medical-allergy/${patientId}`, allergyData);
            return response.data;
        } catch (error) {
            console.error("Error in addAllergy service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    // 4. MAGDAGDAG NG SURGERY
    addSurgery: async (patientId, surgeryData) => {
        try {
            const response = await api.post(`${API_URL}/medical-surgery/${patientId}`, surgeryData);
            return response.data;
        } catch (error) {
            console.error("Error in addSurgery service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    // 5. MAGBURA NG MEDICAL RECORD ITEMS
    deleteCondition: async (conditionId) => {
        try {
            const response = await api.delete(`${API_URL}/medical-condition/${conditionId}`);
            return response.data;
        } catch (error) {
            console.error("Error in deleteCondition service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    deleteAllergy: async (allergyId) => {
        try {
            const response = await api.delete(`${API_URL}/medical-allergy/${allergyId}`);
            return response.data;
        } catch (error) {
            console.error("Error in deleteAllergy service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    },

    deleteSurgery: async (surgeryId) => {
        try {
            const response = await api.delete(`${API_URL}/medical-surgery/${surgeryId}`);
            return response.data;
        } catch (error) {
            console.error("Error in deleteSurgery service:", error.response?.data?.error || error.response?.data || error.message);
            throw error;
        }
    }
};