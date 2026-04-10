import React from 'react';
import { Clock, History, X, BookOpen, Trash2, ArrowRight } from 'lucide-react';

const RecentHistory = ({ isOpen, onClose }) => {
    // Sample Data
    const historyItems = [
        { id: 1, time: "2 hours ago", title: "First Aid for Heatstroke", category: "Emergency", icon: "🔥" },
        { id: 2, time: "Yesterday", title: "Understanding Sleep Apnea", category: "General Medicine", icon: "😴" },
        { id: 3, time: "3 days ago", title: "Post-Workout Nutrition Guide", category: "Nutrition", icon: "🍎" }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* 1. Backdrop - Gamit ang blur mula sa theme mo */}
            <div 
                className="absolute inset-0 bg-background/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            
            {/* 2. Drawer Content - Sinunod ang slide-in-from-right animation */}
            <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col
                            animate-in slide-in-from-right duration-500 ease-out">
                
                {/* Header - Using Primary colors from index.css */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                            <History size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-sm font-black uppercase italic tracking-tighter text-foreground">Reading History</h2>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-70">MediHelp Activity Log</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-all active:scale-90 border border-transparent hover:border-border"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* History List - Card Hover styles based on your utility */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-3 custom-scrollbar">
                    {historyItems.length > 0 ? (
                        historyItems.map((item, index) => (
                            <div 
                                key={item.id}
                                className={`group relative p-5 rounded-3xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden
                                           animate-fade-in`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Subtle Gradient background similar to your Premium Banner */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex gap-4 relative z-10">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-card border border-border text-2xl shadow-sm group-hover:shadow-primary/20 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>

                                    <div className="flex-1 space-y-1 text-left">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <span className="text-primary/80">{item.category}</span>
                                            <div className="flex items-center gap-1 opacity-60">
                                                <Clock size={10} />
                                                {item.time}
                                            </div>
                                        </div>
                                        <h4 className="text-[13px] font-black group-hover:text-primary transition-colors leading-tight italic">
                                            {item.title}
                                        </h4>
                                    </div>

                                    <div className="self-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight size={18} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <BookOpen size={48} className="text-muted-foreground" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">No activity yet</p>
                        </div>
                    )}
                </div>

                {/* Footer - Consistent with your button styles */}
                <div className="p-6 border-t border-border bg-card/50 backdrop-blur-md">
                    <button className="w-full py-4 flex items-center justify-center gap-2 rounded-2xl 
                        /* Base State */
                        bg-destructive/10 text-destructive border border-destructive/20 
                        text-[10px] font-black uppercase tracking-[0.2em] shadow-sm 
                        transition-all duration-300 ease-out
                        
                        /* Hover State - Mas malinis at may glow */
                        hover:bg-destructive hover:text-white 
                        hover:shadow-[0_0_20px_rgba(var(--destructive),0.3)] 
                        hover:border-destructive
                        
                        /* Active State */
                        active:scale-[0.98] group cursor-pointer"
                    >
                        <Trash2 
                            size={14} 
                            className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" 
                        />
                        <span>Clear All History</span>
                    </button>
                </div>
            </div>

            {/* Custom Scrollbar Logic para sa Loob ng Drawer */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.3);
                }
            `}</style>
        </div>
    );
};

export default RecentHistory;