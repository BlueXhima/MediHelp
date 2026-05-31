// Frontend/src/components/modals/InfoModal.jsx

import React from 'react';
import { X, Mic, HeartPulse, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

const InfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Overlay */}
            <div 
                className="absolute inset-0 bg-background/40 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Box Container */}
            <div className="relative bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-primary/10 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
                
                {/* Decorative Top Glow */}
                <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-primary via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Sparkles size={18} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-wider uppercase text-foreground">
                                Guide & Disclaimer
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                Medi Voice Terminal v1.0
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content Area (Scrollable if needed on super small screens) */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-custom text-sm">
                    
                    {/* Feature 1: Voice AI */}
                    <div className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <Mic size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Voice Symptom Analysis</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Pindutin ang mic button at sabihin ang iyong nararamdaman (e.g., "I have a headache and a mild fever"). Susuriin ito ng aming AI para magbigay ng paunang gabay.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Guest vs Member */}
                    <div className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <HeartPulse size={18} className="text-success shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Guest vs Member Access</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Ang mga <span className="text-primary font-bold">Guests</span> ay may limitadong 5 voice attempts kada session. Mag-log in o mag-register para ma-enjoy ang <span className="text-success font-bold">Unlimited Structural Sync</span> at kakayahang i-save ang mga ulat.
                            </p>
                        </div>
                    </div>

                    {/* Critical Medical Disclaimer */}
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-red-500">
                            <ShieldAlert size={16} />
                            <h4 className="text-xs font-black uppercase tracking-wider">Medical Disclaimer</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Ang application na ito ay isang intelligent checker na nagbibigay lamang ng impormasyon at edukasyon. **HINDI ito pamalit sa propesyonal na diagnosis, gamot, o medikal na payo ng totoong doktor.**
                        </p>
                        <div className="flex items-start gap-1.5 pt-1 text-[11px] text-red-500/80 font-medium italic">
                            <AlertCircle size={12} className="shrink-0 mt-0.5" />
                            <span>Kung ikaw ay nakakaranas ng matinding emergency, mangyaring tumawag agad sa pinakamalapit na ospital o gamitin ang Emergency Button sa Navbar.</span>
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-border/60 flex justify-end shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;