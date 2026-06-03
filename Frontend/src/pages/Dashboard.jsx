import React, { useState, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Mic, BookOpen, User, Users, ChevronDown, Menu, X,
    Settings, LogOut, ArrowUpRight, Heart, Brain, MapPin, HelpCircle, Search 
} from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import TopHeader from '../components/TopHeader';
import LogoutModal from '../components/modals/LogoutModal';
import MediHelpLogo from '/MediHelpLogo.png';
import Button from '../components/ui/Button';
import Sidebar from '../components/Sidebar';
import BackgroundLoadingState from '../components/BackgroundLoadingState';
import DeleteModal from '../components/modals/DeleteModal';
import { userService } from '../services/userService';
import { handleNearbyHospitalNavigation } from '../lib/locationUtils';

import Overview from './dashboard/Overview';
import AllArticles from './dashboard/AllArticles';
import AllGlossary from './dashboard/AllGlossary';
import AllInfographics from './dashboard/AllInfographics';
import AllFirstAid from './dashboard/AllFirstAid';
import SavedResources from './dashboard/SavedResources';

import NearbyHospitalMap from './dashboard/NearbyHospitalMap';
import MyProfile from './dashboard/MyProfile';
import HealthRecord from './dashboard/HealthRecord';

const Dashboard = () => {
    const navigate = useNavigate();
    const { tabName } = useParams();
    
    // 1. CONFIGURATION: Dito mo lang babaguhin lahat ng pangalan.
    const tabConfig = {
        'overview': 'Overview',
        'voice-assistant': 'Voice Assistant',
        'nearby-hospital': 'Nearby Hospital',
        'health-insights': 'Health Insights',
        'medical-glossary': 'Medical Glossary',              
        'infographics': 'Infographics',      
        'first-aid-guides': 'First Aid Guides', 
        'saved-resources': 'Saved Resources',
        'health-records': 'Health Record', 
        'my-profile': 'My Profile',
        'settings': 'Settings',
        'help-support': 'Help & Support'
    };

    // 2. STATE DEFINITIONS
    const [userData, setUserData] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isHospitalLoading, setIsHospitalLoading] = useState(false);
    const handleNearbyHospitalClick = () => {
        // Gagamitin ang utility pero dito natin iha-handle ang loading UI
        handleNearbyHospitalNavigation(setIsHospitalLoading, (path) => {
            // Pagkatapos ng success logic sa locationUtils, ito ang tatawagin
            navigate(path);
            setIsMobileMenuOpen(false);
        });
    };

    const [userRole, setUserRole] = useState(null);
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, title: '', message: '', onConfirm: () => {} 
    });
    const libraryRef = useRef(null);

    // 3. COMPUTED LOGIC
    const [subTitle, setSubTitle] = useState('');
    const activeSlug = tabName?.toLowerCase() || 'overview';
    const currentDisplayTitle = tabConfig[activeSlug] || 'Overview';

    useDocumentTitle(`${currentDisplayTitle}`);

    // 4. NAVIGATION HANDLER (Ito ang kapalit ng setActiveTab)
    const handleTabChange = (name) => {
        // Safe check kung ang 'name' ay may value
        if (!name) return;
        // Convert "Health Insights" to "health-insights"
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/dashboard/${slug}`);
        setIsMobileMenuOpen(false);
    };

    // 5. FETCH USER DATA
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const data = await userService.getFullDetails();
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Opsyonal: Kung 401, redirect sa login
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // 6. FETCH USER ROLE
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) {
            setIsLoggedIn(true);
            setUserRole(role);
        }
        const handleStorageChange = () => {
            const role = localStorage.getItem("userRole");
            if (role) {
                setIsLoggedIn(true);
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // 7. CONTENT RENDERING
    const renderContent = () => {
        switch (activeSlug) {
            case 'overview':
                return (
                    <Overview
                        userData={userData} 
                        onViewChange={(view) => setSubTitle(view)}
                    />
                );
            case 'health-insights':
                return (
                    <AllArticles 
                        onViewChange={(view) => setSubTitle(view)}
                        setModalConfig={setModalConfig}
                    />
                );
            case 'medical-glossary':
                return (
                    <AllGlossary 
                        onViewChange={(view) => setSubTitle(view)} 
                    />
                );
            case 'infographics':
                return (
                    <AllInfographics
                        onViewChange={(view) => setSubTitle(view)}
                    />
                );
            case 'first-aid-guides':
                return (
                    <AllFirstAid
                        onViewChange={(view) => setSubTitle(view)}
                    />
                );
            case 'saved-resources':
                return (
                    <SavedResources 
                        onViewChange={(view) => setSubTitle(view)} 
                    />
                );
            case 'my-profile':
                return (
                    <MyProfile 
                        userData={userData}
                        onNearbyHospitalClick={handleNearbyHospitalClick}
                        onViewChange={(view) => setSubTitle(view)}  
                    />)
                ;
            case 'health-records':
                return (
                    <HealthRecord
                        userData={userData}
                        onViewChange={(view) => setSubTitle(view)}
                    />
                )
            
            // Mag-add ka rito ng iba pang tabs na may ready nang component
            // case 'VoiceQuery':
            //     return <VoiceQueryComponent />;

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6 animate-fade-in">
                        {/* Minimalist Icon with Thin Border */}
                        <div className="mb-8 p-5 rounded-full border border-slate-100 dark:border-slate-800/50">
                            <HelpCircle size={32} strokeWidth={1.5} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        
                        {/* Clean Typography */}
                        <div className="space-y-2 text-center">
                            <h2 className="text-lg font-medium text-foreground tracking-tight">
                                {currentDisplayTitle.replace(/([A-Z])/g, ' $1').trim()}
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                                Coming Soon • In Development
                            </p>
                        </div>

                        {/* Subtle Action Button */}
                        <button 
                            onClick={() => handleTabChange('Overview')}
                            className="mt-12 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                );
        }
    };

    // 7. LOGOUT LOGIC
    const handleLogout = async () => {
        setIsLoading(true); // Start loading animation
        try {
            await api.post("/logout");
            showToast("Logged out successfully!", "success");
        } catch (err) {
            console.error("Logout failed:", err);
            showToast("Session expired. Logging out...", "info");
        } finally {
            // 1.5-second delay before redirecting
            setTimeout(() => {
                // Clear storage
                sessionStorage.removeItem("userRole");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("email");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("isFirstLogin");
                
                (false); // Stop loading animation
                navigate("/landingpage");
            }, 1500);
        }
    };

    useEffect(() => {
        // I-check kung galing tayo sa ArticlePage na may dalang state
        if (location.state?.activeSlug) {
            setActiveTab(location.state.activeSlug);
            
            // Kung ang tab ay 'Health Insights', buksan din dapat ang sidebar dropdown
            if (location.state.activeSlug === 'health-insights') {
                setIsLibraryOpen(true);
            }
            
            // Linisin ang state para hindi laging bumabalik sa Library pag nag-refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const isMapPage = tabName === 'nearby-hospital';

    return (
        <div className="min-h-screen bg-background flex selection:bg-primary/20 text-foreground">

            <BackgroundLoadingState 
                isLoading={isHospitalLoading} 
                message="Checking your location and searching for nearby hospitals..." 
            />
            
            {/* 1. MOBILE SIDEBAR (LEFT SLIDE) */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <>
                        {/* Dark Overlay/Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-100 lg:hidden"
                        />
                        
                        {/* Slide-in Menu (Galing sa Kaliwa / x: -100%) */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-70 bg-card border-r border-border z-101 lg:hidden flex flex-col"
                        >
                            <Sidebar 
                                activeTab={currentDisplayTitle}
                                setActiveTab={handleTabChange}
                                isLibraryOpen={isLibraryOpen} 
                                setIsLibraryOpen={setIsLibraryOpen}
                                setIsMobileMenuOpen={setIsMobileMenuOpen}
                                userData={userData}
                                setIsLogoutModalOpen={setIsLogoutModalOpen}
                                libraryRef={libraryRef}
                                onNearbyHospitalClick={handleNearbyHospitalClick}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 2. DESKTOP SIDEBAR (Laging Visible sa malalaking screen) */}
            <aside className="hidden lg:flex w-72 bg-card border-r border-border flex-col shrink-0 h-screen sticky top-0 overflow-hidden">
                <Sidebar 
                    activeTab={currentDisplayTitle}
                    setActiveTab={handleTabChange}
                    isLibraryOpen={isLibraryOpen} 
                    setIsLibraryOpen={setIsLibraryOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    userData={userData}
                    setIsLogoutModalOpen={setIsLogoutModalOpen}
                    libraryRef={libraryRef}
                    onNearbyHospitalClick={handleNearbyHospitalClick}
                />
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER */}
                <TopHeader 
                    title={subTitle || currentDisplayTitle}
                    user={userData} 
                    onLogoutClick={() => setIsLogoutModalOpen(true)}
                    onMenuClick={() => setIsMobileMenuOpen(true)} 
                />

                <main className="flex-1 overflow-y-auto bg-background/50 scrollbar-custom w-full">
                    {renderContent()}
                </main>
            </div>

            <DeleteModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={() => {
                    modalConfig.onConfirm();
                    setModalConfig({ ...modalConfig, isOpen: false });
                }}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogout}
                userData={userData} 
            />
        </div>
    );
};

export default Dashboard;
