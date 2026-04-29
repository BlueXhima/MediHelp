import React, { useState, useEffect } from 'react';
import { Stethoscope } from "lucide-react";

const PreLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Bigyan ng konting delay (500ms) pagka-100% bago i-close
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 500);
                    return 100;
                }
                return prev + 5; // Bibilis ang loading pero sync sa finish
            });
        }, 100); 

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500">
            <div className="flex flex-col items-center w-full max-w-[250px]">
                
                {/* 1. Stethoscope Icon - Scaled up and Pulsing */}
                <div className="relative mb-4 text-primary animate-pulse">
                    <Stethoscope size={150} strokeWidth={1.2} />
                    <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full"></div>
                </div>

                {/* 2. Compact Loading Progress Bar */}
                <div className="w-full max-w-[280px] space-y-3">
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-200 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        {Math.round(progress)}%
                    </p>
                </div>

                {/* 3. MediHelp Brand Name */}
                <div className="mt-2">
                    <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase opacity-90">
                        Medi<span className="text-primary">Help</span>
                    </h1>
                </div>

            </div>
        </div>
    );
};

export default PreLoader;