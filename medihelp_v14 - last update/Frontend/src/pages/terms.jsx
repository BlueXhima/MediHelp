import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Gavel, UserCheck, AlertCircle, 
    FileText, Scale, Ban, Bell 
} from 'lucide-react';

export const Terms = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const navigate = useNavigate();

    const sections = {
        introduction: {
            title: "Introduction",
            icon: <Gavel size={20} />,
            content: (
                <div className="space-y-6 text-left">
                    <p className="text-slate-600 leading-relaxed">
                        By accessing or using <strong>MediHelp</strong>, you agree to be bound by these Terms and Conditions. These terms govern your use of our voice-assisted healthcare system, health records management, and informational libraries.
                    </p>
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                        <p className="text-sm text-emerald-700 font-bold mb-2">Effective Date:</p>
                        <p className="text-sm text-emerald-600 font-medium">
                            These terms were last updated on April 22, 2026. Continued use of the platform constitutes acceptance of any future updates.
                        </p>
                    </div>
                </div>
            )
        },
        medicalDisclaimer: {
            title: "Medical Disclaimer",
            icon: <AlertCircle size={20} />,
            content: (
                <div className="space-y-4 text-left">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Not a Replacement for Medical Advice</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        MediHelp is an <strong>informational tool</strong>. The AI-driven voice assistant and guidance articles are for educational purposes only.
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Do not use MediHelp for life-threatening emergencies.",
                            "Consult a licensed physician for any medical diagnosis.",
                            "Do not delay seeking professional advice because of something you read or heard on this platform."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 text-sm font-bold">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        userResponsibility: {
            title: "User Responsibilities",
            icon: <UserCheck size={20} />,
            content: (
                <div className="space-y-4 text-left">
                    <p className="text-slate-600 font-medium">To maintain a secure environment, users must:</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-black text-slate-800 text-sm mb-1">Account Security</h4>
                            <p className="text-xs text-slate-500 font-medium">You are responsible for keeping your login credentials confidential. Do not share your account with others.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-black text-slate-800 text-sm mb-1">Accurate Information</h4>
                            <p className="text-xs text-slate-500 font-medium">You must provide truthful and accurate medical data when updating your Health Profile for the best assistance experience.</p>
                        </div>
                    </div>
                </div>
            )
        },
        prohibitedConduct: {
            title: "Prohibited Conduct",
            icon: <Ban size={20} />,
            content: (
                <div className="space-y-4 text-left">
                    <p className="text-slate-600 font-medium">You are strictly prohibited from:</p>
                    <ul className="space-y-3 text-sm text-slate-500 font-bold">
                        <li className="flex items-center gap-3"><div className="w-1 h-1 bg-red-400 rounded-full"/> Attempting to hack or bypass security encryption.</li>
                        <li className="flex items-center gap-3"><div className="w-1 h-1 bg-red-400 rounded-full"/> Using the voice assistant to harass or upload malicious audio.</li>
                        <li className="flex items-center gap-3"><div className="w-1 h-1 bg-red-400 rounded-full"/> Misrepresenting your identity as a medical professional.</li>
                    </ul>
                </div>
            )
        },
        termination: {
            title: "Service Changes",
            icon: <Bell size={20} />,
            content: (
                <div className="space-y-4 text-left">
                    <p className="text-slate-600 leading-relaxed font-medium">
                        We reserve the right to modify, suspend, or terminate the MediHelp service at any time for maintenance, security updates, or violation of these terms.
                    </p>
                </div>
            )
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* Header Area */}
                <div className="flex items-center justify-between mb-10">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:text-emerald-600 transition-all border border-slate-200 shadow-sm cursor-pointer"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Scale size={14} /> Legal Agreement
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm sticky top-10">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4 text-left">Terms Navigator</h2>
                            <nav className="space-y-2">
                                {Object.keys(sections).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveSection(key)}
                                        className={`w-full flex items-center gap-4 px-5 py-5 rounded-[1.5rem] font-black text-sm transition-all cursor-pointer ${
                                            activeSection === key 
                                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' 
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

                    {/* Content Section */}
                    <main className="lg:w-2/3">
                        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden min-h-[300px]">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight text-left">
                                {sections[activeSection].title}
                            </h1>
                            
                            <div className="relative z-10 transition-opacity duration-300">
                                {sections[activeSection].content}
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 px-8 py-6 bg-slate-100/50 rounded-[2rem] border border-slate-200/50">
                            <p className="text-xs text-slate-400 font-bold text-left leading-relaxed">
                                Please review these terms carefully. If you do not agree with any part of these terms, you must immediately stop using the MediHelp platform.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Terms;