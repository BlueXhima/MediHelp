import React from 'react';
import { Info, X, ShieldCheck, Heart, Zap } from 'lucide-react';

const InfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
            <div className="w-full max-w-[420px] bg-background border border-border/50 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                <div className="p-8 text-left">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Info size={20} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">System Info</h3>
                        </div>
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

                    {/* Info Cards */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 flex gap-4">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold mb-1">Privacy First</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">Your health queries are processed in a secured session and are not stored permanently.</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 flex gap-4">
                            <Zap className="text-amber-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold mb-1">Medi Intelligence v1.0</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">Powered by advanced health-data mapping to provide accurate library references.</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 flex gap-4">
                            <Heart className="text-red-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold mb-1">Human-Centered</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">Designed as a thesis project to improve health literacy in local communities.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Warning */}
                    <div className="mt-8 p-4  rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
                        <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest">
                            Disclaimer: Not a substitute for professional medical advice.
                        </p>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-full mt-4 py-4 border border-border cursor-pointer rounded-2xl 
                        relative overflow-hidden group transition-all active:scale-[1] hover:bg-primary/10 hover:shadow-sm"
                    >
                        <span className="relative flex items-center justify-center gap-2 text-foreground font-bold text-sm tracking-[0.2em]">
                            Got it, thanks!
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;