import React from 'react';
import { BookOpen, Brain, Heart, Zap } from 'lucide-react';

const Overview = () => {
    const stats = [
        { label: "Verified Articles", value: "500+", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Health Topics", value: "20+", icon: <Brain className="w-5 h-5" /> },
        { label: "Accuracy Rate", value: "98%", icon: <Zap className="w-5 h-5" /> },
    ];

    return (
        <section className="container py-14 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Side: Text Content */}
                <div className="space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">System Overview</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                        Bridging the Gap in <br />
                        <span className="text-primary">Health Literacy.</span>
                    </h2>
                    
                    <p className="text-lg text-foreground/60 leading-relaxed">
                        MediHelp was developed to provide fast and reliable medical information using cutting-edge AI technology. Our goal is to make healthcare education accessible to every Filipino through voice commands and a simple interface.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-card border border-border">
                                <div className="text-primary mb-2">{stat.icon}</div>
                                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                                <div className="text-xs text-foreground/50 uppercase font-bold tracking-tighter">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Graphic / Feature Card */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                    <div className="bg-card border border-border p-8 rounded-[40px] shadow-2xl relative">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">User-Centric Design</h4>
                                    <p className="text-xs text-foreground/60">Tailored for ease of use and accessibility.</p>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-2xl bg-foreground/5 border border-border italic text-foreground/70 text-sm leading-relaxed">
                                "The goal of MediHelp is to empower individuals with knowledge, ensuring that health information is just one voice command away."
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Overview;