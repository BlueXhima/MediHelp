import React, { useState } from 'react';
import { User, Shield, Edit, X, Check } from 'lucide-react';
import Button from '../../../components/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const PersonalInfoCard = ({ personalInfo, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(personalInfo);

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(personalInfo);
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <User size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">Personal Information</h3>
                </div>
                {!isEditing ? (
                    <button
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                    <Edit size={16} className="mr-2" /> Edit
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10 cursor-pointer"
                            onClick={handleCancel}
                        >
                            <X size={16} className="mr-2" /> Cancel
                        </button>
                        <button
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 cursor-pointer"
                            onClick={handleSave}
                        >
                            <Check size={16} className="mr-2" /> Save
                        </button>
                    </div>
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Full Name
                    </label>
                    <Input
                        type="text"
                        value={formData?.fullName}
                        onChange={(e) => handleChange('fullName', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Date of Birth
                    </label>
                    <Input
                        type="date"
                        value={formData?.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Gender
                    </label>
                    <Input
                        type="text"
                        value={formData?.gender}
                        onChange={(e) => handleChange('gender', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Blood Type
                    </label>
                    <Input
                        type="text"
                        value={formData?.bloodType}
                        onChange={(e) => handleChange('bloodType', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Height (cm)
                    </label>
                    <Input
                        type="number"
                        value={formData?.height}
                        onChange={(e) => handleChange('height', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Weight (kg)
                    </label>
                    <Input
                        type="number"
                        value={formData?.weight}
                        onChange={(e) => handleChange('weight', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Phone Number
                    </label>
                    <Input
                        type="tel"
                        value={formData?.phone}
                        onChange={(e) => handleChange('phone', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-primary text-left block">
                        Email Address
                    </label>
                    <Input
                        type="email"
                        value={formData?.email}
                        onChange={(e) => handleChange('email', e?.target?.value)}
                        disabled={!isEditing}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="space-y-4 mt-6">
                <label className="text-sm font-medium text-text-primary text-left block">
                    Address
                </label>
                <Input
                    type="text"
                    value={formData?.address}
                    onChange={(e) => handleChange('address', e?.target?.value)}
                    disabled={!isEditing}
                    className="w-full"
                />
            </div>
            {!isEditing && (
                <div className="mt-6 px-4 py-5 bg-gray dark:bg-gray-100 dark:text-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-text-secondary rounded-md w-full">
                        <Shield size={16} className="text-success" />
                        <span>Your personal information is encrypted and HIPAA compliant</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoCard;