import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { User, Activity, AlertTriangle, Phone, Download, Share2, Bell, Shield, FileText, Pill, TrendingUp } from 'lucide-react';
import Button from '../../components/Button.jsx';
import PrivacySettingsCard from './components/PrivacySettingsCard.jsx';
import MedicalHistoryCard from './components/MedicalHistoryCard.jsx';
import MedicationCard from './components/MedicationCard.jsx';
import EmergencyContactCard from './components/EmergencyContactCard.jsx';
import HealthMetricsCard from './components/HealthMetricsCard.jsx';
import PersonalInfoCard from './components/PersonalInfoCard.jsx';

export const HealthProfile = () => {
    const { user } = useContext(AuthContext); // Fetch logged-in user details
    const [activeTab, setActiveTab] = useState('personal');

    // Mock data for personal information
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "Sarah Johnson",
        dateOfBirth: "1985-03-15",
        gender: "Female",
        bloodType: "O+",
        height: "165",
        weight: "62",
        phone: "(555) 123-4567",
        email: user?.email || "", // Dynamically set email from AuthContext
        address: "123 Main Street, Anytown, ST 12345"
    });

    useEffect(() => {
        // Simulate fetching additional personal information based on email
        if (user?.email) {
            setPersonalInfo((prevInfo) => ({
                ...prevInfo,
                email: user.email,
                fullName: user.fullName || "Carlos Emmanuel Reyes", // Use user data
                dateOfBirth: user.dateOfBirth || "2005-06-18",
                gender: user.gender || "Male",
                bloodType: user.bloodType || "AB+",
                height: user.height || "164",
                weight: user.weight || "59",
                phone: user.phone || "(555) 987-6543",
                address: user.address || "456 Elm Street, Sampletown, ST 67890"
            }));
        }
    }, [user?.email]);

    // Mock data for medical history
    const [medicalHistory, setMedicalHistory] = useState({
        conditions: [
            {
                id: 1,
                name: "Hypertension",
                diagnosedDate: "2020-06-15",
                status: "Active"
            },
            {
                id: 2,
                name: "Type 2 Diabetes",
                diagnosedDate: "2019-11-22",
                status: "Active"
            },
            {
                id: 3,
                name: "Seasonal Allergies",
                diagnosedDate: "2018-04-10",
                status: "Active"
            }
        ],
        allergies: [
            {
                id: 1,
                allergen: "Penicillin",
                severity: "Severe",
                reaction: "Anaphylaxis"
            },
            {
                id: 2,
                allergen: "Peanuts",
                severity: "Moderate",
                reaction: "Hives and swelling"
            },
            {
                id: 3,
                allergen: "Pollen",
                severity: "Mild",
                reaction: "Sneezing and congestion"
            }
        ],
        surgeries: [
            {
                id: 1,
                procedure: "Appendectomy",
                date: "2015-08-20",
                hospital: "General Hospital"
            },
            {
                id: 2,
                procedure: "Wisdom Tooth Extraction",
                date: "2012-03-10",
                hospital: "Dental Clinic"
            }
        ]
    });

    // Mock data for medications
    const [medications, setMedications] = useState([
        {
            id: 1,
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            prescribedBy: "Dr. Smith",
            startDate: "2020-06-15",
            status: "Active"
        },
        {
            id: 2,
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            prescribedBy: "Dr. Johnson",
            startDate: "2019-11-22",
            status: "Active"
        },
        {
            id: 3,
            name: "Vitamin D3",
            dosage: "1000 IU",
            frequency: "Once daily",
            prescribedBy: "Dr. Smith",
            startDate: "2021-01-10",
            status: "Active"
        },
        {
            id: 4,
            name: "Aspirin",
            dosage: "81mg",
            frequency: "Once daily",
            prescribedBy: "Dr. Smith",
            startDate: "2020-08-01",
            status: "Inactive"
        }
    ]);

    // Mock data for emergency contacts
    const [emergencyContacts, setEmergencyContacts] = useState([
        {
            id: 1,
            name: "Michael Johnson",
            relationship: "Spouse",
            phone: "(555) 987-6543",
            email: "michael.johnson@email.com",
            isPrimary: true
            },
        {
            id: 2,
            name: "Emma Johnson",
            relationship: "Daughter",
            phone: "(555) 456-7890",
            email: "emma.johnson@email.com",
            isPrimary: false
        },
        {
            id: 3,
            name: "Robert Wilson",
            relationship: "Brother",
            phone: "(555) 321-0987",
            email: "robert.wilson@email.com",
            isPrimary: false
        }
    ]);

    // Mock data for health metrics
    const [healthMetrics, setHealthMetrics] = useState({
        bloodPressure: [
            { date: "2024-10-15", systolic: 125, diastolic: 82 },
            { date: "2024-10-10", systolic: 128, diastolic: 85 },
            { date: "2024-10-05", systolic: 122, diastolic: 80 },
            { date: "2024-09-30", systolic: 130, diastolic: 88 },
            { date: "2024-09-25", systolic: 126, diastolic: 83 }
        ],
        heartRate: [
            { date: "2024-10-15", bpm: 72 },
            { date: "2024-10-10", bpm: 75 },
            { date: "2024-10-05", bpm: 68 },
            { date: "2024-09-30", bpm: 78 },
            { date: "2024-09-25", bpm: 74 }
        ],
        weight: [
            { date: "2024-10-15", kg: 62.0 },
            { date: "2024-10-01", kg: 62.5 },
            { date: "2024-09-15", kg: 63.0 },
            { date: "2024-09-01", kg: 63.2 },
            { date: "2024-08-15", kg: 63.8 }
        ]
    });

    // Mock data for privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        shareWithProviders: true,
        anonymousAnalytics: true,
        medicationReminders: true,
        healthInsights: true,
        emergencyAccess: true,
        researchParticipation: false,
        dataRetention: "5years"
    });

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'medical', label: 'Medical History', icon: FileText },
        { id: 'medications', label: 'Medications', icon: Pill },
        { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
        { id: 'metrics', label: 'Health Metrics', icon: TrendingUp },
        { id: 'privacy', label: 'Privacy Settings', icon: Shield }
    ];

    const handlePersonalInfoUpdate = (updatedInfo) => {
        setPersonalInfo(updatedInfo);
    };

    const handleMedicalHistoryUpdate = (updatedHistory) => {
        setMedicalHistory(updatedHistory);
    };

    const handleMedicationsUpdate = (updatedMedications) => {
        setMedications(updatedMedications);
    };

    const handleEmergencyContactsUpdate = (updatedContacts) => {
        setEmergencyContacts(updatedContacts);
    };

    const handleHealthMetricsUpdate = (updatedMetrics) => {
        setHealthMetrics(updatedMetrics);
    };

    const handlePrivacySettingsUpdate = (updatedSettings) => {
        setPrivacySettings(updatedSettings);
    };

    const renderTabContent = () => {
        switch (activeTab) {
        case 'personal':
            return (
                <PersonalInfoCard 
                    personalInfo={personalInfo} 
                    onUpdate={handlePersonalInfoUpdate} 
                />
            );
        case 'medical':
            return (
                <MedicalHistoryCard 
                    medicalHistory={medicalHistory} 
                    onUpdate={handleMedicalHistoryUpdate} 
                />
            );
        case 'medications':
            return (
                <MedicationCard 
                    medications={medications} 
                    onUpdate={handleMedicationsUpdate} 
                />
            );
        case 'emergency':
            return (
                <EmergencyContactCard 
                    emergencyContacts={emergencyContacts} 
                    onUpdate={handleEmergencyContactsUpdate} 
                />
            );
        case 'metrics':
            return (
                <HealthMetricsCard 
                    healthMetrics={healthMetrics} 
                    onUpdate={handleHealthMetricsUpdate} 
                />
            );
        case 'privacy':
            return (
                <PrivacySettingsCard 
                    privacySettings={privacySettings} 
                    onUpdate={handlePrivacySettingsUpdate} 
                />
            );
        default:
            return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            {/* Main Content */}
            <main className="pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-medical">
                                <User size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl text-left font-bold text-text-primary">Health Profile</h1>
                                <p className="text-text-secondary">Manage your personal health information and preferences</p>
                            </div>
                        </div>

                        {/* Profile Summary */}
                        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                        <User size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl text-left font-semibold text-text-primary">{personalInfo?.fullName}</h2>
                                        <p className="text-text-secondary text-left">
                                            {personalInfo?.gender} • {personalInfo?.bloodType} • Born {personalInfo?.dateOfBirth}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                                            <div className="flex items-center space-x-1">
                                                <Activity size={14} />
                                                <span>{personalInfo?.height} cm • {personalInfo?.weight} kg</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Phone size={14} />
                                                <span>{personalInfo?.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex items-center justify-between space-x-8 overflow-x-auto">
                                {tabs?.map((tab) => (
                                    <button
                                        key={tab?.id}
                                        onClick={() => setActiveTab(tab?.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
                                            activeTab === tab?.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                                        }`}
                                    >
                                        <tab.icon size={18} />
                                        <span>{tab?.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-8">
                        {renderTabContent()}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6 text-center">
                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Download size={24} className="text-secondary" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Export Health Data</h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Download your complete health profile for sharing with healthcare providers.
                            </p>
                            <Button variant="outline" iconName="Download" iconPosition="left" fullWidth>
                                Export Data
                            </Button>
                        </div>

                        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6 text-center">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Share2 size={24} className="text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Share with Provider</h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Securely share your health information with your healthcare team.
                            </p>
                            <Button variant="outline" iconName="Share2" iconPosition="left" fullWidth>
                                Share Profile
                            </Button>
                        </div>

                        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl shadow-medical p-6 text-center">
                            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Bell size={24} className="text-warning" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Set Reminders</h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Configure medication reminders and health check-up notifications.
                            </p>
                            <Button variant="outline" iconName="Bell" iconPosition="left" fullWidth>
                                Manage Reminders
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HealthProfile;