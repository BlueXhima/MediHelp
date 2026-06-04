import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    ChevronLeft, Settings, Send, HelpCircle, 
    MessageSquare, Mail, Globe, ArrowRight, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { showToast } from '../components/ToastMessage';
import BackgroundLoadingState from '../components/BackgroundLoadingState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import ThemeToggle from '../components/ThemeToggle';
import { userService } from '../services/userService';

const ContactSupport = () => {
    const navigate = useNavigate();
    const [userData, setUser] = useState(null);
    const [fetchingUser, setFetchingUser] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    // --- DYNAMIC BROWSER TITLE ---
    // Kapag fetching pa, default muna. Kapag tapos na, check kung may user.
    const dynamicTitle = fetchingUser 
        ? "Loading..." 
        : (userData ? "Contact Support" : "Contact Us");
    
    useDocumentTitle(dynamicTitle);

    // 1. Fetch User Details on Mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await userService.getFullDetails();
                if (res) {
                    setUser(res); // Ise-save ang buong record sa `userData` state

                    // --- DITO ANG SULUSYON ---
                    // I-prefill natin ang mga fields ng form gamit ang sagot galing sa server
                    setFormData({
                        fullName: `${res.firstName || ''} ${res.lastName || ''}`.trim(),
                        email: res.email || '',
                        subject: '',
                        message: ''
                    });
                }
            } catch (error) {
                console.error("Error loading support configuration:", error);
                // Huwag mag-toast error dito para kung guest man siya, tahimik lang na hindi mag-prefill.
            } finally {
                setFetchingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const isLoggedIn = !!userData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Simulan ang loading animation

        try {
            const response = await api.post('/contact', formData);

            if (response.data.success) {
                setTimeout(() => {
                    showToast("Message sent successfully!", "success");
                    setFormData(prev => ({ ...prev, subject: '', message: '' }));
                    setIsSubmitting(false);
                }, 800);
                return;
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            showToast(errorMsg, "error");
            setIsSubmitting(false)
        }
    };

    // Loading state habang nag-che-check ng auth
    if (fetchingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <BackgroundLoadingState
                isLoading={isSubmitting} 
                message="Sending your message..."
            />

            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                    
                    {/* Left Section: Back Button */}
                    <div className="flex-1 flex justify-start">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    {/* Center Section: Logo */}
                    <div className="shrink-0 text-center">
                        <h1 className="text-lg md:text-xl font-black tracking-widest uppercase text-primary leading-none" style={{ fontFamily: 'UNESA, sans-serif' }}>
                            MediHelp
                        </h1>
                    </div>

                    {/* Right Section: Controls */}
                    <div className="flex-1 flex items-center justify-end gap-1 md:gap-3">
                        <div className="scale-90 md:scale-100">
                            <ThemeToggle inline />
                        </div>
                        
                        {/* HINTAYIN MATAPOS ANG FETCHING PARA WALANG JUMPING UI */}
                        {!fetchingUser && (
                            <>
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-1 md:gap-3">
                                        {/* DYNAMIC AVATAR OR INITIALS */}
                                        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                            {userData?.profile_picture ? (
                                                <img 
                                                    src={userData?.profile_picture}
                                                    alt="User" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + userData?.firstName; }}
                                                />
                                            ) : (
                                                <span className="text-sm font-black">{userData?.firstName?.charAt(0) || 'U'}</span>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={() => navigate('/dashboard/settings')} 
                                            className="p-2 hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                                        >
                                            <Settings size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-1.5 text-xs md:text-sm font-bold rounded-xl"
                                    >
                                        Login
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
                {/* Heading Section */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-light tracking-tight"
                    >
                        Contact <span className="font-serif italic text-primary">Us</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-muted-foreground leading-relaxed"
                    >
                        Our dedicated concierge team is here to support your healthcare journey. 
                        Please let us know how we can assist you today.
                    </motion.p>
                </div>

                {/* 2 Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* First Column: Form Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 bg-card border border-border/60 rounded-3xl p-8 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="text-xl font-semibold">Send us a message</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. John Smith"
                                        className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="johnsmith@gmail.com"
                                        className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="How can we help?"
                                    className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Message</label>
                                <textarea 
                                    rows="4"
                                    placeholder="Type your message here..."
                                    className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    required
                                ></textarea>
                            </div>

                            <Button 
                                buttonType="submit"
                                variant="primary" 
                                className="w-full py-4 rounded-xl shadow-lg shadow-primary/20"
                                leadingIcon={Send}
                                disabled={isSubmitting}
                            >
                                Send Message
                            </Button>
                        </form>
                    </motion.div>

                    {/* Second Column: Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Help Center Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card border border-border/60 rounded-3xl p-8 hover:shadow-md transition-all group"
                        >
                            {/* Header Section: Icon + Title/Subtitle (Flex Row) */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-2 bg-purple-100 rounded-full text-purple-600 group-hover:scale-105 transition-transform shrink-0">
                                    <HelpCircle size={18} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground">Visit Help Center</h3>
                                    <p className="text-sm text-gray-500 font-medium">Explore self-service resources</p>
                                </div>
                            </div>

                            {/* Body Text Section */}
                            <div className="mb-8">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Browse detailed guides on patient rights, accessibility, insurance verification, and billing tutorials.
                                </p>
                            </div>

                            {/* Footer Section: Text Link Action */}
                            <button 
                                onClick={() => navigate('/help-support')}
                                className="flex items-center gap-2 text-purple-600 font-bold text-md hover:text-purple-700 transition-colors group/link cursor-pointer"
                            >
                                Go to Help Center 
                                <ArrowRight size={20} className="group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Image Background Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative h-280px rounded-3xl overflow-hidden group shadow-xl"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
                                alt="Support" 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h4 className="text-white text-xl font-medium drop-shadow-lg">
                                    We're committed to providing the best care for our community.
                                </h4>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* MEDICAL EMERGENCY DISCLAIMER */}
                <div className="pb-14">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl p-6"
                    >
                        <div className="flex flex-row items-start gap-4">
                            
                            <div className="p-2.5 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-500 animate-pulse mt-0.5 shrink-0">
                                <HelpCircle size={18} strokeWidth={2.5} />
                            </div>

                            <div className="space-y-1">
                                <h5 className="text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                                    Medical Emergency?
                                </h5>
                                <p className="text-amber-700/90 dark:text-amber-400/80 text-[13px] leading-relaxed">
                                    If you are experiencing a medical emergency, please call your local emergency services <span className="font-bold underline">(911)</span> immediately. MediHelp support channels are not intended for life-threatening situations.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="bg-card border-t border-border/40 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-[0.2em] text-primary" style={{ fontFamily: 'UNESA, sans-serif' }}>
                                MEDIHELP
                            </h2>
                            <p className="text-[0.7rem] text-muted-foreground font-medium">
                                © 2026 MediHelp Inc. All rights reserved. Professional healthcare guidance at your fingertips.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:flex items-center gap-x-8 gap-y-4">
                            <a href="#" className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Accessibility</a>
                            <a href="#" className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactSupport;
