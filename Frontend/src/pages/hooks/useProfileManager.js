import { useState } from 'react';
import { userService } from '../../services/userService';
import { showToast } from '../../components/ToastMessage';

export const useProfileManager = (initialUserData, onSaveSuccess) => {
    // Local tracking state para sa binabagong form fields
    const [formData, setFormData] = useState(initialUserData || {});
    const [selectedFile, setSelectedFile] = useState(null);
    
    // Ihiwalay ang preview URL para sa content section lang at hindi sa header agad
    const [localPreview, setLocalPreview] = useState(null); 
    const [removeImageFlag, setRemoveImageFlag] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // I-sync ang fields kapag nagta-type ang user
    const handleInputChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Pagpili ng bagong pfp image binary file
    const handleFileChange = (file) => {
        if (file) {
            setSelectedFile(file);
            setRemoveImageFlag(false);
            
            // I-store ang preview URL dito sa isolated local state lang!
            const previewUrl = URL.createObjectURL(file);
            setLocalPreview(previewUrl); 
        }
    };

    // Pagtanggal ng imahe
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setRemoveImageFlag(true);
        setLocalPreview('REMOVE_IMAGE_PLACEHOLDER');
    };

    const resetForm = (freshUserData) => {
        setFormData(freshUserData || {});
        setSelectedFile(null);
        setLocalPreview(null);
        setRemoveImageFlag(false);
    };

    // Pag-save ng transaksyon
    const saveProfileChanges = async () => {
        try {
            setIsSubmitting(true);
            
            const uploadPayload = new FormData();
            uploadPayload.append('firstName', formData.firstName || '');
            uploadPayload.append('lastName', formData.lastName || '');
            uploadPayload.append('email', formData.email || '');
            uploadPayload.append('address', formData.address || '');
            uploadPayload.append('gender', formData.gender || '');
            uploadPayload.append('height', formData.height || '');
            uploadPayload.append('weight', formData.weight || '');
            uploadPayload.append('dob', formData.dob || '');
            uploadPayload.append('bloodType', formData.bloodType || '');
            uploadPayload.append('removeProfileImage', removeImageFlag);

            if (selectedFile) {
                uploadPayload.append('profileImage', selectedFile);
            }

            const response = await userService.updateProfile(uploadPayload);

            // FIX: Tiyaking laging binabasa nang tama ang Axios response formatting data packet
            if (response && response.success) {
                showToast(response.message || 'Profile updated successfully!', 'success');
                
                const updatedImage = response.profile_picture || (removeImageFlag ? null : formData.profile_picture);
                
                const finalUpdatedData = {
                    ...formData,
                    profile_picture: updatedImage
                };

                if (onSaveSuccess) {
                    onSaveSuccess(finalUpdatedData);
                }
                
                // I-clear ang local references pagkatapos ng success transaction
                setSelectedFile(null);
                setLocalPreview(null);

                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: response.message || 'Failed to update profile settings.' 
                };
            }
        } catch (error) {
            console.error("Database update transaction failed:", error);
            return { 
                success: false, 
                message: error.response?.data?.error || 'An operational server error occurred.' 
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        localPreview, // Ipapasa natin ito para magamit sa Profile Preview card sa content body
        removeImageFlag,
        handleInputChange,
        handleFileChange,
        handleRemoveImage,
        resetForm,
        saveProfileChanges
    };
};