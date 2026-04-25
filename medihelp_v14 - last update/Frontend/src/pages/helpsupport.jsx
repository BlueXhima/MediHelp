import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Search, HelpCircle, MessageCircle, FileText, Shield, Activity,
    ChevronRight, ExternalLink, Mail, Phone, LifeBuoy, ArrowLeft 
} from 'lucide-react';
import Navbar from '../components/navbar';

const HelpSupport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);
    const [prevPage, setPrevPage] = useState("Dashboard");

    const faqCategories = [
        { icon: <Shield className="text-blue-500" />, title: 'Privacy & Security', desc: 'Manage your data and account protection.' },
        { icon: <FileText className="text-emerald-500" />, title: 'Health Records', desc: 'How to update or export your medical documentation.' },
        { icon: <Activity className="text-purple-500" />, title: 'Voice Assistant', desc: 'Tips for using the AI consultation features.' },
    ];

    const commonQuestions = [
        {
            q: "How do I update my medical history?",
            a: "Navigate to your Health Profile and select the Medical Records section. Click the 'Edit Records' button to add or modify your conditions, allergies, and past surgeries."
        },
        {
            q: "Is my medical data secure and private?",
            a: "Yes. Your data is encrypted and stored according to strict privacy standards. It is only accessible to you unless you explicitly choose to share it."
        },
        {
            q: "How do I use the Voice Assistant for consultation?",
            a: "You can access the Voice Assistant via the Dashboard. Simply click the microphone icon and describe your symptoms to receive AI-guided health information."
        },
        {
            q: "Can I export my health records as a document?",
            a: "Yes, you can use the 'Export PDF' feature found in the My Health Record page to generate a professional copy of your clinical history."
        },
        {
            q: "How does the Community Commute Guide work?",
            a: "This feature allows users in Bacoor and Imus to share real-time transport updates and view automated fare calculations via a community-powered feed."
        },
        {
            q: "What should I do if I forgot my account password?",
            a: "On the login page, click 'Forgot Password' to initiate an OTP verification process sent to your registered email to safely reset your credentials."
        }
    ];

    // Kunin ang path mula sa storage
    useEffect(() => {
        // Tuwing nagbabago ang location (URL), basahin ang storage
        const rawPath = sessionStorage.getItem('prevPath') || '/dashboard';
        
        const formatPath = (path) => {
            if (path === '/dashboard' || path === '/') return "Dashboard";
            const segment = path.split('/').filter(Boolean).pop();
            if (!segment || segment === 'dashboard') return "Dashboard";
            return segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        setPrevPage(formatPath(rawPath));
    }, [location]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-4 pt-28">

                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:text-blue-600 transition-all border border-slate-200/60 shadow-sm hover:shadow-md cursor-pointer"
                    >
                        <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        Back
                    </button>

                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="hover:text-slate-600 transition-colors cursor-default">
                            {prevPage}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-blue-500">Support Center</span>
                    </div>
                </div>
                
                {/* Hero Section with Search */}
                <div className="relative overflow-hidden bg-card rounded-[1.5rem] border border-border p-10 md:p-16 mb-10 shadow-lg shadow-slate-200/40 text-center">
                    <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                            <LifeBuoy size={16} /> Support Center
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">How can we help you?</h1>
                        <p className="text-slate-500 font-medium max-w-xl mx-auto">
                            Search our knowledge base or browse categories below to find the answers you need for your MediHelp experience.
                        </p>

                        <div className="max-w-2xl mx-auto relative mt-8">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search for articles, guides, or keywords..."
                                className="w-full pl-14 pr-6 py-5 bg-card/40 border border-border rounded-[2rem] font-bold text-foreground outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Categories */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {faqCategories.map((cat, i) => (
                                <div key={i} className="group p-6 bg-card border border-border rounded-[2rem] hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                                        {cat.icon}
                                    </div>
                                    <h3 className="font-black text-foreground mb-1">{cat.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Popular Questions */}
                        <div className="bg-card rounded-[1.5rem] border border-border p-8 shadow-sm">
                            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                                <HelpCircle className="text-blue-500" /> Popular Questions
                            </h2>
                            <div className="divide-y divide-slate-50">
                                {commonQuestions.map((item, i) => (
                                    <div key={i} className="border-b border-slate-50 last:border-0">
                                        <button 
                                            onClick={() => setActiveIndex(activeIndex === i ? null : i)} // Toggle logic
                                            className="w-full flex items-center justify-between py-5 group cursor-pointer text-left outline-none"
                                        >
                                            <span className={`font-bold transition-colors ${activeIndex === i ? 'text-blue-600' : 'text-slate-600'}`}>
                                                {item.q}
                                            </span>
                                            <ChevronRight 
                                                size={18} 
                                                className={`text-slate-300 transition-all duration-300 ${activeIndex === i ? 'rotate-90 text-blue-500' : ''}`} 
                                            />
                                        </button>
                                        
                                        {/* Answer Section: Lalabas lang pag activeIndex === i */}
                                        <div className={`overflow-hidden transition-all duration-300 ${activeIndex === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                                            <p className="text-sm text-slate-500 text-left font-medium leading-relaxed bg-transparent border border-border p-4 rounded-2xl">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Support */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[1.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                            <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                            
                            <h2 className="text-xl font-black mb-4 relative z-10">Direct Contact</h2>
                            <p className="text-slate-400 text-sm font-medium mb-8 relative z-10">Can't find what you're looking for? Talk to our team directly.</p>
                            
                            <div className="space-y-4 relative z-10">
                                <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Live Chat</p>
                                        <p className="font-bold text-sm">Start a conversation</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                                        <Mail size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Email Support</p>
                                        <p className="font-bold text-sm">support@medihelp.ph</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-card rounded-[1.5rem] border border-border p-8 text-left shadow-sm">
                            <h3 className="font-black text-foreground mb-4">Helpful Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/terms" className="flex items-center justify-between text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        Terms of Service <ExternalLink size={14} />
                                    </a>
                                </li>
                                <li>
                                    <a href="/privacy" className="flex items-center justify-between text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        Privacy Policy <ExternalLink size={14} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs font-medium mt-8 mb-4">
                    MediHelp Support is available 24/7 for emergency inquiries.
                </p>
            </main>
        </div>
    );
};

export default HelpSupport;