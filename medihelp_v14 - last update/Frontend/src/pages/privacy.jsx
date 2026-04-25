import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Shield, Lock, Eye, Database, 
    Mic, UserCheck, Smartphone, Globe 
} from 'lucide-react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const navigate = useNavigate();

    const sections = {
        introduction: {
            title: "Introduction",
            icon: <Shield size={20} />,
            content: (
                <div className="space-y-6 text-left">
                    <p className="text-slate-600 leading-relaxed">
                        Welcome to <strong>MediHelp</strong>. We are committed to protecting your personal and medical information. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information through our Voice-Assisted Healthcare Information System.
                    </p>
                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                        <p className="text-sm text-blue-700 font-bold mb-2">Key Commitment:</p>
                        <p className="text-sm text-blue-600 font-medium">
                            We do not sell your health data. Your medical records are encrypted and only used to provide you with better healthcare insights and assistance.
                        </p>
                    </div>
                </div>
            )
        },
        dataCollection: {
            title: "Information We Collect",
            icon: <Database size={20} />,
            content: (
                <div className="space-y-6 text-left">
                    <p className="text-slate-600 font-medium">To provide a seamless voice-assisted experience, we collect the following:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2 text-blue-600">
                                <UserCheck size={18} />
                                <span className="font-black text-xs uppercase tracking-wider">Personal Data</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Full name, email address, and age to manage your health profile.</p>
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2 text-emerald-600">
                                <Mic size={18} />
                                <span className="font-black text-xs uppercase tracking-wider">Voice Data</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Temporary voice recordings used for symptom analysis and navigation commands.</p>
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2 text-purple-600">
                                <Database size={18} />
                                <span className="font-black text-xs uppercase tracking-wider">Medical Records</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Clinical history, allergies, and surgeries you manually input into the system.</p>
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2 text-orange-600">
                                <Smartphone size={18} />
                                <span className="font-black text-xs uppercase tracking-wider">Usage Logs</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Device info and IP addresses to prevent unauthorized access to your records.</p>
                        </div>
                    </div>
                </div>
            )
        },
        dataUsage: {
            title: "How We Use Data",
            icon: <Eye size={20} />,
            content: (
                <div className="space-y-4 text-left">
                    <ul className="space-y-3">
                        {[
                            "To process and analyze your symptoms via Voice Assistant.",
                            "To maintain and display your personalized Health Records.",
                            "To provide educational content through the Guidance Library.",
                            "To improve our AI-driven medical assistance algorithms.",
                            "To ensure security and verify your identity during login."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-slate-600 font-medium">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        security: {
            title: "Security Measures",
            icon: <Lock size={20} />,
            content: (
                <div className="space-y-6 text-left">
                    <p className="text-slate-600 leading-relaxed font-medium">
                        MediHelp uses industry-standard security protocols to keep your data safe:
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">End-to-End Encryption</h4>
                                <p className="text-xs text-slate-500 font-medium">All medical data is encrypted using AES-256 before being stored.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">Secure Data Transmission</h4>
                                <p className="text-xs text-slate-500 font-medium">We use HTTPS (SSL/TLS) for all data moving between your device and our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* Custom Header with Back Button */}
                <div className="flex items-center justify-between mb-10">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:text-blue-600 transition-all border border-slate-200 shadow-sm cursor-pointer"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Shield size={14} /> Privacy & Trust Center
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm sticky top-10">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4 text-left">Privacy Sections</h2>
                            <nav className="space-y-2">
                                {Object.keys(sections).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveSection(key)}
                                        className={`w-full flex items-center gap-4 px-5 py-5 rounded-[1.5rem] font-black text-sm transition-all cursor-pointer ${
                                            activeSection === key 
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                    >
                                        <div className={activeSection === key ? 'text-white' : 'text-slate-400'}>
                                            {sections[key].icon}
                                        </div>
                                        {sections[key].title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Display */}
                    <main className="lg:w-2/3">
                        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden min-h-[300px]">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight text-left">
                                {sections[activeSection].title}
                            </h1>
                            
                            <div className="relative z-10 transition-all duration-300">
                                {sections[activeSection].content}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;