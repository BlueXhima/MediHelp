import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RecentGuidanceCard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Kuhanin ang user ID mula sa local storage o auth context
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        const fetchHistory = async () => {
            // GINAYA NATIN ANG LOGIC SA RecentHistory.jsx
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData?.UserID;

            if (userId) {
                setLoading(true);
                try {
                    // Tiyaking tama ang port at path (5000 based sa RecentHistory)
                    const res = await axios.get(`http://localhost:5000/api/articles/history/${userId}`);
                    setHistory(res.data);
                } catch (err) {
                    console.error("Error fetching guidance history:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHistory();
    }, []);

    const getTypeColor = (type) => {
        const colors = {
            'Allergies': 'bg-purple-500/10 text-purple-500',
            'Pregnancy': 'bg-pink-500/10 text-pink-500',
            'Cardiovascular': 'bg-red-500/10 text-red-500',
            'Lifestyle': 'bg-emerald-500/10 text-emerald-500'
        };
        return colors[type] || 'bg-blue-500/10 text-blue-500';
    };

    return (
        <div className="bg-card border border-border/50 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground leading-none">Activity</span>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Recent Guidance</h3>
                    </div>
                </div>
                <Link
                    to="/dashboard/guidance-library"
                    className="group text-primary hover:text-primary/80 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                    View Library
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="space-y-4 p-2 max-h-[750px] overflow-y-auto pr-3 custom-scrollbar">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <Loader2 size={40} className="animate-spin text-primary opacity-40" />
                            <div className="absolute inset-0 blur-lg bg-primary/20 animate-pulse rounded-full" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 animate-pulse">
                            Syncing History
                        </span>
                    </div>
                ) : history.length > 0 ? (
                    history.map((item, idx) => (
                        <motion.div
                            key={item.article_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ delay: idx * 0.08 }}
                        >
                            <Link 
                                to={`/dashboard/guidance/article/${item.article_id}`}
                                className="group relative block p-4 bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-primary/20 rounded-[24px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
                            >
                                {/* Background Subtle Progress Glow */}
                                <div 
                                    className="absolute top-0 left-0 h-full bg-primary/[0.03] transition-all duration-1000 ease-out"
                                    style={{ width: `${item.progress_percentage}%` }}
                                />

                                <div className="relative flex items-center gap-4 z-10">
                                    {/* Image Container with Progress Ring */}
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        {/* Progress Indicator Dot */}
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                                            <div className={`w-2.5 h-2.5 rounded-full ${item.progress_percentage === 100 ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getTypeColor(item.category_name)}`}>
                                                {item.category_name}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(item.last_visited).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h4 className="font-bold text-slate-800 text-[15px] leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-2">
                                            {item.title}
                                        </h4>

                                        {/* Minimalist Progress Bar */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.progress_percentage}%` }}
                                                    className={`h-full rounded-full ${item.progress_percentage === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 w-8">
                                                {item.progress_percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Icon */}
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                            <BookOpen size={24} className="text-slate-200" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Your library is empty</p>
                    </div>
                )}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 relative group"
            >
                {/* Background Glow Effect - Lumalabas lang sa hover */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Link
                    to="/dashboard/guidance-library"
                    className="relative w-full flex items-center justify-center gap-3 py-5 bg-card border border-border hover:text-primary-foreground hover:bg-primary text-foreground rounded-[24px] transition-all duration-500 overflow-hidden group-hover:-translate-y-1"
                >
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

                    <div className="flex items-center gap-3 relative z-10">
                        <motion.div 
                            whileHover={{ rotate: 90 }}
                            className="w-6 h-6 bg-white/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                        >
                            <Plus size={14} className="text-foreground" />
                        </motion.div>
                        
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                            Explore Library
                        </span>
                    </div>

                    {/* Floating Arrow that appears on hover */}
                    <ArrowRight 
                        size={16} 
                        className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                    />
                </Link>
            </motion.div>
        </div>
    );
};

export default RecentGuidanceCard;