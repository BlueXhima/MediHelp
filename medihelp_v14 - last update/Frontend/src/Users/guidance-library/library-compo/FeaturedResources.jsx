import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeaturedResources = ( { onArticleClick } ) => {
    const [resources, setResources] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Palitan ang URL base sa iyong server config
                const res = await axios.get('http://localhost:5000/api/articles/featured');
                setResources(res.data);
            } catch (err) {
                console.error("Error fetching articles:", err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <section className="w-full py-6 animate-fade-in-delay-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="space-y-1 text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <span className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(167,139,250,0.4)]"></span>
                        Featured Health Resources
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl pl-5">
                        Hand-picked guides and expert-verified documentation to help you manage your health journey with confidence.
                    </p>
                </div>

                <button 
                    onClick={() => navigate('/dashboard/guidance-library/all-articles')}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all group self-start md:self-end cursor-pointer"
                >                    View All 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((res, index) => (
                    <div 
                        key={res.article_id}
                        className="group relative flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden card-hover animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <img 
                                src={res.image_url} 
                                alt={res.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = "https://images.unsplash.com/photo-1505751172107-5962200a4886?q=80&w=2070&auto=format&fit=crop";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-7 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">{res.icon_emoji}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {res.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl text-left font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                                {res.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-left text-slate-500 dark:text-slate-400 leading-relaxed mb-8 line-clamp-3">
                                {res.description}
                            </p>

                            {/* 3. Footer Section */}
                            <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                    {/* Read Time mula sa DB */}
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {res.read_time}
                                    </div>
                                    {/* View Count mula sa DB */}
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {res.view_count}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onArticleClick(res.article_id)}
                                    className="flex items-center gap-2 bg-blue text-white px-5 py-2.5 
                                    rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 
                                    transition-all shadow-lg shadow-blue/20 group/btn cursor-pointer"
                                >
                                    Read More
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/15 transition-all duration-500" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedResources;