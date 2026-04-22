import React, { useEffect, useRef } from 'react';
import { Languages, History, Eye, BookOpen } from 'lucide-react';

const ArticleContent = ({ data, textSizeClass }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            // Hanapin lahat ng 'a' tags sa loob ng component
            const links = contentRef.current.querySelectorAll('a');
            links.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                // Optional: Dagdagan ng class para sa styling
                link.classList.add('text-blue-600', 'hover:underline');
            });
        }
    }, [data]); // Re-run kapag nagbago ang data

    return (
        <div className="w-full max-w-3xl mx-auto pb-12" ref={contentRef}>
            {/* ARTICLE HEADER AREA */}
            <div className="flex flex-col gap-3 mb-2"> {/* Binalik sa gap-3 at mb-4 para mas dikit */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-tight leading-[1.1]">
                        {data?.title}
                    </h1>
                    
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-all shrink-0 h-fit mb-1">
                        <Languages size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">128 languages</span>
                    </button>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">
                    <div className="flex items-center gap-1.5">
                        <History size={13} className="text-primary/60" />
                        <span>Last edited 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Eye size={13} className="text-primary/60" />
                        <span>{data.view_count?.toLocaleString()} views</span>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100 mb-8" />

            <div 
                className={`text-foreground font-serif text-justify transition-all duration-300
                    ${textSizeClass} 
                    
                    /* 1. LINE HEIGHT */
                    leading-normal md:leading-[1.7]

                    /* 2. PARAGRAPHS - Eksaktong spacing para hindi sobrang layo */
                    [&_p]:mb-4 [&_p]:mt-0 [&_p]:text-foreground/90 
                    
                    /* 3. SECTION HEADERS (H3) */
                    [&_h3]:text-xl [&_h3]:md:text-xl [&_h3]:text-foreground [&_h3]:font-bold 
                    [&_h3]:font-sans [&_h3]:tracking-widest
                    [&_h3]:mt-4 [&_h3]:mb-4 [&_h3]:pt-4 [&_h3]:border-b [&_h3]:border-slate-100
                    [&_h3:first-of-type]:mt-0 [&_h3:first-of-type]:pt-0 [&_h3:first-of-type]:border-b-2
                    
                    /* 4. LISTS - Support para sa Nested Lists */
                    [&_ul]:list-disc [&_ol]:list-decimal
                    [&_ul]:ml-6 [&_ol]:ml-6 
                    [&_ul]:mb-4 [&_ol]:mb-4
                    [&_li]:mb-1.5 [&_li]:pl-1
                    /* Styling para sa mga a tags */
                    [&_ul>li>a]:hover:text-blue-600 [&_ul>li>a]:hover:underline
                    /* Styling para sa listahan sa loob ng listahan (Nested) */
                    [&_ul_ul]:mt-2 [&_ul_ul]:mb-0 [&_ul_ul]:list-[circle]
                    [&_ol_ol]:mt-2 [&_ol_ol]:mb-0
                    
                    /* 5. EMPHASIS */
                    [&_b]:text-foreground [&_b]:font-bold 
                    
                    /* 6. WHITESPACE & OVERFLOW */
                    whitespace-normal overflow-hidden

                    /* 7. TABLES - Encyclopedia Style */
                    [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-[0.9em] [&_table]:font-sans
                    [&_table_th]:bg-slate-50 [&_table_th]:border [&_table_th]:border-slate-200 [&_table_th]:p-3 [&_table_th]:text-left
                    [&_table_td]:border [&_table_td]:border-slate-200 [&_table_td]:p-3 [&_table_td]:align-top
                    [&_table_tr:nth-child(even)]:bg-slate-50/50

                    /* 8. VIDEO & IFRAME */
                    [&_video]:w-full [&_video]:my-8 [&_video]:rounded-xl [&_video]:border [&_video]:border-slate-200
                    [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-8 [&_iframe]:rounded-xl [&_iframe]:border-0

                    /* 9. IMAGES - Encyclopedia & Medical Style */
                    [&_img]:max-w-full [&_img]:h-auto [&_img]:my-8 [&_img]:rounded-2xl 
                    [&_img]:border [&_img]:border-slate-100 [&_img]:shadow-lg [&_img]:shadow-slate-200/50
                    [&_img]:mx-auto hover:opacity-95 transition-opacity
                `}
                dangerouslySetInnerHTML={{ __html: data?.full_content }} 
            />

            {/* References Section */}
            {data?.external_link && (
                <section 
                    id="external-link" 
                    className="mt-8 pt-8 scroll-mt-32"
                >
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-100 pb-2">
                        <BookOpen className="text-primary" size={18} />
                        <h2 className="text-xl font-bold text-foreground tracking-[0.2em]">
                            External Links
                        </h2>
                    </div>
                    <div 
                        className={`text-foreground font-sans leading-snug
                            [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:ml-5 [&>ul]:mb-5
                            [&>ul>li]:text-lg [&>ul>li]:pl-0
                            [&>ul>li]:text-foreground
                            [&>ul>li]:transition-colors [&>ul>li]:duration-200
                            [&>ul>li>a]:hover:text-blue-600
                            [&>ul>li>a]:hover:underline [&>ul>li:hover]:underline-offset-4
                            ${textSizeClass}`}
                        dangerouslySetInnerHTML={{ __html: data?.external_link }}
                    />
                </section>
            )}
        </div>
    );
};

export default ArticleContent;