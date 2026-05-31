import React from 'react';
import { Mic, Zap, Search, ShieldCheck, Star } from "lucide-react";

const CoreFeatures = () => {
    const features = [
        { 
            icon: <Mic className="w-6 h-6" />, 
            title: "Natural Language", 
            desc: "Speak naturally in Tagalog or English to get expert health info instantly." 
        },
        { 
            icon: <Zap className="w-6 h-6" />, 
            title: "Instant Analysis", 
            desc: "Our AI processes symptoms and provides actionable insights in seconds." 
        },
        { 
            icon: <Search className="w-6 h-6" />, 
            title: "Verified Sources", 
            desc: "Every piece of information is cross-referenced with trusted medical databases." 
        },
        { 
            icon: <ShieldCheck className="w-6 h-6" />, 
            title: "Privacy First", 
            desc: "Your health queries are encrypted and processed with the highest security." 
        }
    ];

    return (
        <section className="container py-14 relative overflow-hidden">
            {/* Background Glow Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />

            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                    <Star size={12} className="text-primary fill-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Platform Capabilities
                    </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                    Smart Features for <br />
                    <span className="text-primary italic">Better Health Literacy.</span>
                </h2>
                
                <p className="text-lg text-foreground/60 leading-relaxed">
                    Explore the advanced tools we've integrated to make medical information 
                    more accessible, accurate, and easy to understand for everyone.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <div 
                        key={i} 
                        className="p-8 rounded-[32px] bg-card border border-border card-hover group animate-fade-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Icon Container with Subtle Glow[cite: 11, 15] */}
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            {f.icon}
                        </div>

                        <h4 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-glow transition-all">
                            {f.title}
                        </h4>

                        <p className="text-sm text-foreground/50 leading-relaxed">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CoreFeatures;