import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import HeroBanner from '../components/herobanner';
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

const LandingPage = () => {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [transcript, setTranscript] = useState("Tap the button below to start your health query...");

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
                <section className="bg-card py-20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-2xl text-left">
                                <span className="text-primary font-bold tracking-wider uppercase text-sm">The Problem</span>
                                <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                    Healthcare shouldn't be <br/> <span className="text-primary/60 italic">this complicated.</span>
                                </h2>
                            </div>
                            <p className="text-foreground/70 text-lg max-w-sm pb-2">
                                We're bridging the gap between your symptoms and the clarity you deserve.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Main Pain Point */}
                            <div className="md:col-span-7 bg-red-50 dark:bg-red-950/20 p-10 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col justify-between min-h-[320px]">
                                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                    <AlarmClock size={30} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">The 3-Week Wait Gap</h3>
                                    <p className="text-foreground/80 text-lg">Traditional scheduling leaves you in a state of anxiety. MediHelp provides the "right now" answers you need while waiting for your specialist.</p>
                                </div>
                            </div>

                            {/* Side Pain Points */}
                            <div className="md:col-span-5 space-y-6">
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-8 rounded-3xl border border-yellow-100 dark:border-yellow-900/30">
                                    <TriangleAlert className="text-yellow-600 mb-4" size={28} />
                                    <h4 className="text-xl font-bold mb-2">Information Overload</h4>
                                    <p className="text-sm text-foreground/80">Stop "doom-scrolling" medical forums that only increase your stress levels.</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                    <Brain className="text-blue-600 mb-4" size={28} />
                                    <h4 className="text-xl font-bold mb-2">24/7 Accessibility</h4>
                                    <p className="text-sm text-foreground/80">Health concerns don't follow a 9-to-5 schedule. Neither do we.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Other HomePage Sections */}
                <section className="py-20 bg-background/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                            <div className="text-left max-w-xl">
                                <span className="text-primary font-bold tracking-widest uppercase text-xs">Prevention First</span>
                                <h3 className="text-4xl font-extrabold text-foreground mt-2">Stay Informed, Stay Healthy</h3>
                                <p className="mt-4 text-foreground/70">
                                    Practical habits to prevent health issues before they arise.
                                </p>
                            </div>
                            <button className="mt-6 md:mt-0 px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-all font-medium">
                                View All Tips
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nutrition - Wide Card */}
                            <div className="group p-8 rounded-3xl bg-green-50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-green-900 text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <UtensilsCrossed size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Nutrition & Diet</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Eat balanced meals rich in fiber and vitamins to fuel your recovery.</p>
                                </div>
                            </div>

                            {/* Exercise - Wide Card */}
                            <div className="group p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-blue-900 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Dumbbell size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Active Movement</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Stay active with at least 30 minutes of intentional movement daily.</p>
                                </div>
                            </div>

                            {/* Sleep - Wide Card */}
                            <div className="group p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-purple-900 text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <AlarmClock size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Restful Sleep</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Maintain 7–8 hours of restful sleep to support cognitive health.</p>
                                </div>
                            </div>

                            {/* Lifestyle - Wide Card */}
                            <div className="group p-8 rounded-3xl bg-orange-50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-orange-900 text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Leaf size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Mindful Lifestyle</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Avoid habits like smoking and limit alcohol for long-term wellness.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Refactored Resources Library */}
                <section className="bg-card py-24 relative">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h3 className="text-4xl font-bold mb-12">Trusted Knowledge Hub</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Cancer Awareness */}
                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-orange-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <Ribbon className="text-orange-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Cancer Awareness</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Learn about prevention, screening, and support resources for various conditions.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>

                            {/* Heart Health */}
                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-blue-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <HeartPlus className="text-blue-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Heart Health</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Keep your heart strong with expert-backed tips on diet and risk management.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>

                            {/* Mental Wellness */}
                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-purple-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <Brain className="text-purple-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Mental Wellness</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Resources to support your emotional well-being and stress management.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Timeline / FAQ (Optional) Sections*/}
                <section className="py-24 bg-background">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h3 className="text-4xl font-bold mb-4">Three Steps to Peace of Mind</h3>
                            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="relative">
                            {/* Vertical Line for Desktop */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"></div>

                            <div className="space-y-20">
                                {/* Step 1 */}
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1 text-right hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">01</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Mic size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-2xl font-bold mb-2">Voice Activation</h4>
                                        <p className="text-foreground/70 leading-relaxed">Simply tap and speak. No typing complex medical terms—just describe how you feel in your own words.</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                                    <div className="flex-1 text-left hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">02</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Brain size={20} />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h4 className="text-2xl font-bold mb-2">Smart Analysis</h4>
                                        <p className="text-foreground/70 leading-relaxed">Our system analyzes your intent and symptoms against trusted medical databases to provide instant context.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1 text-right hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">03</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Check size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-2xl font-bold mb-2">Actionable Guidance</h4>
                                        <p className="text-foreground/70 leading-relaxed">Receive clear next steps—whether it's home care, scheduling a checkup, or seeking urgent medical attention.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero-Banner Section */}
                <HeroBanner />

                {/* Footer Section */}
                <PageEnd />
            </main>
        </div>
    );
};

export default LandingPage;