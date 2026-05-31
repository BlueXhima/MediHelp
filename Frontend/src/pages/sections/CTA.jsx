import React from 'react';
import { ArrowRight, Sparkles } from "lucide-react";
import Button from '../../components/ui/Button';

const CTA = () => {
    return (
        <section className="container py-16 relative px-6">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[48px] bg-gradient-to-br from-primary/20 via-card to-background border border-primary/20">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10" />

                <div className="relative z-10 px-8 py-14 md:py-18 flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-bounce">
                        <Sparkles size={14} className="text-primary fill-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Get Started Now
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tight max-w-4xl leading-[1.1]">
                        Ready to experience the <br />
                        <span className="text-primary italic">future of healthcare?</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-lg text-foreground/60 max-w-2xl mb-12 leading-relaxed">
                        Join thousands of Filipinos who are taking control of their health literacy 
                        with the power of AI. It’s fast, free, and accessible to everyone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Button 
                            className="px-10 py-6 rounded-2xl text-lg font-bold group shadow-xl shadow-primary/20"
                            variant="primary"
                        >
                            Start Consulting
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Button>
                        
                        <button className="px-10 py-6 rounded-2xl text-lg font-bold text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all">
                            View Documentation
                        </button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="mt-12 flex items-center gap-2 text-xs font-medium text-foreground/40">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <span>Join 500+ active health seekers this week</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;