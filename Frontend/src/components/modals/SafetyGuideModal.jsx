// src/components/modals/SafetyGuideModal.jsx
import React from 'react';
import { X, ChevronLeft, AlertTriangle, Smartphone, HeartPulse, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const SafetyGuideModal = ({ isOpen, onClose, onBack }) => {
    if (!isOpen) return null;

    const guides = [
        {
            step: "01",
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            title: "Assess Discipline & Security",
            desc: "Verify site parameters are operational. Look for critical hazards such as chemical vectors, structural fatigue, or active energy pressure.",
        },
        {
            step: "02",
            icon: Smartphone,
            iconColor: "text-blue-500",
            title: "Report Status Frame",
            desc: "Identify full legal name, exact vector location, and incident core. Clinical data must be abstract and verified.",
        },
        {
            step: "03",
            icon: HeartPulse,
            iconColor: "text-red-500",
            title: "Initial Biological Care",
            desc: "Stay locked on the subject. If verified, execute emergency medical matrix; otherwise, await clinical sync from dispatch.",
        }
    ];

    return (
        /* Removed animate-fade-in here */
        <div className="fixed inset-0 bg-black/60 z-200 flex items-center justify-center p-4 backdrop-blur-[2px]">
            {/* Added animate-fade-in directly to the Modal Card */}
            <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border animate-fade-in">
                
                {/* Header (Aligned with Knowledge Library viewer architecture) */}
                <div className="p-6 border-b border-border/70 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={onBack} leadingIcon={ChevronLeft} className="text-[10px] -ml-2 text-foreground/40 hover:text-primary">
                            Back
                        </Button>
                        <div className="border-l border-border/60 pl-4 space-y-0.5">
                            <span className="text-[9px] font-bold tracking-widest uppercase text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">Protocol Matrix</span>
                            <h2 className="font-medium uppercase tracking-tight text-xl leading-none pt-0.5" style={{ fontFamily: "'Unesa', sans-serif" }}>
                                Clinical Safety Guidelines
                            </h2>
                        </div>
                    </div>
                    <Button variant="ghost" type="circular" onClick={onClose} size="sm" className="-mt-1.5 -mr-1.5">
                        <X size={18} className="stroke-[1.5]" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-7 space-y-8 max-h-[65vh] overflow-y-auto scrollbar-custom">
                    
                    <div className="border-l-4 border-primary/20 pl-6 space-y-1 text-left">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Critical Sync Protocol</p>
                        <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                            Follow these dynamic baseline operations precisely during any verified clinical emergency event. Maintain constant synchronization with dispatcher clinical arrays.
                        </p>
                    </div>

                    <div className="grid gap-5">
                        {guides.map((item, i) => (
                            <div key={i} className="group relative flex items-center gap-6 p-6 rounded-2xl border border-border bg-foreground/1 transition-all duration-300 hover:border-primary/20 hover:bg-primary/1">
                                <div className="shrink-0 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                   <Sparkles size={11} /> Step {item.step}
                                </div>
                                
                                <div className="h-full w-px bg-border group-hover:bg-primary/20" />

                                <div className="text-left space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <item.icon className={`${item.iconColor} stroke-[1.2]`} size={18} />
                                        <h4 className="font-bold text-sm uppercase tracking-tight text-foreground group-hover:text-glow">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="text-[12px] text-foreground/50 leading-relaxed font-medium transition-colors group-hover:text-foreground/80">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-7 bg-foreground/1 border-t border-border/70">
                    <Button variant="secondary" className="w-full text-[10px] py-4" onClick={onClose}>
                        Verification Status: Protocols Synced
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SafetyGuideModal;