import React from 'react';
import { 
    LayoutDashboard, Mic, BookOpen, User, Users, ChevronDown, X,
    Settings, LogOut, MapPin, HelpCircle, Search 
} from 'lucide-react';
import MediHelpLogo from '/MediHelpLogo.png';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ 
    activeTab, 
    setActiveTab, 
    isLibraryOpen, 
    setIsLibraryOpen, 
    setIsMobileMenuOpen, 
    userData, 
    setIsLogoutModalOpen,
    libraryRef,
    onNearbyHospitalClick 
}) => {
    const navigate = useNavigate();

    // Helper function para sa navigation at pagsara ng mobile menu
    const handleNavigation = (tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };
    
    return (
        <div className="flex flex-col h-full bg-card overflow-hidden">
            {/* LOGO SECTION */}
            <div className="p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <img src={MediHelpLogo} alt="MediHelp" className="h-8 w-auto" />
                    <span className="text-2xl font-black tracking-tighter text-primary" 
                        style={{ fontFamily: "'Unesa', sans-serif" }}>
                        MEDIHELP
                    </span>
                </div>
                <button 
                    className="lg:hidden p-2 text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>

            {/* MOBILE ONLY SEARCH BAR */}
            <div className="px-6 mb-4 lg:hidden">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search health topics..."
                        className="w-full bg-background border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>

            {/* NAVIGATION AREA */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-none">
                <div>
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Main Menu
                    </p>
                    <div className="space-y-2">
                        {/* Dashboard Button */}
                        <Button 
                            variant={activeTab === 'Overview' ? 'primary' : 'ghost'}
                            className="w-full justify-start px-4 py-3"
                            leadingIcon={LayoutDashboard}
                            onClick={() => setActiveTab('Overview')}
                        >
                            Dashboard
                        </Button>

                        {/* Voice Assistant Button */}
                        <Button 
                            variant={activeTab === 'Voice Assistant' ? 'primary' : 'ghost'}
                            className="w-full justify-start px-4 py-3"
                            leadingIcon={Mic}
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate('/voice-assistant');
                            }}
                        >
                            Voice Assistant
                        </Button>

                        {/* GUIDANCE LIBRARY WITH DROPDOWN */}
                        <div className="w-full" ref={libraryRef}>
                            <Button 
                                variant="ghost"
                                className="w-full justify-start px-4 py-3"
                                leadingIcon={BookOpen}
                                trailingIcon={ChevronDown}
                                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                            >
                                Guidance Library
                            </Button>

                            <AnimatePresence>
                                {isLibraryOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-1 ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-1"
                                    >
                                        <Button 
                                            variant={activeTab === 'Health Insights' ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() => handleNavigation('Health Insights')}
                                        >
                                            Educational Articles
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'Medical Glossary' ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() => handleNavigation('Medical Glossary')}
                                        >
                                            Medical Glossary
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'Infographics' ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() => handleNavigation('Infographics')}
                                        >
                                            Infographics
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'First Aid Guides' ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() => handleNavigation('First Aid Guides')}
                                        >
                                            First Aid Guides
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'Saved Resources' ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start text-xs"
                                            onClick={() => handleNavigation('Saved Resources')}
                                        >
                                            Saved Resources
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button 
                            variant={activeTab === 'Nearby Hospital' ? 'primary' : 'ghost'}
                            className="w-full justify-start px-4 py-3"
                            leadingIcon={MapPin}
                            onClick={() => {
                                // Imbis na rekta navigate, tawagin ang location check function
                                onNearbyHospitalClick();
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Nearby Hospital
                        </Button>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-2 mt-4">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Account Settings
                    </p>
                    <Button 
                        variant={activeTab === 'My Profile' ? 'primary' : 'ghost'}
                        className="w-full justify-start px-4 py-3"
                        leadingIcon={User}
                        onClick={() => setActiveTab('My Profile')}
                    >
                        My Profile
                    </Button>
                    <Button 
                        // Gawin nating laging 'ghost' or i-check kung nasa settings path na
                        variant={location.pathname === '/dashboard/settings' ? 'primary' : 'ghost'}
                        className="w-full justify-start px-4 py-3"
                        leadingIcon={Settings}
                        onClick={() => {
                            navigate('/dashboard/settings'); // Dito ang navigation
                            setIsMobileMenuOpen(false); // Isara ang drawer kung nasa mobile
                        }}
                    >
                        Settings
                    </Button>
                </div>

                {/* NEED HELP CARD */}
                <div className="px-4 mt-8 mb-4">
                    <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 bg-primary/10 w-16 h-16 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                                <HelpCircle size={20} />
                            </div>
                            <h4 className="text-sm font-black text-foreground mb-1">Need Help?</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                                Having trouble? Our support team is available to assist you.
                            </p>
                            <button 
                                onClick={() => {
                                    navigate('/contact-support'); // Idagdag ito
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-white text-primary text-xs font-bold py-2.5 rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Section Footer */}
            <div className="p-2 py-3 border-t border-border bg-background shrink-0">
                <div className="flex items-center gap-3 px-2 py-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center text-primary font-bold overflow-hidden">
                        {userData?.profile_picture ? (
                            <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm">{userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-md font-bold text-foreground truncate tracking-tight">{userData?.firstName} {userData?.lastName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Seeker</p>
                    </div>
                </div>
                
                <Button 
                    variant="dangerGhost" type="rounded" size="md" className="w-full justify-start px-4 py-3"
                    leadingIcon={LogOut}
                    onClick={() => { setIsLogoutModalOpen(true); setIsMobileMenuOpen(false); }}
                >
                    Logout Account
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;