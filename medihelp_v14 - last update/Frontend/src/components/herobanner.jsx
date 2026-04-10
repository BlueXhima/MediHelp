import React from 'react';
import { Mic, ShieldCheck, Sparkles } from "lucide-react";

const HeroBanner = () => {
    return (
        <section className="relative overflow-hidden bg-background border-t py-14 md:py-16 transition-colors duration-500">
            <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
                {/* LEFT SIDE: CSS Blob */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue/20 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-[blob_7s_infinite_alternate] blur-sm"></div>
                    
                    <div className="relative w-48 h-48 md:w-56 md:h-56 bg-card rounded-full shadow-xl flex items-center justify-center border border-border group">
                        <div className="w-full h-full rounded-full bg-primary/5 flex items-center justify-center text-primary relative overflow-hidden">
                            <Mic size={48} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                            <Sparkles size={20} className="absolute top-10 right-10 text-blue animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Content */}
                <div className="flex-grow text-center md:text-left max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                        <ShieldCheck size={12} />
                        HIPAA Compliant Security
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                        Instant Health Guidance,<br />
                        Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue">Your Voice</span>
                    </h2>
                    <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                        Skip the confusion of online forums. Speak your symptoms and get reliable, evidence-based health information instantly.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                        <button className="group relative px-8 py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 overflow-hidden">
                            <Mic size={18} className="relative z-10" />
                            <span className="relative z-10">Start Speaking Now</span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                        
                        <button className="px-8 py-3.5 bg-transparent border border-border text-foreground text-sm font-semibold rounded-full hover:bg-card transition-colors cursor-pointer">
                            Explore Resources
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes blob {
                    0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                    100% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
                }
            `}} />
        </section>
    );
};

export default HeroBanner;