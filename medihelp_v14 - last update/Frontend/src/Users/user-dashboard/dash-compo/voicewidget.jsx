import { useState } from 'react';
import { Mic, MicOff, Pill, Thermometer, Heart, Shield, Sparkles, Activity, Brain } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistantWidget = () => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    return (
        <div className="relative mb-8">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 md:p-12 overflow-hidden">
                
                {/* Top Section: Header & Branding */}
                <div className="text-center mb-10 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-2">
                        <Sparkles size={14} /> AI Voice Assistant
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground">
                        How can I <span className="text-primary text-glow">help</span> you today?
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                        Ask about symptoms, medications, or general health. I'm here to provide 
                        <span className="text-foreground font-bold italic"> real-time medical guidance</span>.
                    </p>
                </div>

                {/* Middle Section: Microphone & Sound Waves */}
                <div className="flex flex-col items-center justify-center mb-12">
                    <div className="relative">
                        {/* Animated Sound Wave Rings */}
                        <AnimatePresence>
                            {isListening && (
                                <>
                                    <motion.div 
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{ scale: 2, opacity: 0.2 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 bg-primary rounded-full"
                                    />
                                    <motion.div 
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{ scale: 2.5, opacity: 0.1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                        className="absolute inset-0 bg-primary rounded-full"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        {/* Main Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleListening}
                            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer shadow-2xl ${
                                isListening
                                    ? 'bg-primary text-white shadow-primary/40'
                                    : 'bg-card border-4 border-border text-primary hover:border-primary/30'
                            }`}
                        >
                            {isListening ? (
                                <div className="flex flex-col items-center">
                                    <Mic size={32} className="animate-bounce" />
                                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Listening</span>
                                </div>
                            ) : (
                                <MicOff size={32} className="opacity-50" />
                            )}
                        </motion.button>
                    </div>

                    {/* Status Text */}
                    <div className="mt-12 flex items-center gap-2">
                        <Activity size={14} className={isListening ? "text-primary animate-pulse" : "text-muted-foreground opacity-30"} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            {isListening ? "Processing Audio Signal" : "Voice Control Off"}
                        </span>
                    </div>
                </div>

                {/* Bottom Section: Quick Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: <Thermometer size={16} />, label: "Symptom Check" },
                        { icon: <Pill size={16} />, label: "Medication Info" },
                        { icon: <Heart size={16} />, label: "Wellness Tips" },
                        { icon: <Brain size={16} />, label: "Mental Health" }
                    ].map((btn, idx) => (
                        <button 
                            key={idx}
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-secondary/30 hover:bg-primary hover:text-white rounded-2xl border border-border/50 text-[10px] font-black uppercase tracking-widest transition-all duration-300 group cursor-pointer"
                        >
                            <span className="group-hover:scale-110 transition-transform">{btn.icon}</span>
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Disclaimer: Redesigned as a Clean Footer */}
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-[24px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Shield size={18} className="text-amber-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Medical Disclaimer</p>
                            <p className="text-[14px] text-amber-700/70 font-medium leading-relaxed italic">
                                MediHelp provides general information only. This is not a substitute for professional medical advice. 
                                In case of emergency, please contact local emergency services immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistantWidget;