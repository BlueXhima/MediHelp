import React from 'react';
import { motion } from 'framer-motion';
import { 
    Mic, Volume2, Sparkles, ShieldCheck, 
    ChevronRight, ArrowRight, Smartphone, ArrowDown, X 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';

// Import ang iniwalay nating malinis na decoupled function hook
import { useVoiceSimulator } from '../hooks/useVoiceSimulator'; 
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const HowItWorks = () => {
    const {
        engineStatus,
        transcript,
        aiResponse,
        voiceExamples, // Kunin ang data array mula sa hook
        handleSelectExample,
        handleMicToggle,
        resetSimulator
    } = useVoiceSimulator();
    useDocumentTitle('How It Works');
    const navigate = useNavigate();

    const steps = [
        {
            number: "01",
            title: "Press the Microphone",
            tagline: "Tap to Activate",
            description: "Simply click the purple floating mic button or speak the activation hotword. Our smart engine will automatically begin listening to your voice.",
            icon: Mic,
            accent: "from-purple-500/10 to-indigo-500/5",
            iconColor: "text-primary"
        },
        {
            number: "02",
            title: "Describe Symptoms or Questions",
            tagline: "Natural Voice Query",
            description: "Speak naturally in your preferred language or dialect. You can ask about medications, disease definitions, or explain what symptoms you feel.",
            icon: Volume2,
            accent: "from-blue-500/10 to-purple-500/5",
            iconColor: "text-blue-500"
        },
        {
            number: "03",
            title: "Receive Instant AI Summary",
            tagline: "Instant Audio Feedback",
            description: "MediHelp AI generates a clear and easy-to-understand medical information breakdown, which the system can read aloud for accessible learning.",
            icon: Sparkles,
            accent: "from-emerald-500/10 to-teal-500/5",
            iconColor: "text-emerald-500"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
                
                {/* HERO OVERVIEW */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6"
                    >
                        <Sparkles size={12} className="animate-pulse" /> Platform Walkthrough
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-6 uppercase"
                        style={{ fontFamily: "'Unesa', sans-serif" }}
                    >
                        How Does <span className="text-primary text-glow">MediHelp</span> Work?
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-foreground/60 text-sm md:text-base font-medium leading-relaxed"
                    >
                        MediHelp is an advanced Voice-Assistant Healthcare Information Platform built to make medical data extraction simple and accessible. Using just your voice, you can access health updates, symptom insights, and drug details without any complicated manual navigation.
                    </motion.p>
                </div>

                {/* THE 3-STEP FLOW LAYOUT */}
                <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                            <motion.div 
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-linear-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-xl bg-foreground/5 ${step.iconColor} group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300`}>
                                                <StepIcon size={24} />
                                            </div>
                                            <span className="text-4xl font-black text-foreground/10 tracking-tighter group-hover:text-primary/20 transition-colors">
                                                {step.number}
                                            </span>
                                        </div>

                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                            {step.tagline}
                                        </p>
                                        <h3 className="text-lg font-bold tracking-tight text-foreground mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-foreground/50 text-xs leading-relaxed font-medium">
                                            {step.description}
                                        </p>
                                    </div>

                                    {index < 2 && (
                                        <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center bg-card border border-border rounded-full text-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                            <ChevronRight size={14} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* TWO-COLUMN FEATURE SHOWCASE WITH SIMULATOR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-border pt-20">
                    
                    {/* Left: Console Sandbox Terminal UI */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${engineStatus !== 'idle' ? 'bg-purple-500 animate-ping' : 'bg-emerald-500'}`} />
                                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-foreground/50">
                                        Status: {engineStatus}
                                    </span>
                                </div>
                                {engineStatus !== 'idle' && (
                                    <button onClick={resetSimulator} className="text-foreground/40 hover:text-red-500 transition-colors cursor-pointer">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="bg-background/80 border border-border/60 rounded-xl p-5 min-h-55 flex flex-col justify-between items-center relative">
                                <div className="w-full text-center space-y-3 my-auto">
                                    {engineStatus === 'idle' && (
                                        <>
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                onClick={handleMicToggle}
                                                className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all shadow-md"
                                            >
                                                <Mic size={24} />
                                            </motion.div>
                                            <p className="text-[10px] uppercase font-extrabold tracking-widest text-primary">Tap Mic to Test</p>
                                        </>
                                    )}

                                    {engineStatus === 'listening' && (
                                        <div className="space-y-4 w-full">
                                            <div className="flex justify-center items-end gap-1 h-6">
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        animate={{ height: [8, 24, 8] }}
                                                        transition={{ repeat: Infinity, duration: 0.5 + (i * 0.15), ease: "easeInOut" }}
                                                        className="w-1 bg-primary rounded-full"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-foreground/80 font-mono bg-card p-3 rounded-lg border border-border/40 text-left wrap-break-word">
                                                {transcript || 'Awaiting input...'}
                                            </p>
                                        </div>
                                    )}

                                    {engineStatus === 'processing' && (
                                        <div className="space-y-2">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="text-[11px] font-mono text-foreground/40">Analyzing parameters via NLP...</p>
                                        </div>
                                    )}

                                    {engineStatus === 'speaking' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left space-y-3 w-full">
                                            <div className="flex items-center gap-2 text-primary">
                                                <Volume2 size={16} className="animate-bounce" />
                                                <span className="text-[10px] uppercase font-black tracking-wider">MediHelp Audio Output Playing</span>
                                            </div>
                                            <p className="text-xs text-foreground/70 leading-relaxed bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                {aiResponse}
                                            </p>
                                            <p className="text-[9px] uppercase tracking-wider font-extrabold text-foreground/30 text-right animate-pulse">
                                                Auto-closing console upon completion...
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Details & Interactive Badge Grid */}
                    <div className="lg:col-span-7 space-y-6 lg:pl-6">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-md">
                            <ShieldCheck size={12} /> Tech Integration
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
                            Engineered with Modern NLP and Natural Language Synthesis
                        </h2>
                        <p className="text-foreground/50 text-xs md:text-sm leading-relaxed font-medium">
                            Our architecture ensures localized language contexts and raw audio speech streams are computed accurately. Users do not need to memorize or type complex medical jargon to find answers.
                        </p>

                        <div className="pt-2">
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-1.5">
                                <ArrowDown size={12} /> Click any example below to simulate the engine workflow:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {voiceExamples.map((ex, i) => (
                                    <button 
                                        key={i} 
                                        disabled={engineStatus !== 'idle'}
                                        onClick={() => handleSelectExample(ex)} // Ipinapasa na natin ang buong object kasama ang answer
                                        className="bg-card border border-border rounded-xl px-4 py-2.5 text-xs font-semibold hover:border-primary/40 transition-colors text-foreground/80 hover:text-primary flex items-center gap-2 group shadow-xs disabled:opacity-30 disabled:pointer-events-none text-left cursor-pointer"
                                    >
                                        <span>{ex.phrase}</span>
                                        <span className="text-[9px] bg-foreground/5 text-foreground/40 px-1.5 py-0.5 rounded-sm group-hover:bg-primary/10 group-hover:text-primary whitespace-nowrap">
                                            {ex.cat}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button 
                                variant="primary" 
                                type="elevated" 
                                size="md" 
                                trailingIcon={ArrowRight}
                                onClick={() => navigate('/login')}
                                className="rounded-full"
                            >
                                Get Started Now
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HowItWorks;