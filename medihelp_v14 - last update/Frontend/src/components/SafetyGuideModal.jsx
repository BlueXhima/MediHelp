import React from 'react';
import { X, ChevronLeft, ShieldCheck, Heart, AlertTriangle, Smartphone, Zap } from 'lucide-react';

const SafetyGuideModal = ({ isOpen, onClose, onBack }) => {
    if (!isOpen) return null;

    const guides = [
        {
            step: "01",
            icon: <AlertTriangle className="text-amber-500" size={24} />,
            title: "Assess & Secure",
            desc: "Ensure the area is safe for you and the victim. Look for hazards like fire, traffic, or unstable structures.",
            color: "amber"
        },
        {
            step: "02",
            icon: <Smartphone className="text-blue-500" size={24} />,
            title: "Report Clearly",
            desc: "State your name, exact location (Imus landmarks help!), and the nature of the incident. Don't hang up first.",
            color: "blue"
        },
        {
            step: "03",
            icon: <Heart className="text-red-500" size={24} />,
            title: "Initial Care",
            desc: "Stay with the victim. If trained, provide first aid/CPR. If not, follow the dispatcher's instructions.",
            color: "red"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            {/* <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={onClose}></div> */}
            
            <div 
                className="relative bg-card text-foreground w-full max-w-2xl rounded-2xl shadow-2xl 
                border border-border overflow-hidden animate-fade-in"
            >
                {/* Header */}
                <div className="p-5 border-b border-border flex items-center justify-between bg-accent/20">
                    <div className="flex items-center gap-2">
                        {/* Back Button */}
                        <button 
                            onClick={onBack} 
                            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl
                                    bg-secondary/50 hover:bg-primary/10 
                                    border border-transparent hover:border-primary/20
                                    transition-all duration-300 ease-out active:scale-95 cursor-pointer"
                        >
                            <div className="relative flex items-center justify-center">
                                <ChevronLeft 
                                    size={16} 
                                    className="text-muted-foreground group-hover:text-primary 
                                            transition-transform duration-300 group-hover:-translate-x-1" 
                                    strokeWidth={3}
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] 
                                            text-muted-foreground group-hover:text-primary 
                                            transition-colors duration-300">
                                Back
                            </span>
                        </button>
                        <div className="flex items-center gap-2 border-l border-border/50 pl-2">
                            {/* <ShieldCheck className="text-primary" size={25} /> */}
                            <h2 className="font-black uppercase tracking-tighter text-lg">
                                Safety Protocol
                            </h2>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Close Button */}
                    <button 
                        onClick={onClose} 
                        className="group p-2 rounded-xl border border-transparent 
                                hover:border-border hover:bg-card hover:shadow-sm
                                transition-all duration-200 text-muted-foreground 
                                hover:text-primary active:scale-90 cursor-pointer"
                        title="Close Directory"
                    >
                        <X 
                            size={18} 
                            className="transition-transform duration-200 group-hover:rotate-90" 
                        />
                    </button>
                </div>

                <div className="p-5 md:p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Intro Headline */}
                    <div className="text-center space-y-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                            Immediate Response Guide
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight italic">What to do first?</h3>
                    </div>

                    {/* Dynamic Steps Grid */}
                    <div className="grid gap-4">
                        {guides.map((item, i) => (
                            <div key={i} className="group relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                                {/* Step Number Background */}
                                <span className="absolute top-2 right-4 text-4xl font-black opacity-[0.10] italic group-hover:opacity-[10] transition-opacity">
                                    {item.step}
                                </span>

                                {/* Icon Section */}
                                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-${item.color}-500/10 border border-${item.color}-500/20 shadow-inner`}>
                                    {item.icon}
                                </div>

                                {/* Text Section */}
                                <div className="space-y-1 pr-8 text-left">
                                    <h4 className="font-black text-sm uppercase tracking-wide text-foreground">
                                        <span className="text-primary mr-2">Step {item.step}:</span>
                                        {item.title}
                                    </h4>
                                    <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pro-Tip / Reminder Box */}
                    <div className="relative overflow-hidden p-5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl group transition-all duration-300">
                        <div className="relative z-10 flex items-center gap-4">
                            {/* Pulsing Icon - Ginamit natin ang Lightbulb para sa 'Tip' vibe */}
                            <div className="p-2.5 bg-primary/20 dark:bg-primary/10 rounded-xl animate-pulse border border-white/10 dark:border-black/5">
                                <Zap size={22} className="text-primary-foreground dark:text-primary fill-current" />
                            </div>
                            
                            <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">
                                        Emergency Protocol Tip
                                    </p>
                                    <span className="w-1 h-1 rounded-full bg-primary animate-ping"></span>
                                </div>
                                <p className="text-sm font-bold leading-snug italic tracking-tight">
                                    "Always identify the nearest landmark or exit before an emergency occurs to ensure a faster response."
                                </p>
                            </div>
                        </div>

                        {/* Decorative Light Effect - Mas pinatindi ang 'Sweep' effect */}
                        <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/20 to-transparent -skew-x-[25deg] transform translate-x-24 group-hover:-translate-x-[400px] transition-transform duration-[1500ms] ease-in-out"></div>
                        
                        {/* Subtle Background Pattern (Optional) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                        </div>
                    </div>

                    {/* Minimalist Disclaimer */}
                    <div className="pt-4 flex items-center justify-center gap-2 border-t border-border/50">
                        <AlertTriangle size={12} className="text-muted-foreground" />
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                            MediHelp is an Assistant Tool • Always Prioritize Professional Help
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-card border-t border-border/50 text-center">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-background text-foreground rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SafetyGuideModal;