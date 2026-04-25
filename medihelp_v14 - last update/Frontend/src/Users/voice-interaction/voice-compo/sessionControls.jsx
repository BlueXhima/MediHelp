import React from 'react';
import { 
    Timer, Clock, Save, Calendar, Share2, 
    Printer, Download, Mail, ShieldCheck, 
    History, ExternalLink, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SessionControls = ({ 
    sessionDuration, 
    onSaveSession, 
    onScheduleAppointment, 
    onShareSession 
}) => {
    const navigate = useNavigate();
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
    };

    const actionCards = [
        {
            title: "Save Session",
            desc: "Securely store this consultation in your history.",
            icon: <Save size={20} />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            action: onSaveSession
        },
        {
            title: "Health Library",
            desc: "Explore articles and modules related to your query.",
            icon: <BookOpen size={20} />,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            action: () => navigate('/dashboard/guidance-library')
        },
        {
            title: "Share Insights",
            desc: "Send a secure educational summary via link or email.",
            icon: <Share2 size={20} />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            action: onShareSession
        }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Session Management</h3>
                    <p className="text-sm text-gray-500">Manage your current consultation and next steps.</p>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                        <Timer size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase leading-none">Session Time</p>
                        <p className="text-lg font-mono font-bold text-indigo-700 leading-none mt-1">
                            {formatDuration(sessionDuration)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {actionCards.map((card, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={card.action}
                        className="flex flex-col p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <h4 className="font-bold text-gray-800 mb-1">{card.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                        <div className="mt-auto flex items-center text-[10px] font-bold text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                            Execute Action <ExternalLink size={12} />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Export & Compliance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Export Tools */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Download size={16} /> Quick Export
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all gap-2 shadow-sm">
                            <Download size={18} />
                            <span className="text-[10px] font-bold uppercase">PDF</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all gap-2 shadow-sm">
                            <Printer size={18} />
                            <span className="text-[10px] font-bold uppercase">Print</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all gap-2 shadow-sm">
                            <Mail size={18} />
                            <span className="text-[10px] font-bold uppercase">Email</span>
                        </button>
                    </div>
                </div>

                {/* AES-256 Encryption & Privacy Section */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center gap-5 shadow-xl shadow-slate-200">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck size={32} className="text-emerald-400" />
                        </div>
                        {/* Decorative Pulse Effect */}
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg leading-tight">AES-256 Encrypted</h4>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400 uppercase tracking-tighter">
                                Military Grade
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Your health data and session logs are secured with <span className="text-slate-200 font-semibold">Advanced Encryption Standard 256-bit</span>. 
                            Only authorized keys can decrypt your medical records.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionControls;