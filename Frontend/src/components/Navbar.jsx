import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Bell, ChevronDown, BookOpen, Heart, Brain, Activity, X, Menu, User,
    Stethoscope, Pill, Apple, Dumbbell, ShieldCheck, AlertTriangle, Baby, 
    FileText, HelpCircle, Image, LifeBuoy, ShieldAlert 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import axios from 'axios';
import Button from './ui/Button';

// 1. Icon Map para i-convert ang string icon names galing DB/Data patungong Component
const IconMap = {
    Heart, 
    Stethoscope, 
    Pill, 
    Apple, 
    Dumbbell, 
    Brain, 
    Activity,
    ShieldCheck, 
    ShieldAlert: AlertTriangle, // Kapag tinawag ang "ShieldAlert", ang AlertTriangle ang lalabas
    Baby, 
    BookOpen
};

const Navbar = ({ onOpenEmergency }) => {
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeFlyout, setActiveFlyout] = useState(null); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
    const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Idinagdag ang 'slug' na tumutugma sa mga keys ng iyong learnData.js
    const learnCategories = [
        { category_id: 1, category_name: 'General Health', icon_name: 'Heart', slug: 'general-health' },
        { category_id: 2, category_name: 'Symptoms', icon_name: 'Stethoscope', slug: 'symptoms' },
        { category_id: 3, category_name: 'Medications', icon_name: 'Pill', slug: 'medications' },
        { category_id: 4, category_name: 'Nutrition', icon_name: 'Apple', slug: 'nutrition' },
        { category_id: 5, category_name: 'Exercise', icon_name: 'Dumbbell', slug: 'exercise' },
        { category_id: 6, category_name: 'Mental Health', icon_name: 'Brain', slug: 'mental-health' },
        { category_id: 7, category_name: 'Chronic Conditions', icon_name: 'Activity', slug: 'chronic-conditions' },
        { category_id: 8, category_name: 'Preventive Care', icon_name: 'ShieldCheck', slug: 'preventive-care' },
        { category_id: 9, category_name: 'Emergency Care', icon_name: 'ShieldAlert', slug: 'emergency-care' },
        { category_id: 10, category_name: 'Pediatric', icon_name: 'Baby', slug: 'pediatric' },
    ];

    const resourceItems = [
        { name: 'Educational Articles', icon_name: 'FileText', href: '/learn?type=education', desc: 'Read deep dives into medical topics.' },
        { name: 'Medical Glossary', icon_name: 'HelpCircle', href: '/learn?type=glossary', desc: 'Understand hard-to-read terms easily.' },
        { name: 'Infographics', icon_name: 'Image', href: '/learn?type=infographics', desc: 'Visual health guides at a single glance.' },
        { name: 'First Aid Guide', icon_name: 'LifeBuoy', href: '/learn?type=firstaid', desc: 'Emergency response and immediate care.' },
    ];

    const Links = [
        { name: 'Learn', hasDropdown: true },
        { name: 'Resources', hasDropdown: true },
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Contact Us', href: '/contact-support' },
    ];

    return (
        <>
            <nav 
                className={`fixed top-0 w-full z-100 border-b transition-all duration-300 px-6 py-2 flex items-center justify-between ${
                    isScrolled ? 'bg-background/95 backdrop-blur-md border-border shadow-sm' : 'bg-transparent border-transparent'
                }`}
                onMouseLeave={() => setActiveFlyout(null)}
            >
                {/* LEFT: Logo */}
                <div className="flex items-center">
                    <span className="text-2xl font-black tracking-tighter text-primary cursor-pointer" 
                        onClick={() => navigate('/')}
                        style={{ fontFamily: "'Unesa', sans-serif" }}>
                        MEDIHELP
                    </span>
                </div>

                {/* CENTER: Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 h-full">
                    {Links.map((link) => (
                        <div 
                            key={link.name} 
                            className="h-12 flex items-center"
                            onMouseEnter={() => link.hasDropdown ? setActiveFlyout(link.name) : setActiveFlyout(null)}
                        >
                            {link.hasDropdown ? (
                                <button className="text-foreground/70 hover:text-primary font-medium transition-colors flex items-center gap-1">
                                    {link.name}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${activeFlyout === link.name ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <a href={link.href} className="text-foreground/70 hover:text-primary font-medium transition-colors">
                                    {link.name}
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle inline />
                        <Button variant="primary" onClick={() => navigate('/login')}>
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* DESKTOP FLYOUT MENU */}
                <AnimatePresence>
                    {activeFlyout && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="hidden md:block absolute left-0 top-full w-full bg-card border-b border-border shadow-2xl overflow-hidden"
                            onMouseLeave={() => setActiveFlyout(null)}
                        >
                            <div className="max-w-7xl mx-auto p-8">
                                {activeFlyout === 'Learn' && (
                                    <div className="grid grid-cols-4 gap-8">
                                        <div className="col-span-3">
                                            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground/40 mb-4">Health Categories</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {learnCategories.map((cat) => {
                                                    const DynamicIcon = IconMap[cat.icon_name] || BookOpen;
                                                    return (
                                                        <div 
                                                            key={cat.category_id} 
                                                            className="group flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-foreground/5 transition-colors" 
                                                            onClick={() => {
                                                                setActiveFlyout(null);
                                                                // Dito babaguhin ang pag-navigate gamit ang slug/topicId
                                                                navigate(`/learn?type=education&cat=${cat.slug}`); 
                                                            }}
                                                        >
                                                            <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                                <DynamicIcon className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-semibold text-sm text-foreground/80 group-hover:text-primary transition-colors">{cat.category_name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="col-span-1 bg-linear-to-br from-red-500/10 to-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group">
                                            {/* Decorative background grid effect */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-5 -mt-5 transition-transform group-hover:scale-125 duration-500" />
                                            
                                            <div className="relative z-10 space-y-3">
                                                <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold">
                                                    Clinical Tool
                                                </span>
                                                <h4 className="text-lg font-bold uppercase tracking-tight text-foreground pt-1" style={{ fontFamily: "'Unesa', sans-serif" }}>
                                                    Symptom Analytics
                                                </h4>
                                                <p className="text-xs text-foreground/60 leading-relaxed">
                                                    Quickly evaluate your symptoms using our advanced diagnostic matrix core.
                                                </p>
                                            </div>

                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                className="mt-6 w-full text-[10px] font-bold uppercase tracking-wider py-2.5 cursor-pointer shadow-lg shadow-primary/10"
                                                onClick={() => {
                                                    setActiveFlyout(null);
                                                    navigate('/voice-assistant'); 
                                                }}
                                            >
                                                Run Diagnostics
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeFlyout === 'Resources' && (
                                    <div className="grid grid-cols-4 gap-8">
                                        <div className="col-span-3">
                                            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground/40 mb-4">Educational Resources</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {resourceItems.map((item) => {
                                                    const DynamicIcon = IconMap[item.icon_name] || BookOpen;
                                                    return (
                                                        <a href={item.href} key={item.name} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-foreground/5 transition-colors">
                                                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                                <DynamicIcon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                                                                <p className="text-xs text-foreground/50 mt-0.5">{item.desc}</p>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="col-span-1 border-l border-border pl-8 flex flex-col justify-center">
                                            <h4 className="font-bold text-sm mb-1 text-foreground">Need Urgent Help?</h4>
                                            <p className="text-xs text-foreground/50 mb-4">Access our quick hotlines and quick relief instructions.</p>
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => {
                                                    setActiveFlyout(null);
                                                    onOpenEmergency(); // 3. Tawagin ang trigger
                                                }}
                                                leadingIcon={ShieldAlert}
                                            >
                                                Emergency Contact
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* MOBILE NAVIGATION MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-90 md:hidden"
                        />

                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-72 bg-card border-l border-border z-100 md:hidden shadow-2xl flex flex-col overflow-y-auto"
                        >
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex justify-end items-center">
                                    <button 
                                        className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-xl hover:bg-foreground/5"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {Links.map((link) => (
                                        <div key={link.name} className="border-b border-border/50 pb-3">
                                            {link.name === 'Learn' ? (
                                                <>
                                                    <button 
                                                        onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
                                                        className="w-full flex items-center justify-between text-[15px] font-bold text-foreground py-1"
                                                    >
                                                        {link.name}
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileLearnOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {mobileLearnOpen && (
                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                                <div className="mt-2 grid gap-3 pl-3 border-l-2 border-primary/20 py-1">
                                                                    {learnCategories.map((cat) => {
                                                                        const DynamicIcon = IconMap[cat.icon_name] || BookOpen;
                                                                        return (
                                                                            <div 
                                                                                key={cat.category_id} 
                                                                                className="flex items-center gap-3 text-foreground/70 hover:text-primary cursor-pointer py-0.5" 
                                                                                onClick={() => { 
                                                                                    setIsMobileMenuOpen(false); 
                                                                                    // Binago rin dito sa mobile view
                                                                                    navigate(`/learn?type=education&cat=${cat.slug}`); 
                                                                                }}
                                                                            >
                                                                                <DynamicIcon size={16} className="text-primary/70" />
                                                                                <span className="text-xs font-semibold">{cat.category_name}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : link.name === 'Resources' ? (
                                                <>
                                                    <button onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)} className="w-full flex items-center justify-between text-[15px] font-bold text-foreground py-1">
                                                        {link.name}
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {mobileResourcesOpen && (
                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                                <div className="mt-2 grid gap-3 pl-3 border-l-2 border-primary/20 py-1">
                                                                    {resourceItems.map((item) => {
                                                                        const DynamicIcon = IconMap[item.icon_name] || BookOpen;
                                                                        return (
                                                                            <a href={item.href} key={item.name} className="flex items-center gap-3 text-foreground/70 hover:text-primary py-0.5" onClick={() => setIsMobileMenuOpen(false)}>
                                                                                <DynamicIcon size={16} className="text-primary/70" />
                                                                                <span className="text-xs font-semibold">{item.name}</span>
                                                                            </a>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <a href={link.href} className="text-[15px] font-bold text-foreground hover:text-primary block py-1" onClick={() => setIsMobileMenuOpen(false)}>
                                                    {link.name}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border mt-2">
                                    <span className="font-bold text-foreground/60 text-[10px] uppercase tracking-widest">Theme Mode</span>
                                    <ThemeToggle inline />
                                </div>

                                <Button 
                                    variant="primary" 
                                    className="w-full py-3.5 text-xs shadow-lg shadow-primary/20 mt-2" 
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/login');
                                    }}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;