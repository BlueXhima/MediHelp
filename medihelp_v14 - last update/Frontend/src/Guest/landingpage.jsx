import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import HeroBanner from './section/herobanner';
import Overview from './section/overview';
import Prevention from './section/prevention';
import Library from './section/knowledge';
import Workflow from './section/workflow';
import Testimonials from './section/testimonial';
import FAQ from './section/faq';
import PageEnd from '../components/footer';
import { Check, TriangleAlert, UtensilsCrossed, Dumbbell, 
    AlarmClock, Leaf, Ribbon, HeartPlus, Brain, CheckCircle2, X, ShieldCheck,
    Mic, Sparkles, Terminal, Stethoscope, Settings, Activity } from "lucide-react";
import { cn } from '../lib/utils';

import HIPAACert from '../assets/HIPAACert.jpg';
import { useChatMessages } from '../hooks/useChatMessage';
import SettingsModal from './guest-compo/settingsmodal';
import BackgroundLoadingState from '../components/BackgroundLoadingState';
import ToastMessage, { showToast } from '../components/ToastMessage';
import PreLoader from './PreLoader';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [transcript, setTranscript] = useState("Tap the button below to start your health query...");
    const [isAppLoading, setIsAppLoading] = useState(() => {
        return !sessionStorage.getItem('hasLoaded');
    });

    const toggleListening = () => {
        setIsListening(!isListening);
        
        if (!isListening) {
            setTranscript("I've been feeling a sharp pain in my lower back for the past two days...");
        } else {
            console.log("Stopped listening.");
        }
    };

    const handleVoiceSequence = () => {
        if (!isListening) {
            // Start Listening
            setIsListening(true);
            setTranscript("I've been feeling a sharp pain in my lower back...");
        } else {
            // Stop Listening and Start Processing
            setIsListening(false);
            setIsLoading(true); // Trigger BackgroundLoadingState

            // Simulate API Processing Delay
            setTimeout(() => {
                setIsLoading(false);
                showToast("Analysis Complete! Redirecting to your guidance...", "success");
                
                // Redirect pagkatapos ng maikling sandali para mabasa ang toast
                setTimeout(() => {
                    navigate('/chat-response'); // Ang path ng bago mong page
                }, 1500);
            }, 3000);
        }
    };

    useEffect(() => {
        // Kung wala pang 'hasLoaded', mag-timer tayo
        if (!sessionStorage.getItem('hasLoaded')) {
            const timer = setTimeout(() => {
                setIsAppLoading(false);
                sessionStorage.setItem('hasLoaded', 'true'); // I-save na tapos na
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            // Kung nanggaling na sa ibang page o nag-back, wag na mag-load
            setIsAppLoading(false);
        }
    }, []);

    if (isAppLoading) {
        return <PreLoader />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">

            <Navbar />
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
            />
            <ToastMessage />
            <BackgroundLoadingState isLoading={isLoading} message="Analyzing your symptoms..." />

            <main className="pt-14">
                <section className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900 dark:to-accent-900 min-h-screen flex items-center">
                    {/* Hero Section */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                                    <Sparkles size={16} className="text-primary animate-pulse" />
                                    <span className="text-xs font-bold tracking-widest uppercase text-primary">Next-Gen Health Assistant</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                                    Get Medical Answers <span className="text-primary italic">Instantly</span> with Voice
                                </h1>
                                <p className="text-xl text-foreground/70 mb-8 max-w-2xl">
                                    Skip the wait — speak your symptoms and get reliable health guidance in seconds, 24/7.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
                                    <button
                                        onClick={() => navigate('/login')}
                                        text="Navigate to Login"
                                        aria-label="Navigate to Login"
                                        className="group relative inline-flex items-center justify-center bg-primary hover:bg-primary/80 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1 active:scale-95 overflow-hidden cursor-pointer w-full sm:w-auto"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <span className="relative z-10 flex items-center gap-2">
                                            Start your 7-Day Free Trial <Check size={20} />
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setShowDemoModal(true)}
                                        className="inline-flex items-center justify-center bg-transparent border-2 border-border text-primary hover:text-primary-foreground font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                                    >
                                        Try Voice Demo
                                    </button>
                                </div>

                                {/* Modernized Security & Trust Bar */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-black text-foreground">2.8k+</span>
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Queries Today</span>
                                    </div>
                                    
                                    <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                                    
                                    <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-2xl border border-border">
                                        <ShieldCheck className="text-blue-600" size={24} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold uppercase tracking-tighter text-blue-400 leading-none">Data Safety</p>
                                            <p className="text-sm font-bold text-foreground">AES-256 Encrypted</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-2xl border border-border">
                                        <Terminal className="text-slate-500" size={20} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 leading-none">Project Status</p>
                                            <p className="text-sm font-bold text-foreground italic">Research Prototype</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="relative group">
                                {/* Guidance Ready Notification - Floating Top Right */}
                                <div className="absolute -top-6 -right-6 z-40 bg-card p-3 pr-6 rounded-2xl shadow-xl border border-border flex items-center gap-3 animate-bounce-slow">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                        <Activity size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-bold text-foreground leading-none">Guidance Ready</p>
                                        <p className="text-[10px] text-foreground/50">Immediate Action Advised</p>
                                    </div>
                                </div>

                                {/* Main Interaction Card */}
                                <div className="bg-card rounded-[40px] shadow-2xl p-10 border border-border/40 min-h-[500px] flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                                <Stethoscope size={24} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-bold text-lg text-foreground leading-none">Medi</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {isListening ? "Listening..." : "Idle"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setShowSettings(true)}
                                            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            <Settings size={22} />
                                        </button>
                                    </div>

                                    {/* Audio Waveform Area */}
                                    <div className="flex items-center justify-center py-14">
                                        <div className="flex items-end gap-1.5 h-16">
                                            {[...Array(12)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "w-1.5 bg-primary/40 rounded-full transition-all duration-300",
                                                        isListening ? "animate-bounce" : "h-4"
                                                    )}
                                                    style={{ 
                                                        height: isListening ? `${Math.random() * 100 + 20}%` : "16px",
                                                        animationDelay: `${i * 0.1}s` 
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transcript Box */}
                                    <div className="bg-slate-200 rounded-xl p-6 mb-8 border text-left">
                                        <p className="text-slate-600 italic text-md leading-relaxed">
                                            "{transcript}"
                                        </p>
                                    </div>

                                    {/* Footer Stats & Button */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between px-2">
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Duration</p>
                                                <p className="text-lg font-bold text-blue-600">0:42s</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence</p>
                                                <p className="text-lg font-bold text-purple-500">98%</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleVoiceSequence}
                                            className={cn(
                                                "w-full py-4 rounded-2xl font-bold cursor-pointer flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl",
                                                isListening 
                                                    ? "bg-red-500 text-white shadow-red-500/20" 
                                                    : "bg-primary text-white shadow-blue-600/20 hover:bg-primary/80"
                                            )}
                                        >
                                            <Mic size={20} />
                                            {isListening ? "Stop Speaking" : "Start Speaking for Voice Query"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* High-level overview of MediHelp's Value Proposition */}
                <Overview />

                {/* Other HomePage Sections */}
                <Prevention />

                {/* Refactored Resources Library */}
                <Library />
                
                {/* Timeline / FAQ (Optional) Sections*/}
                <Workflow />

                <Testimonials />

                <FAQ />

                {/* Hero-Banner Section */}
                <HeroBanner />

                {/* Footer Section */}
                <PageEnd />
            </main>
        </div>
    );
};

export default LandingPage;