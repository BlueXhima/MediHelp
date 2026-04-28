import React, { useState, useEffect } from 'react';
import { Stethoscope, ShieldCheck, Activity, Database } from "lucide-react";

const PreLoader = () => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    // Listahan ng status messages para sa mas "high-tech" na feeling
    const statusMessages = [
        { text: "Initializing Systems...", icon: <Activity size={14} /> },
        { text: "Securing Connection (AES-256)...", icon: <ShieldCheck size={14} /> },
        { text: "Syncing Medical Databases...", icon: <Database size={14} /> },
        { text: "Ready to Assist", icon: <Stethoscope size={14} /> }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; 
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Effect para mag-rotate ang status messages base sa progress
    useEffect(() => {
        if (progress < 30) setStatusIndex(0);
        else if (progress < 60) setStatusIndex(1);
        else if (progress < 90) setStatusIndex(2);
        else setStatusIndex(3);
    }, [progress]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
            {/* Background Decoration - Soft Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="flex flex-col items-center max-w-sm w-full px-10 relative z-10">
                
                {/* 1. Enhanced Icon with Multi-layer Glow */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 rounded-[2rem] bg-primary/20 animate-ping opacity-75"></div>
                    <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/10 blur-xl animate-pulse"></div>
                    
                    <div className="relative bg-gradient-to-br from-primary to-blue-700 p-6 rounded-[2rem] shadow-2xl shadow-primary/40 border border-white/20">
                        <Stethoscope size={48} className="text-white animate-bounce-slow" />
                    </div>
                </div>

                {/* 2. Brand Identity */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground">
                        Medi<span className="text-primary italic">Help</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Research Prototype v1.0
                        </p>
                    </div>
                </div>

                {/* 3. Modern Loading Bar with Percentage */}
                <div className="w-full space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 text-primary animate-pulse">
                            {statusMessages[statusIndex].icon}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {statusMessages[statusIndex].text}
                            </span>
                        </div>
                        <span className="text-[12px] font-mono font-bold text-slate-500">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full p-0.5 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                        <div 
                            className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                            style={{ 
                                width: `${progress}%`,
                                backgroundSize: '200% 100%'
                            }}
                        ></div>
                    </div>
                </div>

                {/* 4. Bottom Security Tag */}
                <div className="absolute bottom-[-100px] flex items-center gap-2 opacity-50">
                    <ShieldCheck size={12} className="text-slate-400" />
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.1em]">
                        On-Device Encryption Active
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PreLoader;