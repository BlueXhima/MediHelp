import React from 'react';
import { Ribbon, HeartPlus, Brain, ArrowRight } from "lucide-react";

const KnowledgeHub = () => {
    const resources = [
        {
            title: "Cancer Awareness",
            desc: "Learn about prevention, screening, and support resources for various conditions.",
            icon: <Ribbon className="text-orange-500 group-hover:scale-110 transition-transform duration-300" size={32} />,
            color: "orange",
            accent: "bg-orange-400"
        },
        {
            title: "Heart Health",
            desc: "Keep your heart strong with expert-backed tips on diet and risk management.",
            icon: <HeartPlus className="text-blue-500 group-hover:scale-110 transition-transform duration-300" size={32} />,
            color: "blue",
            accent: "bg-blue-400"
        },
        {
            title: "Mental Wellness",
            desc: "Resources to support your emotional well-being and stress management.",
            icon: <Brain className="text-purple-500 group-hover:scale-110 transition-transform duration-300" size={32} />,
            color: "purple",
            accent: "bg-purple-400"
        }
    ];

    return (
        <section className="bg-card py-24 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-16">
                    <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Trusted Knowledge Hub</h3>
                    <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                        Expert-reviewed medical information to help you understand your health journey better.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {resources.map((item, idx) => (
                        <div 
                            key={idx}
                            className="relative group bg-card rounded-[2rem] overflow-hidden border border-border/50 
                                hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-2xl 
                                backdrop-blur-xl flex flex-col h-full"
                        >
                            {/* Animated Top Bar */}
                            <div className={`h-1.5 ${item.accent} w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                            <div className={`h-1.5 ${item.accent} opacity-20 w-full absolute top-0`}></div>

                            <div className="p-10 text-left flex flex-col h-full">
                                <div className="mb-6 p-4 rounded-2xl bg-card border border-border/50 inline-flex w-fit shadow-inner group-hover:shadow-md transition-all duration-300">
                                    {item.icon}
                                </div>
                                
                                <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h4>
                                
                                <p className="text-foreground/70 text-base mb-8 leading-relaxed flex-grow">
                                    {item.desc}
                                </p>
                                
                                <a 
                                    href="#" 
                                    className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest group/link"
                                >
                                    <span className="relative">
                                        Read Guide
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300"></span>
                                    </span>
                                    <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform duration-300" />
                                </a>
                            </div>

                            {/* Hover Decorative Glow */}
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KnowledgeHub;