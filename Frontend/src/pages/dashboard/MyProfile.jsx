import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, FileText, Pill, Contact, ShieldCheck, ShieldAlert, Loader2,
    Activity, Lock, Edit2, Upload, Trash2, X, Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { userService } from '../../services/userService';
import { showToast } from '../../components/ToastMessage';

// Tab Hooks Manager
import { useProfileManager } from '../hooks/useProfileManager';
import { useMedicalManager } from '../hooks/useMedicalManager';
import { useMedicationManager } from '../hooks/useMedicationManager';
import { useEmergencyManager } from '../hooks/useEmergencyManager';
import { useMetricsManager } from '../hooks/useMetricsManager';

// Tab Components
import ProfileInfo from './tabs/PersonalInfo';
import MedicalRecord from './tabs/MedicalRecord';
import Medication from './tabs/Medication';
import EmergencyContact from './tabs/EmergencyContact';
import HealthMetrics from './tabs/HealthMetrics';
import PrivacySettings from './tabs/PrivacySettings';

const MyProfile = ({ onNearbyHospitalClick, onViewChange }) => {
    // 1. LAHAT NG BASE STATE AT HOOKS AY DAPAT NASA PINAKA-ITAAS
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isGlobalSubmitting, setIsGlobalSubmitting] = useState(false);

    // Initialize ang profileManager hook para sa Personal Info tab
    const profileManager = useProfileManager(userData, (updatedData) => {
        setUserData(updatedData);
    });

    // Kunin ang Patient ID mula sa loaded userData (or session context mo)
    const patientId = userData?.id || 1; // Gawing dynamic base sa Auth/User data model mo

    // Ikonekta ang medical-records at iba pa sa state manager gamit ang custom hook
    const medicalManager = useMedicalManager(patientId);
    const medicationManager = useMedicationManager(patientId);
    const emergencyManager = useEmergencyManager(patientId);
    const metricsManager = useMetricsManager(patientId);

    const handleCancel = () => {
        setIsEditing(false);
        
        if (activeTab === 'profile') {
            // I-reset ang pansamantalang tinype ng user sa inputs pabalik sa orihinal
            profileManager.resetForm();
            fetchUserData(true); 
        } 
        else if (activeTab === 'medical') {
            // I-re-fetch ang medical records mula sa DB para burahin ang anumang unsaved local arrays
            if (medicalManager?.fetchMedicalRecords) {
                medicalManager.fetchMedicalRecords();
            }
            showToast("Medical Record review discarded.", "info");
        }
        else if (activeTab === 'medication') {
            if (medicationManager?.fetchMedications) {
                medicationManager.fetchMedications();
            }
            medicationManager.setNewMed({ name: '', dosage: '', frequency: '', prescribedBy: '' });
            showToast("Medication review discarded.", "info");
        }
        else if (activeTab === 'emergency') {
            if (emergencyManager?.fetchContacts) emergencyManager.fetchContacts();
            emergencyManager.setNewContact({ name: '', relationship: '', phone: '', email: '', isPrimary: false });
            showToast("Emergency review discarded.", "info");
        }
        else if (activeTab === 'metrics') {
            // I-discard ang unsaved adjustments sa input, hilahin ulit ang galing sa DB
            if (metricsManager?.fetchMetrics) metricsManager.fetchMetrics();
            showToast("Metrics review discarded.", "info");
        }
    }

    const handleSave = async () => {
        setIsGlobalSubmitting(true);
        try {
            if (activeTab === 'profile') {
                // Pinindot ang Save habang nasa Personal Info Tab
                const result = await profileManager.saveProfileChanges();
                if (result && result.success) {
                    showToast(result?.message, "success");
                    setIsEditing(false);
                } else {
                    showToast(result?.message, 'error');
                }
            } 
            else if (activeTab === 'medical') {
                // 1. Kung kasalukuyan pang naglo-load o may pending action ang medical manager, pigilan muna.
                if (medicalManager?.isLoading) {
                    showToast("Please wait for the medical records to finish synchronizing.", "warning");
                    return;
                }

                // 2. I-check kung may tinype si user sa mga fields pero nakalimutang i-click ang "Add" button.
                //    Sinasalo nito ang "paano kung nagka-error o may naiwang bitin na input" scenario.
                const hasUnsavedInput = 
                    (medicalManager?.newCondition?.name?.trim() !== '') ||
                    (medicalManager?.newAllergy?.name?.trim() !== '') ||
                    (medicalManager?.newSurgery?.name?.trim() !== '');

                if (hasUnsavedInput) {
                    showToast("You have unsaved text in the medical fields. Please add or clear them before saving.", "warning");
                    return;
                }

                // 3. Kung pasado sa validations at walang error sa active async states, iconsider natin na matagumpay ang session.
                showToast("Medical records verified and updated successfully.", "success");
                setIsEditing(false);
            } 
            else if (activeTab === 'medication') {
                if (medicationManager?.isLoading) {
                    showToast("Please wait for the medication updates to complete syncing.", "warning");
                    return;
                }

                // Check for unsaved dangling texts left in the input inputs blocks
                const hasUnsavedInput = medicationManager?.newMed?.name?.trim() !== '';

                if (hasUnsavedInput) {
                    showToast("You have unsaved medication text fields. Please click 'Add Medication' or clear it before saving.", "warning");
                    return;
                }

                showToast("Medication adjustments finalized.", "success");
                setIsEditing(false);
            }
            else if (activeTab === 'emergency') {
                if (emergencyManager?.isLoading) {
                    showToast("Please wait for your contacts to finish synchronizing.", "warning");
                    return;
                }

                // Check for lingering input drafts left unsubmitted
                const hasUnsavedInput = emergencyManager?.newContact?.name?.trim() !== '';
                if (hasUnsavedInput) {
                    showToast("You have unsubmitted contact forms. Click 'Add Contact' or clear fields before saving.", "warning");
                    return;
                }

                showToast("Emergency registry verified successfully.", "success");
                setIsEditing(false);
            }
            else if (activeTab === 'metrics') {
                if (metricsManager?.isLoading) {
                    showToast("Please wait for your data stream to finalize sync.", "warning");
                    return;
                }
                const res = await metricsManager.handleSaveMetrics();
                if (res?.success) {
                    setIsEditing(false);
                }
            }
            else {
                // Fallback para sa iba pang tabs
                showToast("Changes saved successfully.", "success");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Fatal Error sa loob ng handleSave:", error);
            showToast("An unexpected error occurred during state mutation.", "error");
        } finally {
            setIsGlobalSubmitting(false);
        }
    };

    // I-load ang user data galing sa backend database
    useEffect(() => {
        const fetchUserData = async (showSilently = false) => {
            try {
                if (!showSilently) setIsLoading(true);
                const rawData = await userService.getFullDetails(true); 
                
                // Mapper upang masiguro na camelCase ang babasahin ng React inputs
                const normalizedData = {
                    id: rawData.id || rawData.PatientID || rawData.PatientId,

                    firstName: rawData.FirstName || rawData.firstName || '',
                    lastName: rawData.LastName || rawData.lastName || '',
                    email: rawData.Email || rawData.email || '',
                    address: rawData.Address || rawData.address || '',
                    gender: rawData.Gender || rawData.gender || '',
                    height: rawData.Height_cm || rawData.height || '',
                    weight: rawData.Weight_kg || rawData.weight || '',
                    dob: rawData.birthdate ? rawData.birthdate.split('T')[0] : (rawData.dob || ''),
                    bloodType: rawData.BloodType || rawData.bloodType || '',
                    profile_picture: rawData.profile_picture || '',
                    isVerified: rawData.IsVerified !== undefined ? rawData.IsVerified : (rawData.isVerified || 0)
                };

                setUserData(normalizedData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                showToast("Failed to load user profile configuration.", "error");
            } finally {
                if (!showSilently) setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // 2. MAGLAGAY NG ISANG EFFECT PARA I-SYNC ANG FORM DATA KAPAG NATAPOS NA MAG-LOAD ANG USER DATA
    useEffect(() => {
        if (userData && profileManager.resetForm) {
            profileManager.resetForm(userData);
        }
    }, [userData]);

    useEffect(() => {
        onViewChange('My Profile'); // Ito ay papasa sa Dashboard
    }, [onViewChange]);

    // 3. ANG MGA CONDITIONAL RENDERING O RETURNS AY ILALAGAY LAMANG SA IBABA NG LAHAT NG HOOKS!
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-3 text-muted-foreground animate-fade-in">
                <Loader2 size={32} className="animate-spin text-primary stroke-[1.5]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Synchronizing Security Vault...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-3 text-muted-foreground">
                <ShieldAlert size={32} className="text-red-500 stroke-[1.5]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Failed to authenticate database transaction.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'medical', label: 'Medical', icon: FileText },
        { id: 'medication', label: 'Meds', icon: Pill },
        { id: 'emergency', label: 'Contact', icon: Contact },
        { id: 'metrics', label: 'Metrics', icon: Activity },
        { id: 'privacy', label: 'Privacy', icon: Lock }
    ];

    return (
        <div className="p-6 w-full space-y-8 bg-background">
            
            {/* MINIMALIST HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl border border-border p-8 md:p-12 overflow-hidden w-full bg-card"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 md:gap-8 w-full">
                    {/* Avatar Display */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-primary/10 border border-border flex items-center justify-center text-primary overflow-hidden shadow-sm">
                            {userData?.profile_picture ? (
                                <img 
                                    src={userData.profile_picture} 
                                    alt="Avatar View"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl md:text-4xl font-bold">
                                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Metadata */}
                    <div className="flex-1 text-center md:text-left space-y-3 w-full">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            {profileManager.formData?.firstName || ''} {profileManager.formData?.lastName || ''}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                Health Seeker
                            </span>

                            {/* DYNAMIC VERIFIED BADGE */}
                            {profileManager.formData?.isVerified === 1 ? (
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-emerald-500/20">
                                    <ShieldCheck size={12} /> Verified Account
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-amber-500/20">
                                    <ShieldAlert size={12} /> Unverified Account
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 max-w-md mx-auto md:mx-0">
                            Managing your personal health journey and medical insights in one secure place.
                        </p>
                    </div>

                    {/* Actions Panel (Top) */}
                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-center md:justify-start shrink-0">
                        {!isEditing ? (
                            <>
                                <Button 
                                    variant="primary" 
                                    type="rounded" 
                                    leadingIcon={Edit2}
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 md:flex-none shadow-none"
                                >
                                    Edit Profile
                                </Button>
                                <Button variant="ghost" type="rounded" className="flex-1 md:flex-none">
                                    Share Profile
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="primary" 
                                    type="rounded" 
                                    leadingIcon={Check}
                                    disabled={profileManager.isSubmitting} 
                                    onClick={handleSave}
                                    className="flex-1 md:flex-none shadow-none"
                                >
                                    {profileManager.isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    type="rounded" 
                                    leadingIcon={X}
                                    onClick={handleCancel}
                                    className="text-red-500 hover:bg-red-500/10 flex-1 md:flex-none"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* MAIN WORKING LAYOUT BLOCK */}
            <div className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                {/* HORIZONTAL TAB NAVIGATION BAR */}
                <div className="w-full bg-card border-b border-border/60 px-4 md:px-6 py-3 flex items-center overflow-x-auto scrollbar-none gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <Button
                                key={tab.id}
                                buttonType="button"
                                disabled={isEditing && tab.id !== 'profile'}
                                onClick={() => setActiveTab(tab.id)}
                                variant="ghost"
                                className={`
                                    relative pb-4 rounded-none bg-transparent hover:bg-transparent
                                    flex items-center justify-center gap-2 
                                    transition-all duration-300 cursor-pointer active:scale-100
                                    
                                    /* FIXED MOBILE 4 TABS CONDITION */
                                    shrink-0 basis-[calc(25%-6px)] 
                                    md:shrink md:basis-auto md:flex-1 md:min-w-fit
                                    
                                    ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}
                                    ${isEditing && tab.id !== 'profile' ? 'opacity-40 cursor-not-allowed' : ''}
                                `}
                            >
                                <tab.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                                    {tab.label}
                                </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </div>

                {/* CONTENT CANVAS */}
                <div className="p-6 md:p-8 flex-1 w-full flex flex-col justify-between">

                    <div className="w-full flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="w-full"
                            >
                                {activeTab === 'profile' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                                        
                                        {/* PICTURE CONTROLLER */}
                                        <div className="bg-card border border-border/60 p-8 rounded-3xl space-y-6 text-center w-full">
                                            <input 
                                                type="file"
                                                id="avatarUploadInput"
                                                accept="image/png, image/jpeg, image/jpg"
                                                className="hidden"
                                                disabled={!isEditing}
                                                onChange={(e) => profileManager.handleFileChange(e.target.files[0])}
                                            />
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">
                                                    Profile Picture
                                                </h4>
                                            </div>

                                            <div className="mx-auto w-40 h-40 md:w-44 md:h-44 rounded-full border border-border flex items-center justify-center bg-background/50 overflow-hidden relative text-primary shadow-inner">
                                                {profileManager.localPreview === 'REMOVE_IMAGE_PLACEHOLDER' ? (
                                                    <span className="text-2xl font-bold">
                                                        {profileManager.formData?.firstName?.charAt(0)}{profileManager.formData?.lastName?.charAt(0)}
                                                    </span>
                                                ) : profileManager.localPreview ? (
                                                    <img src={profileManager.localPreview} alt="Live Preview" className="w-full h-full object-cover" />
                                                ) : userData?.profile_picture ? (
                                                    <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold">
                                                        {profileManager.formData?.firstName?.charAt(0)}{profileManager.formData?.lastName?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 pt-2 w-full">
                                                <Button 
                                                    buttonType="button"
                                                    variant={isEditing ? "primary" : "secondary"}
                                                    type="rounded"
                                                    disabled={!isEditing}
                                                    leadingIcon={Upload}
                                                    onClick={() => document.getElementById('avatarUploadInput').click()}
                                                    className="w-full py-3 shadow-none"
                                                >
                                                    Upload Photo
                                                </Button>

                                                <Button 
                                                    buttonType="button"
                                                    variant={isEditing ? "dangerGhost" : "secondary"}
                                                    type="rounded"
                                                    disabled={!isEditing}
                                                    leadingIcon={Trash2}
                                                    onClick={profileManager.handleRemoveImage}
                                                    className={`w-full py-3 transition-colors ${isEditing ? 'bg-red-500/5 hover:bg-red-500/10' : ''}`}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* 2. PERSONAL INFORMATION INPUT CANVAS */}
                                        <div className="lg:col-span-2 w-full">
                                            <ProfileInfo 
                                                userData={profileManager.formData} 
                                                isEditing={isEditing} 
                                                onInputChange={profileManager.handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 2. MEDICAL RECORD TAB */}
                                {activeTab === 'medical' && (
                                    <MedicalRecord 
                                        isEditing={isEditing} 
                                        medicalManager={medicalManager}
                                    />
                                )}

                                {/* 3. MEDICATIONS TAB */}
                                {activeTab === 'medication' && (
                                    <Medication 
                                        isEditing={isEditing} 
                                        medicationManager={medicationManager}
                                    />
                                )}

                                {/* 4. EMERGENCY CONTACT TAB */}
                                {activeTab === 'emergency' && (
                                    <EmergencyContact 
                                        isEditing={isEditing}
                                        emergencyManager={emergencyManager}
                                        onNearbyHospitalClick={onNearbyHospitalClick} 
                                    />
                                )}

                                {/* 5. HEALTH METRICS TAB */}
                                {activeTab === 'metrics' && ( 
                                    <HealthMetrics 
                                        isEditing={isEditing} 
                                        metricsManager={metricsManager}
                                    />
                                )}

                                {/* 6. PRIVACY SETTINGS TAB */}
                                {activeTab === 'privacy' && (
                                    <PrivacySettings isEditing={isEditing} />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* PERSISTENT CANVAS-LEVEL BOTTOM RIGHT ACTIONS */}
                        {isEditing && (
                            <div className="flex justify-end items-center gap-3 pt-6 border-t border-border/40 w-full mt-6">
                                <Button 
                                    variant="ghost" 
                                    type="rounded" 
                                    leadingIcon={X}
                                    onClick={handleCancel}
                                    className="text-red-500 hover:bg-red-500/10"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="primary" 
                                    type="rounded" 
                                    leadingIcon={Check}
                                    disabled={isGlobalSubmitting || profileManager.isSubmitting} 
                                    onClick={handleSave}
                                >
                                    {isGlobalSubmitting || profileManager.isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyProfile;