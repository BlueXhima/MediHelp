import React from 'react';
import { Languages, History, Eye, BookOpen } from 'lucide-react';

const ArticleContent = ({ data, textSizeClass }) => {
    return (
        <div className="w-full max-w-3xl mx-auto pb-12">
            {/* ARTICLE HEADER AREA */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    {/* Left: Title */}
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-tight">
                        {data?.title}
                    </h1>
                    
                    {/* Right: Language Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-all shrink-0 h-fit mb-1">
                        <Languages size={18} />
                        <span className="text-sm font-medium">128 languages</span>
                    </button>
                </div>

                {/* Metadata Row (Parang Wikipedia feels) */}
                <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                    <div className="flex items-center gap-2">
                        <History size={14} />
                        <span>Last edited 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye size={14} />
                        <span>{data.view_count} views</span>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100 mb-10" />

            <div 
                className={`text-foreground font-serif text-justify whitespace-pre-line transition-all duration-300
                    ${textSizeClass} 

                    /* 1. LINE HEIGHT - Mula relaxed ginawa nating normal/snug */
                    leading-snug md:leading-normal

                    /* 2. PARAGRAPHS - Sobrang liit na margin-bottom */
                    [&>p]:mb-2 [&>p]:mt-0 [&>p]:text-slate-400 [&>p]:first:mt-0 [&>p]:last:mb-0
                    [&>p]:leading-relaxed

                    /* 3. HEADERS (H3) - Dikit na sa taas at baba */
                    [&>h3]:text-foreground [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-1 
                    [&>h3]:border-b [&>h3]:border-slate-100 [&>h3]:pb-0.5 [&>h3]:font-sans
                    
                    /* Dynamic size para sa H3 */
                    ${textSizeClass === 'text-sm' ? '[&>h3]:text-xl' : 
                    textSizeClass === 'text-xl' ? '[&>h3]:text-3xl' : '[&>h3]:text-3xl'}

                    /* 4. LISTS - Halos walang gap sa pagitan ng items */
                    [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-2 [&>ul]:space-y-0.5
                    [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-2 [&>ol]:space-y-0.5
                    [&>ul>li]:text-slate-400
                    
                    /* 5. MANUAL BR TAGS - Ginawang 4px na lang ang height */
                    [&>br]:block [&>br]:content-[''] [&>br]:h-1`}
                dangerouslySetInnerHTML={{ __html: data?.full_content }} 
            />

            {/* References Section */}
            {data?.references_list && (
                <section id="references" className={`mt-12 py-10 border-t-2 border-border scroll-mt-32`}>
                    {/* Pwede mo rin i-apply ang textSizeClass dito kung gusto mo magbago rin ang references */}
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="text-primary" size={24} />
                        <h2 className="text-2xl font-black text-foreground tracking-[0.1em]">
                            References & Citations
                        </h2>
                    </div>
                    <div 
                        className={`text-slate-500 font-sans leading-relaxed
                            [&>ul]:list-disc [&>ul]:list-outside [&>ul]:ml-5 [&>ul]:space-y-4 
                            [&>ul>li]:pl-2 [&>ul>li]:text-justify
                            [&>ul>li]:font-serif 
                            ${textSizeClass}`} // Apply din dito
                        dangerouslySetInnerHTML={{ __html: data?.references_list }}
                    />
                </section>
            )}
        </div>
    );
};

export default ArticleContent;