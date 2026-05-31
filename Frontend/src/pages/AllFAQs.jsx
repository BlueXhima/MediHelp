import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, ArrowRight, FileText, Hash, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// I-import lang ang faqs array mula sa iyong data file
import { faqs } from '../data/faqData';

const AllFAQs = () => {
    useDocumentTitle('All FAQs | MediHelp Hub');
    const navigate = useNavigate();
    
    const [filterQuery, setFilterQuery] = useState('');

    // Salain (Filter) ang faqs batay sa nilagay ng user sa search bar
    const filteredFaqs = faqs.filter(faq => 
        faq.q.toLowerCase().includes(filterQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(filterQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase())))
    );

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
            
            {/* HEADER CONTROLS BAR */}
            <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            type="circular" 
                            onClick={() => navigate(-1)}
                            aria-label="Back to Help Support Hub"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h1 className="text-sm font-bold tracking-wide">All Support Records</h1>
                            <p className="text-[10px] text-foreground/40 font-medium">Complete FAQ Log Directory</p>
                        </div>
                    </div>
                    <span className="text-[10px] tracking-widest font-bold uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {faqs.length} Knowledge Blocks
                    </span>
                </div>
            </header>

            {/* BODY HUB */}
            <main className="max-w-5xl mx-auto px-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* INTRO AND FILTER LAYER */}
                <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-glow mb-2 flex items-center justify-center md:justify-start gap-2">
                            <HelpCircle size={24} className="text-primary" />
                            Knowledge Base Directory
                        </h2>
                        <p className="text-xs text-foreground/50 max-w-md leading-relaxed">
                            Browse all available medical settings, offline synchronization maps, profile configurations, and compliance modules below.
                        </p>
                    </div>

                    {/* Filter Input Field */}
                    <div className="relative w-full md:w-80 shrink-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                        <input 
                            type="text"
                            placeholder="Filter articles..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                        />
                    </div>
                </div>

                {/* FAQ DIRECT RENDER FROM faqs ARRAY */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((article) => (
                            <div 
                                key={article.id}
                                onClick={() => navigate(`/help-support/faq/${article.id}`)}
                                className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-5 flex items-start justify-between gap-6 group transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:bg-primary/1"
                            >
                                <div className="space-y-2 min-w-0">
                                    {/* Meta Info at Category Label */}
                                    <div className="flex items-center gap-3 text-[10px] text-foreground/40 font-medium">
                                        <span className="text-[9px] uppercase font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-sm">
                                            {article.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} /> Updated recently
                                        </span>
                                    </div>

                                    {/* Title Question */}
                                    <h4 className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors pr-2">
                                        {article.q}
                                    </h4>

                                    {/* Summary Snippet Preview */}
                                    <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                                        {article.a}
                                    </p>

                                    {/* Mga Tags */}
                                    {article.tags && article.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                            {article.tags.map((tag, idx) => (
                                                <span key={idx} className="text-[9px] font-semibold text-foreground/40 bg-foreground/5 border border-border/40 px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                                                    <Hash size={8} />{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Icon Anchor */}
                                <div className="p-2 rounded-xl bg-foreground/5 text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5 self-center">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        ))
                    ) : (
                        /* KAPAG WALANG MATCH SA SEARCH FILTER */
                        <div className="border border-dashed border-border rounded-3xl p-12 text-center max-w-md mx-auto my-10 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                            <div className="p-3 rounded-2xl bg-foreground/5 text-foreground/30">
                                <Search size={24} />
                            </div>
                            <h3 className="text-sm font-bold">No documentation entries found</h3>
                            <p className="text-xs text-foreground/40 leading-relaxed max-w-xs">
                                We couldn't find any articles matching "{filterQuery}". Check your spellings or try clearing filter strings.
                            </p>
                            <Button variant="ghost" type="pill" size="sm" onClick={() => setFilterQuery('')} className="text-xs text-primary font-bold mt-2">
                                Clear Filter Query
                            </Button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default AllFAQs;