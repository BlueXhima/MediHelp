import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, User, BookOpen, Phone, FileText, MapPin, Settings, X, Zap } from 'lucide-react';

import GoogleMapEmbed from '../../../components/GoogleMapEmbed';
import ToastMessage, { showToast } from '../../../components/ToastMessage'; 
import BackgroundLoadingState from '../../../components/BackgroundLoadingState';
import { redirectToNearbyHospitals } from '../../../lib/locationUtils';
import EmergencyModal from '../../../components/EmergencyModal';
import SafetyGuideModal from '../../../components/SafetyGuideModal';

const QuickActionsPanel = () => {
    // 'emergency', 'safety', o null
    const [activeModal, setActiveModal] = useState(null);

    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [userLocation, setUserLocation] = React.useState(null);

    const quickActions = [
        {
            id: 1,
            title: "Voice Assistant",
            description: "Ask health questions",
            icon: <Mic size={24} />,
            path: "/dashboard/voice-assistant",
            colorClass: "bg-blue-600 hover:bg-blue-700"
        },
        {
            id: 2,
            title: "Health Profile",
            description: "Update information",
            icon: <User size={24} />,
            path: "/dashboard/health-profile",
            colorClass: "bg-indigo-600 hover:bg-indigo-700"
        },
        {
            id: 3,
            title: "Guidance Library",
            description: "Browse resources",
            icon: <BookOpen size={24} />,
            path: "/guidance-library",
            colorClass: "bg-emerald-600 hover:bg-emerald-700"
        },
        {
            id: 4,
            title: "Emergency",
            description: "Quick access to help",
            icon: <Phone size={24} />,
            isEmergency: true,
            colorClass: "bg-red-600 hover:bg-red-700"
        }
    ];

    useEffect(() => {
        const hasSeenPrivacyNotice = sessionStorage.getItem("hasSeenPrivacyNotice");
        if (!hasSeenPrivacyNotice) {
            showToast("We use your location to find nearby hospitals. Your data is not stored.", "info");
            sessionStorage.setItem("hasSeenPrivacyNotice", "true");
        }
    }, []);

    const handleNearbyHospitalClick = () => {
        redirectToNearbyHospitals(setIsLoading);
    };

    return (
        <>  
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            <EmergencyModal 
                isOpen={activeModal === 'emergency'} 
                onClose={() => setActiveModal(null)} 
                onOpenSafety={() => setActiveModal('safety')}
            />

            {/* SAFETY GUIDE MODAL */}
            <SafetyGuideModal 
                isOpen={activeModal === 'safety'} 
                onClose={() => setActiveModal(null)}
                onBack={() => setActiveModal('emergency')}
            />

            <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center">
                        <Zap className="mr-3 text-amber-500" size={24} />
                        Quick Actions
                    </h3>
                    <span className="text-sm text-foreground">Get help fast</span>
                </div>

                {/* Main Action Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action) => (
                        action.isEmergency ? (
                            <button
                                key={action.id}
                                onClick={() => setActiveModal('emergency')}
                                className={`${action.colorClass} flex flex-col items-center text-center p-5 rounded-2xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer`}
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                    {action.icon}
                                </div>
                                <h4 className="font-bold text-sm">{action.title}</h4>
                                <p className="text-[10px] opacity-80 uppercase tracking-tighter">{action.description}</p>
                            </button>
                        ) : (
                            <Link
                                key={action.id}
                                to={action.path}
                                className={`${action.colorClass} flex flex-col items-center text-center p-5 rounded-2xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer`}
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                    {action.icon}
                                </div>
                                <h4 className="font-bold text-sm">{action.title}</h4>
                                <p className="text-[10px] opacity-80 uppercase tracking-tighter">{action.description}</p>
                            </Link>
                        )
                    ))}
                </div>

                {/* Bottom Utility Row */}
                <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={() => handleNearbyHospitalClick(setIsLoading)}
                        className="flex items-center px-4 py-2 cursor-pointer text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/80 transition-colors"
                    >
                        <MapPin size={14} className="mr-2" />
                        Nearby Hospitals
                    </button>

                    {showMap && userLocation && (
                        <div className="mt-4">
                            <GoogleMapEmbed
                                apiKey="YOUR_VALID_GOOGLE_MAPS_API_KEY"
                                center={userLocation}
                                zoom={15}
                            />
                        </div>
                    )}
                    
                    <button className="flex items-center px-4 py-2 cursor-pointer text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/80 transition-colors">
                        <FileText size={14} className="mr-2" />
                        Medical Records
                    </button>

                    <button className="flex items-center px-4 py-2 cursor-pointer text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/80 transition-colors">
                        <MapPin size={14} className="mr-2" />
                        Find Doctors
                    </button>

                    <button className="flex items-center px-4 py-2 cursor-pointer text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/80 transition-colors">
                        <Settings size={14} className="mr-2" />
                        Preferences
                    </button>
                </div>
            </div>
        </>
    );
};

export default QuickActionsPanel;