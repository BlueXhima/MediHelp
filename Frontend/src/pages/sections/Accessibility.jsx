import React from 'react';
import { Eye, Mic, Smartphone, MessageSquareText, ShieldCheck } from "lucide-react";

const Accessibility = () => {
    const features = [
        {
            icon: <Mic className="w-5 h-5" />,
            title: "Voice-First Navigation",
            desc: "Designed for users who prefer speaking over typing, making health info reachable for all."
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: "High Contrast Support",
            desc: "Optimized for visual clarity with deep blacks and vibrant purples for better readability."
        },
        {
            icon: <MessageSquareText className="w-5 h-5" />,
            title: "Multi-language AI",
            desc: "Understandable health guidance in both Tagalog and English to bridge language gaps."
        }
    ];

    return (
        <section className="container py-14 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10" />

            <div className="flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Side: Dynamic Visual Container */}
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                    <div className="relative group">
                        {/* Main Decorative Card */}
                        <div className="relative z-10 bg-card border border-border p-8 rounded-[40px] shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <ShieldCheck size={120} className="text-primary" />
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 animate-pulse">
                                    <div className="w-3 h-3 rounded-full bg-success" />
                                    <span className="text-xs font-bold uppercase tracking-tighter text-foreground/40">AI Accessibility Active</span>
                                </div>
                                
                                <div className="p-6 rounded-3xl bg-foreground/5 border border-border">
                                    <p className="text-lg font-medium text-foreground italic leading-relaxed">
                                        "Making healthcare information accessible isn't just a feature; it's our commitment to the community."
                                    </p>
                                </div>

                                {/* Floating Feature Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                                        <Smartphone size={18} className="text-primary" />
                                        <span className="text-xs font-bold">Mobile Ready</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                                        <Mic size={18} className="text-primary" />
                                        <span className="text-xs font-bold">Voice UI</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back Decorative Layers */}
                        <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/5 border border-primary/10 rounded-[40px] -z-10 group-hover:-bottom-6 group-hover:-right-6 transition-all duration-500" />
                    </div>
                </div>

                {/* Right Side: Text Content */}
                <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Inclusivity</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                        Health for <br />
                        <span className="text-primary">Everyone, Everywhere.</span>
                    </h2>

                    <p className="text-lg text-foreground/60 leading-relaxed">
                        We believe that medical information should be easily accessible to everyone. This is why MediHelp was developed with a focus on accessibility for the elderly and people with disabilities.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 pt-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-foreground/5 transition-colors group">
                                <div className="mt-1 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{feature.title}</h4>
                                    <p className="text-sm text-foreground/50 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Accessibility;