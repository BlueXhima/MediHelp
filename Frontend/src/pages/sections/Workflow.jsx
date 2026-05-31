import React from 'react';
import { ArrowRight, Mic, Cpu, GraduationCap } from "lucide-react";

const HowItWorks = () => {
    const steps = [
        { 
            num: "01", 
            icon: <Mic className="w-6 h-6" />,
            title: "Voice Input", 
            desc: "Press the microphone and state your concern naturally." 
        },
        { 
            num: "02", 
            icon: <Cpu className="w-6 h-6" />,
            title: "AI Processing", 
            desc: "MediHelp analyzes the context of your query using advanced AI." 
        },
        { 
            num: "03", 
            icon: <GraduationCap className="w-6 h-6" />,
            title: "Get Educated", 
            desc: "Receive expert-verified and easy-to-understand health guidance." 
        }
    ];

    return (
        <section className="container py-14 relative overflow-hidden">
            {/* Header Area */}
            <div className="text-center max-w-2xl mx-auto mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        The Process
                    </span>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4">Seamless Experience.</h2>
                <p className="text-foreground/60">
                    Getting medical insights has never been this simple. Follow these three steps to start your journey.
                </p>
            </div>

            {/* Steps Container */}
            <div className="relative flex flex-col md:flex-row gap-8 justify-center items-start">
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[2px] -z-0">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    
                    {/* Moving Light Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />
                </div>

                {steps.map((s, i) => (
                    <div key={i} className="flex-1 w-full group relative">
                        <div className="flex flex-col items-center text-center">
                            {/* Number & Icon Circle */}
                            <div className="relative mb-8">
                                <div className="text-7xl font-black text-primary/5 absolute -top-10 left-1/2 -translate-x-1/2 group-hover:text-primary/10 transition-all duration-500">
                                    {s.num}
                                </div>
                                <div className="w-20 h-20 rounded-[28px] bg-background border border-border shadow-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 relative z-10">
                                    {s.icon}
                                </div>
                                
                                {/* Pulse Effect */}
                                <div className="absolute inset-0 bg-primary/20 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                            </div>

                            {/* Text Content */}
                            <h4 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                {s.title}
                            </h4>
                            <p className="text-sm text-foreground/50 leading-relaxed max-w-[250px]">
                                {s.desc}
                            </p>

                            {/* Connector Arrow (Mobile Only) */}
                            {i < steps.length - 1 && (
                                <ArrowRight className="md:hidden mt-8 text-border animate-bounce rotate-90" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;