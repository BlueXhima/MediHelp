import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Calendar, Shield, AlertCircle, Hash, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

// Inimport natin ang pinalawak na faqData array
import { faqs } from '../../data/faqData';

const HelpArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Hanapin ang tugmang FAQ record gamit ang id parameter
    const article = faqs.find(item => item.id === parseInt(id));

    // Dynamic browser title setter
    useDocumentTitle(article ? article.q : 'Article Not Found');

    if (!article) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-card border border-border p-8 rounded-3xl max-w-sm shadow-xl">
                    <h2 className="text-lg font-bold mb-2">Article Not Found</h2>
                    <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
                        The documentation layout you are attempting to review does not exist or has been relocated.
                    </p>
                    <Button variant="primary" type="rounded" className="w-full" onClick={() => navigate('/help-support')}>
                        Back to Help Hub
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
            
            {/* BACK BAR ACTIONS */}
            <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        type="circular" 
                        onClick={() => navigate(-1)}
                        aria-label="Back to Help Hub"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <span className="text-[10px] tracking-widest font-bold uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {article.category}
                    </span>
                </div>
            </header>

            {/* DYNAMIC LAYOUT TEMPLATE CONTENT */}
            <main className="max-w-3xl mx-auto px-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* Upper Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-foreground/40 text-[11px] font-medium mb-6">
                    <div className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-primary" />
                        <span>Documentation Logs</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>4 min read documentation</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>Updated recently</span>
                    </div>
                </div>

                {/* Main Heading Question */}
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-glow mb-8">
                    {article.q}
                </h1>

                {/* CORE CONTENT SHELL */}
                <div className="space-y-8">
                    
                    {/* Part 1: Brief Answer Overview */}
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-1 block">Quick Overview</span>
                        <p className="text-sm font-medium text-foreground/90 leading-relaxed italic">
                            "{article.a}"
                        </p>
                    </div>

                    {/* Part 2: Detailed Deep-Dive Text */}
                    <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-4">
                        <p>{article.detailedAnswer}</p>
                    </div>

                    {/* Part 3: Step-by-Step Interactive Guide */}
                    {article.steps && article.steps.length > 0 && (
                        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-xs backdrop-blur-xs">
                            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                Step-by-Step Implementation Guide
                            </h3>
                            <ol className="space-y-3.5">
                                {article.steps.map((step, index) => (
                                    <li key={index} className="flex gap-4 items-start text-xs text-foreground/75 leading-relaxed">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground/5 text-primary text-[10px] font-bold shrink-0 mt-0.5 border border-border">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Part 4: Important Notes or Warnings Banner */}
                    {article.notes && (
                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3 items-start">
                            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-0.5">System Notice</span>
                                <p className="text-xs text-foreground/70 leading-relaxed font-medium">{article.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Part 5: Tag Badges Container */}
                    {article.tags && (
                        <div className="pt-4 border-t border-border/40 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mr-1 flex items-center gap-1">
                                <Hash size={10} /> Related Meta Tags:
                            </span>
                            {article.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-semibold text-foreground/60 bg-foreground/5 border border-border px-2.5 py-1 rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Security Footer Layer */}
                    <div className="pt-6 border-t border-border/30 flex items-start gap-3 text-foreground/40">
                        <Shield size={16} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-relaxed">
                            This informational brief is part of MediHelp's encrypted security index logs. For further compliance guidelines or personalized technical assistance, please communicate directly with system managers.
                        </p>
                    </div>
                </div>

                {/* HELPFUL FEEDBACK BOX */}
                <div className="border border-border bg-card/20 rounded-2xl p-6 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
                    <div>
                        <h4 className="text-xs font-bold mb-1">Was this article helpful to your build?</h4>
                        <p className="text-[11px] text-foreground/50">Help us improve the support registry blocks.</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" type="pill" size="sm" className="px-4 text-xs">
                            Yes, thanks!
                        </Button>
                        <Button variant="ghost" type="pill" size="sm" className="px-4 text-xs text-foreground/50">
                            No
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default HelpArticleDetail;