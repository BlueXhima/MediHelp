// personalInfo.jsx 

import React, { useState, useEffect, useCallback } from 'react';
import { 
    User, Edit, X, Check, Mail, MapPin, 
    Calendar, Ruler, Scale, Droplets, VenusAndMars, Loader2, AlertCircle
} from 'lucide-react';
import DefaultAvatar from '../../../assets/default-avatar.png';
import axios from 'axios';
import ToastMessage, { showToast } from '../../../components/ToastMessage';

// VALIDATION REGEX (for display warnings, NOT for stripping)
const NAME_INVALID_CHARS = /[@#$%^&*()=+{}[\]<>/\\|"'";:]/g;
const ADDRESS_INVALID_CHARS = /[<>{}|\\^`]/g;

const hasInvalidChars = (value, regex) => regex.test(value);

const getInvalidChars = (value, regex) => {
    const matches = value.match(regex);
    return matches ? [...new Set(matches)].join(' ') : '';
};

const PersonalInfo = ({ userData, isLoading: parentIsLoading }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [deletePhoto, setDeletePhoto] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        gender: '',
        height: '',
        weight: '',
        bloodType: '',
        dob: '',
        profile_picture: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log("userData received:", userData);
        
        if (userData && !parentIsLoading) {
            const formatDecimal = (value) => {
                if (!value && value !== 0) return '';
                const num = parseFloat(value);
                return isNaN(num) ? '' : String(Math.round(num));
            };

            const formatDate = (dateValue) => {
                if (!dateValue) return '';
                
                if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateValue;
                }
                
                const date = new Date(dateValue);
                if (isNaN(date.getTime())) {
                    return '';
                }
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                return `${year}-${month}-${day}`;
            };
            
            const initialData = {
                firstName: userData.firstName || userData.FirstName || '',
                lastName: userData.lastName || userData.LastName || '',
                email: userData.email || userData.Email || '',
                address: userData.address || userData.Address || '',
                gender: userData.gender || userData.Gender || '',
                height: formatDecimal(userData.height || userData.Height_cm || userData.height_cm),
                weight: formatDecimal(userData.weight || userData.Weight_kg || userData.weight_kg),
                bloodType: userData.bloodType || userData.BloodType || userData.blood_type || '',
                dob: formatDate(userData.dob || userData.DateOfBirth || userData.dateOfBirth),
                profile_picture: userData.profile_picture || userData.ProfilePicture || userData.profilePicture || ''
            };
            
            console.log("Setting formData to:", initialData);
            
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [userData, parentIsLoading]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const validateHeight = (value) => {
        if (!value) return null;
        const num = parseFloat(value);
        if (isNaN(num)) return 'Height must be a number';
        if (num < 50) return 'Height must be at least 50 cm';
        if (num > 300) return 'Height must be at most 300 cm';
        return null;
    };

    const validateWeight = (value) => {
        if (!value) return null;
        const num = parseFloat(value);
        if (isNaN(num)) return 'Weight must be a number';
        if (num < 2) return 'Weight must be at least 2 kg';
        if (num > 500) return 'Weight must be at most 500 kg';
        return null;
    };

    // REAL-TIME DOB VALIDATION
    const validateDob = (value) => {
        if (!value) return null;
        
        const dobDate = new Date(value);
        const today = new Date();
        // Reset time to midnight for accurate date comparison
        today.setHours(0, 0, 0, 0);
        dobDate.setHours(0, 0, 0, 0);
        
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 150);
        
        if (dobDate.getTime() === today.getTime()) {
            return 'Date of birth cannot be today';
        }
        if (dobDate > today) {
            return 'Date of birth cannot be in the future';
        }
        if (dobDate < minDate) {
            return 'Please enter a valid date of birth';
        }
        return null;
    };

    const validateForm = useCallback(() => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (hasInvalidChars(formData.firstName, NAME_INVALID_CHARS)) {
            newErrors.firstName = `Remove invalid characters: ${getInvalidChars(formData.firstName, NAME_INVALID_CHARS)}`;
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (hasInvalidChars(formData.lastName, NAME_INVALID_CHARS)) {
            newErrors.lastName = `Remove invalid characters: ${getInvalidChars(formData.lastName, NAME_INVALID_CHARS)}`;
        }
        
        const heightError = validateHeight(formData.height);
        if (heightError) newErrors.height = heightError;
        
        const weightError = validateWeight(formData.weight);
        if (weightError) newErrors.weight = weightError;
        
        const dobError = validateDob(formData.dob);
        if (dobError) newErrors.dob = dobError;
        
        if (formData.address && hasInvalidChars(formData.address, ADDRESS_INVALID_CHARS)) {
            newErrors.address = `Remove invalid characters: ${getInvalidChars(formData.address, ADDRESS_INVALID_CHARS)}`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'firstName' || name === 'lastName') {
            if (hasInvalidChars(value, NAME_INVALID_CHARS)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Invalid characters detected: ${getInvalidChars(value, NAME_INVALID_CHARS)}`
                }));
            } else {
                setErrors(prev => ({ ...prev, [name]: null }));
            }
        } else if (name === 'address') {
            if (hasInvalidChars(value, ADDRESS_INVALID_CHARS)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Invalid characters detected: ${getInvalidChars(value, ADDRESS_INVALID_CHARS)}`
                }));
            } else {
                setErrors(prev => ({ ...prev, [name]: null }));
            }
        } else if (name === 'height') {
            const error = validateHeight(value);
            setErrors(prev => ({ ...prev, height: error }));
        } else if (name === 'weight') {
            const error = validateWeight(value);
            setErrors(prev => ({ ...prev, weight: error }));
        } else if (name === 'dob') {
            const error = validateDob(value);
            setErrors(prev => ({ ...prev, dob: error }));
        } else if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size must be less than 5MB', 'error');
                return;
            }
            
            setSelectedFile(file);
            setDeletePhoto(false);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            setFormData(prev => ({
                ...prev,
                profile_picture: objectUrl
            }));
        }
    };

    const handleCancel = () => {
        if (originalData) {
            setFormData({ ...originalData });
        }
        
        setSelectedFile(null);
        setDeletePhoto(false);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        
        setErrors({});
        setIsEditing(false);
    };

    const handleDeletePhoto = () => {
        setDeletePhoto(true);
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setFormData(prev => ({ ...prev, profile_picture: '' }));
    };

    // SMOOTH PAGE REFRESH HELPER
    const smoothReload = () => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showToast('Please fix the errors before saving', 'error');
            return;
        }

        try {
            setIsSaving(true);
            
            const idToSend = userData?.userID || userData?.userId || userData?.UserID;
            
            if (!idToSend) {
                showToast('User ID is missing. Cannot save.', 'error');
                setIsSaving(false);
                return;
            }

            const formDataToSubmit = new FormData();
            formDataToSubmit.append('userId', idToSend);
            formDataToSubmit.append('firstName', formData.firstName.trim());
            formDataToSubmit.append('lastName', formData.lastName.trim());
            formDataToSubmit.append('address', formData.address.trim());
            formDataToSubmit.append('gender', formData.gender);
            formDataToSubmit.append('height', formData.height);
            formDataToSubmit.append('weight', formData.weight);
            formDataToSubmit.append('bloodType', formData.bloodType);
            formDataToSubmit.append('dob', formData.dob);

            if (deletePhoto) {
                formDataToSubmit.append('removeProfileImage', 'true');
            } else if (selectedFile) {
                formDataToSubmit.append('profileImage', selectedFile);
            }

            const response = await axios.post(
                'http://localhost:5000/api/users/update-profile-full', 
                formDataToSubmit,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 30000
                }
            );

            if (response.status === 200) {
                const returnedData = response.data.data;
                
                const updatedData = {
                    ...formData,
                    profile_picture: returnedData?.profile_picture || ''
                };
                
                setOriginalData(updatedData);
                setFormData(updatedData);
                
                setSelectedFile(null);
                setDeletePhoto(false);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                
                setIsEditing(false);
                showToast('Profile updated successfully!', 'success');
                
                setTimeout(() => {
                    smoothReload();
                }, 1200);
            }
        } catch (error) {
            console.error('Save Error:', error);
            
            let errorMessage = 'Failed to save changes.';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const getImageSrc = () => {
        if (deletePhoto) {
            return DefaultAvatar;
        }
        
        if (isEditing && previewUrl) {
            return previewUrl;
        }
        
        if (formData.profile_picture && !formData.profile_picture.startsWith('blob:')) {
            return formData.profile_picture;
        }
        
        return DefaultAvatar;
    };

    if (parentIsLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-slate-500 font-medium">Loading profile...</span>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <User size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-foreground">Personal Information</h3>
                            <p className="text-sm text-slate-500 font-medium">Update your identity and contact info</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={handleCancel} 
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                                    font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <X size={16} /> Cancel
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white 
                                    font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all 
                                    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} /> Save
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 
                                text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <Edit size={16} /> Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-100">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 relative">
                            <img 
                                src={getImageSrc()}
                                alt="Profile"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = DefaultAvatar;
                                }}
                            />
                            
                            {isEditing && !isSaving && (
                                <div 
                                    onClick={() => {
                                        document.getElementById('pfpInput').click();
                                        setDeletePhoto(false);
                                    }}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <span className="text-[10px] text-white font-black uppercase tracking-tighter">
                                        Change Photo
                                    </span>
                                </div>
                            )}
                        </div>

                        {isEditing && !deletePhoto && !isSaving && (
                            (formData.profile_picture || userData?.profile_picture || userData?.ProfilePicture) && (
                                <button
                                    type="button"
                                    onClick={handleDeletePhoto}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all z-10"
                                    title="Delete Photo"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            )
                        )}
                        
                        <input 
                            type="file" 
                            id="pfpInput" 
                            hidden 
                            accept="image/*" 
                            onChange={handleFileChange}
                            disabled={isSaving}
                        />
                    </div>
                    <h2 className="mt-4 text-xl font-black text-slate-900 uppercase tracking-tight">
                        {formData.firstName} {formData.lastName}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            First Name *
                        </label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            disabled={!isEditing || isSaving}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 
                            focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold 
                            text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                            ${errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
                        />
                        {errors.firstName && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={12} />
                                <span>{errors.firstName}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Last Name *
                        </label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            disabled={!isEditing || isSaving}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 
                            focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold 
                            text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                            ${errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
                        />
                        {errors.lastName && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={12} />
                                <span>{errors.lastName}</span>
                            </div>
                        )}
                    </div>

                    {/* Date of Birth — with real-time validation */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Date of Birth
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="date" 
                                name="dob" 
                                value={formData.dob} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                                ${errors.dob ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.dob && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={12} />
                                <span>{errors.dob}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Gender
                        </label>
                        <div className="relative">
                            <VenusAndMars className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed appearance-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Blood Type
                        </label>
                        <div className="relative">
                            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                            <select 
                                name="bloodType" 
                                value={formData.bloodType} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed appearance-none"
                            >
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Height (cm)
                        </label>
                        <div className="relative">
                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                name="height" 
                                value={formData.height} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving}
                                min="50"
                                max="300"
                                placeholder="170"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                                ${errors.height ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.height && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={12} />
                                <span>{errors.height}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Weight (kg)
                        </label>
                        <div className="relative">
                            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                name="weight" 
                                value={formData.weight} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving}
                                min="2"
                                max="500"
                                step="0.1"
                                placeholder="65"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                                ${errors.weight ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.weight && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={12} />
                                <span>{errors.weight}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                value={formData.email} 
                                readOnly
                                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-500 cursor-not-allowed" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        Full Address
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            disabled={!isEditing || isSaving}
                            placeholder='Ex: 123 Rizal St., Brgy. Central, Quezon City'
                            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl 
                            focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                            font-bold text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed
                            ${errors.address ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`} 
                        />
                    </div>
                    {errors.address && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                            <AlertCircle size={12} />
                            <span>{errors.address}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PersonalInfo;