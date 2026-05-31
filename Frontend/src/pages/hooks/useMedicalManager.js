import { useState, useEffect } from 'react';
import { medicalService } from '../../services/medicalService'; 

export const useMedicalManager = (patientId) => {
    // Main States galing sa Database
    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [surgeries, setSurgeries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Temp Form States para sa mga Inputs
    const [newCondition, setNewCondition] = useState({ name: '', date: '', status: 'Active' });
    const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'Moderate', reaction: '' });
    const [newSurgery, setNewSurgery] = useState({ name: '', date: '', hospital: '' });

    // 1. LOAD ALL MEDICAL RECORDS
    const fetchMedicalRecords = async () => {
        if (!patientId) return;
        try {
            setIsLoading(true);
            const response = await medicalService.getRecords(patientId);
            if (response && response.success) {
                setConditions(response.conditions || []);
                setAllergies(response.allergies || []);
                setSurgeries(response.surgeries || []);
            }
        } catch (error) {
            console.error("Error loading medical records:", error);
            // Ang initial fetch ay pwedeng mag-toast pa rin dahil ito ay automatic side-effect,
            // o pwede ring i-return/i-handle sa main loader. Mananatili muna ito para sa safety.
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-load kapag may patientId na
    useEffect(() => {
        fetchMedicalRecords();
    }, [patientId]);

    // 2. INPUT CHANGE HANDLERS
    const handleConditionChange = (field, value) => {
        setNewCondition(prev => ({ ...prev, [field]: value }));
    };

    const handleAllergyChange = (field, value) => {
        setNewAllergy(prev => ({ ...prev, [field]: value }));
    };

    const handleSurgeryChange = (field, value) => {
        setNewSurgery(prev => ({ ...prev, [field]: value }));
    };

    // 3. ADD ITEM HANDLER (Database Sync gamit ang Return pattern)
    const addItem = async (type) => {
        try {
            if (type === 'condition' && newCondition.name) {
                const response = await medicalService.addCondition(patientId, newCondition);
                if (response && response.success) {
                    setConditions(prev => [{ ...newCondition, id: response.id }, ...prev]);
                    setNewCondition({ name: '', date: '', status: 'Active' });
                    return { success: true, message: response.message || "Medical condition added successfully." };
                }
            }
            if (type === 'allergy' && newAllergy.name) {
                const response = await medicalService.addAllergy(patientId, newAllergy);
                if (response && response.success) {
                    setAllergies(prev => [{ ...newAllergy, id: response.id }, ...prev]);
                    setNewAllergy({ name: '', severity: 'Moderate', reaction: '' });
                    return { success: true, message: response.message || "Allergy record added successfully." };
                }
            }
            if (type === 'surgery' && newSurgery.name) {
                const response = await medicalService.addSurgery(patientId, newSurgery);
                if (response && response.success) {
                    setSurgeries(prev => [{ ...newSurgery, id: response.id }, ...prev]);
                    setNewSurgery({ name: '', date: '', hospital: '' });
                    return { success: true, message: response.message || "Surgery record added successfully." };
                }
            }
            return { success: false, message: `Failed to add ${type}. Missing data or invalid request.` };
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
            return { 
                success: false, 
                message: error.response?.data?.error || `Failed to add ${type}.` 
            };
        }
    };

    // 4. REMOVE ITEM HANDLER (Database Sync gamit ang Return pattern)
    const removeItem = async (type, id) => {
        try {
            let response;
            if (type === 'condition') {
                response = await medicalService.deleteCondition(id);
                if (response && response.success) setConditions(prev => prev.filter(item => item.id !== id));
            } 
            else if (type === 'allergy') {
                response = await medicalService.deleteAllergy(id);
                if (response && response.success) setAllergies(prev => prev.filter(item => item.id !== id));
            } 
            else if (type === 'surgery') {
                response = await medicalService.deleteSurgery(id);
                if (response && response.success) setSurgeries(prev => prev.filter(item => item.id !== id));
            }
            
            if (response && response.success) {
                const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
                return { success: true, message: response.message || `${typeCapitalized} removed successfully.` };
            }
            return { success: false, message: `Failed to delete ${type}.` };
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            return { 
                success: false, 
                message: error.response?.data?.error || `Failed to delete ${type}.` 
            };
        }
    };

    return {
        conditions,
        allergies,
        surgeries,
        isLoading,
        newCondition,
        newAllergy,
        newSurgery,
        handleConditionChange,
        handleAllergyChange,
        handleSurgeryChange,
        addItem,
        removeItem,
        fetchMedicalRecords // Ini-expose para sa handleCancel refresh
    };
};