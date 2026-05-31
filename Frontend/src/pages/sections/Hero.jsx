import React from 'react';
import { Sparkles, Mic, Search, ShieldCheck, Activity } from "lucide-react";
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ isListening, transcript, onVoiceQuery }) => {
    const navigate = useNavigate();

    return (
        <section className="container relative pt-16 pb-16 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* 1. Background Decor - Dynamic for Dark Mode */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            </div>

            {/* 2. Badge Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
                    AI-Powered Health Education
                </span>
            </div>

            {/* 3. Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-[1.1]">
                Learn Health with <br />
                <span className="text-primary italic">Your Voice.</span>
            </h1>

            <p className="text-lg text-foreground/60 mb-12 max-w-xl mx-auto leading-relaxed">
                Access expert-verified healthcare information instantly. Just speak your questions and let our AI guide your wellness journey.
            </p>

            {/* 4. MAIN INTERACTION: Voice UI */}
            <div className="w-full max-w-2xl mx-auto bg-card rounded-4xl shadow-2xl shadow-primary/5 border border-border p-8 mb-12 transition-all hover:shadow-primary/10">
                <div className="flex flex-col items-center gap-8">
                    {/* Audio Wave Visualizer */}
                    <div className="flex items-center gap-1.5 h-12">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 rounded-full transition-all duration-300 ${
                                    isListening ? 'bg-primary animate-pulse' : 'bg-foreground/10 h-3'
                                }`}
                                style={{ 
                                    height: isListening ? `${20 + Math.random() * 80}%` : '12px',
                                    animationDelay: `${i * 0.1}s` 
                                }}
                            />
                        ))}
                    </div>

                    {/* Dynamic Transcript Box */}
                    <div className="w-full py-4 px-6 bg-foreground/5 rounded-2xl border border-border min-h-20 flex items-center justify-center">
                        <p className={`text-center transition-all ${isListening ? 'text-primary font-medium' : 'text-foreground/40 italic'}`}>
                            "{transcript}"
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className={`gap-3 ${isListening ? 'bg-red-500 hover:bg-red-600 shadow-none' : ''}`}
                            onClick={onVoiceQuery}
                        >
                            <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
                            {isListening ? "Stop & Process" : "Start Voice Query"}
                        </Button>
                        
                        <Button 
                            variant="secondary" 
                            size="lg" 
                            className="gap-2"
                            onClick={() => navigate('/learn')}
                        >
                            <Search size={18} />
                            Browse Library
                        </Button>
                    </div>
                </div>
            </div>

            {/* 5. Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Research Prototype</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-primary" />
                    <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Real-time Analysis</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;