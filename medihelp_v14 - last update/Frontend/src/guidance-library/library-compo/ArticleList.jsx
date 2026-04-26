import React from 'react';
import { BookOpen, Clock, User, History, ArrowRight, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArticleList = ({ articles, categoryName, loading, onOpenHistory, onArticleClick }) => {
    const navigate = useNavigate();

    // Skeleton Loading State
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="h-32 bg-secondary/50 rounded-3xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* dynamic Header */}
            <div className="flex items-center justify-between px-2">
                <div className="text-left">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground">
                        {categoryName || "All Resources"}
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                        {articles.length} {articles.length === 1 ? 'Article' : 'Articles'} Found
                    </p>
                </div>

                <div className="flex items-center gap-2"> {/* Container para magkatabi sila */}
                    {/* Archive Button */}
                    <button 
                        onClick={() => navigate('/dashboard/guidance-library/archives')}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-amber-500 hover:text-white border border-border rounded-xl transition-all group active:scale-95"
                        title="View Archived History"
                    >
                        <Archive size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="hidden md:block text-xs font-black uppercase tracking-widest">Archives</span>
                    </button>

                    {/* History Button */}
                    <button 
                        onClick={onOpenHistory}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-primary hover:text-white border border-border rounded-xl transition-all group active:scale-95"
                        title="View Reading History"
                    >
                        <History 
                            size={18} 
                            className="transition-transform duration-500 group-hover:[-webkit-transform:rotate(-360deg)] group-hover:rotate-[-360deg]" 
                        />
                        <span className="hidden md:block text-xs font-black uppercase tracking-widest">History</span>
                    </button>
                </div>
            </div>

            {/* Articles Grid/List */}
            <div 
                className={`pr-2 space-y-4 transition-all duration-500
                    ${articles.length >= 6 
                        ? 'max-h-[1035px] p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent' 
                        : 'max-h-none overflow-visible'
                    }`}
                style={{ scrollbarWidth: articles.length >= 6 ? 'thin' : 'none' }}
            >
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div 
                            key={article.article_id}
                            className="group relative bg-card border border-border rounded-3xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <BookOpen size={120} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                {/* Article Info */}
                                <div className="flex-1 text-left space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-wider">
                                            {article.category_name}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase">
                                            <Clock size={12} />
                                            {new Date(article.created_date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                        {article.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl">
                                        {article.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 uppercase tracking-tight">
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border border-border">
                                                <User size={12} />
                                            </div>
                                            {article.author || "MediHelp Team"}
                                        </div>
                                        
                                        <div 
                                            onClick={() => onArticleClick(article.article_id)}
                                            className="flex items-center gap-1 text-xs font-black text-primary uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                            Read More <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                        <div className="p-4 bg-background rounded-full shadow-inner">
                            <BookOpen size={40} className="text-muted-foreground opacity-20" />
                        </div>
                        <div>
                            <h4 className="font-black uppercase italic text-muted-foreground">No articles found</h4>
                            <p className="text-xs text-muted-foreground">Try selecting another category or check back later.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleList;