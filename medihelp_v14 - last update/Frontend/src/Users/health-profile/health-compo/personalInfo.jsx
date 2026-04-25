import React, { useState, useEffect } from 'react';
import { User, Shield, Edit, X, Check, Mail, Phone, MapPin, Calendar, Ruler, Scale, Droplets, VenusAndMars } from 'lucide-react';
import DefaultAvatar from '../../../assets/default-avatar.png';
import axios from 'axios';
import ToastMessage, { showToast } from '../../../components/ToastMessage';

const PersonalInfo = ({ userData, isLoading }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [deletePhoto, setDeletePhoto] = useState(false);
    const [formData, setFormData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        gender: userData?.gender || '',
        height: userData?.height || '',
        weight: userData?.weight || '',
        bloodType: userData?.bloodType || '',
        dob: userData?.dob || '',
        profile_picture: userData?.profile_picture || ''
    });

    // I-sync ang formData kapag dumating na ang data mula sa props (profile.jsx)
    useEffect(() => {
        console.log("useEffect Triggered! userData is:", userData);
        if (userData.email && !isLoading) {
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                gender: userData.gender || '',
                height: userData.height || '',
                weight: userData.weight || '',
                bloodType: userData.bloodType || '',
                dob: userData.dob || '',
                profile_picture: userData.profile_picture || ''
            }));
        }
    }, [userData, isLoading]);

    const handleCancel = () => {
        // I-reset ang changes kung i-cancel
        if (userData) {
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                gender: '', 
                height: '', 
                weight: '', 
                bloodType: '', 
                dob: ''
            }));
        }
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setDeletePhoto(false); // Reset delete state
        // setIsEditing(false);
        // REMOVE setIsEditing(false) from here so it stays in edit mode while you type!
    };

    // 2. UPDATED HANDLEFILECHANGE (Draft Mode)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Itago ang file para sa handleSave mamaya
            setDeletePhoto(false); // Reset delete state if they pick a new file

            // GUMAWA NG LIVE PREVIEW URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl); 

            // I-update din ang formData.profile_picture para makita sa img tag
            setFormData(prev => ({
                ...prev,
                profile_picture: objectUrl
            }));
        }
    };

    useEffect(() => {
        // Cleanup function
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // 3. UPDATED HANDLESAVE (One-Bagagsakan Save)
    const handleSave = async () => {
        try {
            const idToSend = userData?.userID || userData?.userId;
            
            if (!idToSend) {
                showToast("User ID is missing. Cannot save.", "error");
                return;
            }

            const formDataToSubmit = new FormData();
            formDataToSubmit.append('userId', idToSend);
            formDataToSubmit.append('firstName', formData.firstName);
            formDataToSubmit.append('lastName', formData.lastName);
            formDataToSubmit.append('phone', formData.phone);
            formDataToSubmit.append('address', formData.address);
            formDataToSubmit.append('gender', formData.gender);
            formDataToSubmit.append('height', formData.height);
            formDataToSubmit.append('weight', formData.weight);
            formDataToSubmit.append('bloodType', formData.bloodType);
            formDataToSubmit.append('dob', formData.dob);

            // --- TAMA NA LOGIC DITO ---
            if (deletePhoto) {
                // Kung pinindot ang delete, ito lang ang ipadala
                formDataToSubmit.append('removeProfileImage', 'true'); 
            } else if (selectedFile) {
                // Kung may bagong file, ito lang ang ipadala (Isang append lang!)
                formDataToSubmit.append('profileImage', selectedFile); 
            }

            const response = await axios.post('http://localhost:5000/api/users/update-profile-full', formDataToSubmit);

            if (response.status === 200) {
                setIsEditing(false);
                setSelectedFile(null);
                setDeletePhoto(false);
                showToast("Profile updated successfully!", "success");
                
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            console.error("Save Error:", error);
            showToast(error.response?.data?.error || "Failed to save changes.", "error");
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading...</div>;

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
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
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                                    font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"
                                >
                                    <X size={16} /> Cancel
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white 
                                    font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all cursor-pointer"
                                >
                                    <Check size={16} /> Save
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

                {/* PROFILE PICTURE SECTION */}
                <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-100">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 relative">
                            <img 
                                src={deletePhoto ? DefaultAvatar : (formData.profile_picture || userData?.profile_picture || DefaultAvatar)} 
                                alt="Profile"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            {isEditing && (
                                <div 
                                    onClick={() => {
                                        document.getElementById('pfpInput').click();
                                        setDeletePhoto(false); // Reset delete if they pick a new one
                                    }}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <span className="text-[10px] text-white font-black uppercase tracking-tighter">
                                        Change Photo
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* DELETE BUTTON - Appears only during Edit mode if a photo exists */}
                        {isEditing && (formData.profile_picture || userData?.profile_picture) && !deletePhoto && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDeletePhoto(true);
                                    setSelectedFile(null); // Clear any staged upload
                                    setPreviewUrl(null);
                                    setFormData(prev => ({ ...prev, profile_picture: '' }));
                                }}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all z-10"
                                title="Delete Photo"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        )}
                        
                        {/* Hidden Input for Files */}
                        <input 
                            type="file" 
                            id="pfpInput" 
                            hidden 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>
                    <h2 className="mt-4 text-xl font-black text-slate-900 uppercase tracking-tight">
                        {formData.firstName} {formData.lastName}
                    </h2>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 
                            focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold 
                            text-slate-700 disabled:opacity-60" 
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 
                            focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold 
                            text-slate-700 disabled:opacity-60" 
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="date" 
                                name="dob" 
                                value={formData.dob} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60" 
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                        <div className="relative">
                            <VenusAndMars className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 appearance-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Blood Type */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Blood Type</label>
                        <div className="relative">
                            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                            <select 
                                name="bloodType" 
                                value={formData.bloodType} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 appearance-none"
                            >
                                <option value="">Select</option>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="O+">O+</option><option value="O-">O-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>

                    {/* Height */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
                        <div className="relative">
                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                name="height" 
                                value={formData.height} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                placeholder="170"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 appearance-none" 
                            />
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
                        <div className="relative">
                            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                name="weight" 
                                value={formData.weight} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                placeholder="65"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                                focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                                font-bold text-slate-700 disabled:opacity-60 appearance-none" 
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div className="space-y-2 text-left md:col-span-2 lg:col-span-1">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
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

                {/* Address */}
                <div className="space-y-2 text-left">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            disabled={!isEditing}
                            placeholder='Ex: 123 Rizal St., Brgy. Central, Quezon City'
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl 
                            focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all 
                            font-bold text-slate-700 disabled:opacity-60 appearance-none" 
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PersonalInfo;