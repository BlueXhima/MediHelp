import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Shield, Bell, Eye, Loader2,
    ChevronRight, Stethoscope, Menu,
    ArrowLeft, HelpCircle, Activity,
    Settings as SettingsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { cn } from "../lib/utils";
import MobileDrawer from "../components/modals/MobileDrawer";
import MediHelpLogo from "/MediHelpLogo.png";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const tabs = [
        { id: "profile", label: "Profile Information", icon: User, desc: "Manage your personal details" },
        { id: "medical", label: "Medical Preferences", icon: Stethoscope, desc: "Health records & preferences" },
        { id: "security", label: "Security & Privacy", icon: Shield, desc: "Password and account safety" },
        { id: "appearance", label: "Appearance", icon: Eye, desc: "Custom themes and display" },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            
            // Safety check: Kung walang token, patayin agad ang loading
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Kahit 304, dapat may data pa rin na ibibigay si axios mula sa cache
                if (res.data) {
                    setUserData(res.data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                // KRITIKAL: Tatakbo ito sa 200, 304, o kahit sa 404/500 error.
                // Siguradong mawawala ang loading screen dito.
                setTimeout(() => {
                    setIsLoading(false);
                }, 500); 
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                    Synchronizing Preferences
                </p>
            </div>
        );
    }

    const handleTabSelect = (tabId) => {
        setActiveTab(tabId);
        setIsDrawerOpen(false);
    };

    // Reusable Navigation List para sa Desktop Sidebar at Mobile Drawer
    const NavigationContent = () => (
        <div className="space-y-6">
            {/* BRANDING (Lalabas lang sa Mobile Drawer ito karaniwan) */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
                <img src={MediHelpLogo} alt="MediHelp" className="h-8 w-auto" />
                <span 
                    className="text-2xl font-black tracking-tighter text-primary uppercase" 
                    style={{ fontFamily: "'Unesa', sans-serif" }}
                >
                    MEDIHELP
                </span>
            </div>

            <nav className="space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabSelect(tab.id)}
                        className={cn(
                            "group w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer",
                            activeTab === tab.id 
                                ? "bg-primary/10 text-primary shadow-sm" 
                                : "hover:bg-muted/50 text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                activeTab === tab.id ? "bg-primary/20" : "bg-muted group-hover:bg-background"
                            )}>
                                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                                <p className="text-[10px] opacity-60 font-light line-clamp-1">{tab.desc}</p>
                            </div>
                        </div>
                        <ChevronRight 
                            size={14} 
                            className={cn(
                                "transition-all duration-300",
                                activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                            )} 
                        />
                    </button>
                ))}
            </nav>

            {/* SUBTLE SUPPORT CARD */}
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm space-y-4">
                <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    <HelpCircle size={16} />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground font-light">
                    Need assistance with your account? Our support team is available 24/7.
                </p>
                <button 
                    onClick={() => navigate('/contact-support')}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                    Contact Support
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 transition-colors duration-300">
            {/* --- THIN PROGRESS BAR --- */}
            <div className="fixed top-0 left-0 right-0 h-[5px] bg-primary/20 z-50">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-primary"
                />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-8 lg:py-14">
                
                {/* --- HEADER SECTION --- */}
                <header className="mb-12">
                    <div className="flex items-center justify-between w-full">
                        {/* LEFT SIDE: Navigation & Title */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => navigate(-1)}
                                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                                Go Back
                            </button>
                            <h1 className="text-4xl md:text-5xl font-light tracking-tighter leading-none">
                                Settings<span className="text-primary font-serif italic">.</span>
                            </h1>
                        </div>

                        {/* RIGHT SIDE: Menu (Mobile) or Badge (Desktop) */}
                        <div className="flex items-center gap-4">
                            {/* MOBILE MENU TRIGGER - Ngayon ay nasa kanan na */}
                            <button 
                                onClick={() => setIsDrawerOpen(true)}
                                className="lg:hidden p-3 rounded-2xl bg-muted/50 text-primary border border-border/50 transition-colors active:scale-95"
                            >
                                <Menu size={24} />
                            </button>

                            {/* DESKTOP BADGE */}
                            <div className="hidden lg:flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    System Configuration
                                </span>
                                <div className="flex items-center gap-2 text-muted-foreground/40 italic text-[11px] font-light">
                                    <SettingsIcon size={14} />
                                    <span>v1.0.4 - AES-256 Secure Node</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
                    <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-10">
                        <NavigationContent />
                    </aside>

                    {/* --- DYNAMIC CONTENT AREA --- */}
                    <main className="lg:col-span-8 xl:col-span-9">
                        <div className="relative min-h-[600px] rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-md p-6 md:p-12 shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    {/* Placeholder Content */}
                                    <div className="space-y-8">
                                        <div className="pb-6 border-b border-border/40">
                                            <h2 className="text-2xl font-light tracking-tight capitalize">
                                                {activeTab} Settings
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-light mt-1">
                                                Configure your {activeTab} preferences below.
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {/* Sample Setting Row */}
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-border/60 transition-all">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">Coming Soon</p>
                                                    <p className="text-xs text-muted-foreground font-light">This feature is currently under development.</p>
                                                </div>
                                                <div className="h-6 w-10 rounded-full bg-muted animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

            </div>
            {/* --- MOBILE DRAWER --- */}
            <MobileDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                side="right"
            >
                <div>
                    <NavigationContent />
                </div>
            </MobileDrawer>
        </div>
    );
};

export default SettingsPage;
