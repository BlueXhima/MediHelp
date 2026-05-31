import React, { useState } from 'react';
import { BookOpen, ChevronDown, History, Eye, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArticleMainContent = ({ article, textSize, onTranslate, isTranslating, labels }) => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    
    // Mock language options - palitan mo na lang ng actual logic mo
    const languageOptions = [
        { name: 'English', flag: '🇺🇸', code: 'en' },
        { name: 'Tagalog', flag: '🇵🇭', code: 'tl' },
        { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
        { name: 'Korean', flag: '🇰🇷', code: 'ko' },
        { name: 'Chinese', flag: '🇨🇳', code: 'zh-CN' },
    ];

    const [currentLang, setCurrentLang] = useState(languageOptions[0]);

    return (
        <article className="space-y-6 relative">

            <header className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    {/* Dynamic Title */}
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-tight leading-[1.1] max-w-3xl">
                        {article?.title}
                    </h1>
                    
                    {/* LANGUAGE SELECTOR */}
                    <div className="relative">
                        <button 
                            type="button"
                            disabled={isTranslating}
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full border border-border transition-all text-sm font-medium cursor-pointer"
                        >
                            <span>{currentLang.flag}</span>
                            <span>{currentLang.name}</span>
                            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-xl rounded-2xl overflow-hidden z-[60]"
                                >
                                    {languageOptions.map((lang) => (
                                        <button
                                            key={lang.code}
                                            className="w-full px-4 py-3 text-left hover:bg-primary/10 flex items-center gap-3 transition-colors"
                                            onClick={() => {
                                                setCurrentLang(lang);
                                                setIsLangOpen(false);
                                                onTranslate(lang.code); // TATAWAG SA PARENT
                                            }}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <span className="text-sm font-semibold">{lang.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Metadata Row - Encyclopedia Style */}
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                        <span className="text-foreground">
                            {labels.authorBy || "By"} {article?.author_name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <History size={13} className="text-primary/50" />
                        <span>{labels.lastEdited} {labels.recently || "recently"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye size={13} className="text-primary/50" />
                        <span>{article?.view_count?.toLocaleString() || 0} {labels.view}</span>
                    </div>
                </div>
            </header>

            {/* Dito papasok ang full HTML content mula sa database */}
            <div 
                className={`text-foreground font-serif text-justify transition-all duration-300
                    ${textSize} 
                    
                    /* 1. LINE HEIGHT */
                    leading-normal md:leading-[1.7]

                    /* 2. PARAGRAPHS - Eksaktong spacing para hindi sobrang layo */
                    [&_p]:mb-4 [&_p]:mt-0 [&_p]:text-foreground/90 
                    
                    /* 3. SECTION HEADERS (H3) */
                    [&_h3]:text-xl [&_h3]:md:text-xl [&_h3]:text-foreground [&_h3]:font-bold 
                    [&_h3]:font-sans [&_h3]:tracking-widest
                    [&_h3]:mt-4 [&_h3]:mb-4 [&_h3]:pt-4 [&_h3]:border-b [&_h3]:border-border
                    [&_h3:first-of-type]:mt-0 [&_h3:first-of-type]:pt-0 [&_h3:first-of-type]:border-b-2
                    
                    /* 4. LISTS - Support para sa Nested Lists */
                    [&_ul]:list-disc [&_ol]:list-decimal
                    [&_ul]:ml-6 [&_ol]:ml-6 
                    [&_ul]:mb-4 [&_ol]:mb-4
                    [&_li]:mb-1.5 [&_li]:pl-1
                    /* Styling para sa mga a tags */
                    [&_ul>li>a>b]:hover:text-primary [&_ul>li>a]:hover:underline
                    [&_ul>li>a]:hover:text-primary
                    [&>ul>li]:transition-colors [&>ul>li]:duration-200
                    /* Styling para sa listahan sa loob ng listahan (Nested) */
                    [&_ul_ul]:mt-2 [&_ul_ul]:mb-0 [&_ul_ul]:list-[circle]
                    [&_ol_ol]:mt-2 [&_ol_ol]:mb-0
                    
                    /* 5. EMPHASIS */
                    [&_b]:text-foreground [&_b]:font-bold 
                    
                    /* 6. WHITESPACE & OVERFLOW */
                    whitespace-normal overflow-hidden

                    /* 7. TABLES - Encyclopedia Style */
                    [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-[0.9em] [&_table]:font-sans
                    [&_table_th]:bg-card [&_table_th]:border [&_table_th]:border-border [&_table_th]:p-3 [&_table_th]:text-left
                    [&_table_td]:border [&_table_td]:border-border [&_table_td]:p-3 [&_table_td]:align-top
                    [&_table_tr:nth-child(even)]:bg-background

                    /* 8. VIDEO & IFRAME */
                    [&_video]:w-full [&_video]:my-8 [&_video]:rounded-xl [&_video]:border [&_video]:border-slate-200
                    [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-8 [&_iframe]:rounded-xl [&_iframe]:border-0

                    /* 9. IMAGES - Encyclopedia & Medical Style */
                    [&_img]:max-w-full [&_img]:h-auto [&_img]:my-8 [&_img]:rounded-2xl 
                    [&_img]:border [&_img]:border-slate-100 [&_img]:shadow-lg [&_img]:shadow-slate-200/50
                    [&_img]:mx-auto hover:opacity-95 transition-opacity
                `}
                dangerouslySetInnerHTML={{ __html: article?.full_content }} 
            />

            {/* References Section */}
            {article?.external_link && (
                <section 
                    id="external-link" 
                    className="mt-8 pt-8 scroll-mt-32"
                >
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-border pb-2">
                        <BookOpen className="text-primary" size={18} />
                        <h2 className="text-xl font-bold text-foreground tracking-[0.2em]">
                            {labels.link}
                        </h2>
                    </div>
                    <div 
                        className={`text-foreground font-sans leading-snug
                            [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:ml-5 [&>ul]:mb-5
                            [&>ul>li]:pl-0
                            [&>ul>li]:text-foreground
                            [&>ul>li]:transition-colors [&>ul>li]:duration-200
                            [&>ul>li>a]:hover:text-primary
                            [&>ul>li>a]:hover:underline [&>ul>li:hover]:underline-offset-4
                            ${textSize}`}
                        dangerouslySetInnerHTML={{ __html: article?.external_link }}
                    />
                </section>
            )}
        </article>
    );
};

export default ArticleMainContent;