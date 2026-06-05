import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Compass, 
    ChevronDown, 
    ArrowLeft, ArrowRight,
    Sparkles, 
    ArrowUpRight, 
    User,
    HelpCircle,
    X,
    FileText
} from 'lucide-react';

import Button from '../components/ui/Button';
import BackgroundLoadingState from '../components/BackgroundLoadingState';
import { userService } from '../services/userService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import { faqs } from '../data/faqData';

const HelpSupport = () => {
    useDocumentTitle('Help Support');

    const navigate = useNavigate();
    const faqSectionRef = useRef(null); 
    const searchContainerRef = useRef(null); 

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFirstName, setUserFirstName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    // Check Authentication Status sa pag-load ng page
    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const userData = await userService.getFullDetails();
                if (userData) {
                    setIsLoggedIn(true);
                    setUserFirstName(userData.firstName || 'User');
                }
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAuth();
    }, []);

    // Isasara ang dropdown kapag nag-click sa labas ng search elements
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtered array para lamang sa loob ng lumulutang na dropdown view
    const filteredDropdownResults = faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function na magpapatakbo ng transition patungo sa napiling FAQ card
    const handleSelectDropdownItem = (originalId) => {
        setSearchQuery(''); 
        setShowDropdown(false);
        
        // I-navigate ang user papunta sa article template gamit ang ID nito
        navigate(`/help-support/faq/${originalId}`);
    };

    if (isLoading) {
        return <BackgroundLoadingState isLoading={true} message="Loading Help & Support Hub..." />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-8">
            
            {/* HERO SECTION */}
            <div className="relative overflow-visible bg-card/30 border-b border-border py-20 px-6 text-center">
                
                {/* ISOLATED BACKGROUND LAYER: Para iwas horizontal overflow sa blurred backgrounds */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
                </div>

                <div className="absolute top-6 left-6 z-50">
                    <Button 
                        variant="ghost" 
                        type="circular" 
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                </div>

                <div className="max-w-3xl mx-auto relative z-30">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-widest font-bold uppercase bg-primary/10 text-primary rounded-full mb-4 animate-pulse">
                        <Sparkles size={12} />
                        MediHelp Support Desk
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-glow mb-4">
                        {isLoggedIn ? `Hi ${userFirstName}, how can we help?` : "How can we assist you today?"}
                    </h1>
                    <p className="text-sm md:text-base text-foreground/60 mb-8 max-w-xl mx-auto leading-relaxed">
                        Search across our curated documentation or browse specific categories below to resolve platform problems instantly.
                    </p>

                    {/* Live Search Input at Dropdown Container */}
                    <div ref={searchContainerRef} className="relative max-w-2xl mx-auto z-40">
                        <div className="relative shadow-2xl shadow-purple-500/5 rounded-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                            <input 
                                type="text"
                                placeholder="Type keywords to look for configurations, emergency map setups..."
                                value={searchQuery}
                                onFocus={() => setShowDropdown(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                className="w-full pl-12 pr-12 py-4 text-sm rounded-2xl border border-border bg-card/80 backdrop-blur-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* DROPDOWN FILTER RESULTS */}
                        {showDropdown && searchQuery && (
                            <div className="absolute left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-border/40 overflow-hidden">
                                {faqs.filter(faq => 
                                    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length > 0 ? (
                                    faqs.filter(faq => 
                                        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((faq) => (
                                        <div 
                                            key={faq.id}
                                            onClick={() => navigate(`/help-support/faq/${faq.id}`)}
                                            className="p-4 hover:bg-primary/3 cursor-pointer transition-colors flex items-start gap-3 text-left group"
                                        >
                                            <FileText size={16} className="text-primary mt-0.5 shrink-0" />
                                            <div className="min-w-0">
                                                <h4 className="text-md font-bold text-foreground/90 group-hover:text-primary transition-colors truncate">{faq.q}</h4>
                                                <p className="text-[12px] text-foreground/50 truncate mt-0.5">{faq.a}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-xs text-foreground/40 text-center font-medium">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CORE */}
            <main className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div className="lg:col-span-2 space-y-12">

                    {/* 1. FAQ Accordion Dropdown List */}
                    <div ref={faqSectionRef} className="scroll-mt-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide">
                                <HelpCircle size={22} className="text-primary" />
                                Frequently Asked Questions (FAQs)
                            </h2>
                            {/* View All Button Action Trigger */}
                            <button 
                                onClick={() => navigate('/help-support/all-faqs')} 
                                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider flex items-center gap-1 group cursor-pointer"
                            >
                                View All
                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border/40 shadow-sm">
                            {faqs.slice(0, 5).map((faq, index) => {
                                const isOpen = activeFaq === index;
                                return (
                                    <div key={index} className="transition-all duration-300">
                                        <button
                                            onClick={() => setActiveFaq(isOpen ? null : index)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm hover:bg-foreground/0.02 transition-colors cursor-pointer"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-primary/80">{faq.category}</span>
                                                <span className="text-foreground/90">{faq.q}</span>
                                            </div>
                                            <ChevronDown 
                                                size={18} 
                                                className={`text-foreground/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                                            />
                                        </button>
                                        
                                        <div 
                                            className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48 border-t border-border/20 bg-foreground/0.01' : 'max-h-0'}`}
                                        >
                                            <p className="px-6 py-4 text-xs text-foreground/70 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR NAVIGATION PROMPTS */}
                <div className="lg:col-span-1 space-y-6">
                    {isLoggedIn ? (
                        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                    <User size={18} />
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase font-bold text-foreground/40 tracking-widest">Active Hub</span>
                                    <h3 className="text-xs font-bold">Profile Configurations</h3>
                                </div>
                            </div>
                            <p className="text-xs text-foreground/60 mb-5 leading-relaxed">
                                Ready to configure encryption keys, reset account logs, or tweak active trackers? Jump straight inside.
                            </p>
                            <Button 
                                variant="secondary"
                                type="rounded"
                                size="sm"
                                className="w-full"
                                trailingIcon={ArrowUpRight}
                                onClick={() => navigate('/dashboard/settings')}
                            >
                                Settings Dashboard
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm border-dashed">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1">Are you an existing user?</h3>
                            <p className="text-xs text-foreground/60 leading-relaxed mb-5">
                                Log into your secure patient profile to review synchronized record histories and troubleshooting indicators.
                            </p>
                            <Button 
                                variant="primary"
                                type="rounded"
                                size="sm"
                                className="w-full"
                                onClick={() => navigate('/login')}
                            >
                                Sign In To Profile
                            </Button>
                        </div>
                    )}

                    <div className="bg-linear-to-br from-card to-card/50 border border-border p-6 rounded-3xl shadow-lg relative text-left">
                        <h3 className="text-sm font-bold mb-1">Still running into bugs?</h3>
                        <p className="text-xs text-foreground/60 mb-5 max-w-xs mx-auto leading-relaxed">
                            Can’t locate data remedies in the logs above? Forward an official communication ticket straight onto our administrator staff line.
                        </p>
                        <Button 
                            variant="outline"
                            type="pill"
                            size="md"
                            className="w-full text-center"
                            onClick={() => navigate('/contact-support')}
                        >
                            Open Support Ticket
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HelpSupport;
