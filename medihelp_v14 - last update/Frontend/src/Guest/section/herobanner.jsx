import React from 'react';
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FullBleedCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 bg-card overflow-hidden group">
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* Badge - Adaptive Colors */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full 
                    bg-primary backdrop-blur-md 
                    border border-white/30 dark:border-white/10 
                    text-white text-[10px] font-bold tracking-widest uppercase">
                    <Sparkles size={12} className="text-white" />
                    Start Your Journey
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
                    Take control of your health <br className="hidden md:block" /> 
                    with one simple conversation.
                </h2>

                {/* Supporting Line */}
                <p className="text-lg md:text-xl text-slate-400 font-base mb-10 max-w-2xl mx-auto">
                    Join thousands of users who trust MediHelp for clear, fast, and accurate health guidance every single day.
                </p>

                {/* Prominent CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="group w-full sm:w-auto px-10 py-5 
                            bg-white dark:bg-primary text-primary dark:text-white 
                            text-base font-bold rounded-full 
                            hover:shadow-2xl hover:shadow-white/20 dark:hover:shadow-primary/40 
                            transition-all transform hover:-translate-y-1 cursor-pointer 
                            flex items-center justify-center gap-3"
                    >
                        Get Started Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                    <p className="text-white/60 dark:text-slate-500 text-xs font-semibold uppercase tracking-widest">
                        Free access during alpha phase
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FullBleedCTA;