// src/pages/LearnTemplate.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle'; // 1. I-import ang hook
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { 
    ArrowLeft, BookOpen, Clock, AlertCircle, Lock, UserPlus, 
    Sparkles, Brain, Heart, Activity, Pill, Stethoscope, 
    Apple, Dumbbell, ShieldCheck, FileText, Baby, ShieldAlert
} from 'lucide-react';

const IconMap = { 
    Brain, Heart, Activity, Pill, Stethoscope, Apple, 
    Dumbbell, ShieldCheck, ShieldAlert, Baby, BookOpen 
};

const LearnTemplate = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');
    const isGuestUser = !token;

    // 2. TAWAGIN ANG HOOK PARA SA ARTIKULO
    // Kung naglo-load pa, gagamit muna ng temporary indicator, pagkatapos ay ang totoong title mula sa DB
    useDocumentTitle(article ? article.title : "Loading Article Data...");

    useEffect(() => {
        const fetchSingleArticle = async () => {
            try {
                const response = await api.get(`/articles/${topicId}`);
                setArticle(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading specific article framework:", error);
                setIsLoading(false);
            }
        };
        fetchSingleArticle();
    }, [topicId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center font-mono text-[10px] text-foreground/40">
                Synchronizing clinical data framework...
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
                <Navbar /> 
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-4 pt-28">
                    <AlertCircle size={36} className="text-primary/60 stroke-[1.5]" />
                    <h1 className="text-sm font-bold uppercase tracking-tight">Article Not Found</h1>
                    <Button variant="secondary" onClick={() => navigate('/learn')} className="text-[10px] py-2 px-4">Return to Library</Button>
                </main>
                <Footer /> 
            </div>
        );
    }

    const TopicIcon = IconMap[article.icon_name] || BookOpen;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20">
            <Navbar /> 
            <main className="flex-1 pt-24 sm:pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex items-center">
                    <button 
                        onClick={() => navigate('/learn')} 
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors group cursor-pointer"
                    >
                        <ArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" /> 
                        Back to Knowledge Base
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-2xl shrink-0">
                            <TopicIcon size={24} className="stroke-[1.5]" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[9px] font-bold tracking-widest uppercase text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">
                                {article.category_name || 'Clinical Framework'} 
                            </span>
                            <h1 className="text-xl sm:text-2xl font-medium tracking-tight uppercase leading-tight" style={{ fontFamily: "'Unesa', sans-serif" }}>
                                {article.title} 
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-foreground/40 bg-foreground/5 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
                        <Clock size={11} />
                        <span>{article.read_time || '12 min read'}</span> 
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                        <div className="bg-card/10 p-5 rounded-2xl border border-border/60 shadow-md shadow-black/2 space-y-3">
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-foreground flex items-center gap-2">
                                <Sparkles size={12} className="text-primary stroke-[1.8]" /> Clinical Abstract Overview
                            </h3>
                            <p className="text-foreground/60 text-xs leading-relaxed font-medium">
                                {article.summary_content || 'Understanding the fundamental anatomical systems is paramount for interpreting diagnostic data and stabilizing physiological responses.'} 
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl border border-border/30 bg-foreground/1 space-y-2.5">
                            <h4 className="text-[9px] font-bold tracking-widest uppercase text-foreground/40 font-mono">Module Specifications</h4>
                            <div className="text-[11px] space-y-2 text-foreground/70 font-medium">
                                <div className="flex justify-between py-0.5 border-b border-border/20">
                                    <span>Target Discipline</span>
                                    <span className="text-foreground font-semibold text-xs">{article.category_name || 'General Medicine'}</span> 
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-border/20">
                                    <span>Verification Status</span>
                                    <span className="text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck size={11}/> Certified Peer</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>Core Access Layer</span>
                                    <span className="text-primary font-semibold">{isGuestUser ? 'Tier-1 Preview' : 'Full Sync'}</span> 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8 relative">
                        {isGuestUser ? (
                            <div className="space-y-8 relative">
                                <div className="space-y-2 opacity-60 pointer-events-none select-none">
                                    <h2 className="text-sm font-bold tracking-tight uppercase text-foreground flex items-center gap-2">
                                        <span className="text-primary font-mono text-xs">01.</span> Pathophysiological Baseline Integration
                                    </h2>
                                    <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-medium">
                                        Understanding the complexity of the human anatomical layout requires a multi-faceted approach. We analyze how centralized muscular structures cross complex ligaments and tendons to convert chemical adenosine triphosphate into structural kinetic force and movement seamlessly. {article.body_content ? `${article.body_content.substring(0, 150)}...` : 'Loading system data...'} 
                                    </p>
                               </div>

                                <div className="space-y-2 opacity-25 pointer-events-none select-none border-t border-border/30 pt-6">
                                    <h2 className="text-sm font-bold tracking-tight uppercase text-foreground flex items-center gap-2">
                                        <span className="text-primary font-mono text-xs">02.</span> Homeostatic Cellular Regulation Dynamics
                                    </h2>
                                    <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-medium">
                                        Cellular respiration relies tightly on balanced molecular interactions across cellular boundaries. Advanced chemical signals route oxygen vectors precisely, maintaining consistent operations even during periods of heavy dynamic physiological changes or internal metabolic pressure.
                                    </p>
                                </div>

                                <div className="space-y-2 opacity-5 pointer-events-none select-none border-t border-border/30 pt-6 pb-24">
                                    <h2 className="text-sm font-bold tracking-tight uppercase text-foreground flex items-center gap-2">
                                        <span className="text-primary font-mono text-xs">03.</span> Advanced Clinical Analysis & Diagnostics
                                    </h2>
                                    <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-medium">
                                        System-wide reviews show consistent patterns in metabolic efficiency scores under strict tracking timelines. The clinical parameters monitored indicate that balanced structural alignment remains critical to long-term physical endurance.
                                    </p>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 top-16 bg-linear-to-t from-background via-background/95 to-transparent flex items-end justify-center pb-2">
                                    <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl max-w-md w-full text-center space-y-5 shadow-xl shadow-black/5 backdrop-blur-md">
                                        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <Lock size={16} className="stroke-[1.8]" /> 
                                        </div>
                                        <div className="space-y-1.5">
                                            <h3 className="text-base font-bold uppercase tracking-tight text-foreground">
                                                Access Restricted Content
                                            </h3>
                                            <p className="text-xs text-foreground/50 leading-relaxed max-w-xs mx-auto">
                                                You are in preview mode as a guest. To read the full biological protocols and diagnostics, you need to log in or create an account.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-1">
                                            <Button 
                                                variant="primary" 
                                                onClick={() => navigate('/register')}
                                                className="w-full py-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-primary/5 hover:shadow-primary/10 transition-all"
                                            >
                                                <UserPlus size={13} /> Create Free Medical Account 
                                            </Button>
                                            <button 
                                                onClick={() => navigate('/login')}
                                                className="text-[10px] font-bold tracking-wide uppercase text-foreground/40 hover:text-primary pt-1 transition-colors cursor-pointer"
                                            >
                                                Already have an account? Sign In Here
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-3xl">
                                <div className="space-y-2">
                                    <h2 className="text-sm font-bold tracking-tight uppercase text-foreground flex items-center gap-2">
                                        <FileText size={14} className="text-primary"/> Core Clinical Protocols & Guidelines
                                    </h2>
                                    <div className="h-px bg-border/40 w-full" />
                                </div>
                                <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium space-y-3">
                                    {article.body_content} 
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer /> 
        </div>
    );
};

export default LearnTemplate;