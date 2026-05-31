import React from 'react';
import { ArrowLeft, LayoutList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArticleLeftSidebar = ({ sections, activeSection, setActiveSection, labelBack, labelToc, labelSubtoc, labelTip }) => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        /* Ginamit ang 'text-foreground' para sa base text color */
        <nav className="flex flex-col select-none text-foreground h-full overflow-hidden">
            
            {/* 1. FIXED TOP: Back Button */}
            <div className="shrink-0 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-500 cursor-pointer"
                >
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Border at Background na sumusunod sa theme variables */}
                        <div className="relative p-2 rounded-full border border-border bg-card group-hover:border-primary/30 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-60">{labelToc}</span>
                        <span className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors italic">
                            {labelSubtoc}
                        </span>
                    </div>
                </button>
            </div>

            {/* Header ng TOC */}
            <div className="flex items-center gap-2 px-1 mb-4 shrink-0">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <LayoutList size={14} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/50">
                    {labelToc}
                </h3>
            </div>

            {/* 2. SCROLLABLE MIDDLE: TOC Items */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-custom min-h-0 mb-6">
                <div className="flex flex-col gap-1 relative border-l border-border ml-3">
                    {sections.map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`group relative flex items-center py-2.5 px-4 transition-all duration-300 rounded-xl ${
                                    isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-primary/5 text-foreground/60'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-[-1px] top-1/4 bottom-1/4 w-[2px] bg-primary rounded-full z-10 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                )}

                                <div className="shrink-0">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                        isActive 
                                        ? 'bg-primary scale-125 shadow-[0_0_10px_hsl(var(--primary))]' 
                                        : 'bg-foreground/20 group-hover:bg-foreground/40'
                                    }`} />
                                </div>

                                <span className={`ml-3 text-[12px] text-left transition-all duration-300 ${
                                    isActive 
                                    ? 'text-foreground font-bold translate-x-1' 
                                    : 'text-foreground/70 group-hover:text-foreground'
                                }`}>
                                    {section.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. FIXED BOTTOM: Progress Hint */}
            <div className="px-3 py-4 bg-card rounded-2xl border border-dashed border-border shrink-0">
                <p className="text-[0.7rem] text-foreground/50 leading-relaxed italic">
                    {labelTip}
                </p>
            </div>
        </nav>
    );
};

export default ArticleLeftSidebar;