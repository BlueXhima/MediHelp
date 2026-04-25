import React from 'react';
import { Calendar, MessageCircle, ShieldCheck, HeartPulse, Dot } from "lucide-react";
import { motion } from 'framer-motion';

const QuickStatsBar = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
        >
            {/* Main Floating Bar */}
            <div className="relative group">
                {/* Subtle Glow Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 blur-xl opacity-50" />
                
                <div className="relative flex flex-wrap text-left items-center justify-between gap-6 px-8 py-4 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] shadow-xl shadow-black/5">
                    
                    {/* Stats Group */}
                    <div className="flex flex-wrap items-center gap-8">
                        
                        {/* Health Status */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <HeartPulse size={18} className="text-emerald-500 relative z-10" />
                                <motion.div 
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Status</span>
                                <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground flex items-center">
                                    Good Condition <Dot className="text-emerald-500 animate-pulse" />
                                </span>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden md:block h-8 w-[1px] bg-border/50" />

                        {/* Last Check-up */}
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Last Sync</span>
                                <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground">2 weeks ago</span>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden md:block h-8 w-[1px] bg-border/50" />

                        {/* Monthly Queries */}
                        <div className="flex items-center gap-3">
                            <MessageCircle size={18} className="text-indigo-500" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Activity</span>
                                <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground">12 Consultations</span>
                            </div>
                        </div>

                    </div>

                    {/* Security Badge - Integrated into the bar */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 shadow-inner">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] italic text-primary/80">
                            AES-256 Protected
                        </span>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default QuickStatsBar;