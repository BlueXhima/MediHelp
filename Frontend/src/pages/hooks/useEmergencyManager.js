// src/hooks/useEmergencyManager.js
import { useState, useEffect, useCallback } from 'react';
import { emergencyService } from '../../services/emergencyService'; // Ayusin ang path kung kinakailangan
import { showToast } from '../../components/ToastMessage';

export const useEmergencyManager = (patientId) => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newContact, setNewContact] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: false
    });

    const fetchContacts = useCallback(async () => {
        if (!patientId) return;
        setIsLoading(true);
        try {
            const result = await emergencyService.getEmergencyContacts(patientId);
            if (result.success) {
                setContacts(result.contacts || []);
            }
        } catch (error) {
            console.error("Error loading contacts:", error);
            showToast("Failed to sync emergency contacts.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleInputChange = (field, value) => {
        setNewContact(prev => ({ ...prev, [field]: value }));
    };

    const handleAddContact = async () => {
        if (!newContact.name.trim() || !newContact.phone.trim()) {
            showToast("Name and Phone Number are required.", "warning");
            return;
        }

        try {
            const result = await emergencyService.addEmergencyContact(patientId, newContact);
            if (result.success) {
                showToast("Contact added successfully.", "success");
                setNewContact({ name: '', relationship: '', phone: '', email: '', isPrimary: false });
                fetchContacts(); // E-execute ulit para ma-refresh ang listahan mula sa Database
            }
        } catch (error) {
            console.error("Error creating contact:", error);
            showToast("Failed to save emergency contact.", "error");
        }
    };

    const handleRemoveContact = async (contactId) => {
        try {
            const result = await emergencyService.deleteEmergencyContact(contactId);
            if (result.success) {
                showToast("Contact removed from register.", "success");
                fetchContacts();
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            showToast("Could not remove contact.", "error");
        }
    };

    return {
        contacts,
        isLoading,
        newContact,
        setNewContact,
        handleInputChange,
        handleAddContact,
        handleRemoveContact,
        fetchContacts
    };
};