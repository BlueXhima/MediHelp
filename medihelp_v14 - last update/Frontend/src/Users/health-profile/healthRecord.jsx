import React from 'react';
import { ArrowLeft, ShieldCheck, Download, Share2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import MedicalRecord from '../health-profile/health-compo/medicalRecord';

const HealthRecord = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-4 pt-24">
                
                {/* Upper Navigation & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:text-blue-600 transition-all border border-slate-200/60 shadow-sm hover:shadow-md cursor-pointer"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm" title="Share Record">
                            <Share2 size={18} />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                            <Download size={18} className="text-blue-500" />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Main Header Card with Glassmorphism */}
                <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 mb-10 shadow-xl shadow-slate-200/40">
                    {/* Decorative Background Blur */}
                    <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                <Clock size={12} />
                                Last Updated: April 2026
                            </div>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 flex items-center justify-center">
                                    <ShieldCheck size={38} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Health Record</h1>
                                    <p className="text-slate-500 font-medium mt-1 max-w-md">
                                        Your comprehensive medical history, encrypted and accessible only by you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats or Status */}
                        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Security Status</p>
                                <span className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    Verified Secure
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm p-2 md:p-6">
                        <MedicalRecord isLoading={false} />
                    </div>
                    
                    {/* Footer Note */}
                    <p className="text-center text-slate-400 text-xs font-medium pb-4">
                        All medical data is stored according to health privacy standards. 
                        Need help? <span className="text-blue-500 hover:underline cursor-pointer">Contact Support</span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default HealthRecord;