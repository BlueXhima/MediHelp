import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mic, Heart, BookOpen, ArrowUpRight, Brain, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const Overview = ({ onViewChange }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRead, setTotalRead] = useState(0);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/articles/history');
                setTotalRead(response.data.length);
                setHistory(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching reading history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // PALITAN ITO:
                const data = await userService.getFullDetails(); 
                setUserData(data);
            } catch (err) {
                console.error("Error loading user info:", err);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        onViewChange('Overview'); // Ito ay papasa sa Dashboard
    }, [onViewChange]);

    const stats = [
        { label: 'Health Score', value: '85%', icon: Heart, color: 'text-primary' },
        { label: 'Voice Queries', value: '12', icon: Mic, color: 'text-primary' },
        { label: 'Articles Read', value: isLoading ? "..." : totalRead.toString(), icon: BookOpen, color: 'text-primary' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 bg-background">
            {/* WELCOME SECTION - Mas malinis, tinanggal ang mabigat na gradient shadow */}
            <div className="relative p-12 bg-card border border-border rounded-3xl overflow-hidden">
                <div className="relative z-10 space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Welcome back, <span className="text-primary">{userData?.firstName || 'Health Seeker'}</span>.
                        </h1>
                        <p className="text-foreground/50 text-base font-medium max-w-sm">
                            Your voice-guided health journey continues here. What's on your mind today?
                        </p>
                    </div>
                    
                    {/* Primary Button na hindi 'Elevated' para sa minimalist feel */}
                    <Button 
                        variant="primary"
                        type="pill"
                        size="lg"
                        leadingIcon={Mic}
                        className="shadow-none hover:shadow-primary/10"
                        onClick={() => console.log("Start Voice Query")}
                    >
                        Start Voice Query
                    </Button>
                </div>
                {/* Subtle background blur instead of solid colors */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20" />
            </div>

            {/* STATS GRID - Flat design with subtle borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="group p-8 bg-card border border-border rounded-3xl transition-all hover:border-primary/20">
                        <div className="flex flex-col items-start gap-4">
                            <stat.icon size={24} className={stat.color} />
                            <div>
                                <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
                                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RECENT ACTIVITY & TIPS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Guidance - 2/3 width for focus */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold tracking-tight text-foreground text-left">Guidance History</h3>
                        <Button
                            onClick={() => navigate('/dashboard/health-insights?view=history')}
                            variant="ghost" 
                            size="sm" 
                            trailingIcon={ArrowUpRight}>
                            View All
                        </Button>
                    </div>

                    <div className="space-y-4 max-h-100 overflow-y-auto pr-2 scrollbar-custom">
                        {isLoading ? (
                            // Mas eleganteng Skeleton Loader
                            [1, 2, 3].map((n) => (
                                <div key={n} className="h-20 bg-card/40 animate-pulse rounded-2xl border border-border/20" />
                            ))
                        ) : history.length > 0 ? (
                            history.map((item, index) => (
                                <div 
                                    key={item.history_id}
                                    onClick={() => navigate(`/dashboard/library/article/${item.article_id}`)} 
                                    className="group relative flex items-center justify-between p-4 bg-card/40 hover:bg-card border border-border/50 hover:border-primary/30 rounded-2xl transition-all duration-300 hover:shadow-sm group cursor-pointer"
                                >
                                    {/* Visual Indicator on Hover */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-5">
                                        {/* Icon Container with subtle glow */}
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                                <BookOpen size={20} className="text-foreground/40 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>

                                        <div className="text-left space-y-1">
                                            <h4 className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <p className="text-[10px] font-semibold text-foreground/30 flex items-center gap-1.5 uppercase tracking-wider">
                                                    <Clock size={12} className="opacity-70" /> 
                                                    {formatDistanceToNow(new Date(item.last_visited), { addSuffix: true })}
                                                </p>
                                                <span className="w-1 h-1 bg-border rounded-full" />
                                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                                                    {item.category_name || 'Medical'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex flex-col items-end gap-1">
                                            <div className="w-24 h-1.5 bg-background border border-border rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-500" 
                                                    style={{ width: `${item.progress_percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] font-black text-foreground/20 uppercase tracking-tighter">
                                                {item.progress_percentage}% Completed
                                            </span>
                                        </div>
                                        
                                        {/* Interaction Icon */}
                                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                                            <ArrowUpRight size={14} className="text-primary" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl opacity-40">
                                <p className="text-xs font-bold uppercase tracking-widest text-foreground">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Health Insight - Minimalist Sidebar Card */}
                <div className="bg-card text-foreground border border-border p-8 rounded-3xl flex flex-col justify-between items-start text-left h-fit">
                    <div className="space-y-6">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Brain size={20} />
                        </div>
                        <h3 className="text-2xl font-bold leading-tight tracking-tight">
                            Consistency leads to better results.
                        </h3>
                        <p className="opacity-70 text-sm font-medium">
                            Try asking one health question a day to stay informed.
                        </p>
                    </div>
                    <Button 
                        type="3d"
                        variant="outline"
                        className="mt-8 w-full py-4 text-[11px] rounded-xl"
                    >
                        Explore Insights
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
