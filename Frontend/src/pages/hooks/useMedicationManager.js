// src/hooks/useMedicationManager.js
import { useState, useEffect, useCallback } from 'react';
import { medicationService } from '../../services/medicationService';
import { showToast } from '../../components/ToastMessage';

export const useMedicationManager = (patientId) => {
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Tracks the temporary unsaved inputs in the form
    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: ''
    });

    // Wrapped in useCallback to safely allow re-fetching during standard discards/cancels
    const fetchMedications = useCallback(async () => {
        if (!patientId) return;
        setIsLoading(true);
        try {
            const data = await medicationService.getByPatientId(patientId);
            
            // FIX HERE: Extract 'medications' array inside the response object safely
            const medicationsList = data?.medications || [];
            
            const normalizedMeds = medicationsList.map(med => ({
                id: med.id || med.MedicationID || med.MedicationId,
                name: med.name || med.MedicationName || '',
                dosage: med.dosage || med.Dosage || '',
                frequency: med.frequency || med.Frequency || '',
                prescribedBy: med.prescribedBy || med.PrescribedBy || med.DoctorName || '',
                status: med.status || med.Status || 'Active'
            }));
            
            setMedications(normalizedMeds);
        } catch (error) {
            console.error("Hook error loading medication states:", error);
            showToast("Failed to sync your current medication database.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    // Initial lifecycle load
    useEffect(() => {
        fetchMedications();
    }, [fetchMedications]);

    // Fires whenever the user clicks the explicit "Add Medication" button
    const handleAddMedication = async () => {
        if (!newMed.name.trim()) {
            showToast("Medication name is required.", "warning");
            return;
        }

        try {
            const response = await medicationService.create(patientId, newMed);
            
            if (response && response.success) {
                // Re-fetch clean array from DB to reflect true model keys/IDs
                await fetchMedications();
                
                // Reset fields
                setNewMed({ name: '', dosage: '', frequency: '', prescribedBy: '' });
                showToast("Medication added successfully.", "success");
            } else {
                showToast("Failed to attach new medication record.", "error");
            }
        } catch (error) {
            showToast("Failed to attach new medication record.", "error");
        }
    };

    // Fires whenever the user drops a medication item
    const handleRemoveMedication = async (id) => {
        try {
            const response = await medicationService.delete(id);
            if (response && response.success) {
                // Dynamic UI filter state matching database destruction
                setMedications(prev => prev.filter(med => med.id !== id));
                showToast("Medication removed successfully.", "success");
            } else {
                showToast("Failed to delete medication state.", "error");
            }
        } catch (error) {
            showToast("Failed to delete medication state.", "error");
        }
    };

    // Form tracking utility
    const handleInputChange = (field, value) => {
        setNewMed(prev => ({ ...prev, [field]: value }));
    };

    return {
        medications,
        newMed,
        isLoading,
        fetchMedications,
        handleAddMedication,
        handleRemoveMedication,
        handleInputChange,
        setNewMed
    };
};