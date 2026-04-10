import { useState, useEffect } from "react";
import { Stethoscope, Hand, Target, Mic, Rocket, X, ShieldCheck} from "lucide-react";
import GetStarted from "./onboarding-compo/getstarted";
import Features from "./onboarding-compo/feature";
import VoiceSetup from "./onboarding-compo/voicesetup";
import Ready from "./onboarding-compo/ready";

const OnboardingModal = () => {
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isFirstLogin = localStorage.getItem("isFirstLogin");
        if (isFirstLogin === "true") {
            setIsVisible(true);
        }
    }, []);

    const handleFinishOnboarding = () => {
        // 1. I-update ang localStorage para sa susunod na refresh/visit, false na siya
        localStorage.setItem("isFirstLogin", "false");
        
        // 2. I-close ang modal
        setIsVisible(false);
    };

    const steps = [
        { id: 1, label: "Get Started", icon: <Hand size={20} /> },
        { id: 2, label: "Features", icon: <Target size={20} /> },
        { id: 3, label: "Voice Setup", icon: <Mic size={20} /> },
        { id: 4, label: "Ready", icon: <Rocket size={20} /> },
    ];

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex overflow-hidden min-h-[600px] animate-pop-up">
                
                {/* --- SIDEBAR NAVIGATION --- */}
                <div className="w-1/3 bg-slate-50 border-r p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col mb-10 text-left">
                            <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-2xl text-primary tracking-tight">
                                    MediHelp
                                </span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-0.5 ml-0.5">
                                Onboarding
                            </span>
                        </div>

                        <nav className="space-y-4">
                            {steps.map((s) => {
                                const isCompleted = step > s.id; // Check kung tapos na ang step
                                const isActive = step === s.id;   // Check kung ito ang current step

                                return (
                                    <div
                                        key={s.id}
                                        className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                                            isCompleted 
                                                ? "bg-green-50 text-green-600 font-bold" // Green bg kapag tapos na
                                                : isActive 
                                                    ? "bg-white shadow-md text-primary font-bold border border-gray-100" 
                                                    : "text-gray-500 opacity-70"
                                        }`}
                                    >
                                        <div className={`transition-colors duration-300 ${
                                            isCompleted ? "text-green-500" : isActive ? "text-primary" : "text-gray-400"
                                        }`}>
                                            {/* Palitan ang icon ng CheckCircle kapag completed na para sa mas magandang UX */}
                                            {isCompleted ? <ShieldCheck size={20} /> : s.icon}
                                        </div>
                                        <span className="text-md">{s.label}</span>
                                        
                                        {/* Optional: Add a checkmark at the end for completed steps */}
                                        {isCompleted && (
                                            <div className="ml-auto">
                                                <div className="bg-green-500 rounded-full p-0.5">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                            <div className="bg-blue-100 p-1.5 rounded-full mb-2">
                                <ShieldCheck size={18} className="text-blue-600" />
                            </div>
                            <p className="text-[14px] leading-relaxed text-blue-700 font-medium text-left px-2">
                                Your health data is <span className="font-bold uppercase tracking-wider">encrypted</span> and secure
                            </p>
                        </div>

                        <div className="text-[11px] text-gray-400 text-center uppercase tracking-widest font-medium">
                            © 2026 MediHelp Healthcare System
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="w-2/3 p-10 flex flex-col relative">
                    {/* Close Button */}
                    <button 
                        onClick={handleFinishOnboarding} // Palitan ang setIsVisible(false) nito
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex-1 flex flex-col justify-center">
                        {step === 1 && <GetStarted onNext={() => setStep(2)} />}
                        {step === 2 && <Features onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                        {step === 3 && <VoiceSetup onNext={() => setStep(4)} onBack={() => setStep(2)} />}
                        {step === 4 && <Ready onBack={() => setStep(3)} onClose={handleFinishOnboarding} />}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OnboardingModal;