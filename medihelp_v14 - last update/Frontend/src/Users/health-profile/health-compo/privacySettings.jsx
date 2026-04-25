import React, { useState } from 'react';
import { 
    Shield, Lock, Eye, EyeOff, Bell, UserCheck, 
    Download, Trash2, Check, ShieldCheck, AlertTriangle,
    RotateCcw, ChevronDown
} from 'lucide-react';

const PrivacySettings = ({ isLoading }) => {
    // State para sa mga privacy switches
    const [settings, setSettings] = useState({
        shareWithDoctors: true,
        showAllergiesOnLockscreen: true,
        anonymousAnalytics: false,
        twoFactorAuth: true,
        emailNotifications: true
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading security settings...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-border pb-6 text-left">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Privacy & Security</h3>
                        <p className="text-sm text-slate-500 font-medium">Control your data and how it's shared</p>
                    </div>
                </div>
                <div className="hidden md:block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                    System Protected
                </div>
            </div>

            {/* Privacy Controls List */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 text-left">Data Permissions</h4>
                
                {/* 1. Share with Doctors */}
                <div className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-5 text-left">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h5 className="font-black text-slate-800 text-lg leading-tight">Share with Providers</h5>
                            <p className="text-sm text-slate-500 font-medium">Allow verified doctors to view your medical history.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggleSetting('shareWithDoctors')}
                        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings.shareWithDoctors ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.shareWithDoctors ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* 2. Emergency Lockscreen */}
                <div className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-5 text-left">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h5 className="font-black text-slate-800 text-lg leading-tight">Emergency Visibility</h5>
                            <p className="text-sm text-slate-500 font-medium">Show allergies and blood type on lockscreen during emergencies.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggleSetting('showAllergiesOnLockscreen')}
                        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings.showAllergiesOnLockscreen ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.showAllergiesOnLockscreen ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* 3. Two-Factor Auth */}
                <div className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-5 text-left">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h5 className="font-black text-slate-800 text-lg leading-tight">Two-Factor Authentication</h5>
                            <p className="text-sm text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggleSetting('twoFactorAuth')}
                        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings.twoFactorAuth ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* Data Retention Card */}
            <div className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-indigo-100 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <RotateCcw size={20} />
                        </div>
                        <div>
                            <h5 className="font-black text-slate-800 text-lg leading-tight">Data Retention</h5>
                            <p className="text-sm text-slate-500 font-medium max-w-md">
                                How long should MediHelp keep your health records if your account becomes inactive?
                            </p>
                        </div>
                    </div>
                    <div className="relative min-w-[200px]">
                        <select 
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                            defaultValue="5years"
                        >
                            <option value="1year">1 Year</option>
                            <option value="3years">3 Years</option>
                            <option value="5years">5 Years (Standard)</option>
                            <option value="10years">10 Years</option>
                            <option value="forever">Forever / Until Deletion</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-6 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50/50 space-y-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
                        <Download size={18} />
                    </div>
                    <div>
                        <h5 className="font-black text-slate-900">Export My Data</h5>
                        <p className="text-xs text-slate-500 font-bold mt-1">Download a copy of your full medical profile in PDF format.</p>
                    </div>
                    <button className="w-full py-3 bg-white border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                        Download PDF
                    </button>
                </div>

                <div className="p-6 border-2 border-rose-50 rounded-[2.5rem] bg-rose-50/20 space-y-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                        <Trash2 size={18} />
                    </div>
                    <div>
                        <h5 className="font-black text-rose-900">Delete Account</h5>
                        <p className="text-xs text-rose-500 font-bold mt-1">Permanently remove all your health records from our servers.</p>
                    </div>
                    <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                        Request Deletion
                    </button>
                </div>
            </div>

            {/* Compliance Note */}
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h5 className="font-black text-indigo-900 leading-none mb-2 text-base">Privacy Compliance</h5>
                    <p className="text-sm text-indigo-800/70 font-medium leading-relaxed">
                        MediHelp follows the **Data Privacy Act of 2012 (RA 10173)**. Your information is encrypted and will never be shared with third parties without your explicit consent.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacySettings;