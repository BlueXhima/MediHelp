import React from 'react';
import * as Icons from 'lucide-react';

const CategoryFilters = ({ categories, activeId, onSelect }) => {
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            {/* Header with Glass Effect Icon */}
            <div className="flex items-center gap-4 px-2 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                    <div className="relative p-2.5 bg-primary/10 border border-primary/20 rounded-xl">
                        <Icons.Filter size={20} className="text-primary animate-pulse-subtle" />
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-black uppercase tracking-[0.15em] italic text-foreground/90">Browse by</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Specialized Categories</p>
                    </div>
                </div>
            </div>

            {/* Filter List */}
            <div className="grid gap-2.5 relative">
                {/* Vertical Line Indicator (Design Only) */}
                <div className="absolute left-[25px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

                {/* Default "All Resources" Option */}
                <button
                    onClick={() => onSelect('all')}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-500 border cursor-pointer overflow-hidden
                        ${activeId === 'all' 
                            ? 'bg-primary border-primary shadow-xl shadow-primary/20 translate-x-2' 
                            : 'bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 hover:bg-secondary/50'
                        }`}
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`p-2.5 rounded-xl transition-all duration-500 ${activeId === 'all' ? 'bg-white shadow-lg text-primary rotate-[360deg]' : 'bg-secondary text-primary group-hover:scale-110'}`}>
                            <Icons.LayoutGrid size={18} />
                        </div>
                        <span className={`text-[13px] font-black tracking-tight uppercase ${activeId === 'all' ? 'text-white' : 'text-foreground/80 group-hover:text-primary'}`}>
                            All Resources
                        </span>
                    </div>
                    {activeId === 'all' && (
                        <div className="absolute right-0 top-0 h-full w-1 bg-white/40" />
                    )}
                </button>

                {/* Dynamic Categories */}
                {safeCategories.map((cat) => {
                    const LucideIcon = Icons[cat.icon_name] || Icons.BookOpen;
                    const isActive = activeId === cat.category_id;

                    return (
                        <button
                            key={cat.category_id}
                            onClick={() => onSelect(cat.category_id)}
                            className={`group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-500 border cursor-pointer overflow-hidden
                                ${isActive 
                                    ? 'bg-primary border-primary shadow-xl shadow-primary/20 translate-x-2' 
                                    : 'bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 hover:bg-secondary/50'
                                }`}
                        >
                            {/* Inner Glow Effect for Active State */}
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />}
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-2.5 rounded-xl transition-all duration-500
                                    ${isActive ? 'bg-white shadow-lg text-primary scale-110' : 'bg-secondary text-primary group-hover:scale-110 group-hover:bg-primary/10'}`}>
                                    <LucideIcon size={18} />
                                </div>
                                <span className={`text-[13px] font-black tracking-tight uppercase ${isActive ? 'text-white' : 'text-foreground/80 group-hover:text-primary'}`}>
                                    {cat.category_name}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 relative z-10">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all duration-500
                                    ${isActive ? 'bg-white/20 border-white/20 text-white' : 'bg-accent/50 border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary'}`}>
                                    {cat.article_count || 0}
                                </span>
                                <Icons.ChevronRight size={14} className={`transition-all duration-500 ${isActive ? 'text-white opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-40 group-hover:translate-x-0'}`} />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Sidebar Hint / Tip */}
            <div className="mx-2 p-4 rounded-2xl bg-secondary/30 border border-dashed border-border mt-8">
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                    Tip: Click on a category to filter resources specialized for your medical guidance.
                </p>
            </div>
        </div>
    );
};

export default CategoryFilters;