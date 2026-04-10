import React, { useState, useEffect } from 'react';
import { User, Activity, Shield, FileText, Pill, Settings, Calendar, Clock, Phone } from 'lucide-react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ToastMessage from '../../components/ToastMessage';

import PersonalInfo from './health-compo/personalInfo';
import MedicalRecord from './health-compo/medicalRecord';
import Medications from './health-compo/medication';
import Emergency from './health-compo/emergency';
import Metrics from './health-compo/metrics';
import Privacy from './health-compo/privacySettings';

const HealthProfile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState({ firstName: '', lastName: '' });
    const [isLoading, setIsLoading] = useState(true);

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Formatter para sa Petsa at Oras
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = currentTime.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = currentTime.getDate();
    const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            // Double check kung "Email" o "email" ang nasa storage mo!
            const storedEmail = localStorage.getItem("Email") || localStorage.getItem("email");
            
            console.log("Email from storage:", storedEmail);

            if (!storedEmail) {
                console.error("No email found in storage.");
                setIsLoading(false);
                return;
            }

            // I-set agad ang email sa state para makita ng PersonalInfo component
            setUserData(prev => ({ ...prev, email: storedEmail }));

            try {
                const response = await axios.get(`http://localhost:5000/api/user-details`, {
                    params: { email: storedEmail }
                });

                if (response.data) {
                    setUserData({
                        userID: response.data.userID,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email, // Siguraduhing galing ito sa backend
                        profile_picture: response.data.profile_picture
                    });
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const menuItems = [
        { id: 'personal', label: 'Profile', icon: <User size={18} /> },
        { id: 'records', label: 'Records', icon: <FileText size={18} /> },
        { id: 'medications', label: 'Meds', icon: <Pill size={18} /> },
        { id: 'emergency', label: 'Emergency Contacts', icon: <Phone size={18} /> },
        { id: 'metrics', label: 'Metrics', icon: <Activity size={18} /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-background text-left pb-8">
            <Navbar />
            <ToastMessage />

            <section className="bg-background border-b border-border pt-26 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
                                    Patient Dashboard
                                </span>
                            </div>
                            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                                Hello, <span className="text-primary font-black">
                                    {isLoading ? "Loading..." : `${userData.firstName} ${userData.lastName}`}
                                </span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-2 max-w-md italic">
                                Your central hub for all your medical information and health tracking.
                            </p>
                        </div>
                        
                        {/* Stat Card */}
                        <div className="flex gap-4">
                            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Calendar size={24} />
                                </div>
                                
                                {/* Date and Time Info */}
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Current Time
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-xl font-black text-slate-900">
                                            {monthName} {dayNumber}
                                        </h3>
                                        <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full flex items-center gap-1">
                                            <Clock size={10} />
                                            {timeString}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        {dayName}, 2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs and Main Content remain the same... */}
            <div className="max-w-5xl mx-auto px-6 -mt-8">
                <div className="bg-card p-4 rounded-[24px] border border-border shadow-xl shadow-slate-100/50 flex flex-wrap items-center justify-center gap-2 md:gap-4 overflow-hidden">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                                activeTab === item.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                            }`}
                        >
                            {item.icon}
                            <span className="hidden sm:inline">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 mt-10">
                <div className="bg-card border border-slate-200 rounded-[40px] shadow-sm p-8 md:p-12 min-h-[500px] animate-fade-in relative overflow-hidden">
                    
                    <div className="relative z-10">
                        {activeTab === 'personal' && (
                            <PersonalInfo 
                                userData={userData} 
                                isLoading={isLoading} 
                            />
                        )}

                        {activeTab === 'records' && (
                            <MedicalRecord isLoading={isLoading} />
                        )}

                        {activeTab === 'medications' && (
                            <Medications isLoading={isLoading} />
                        )}

                        {activeTab === 'emergency' && (
                            <Emergency isLoading={isLoading} />
                        )}

                        {activeTab === 'metrics' && (
                            <Metrics isLoading={isLoading} />
                        )}

                        {activeTab === 'privacy' && (
                            <Privacy isLoading={isLoading} />
                        )}

                        {/* Placeholder para sa ibang tabs */}
                        {!['personal', 'records', 'medications', 'emergency', 'metrics', 'privacy'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                                    {menuItems.find(i => i.id === activeTab)?.icon}
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                                    {activeTab.replace('-', ' ')} Section
                                </h2>
                                <p className="text-slate-400 mt-2">Coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HealthProfile;