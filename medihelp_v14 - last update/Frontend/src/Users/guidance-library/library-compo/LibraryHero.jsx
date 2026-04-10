import React from 'react';

const LibraryHero = ({ onSearch, searchQuery }) => {
    return (
        <section className="relative w-full py-10 px-6 rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-xl animate-fade-in">
            {/* Background Decorative Elements using your index.css colors */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-72 h-72 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Badge/Tag */}
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 rounded-full animate-fade-in-delay-1">
                    Knowledge Base
                </span>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in-delay-2">
                    Guidance <span className="text-primary text-glow">Library</span>
                </h1>

                {/* Short Description */}
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed animate-fade-in-delay-3">
                    Explore our comprehensive collection of verified medical documentation, 
                    proactive wellness guides, and emergency first-aid protocols.
                </p>

                {/* Search Bar Section (The Integrated Search Card) */}
                <div className="relative group max-w-3xl mx-auto animate-fade-in-delay-4">
                    {/* Glow effect on focus */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    
                    <div className="relative flex items-center bg-background border border-border rounded-2xl p-1.5 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                        
                        {/* Search Icon */}
                        <div className="pl-4 pr-2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <input 
                            type="text"
                            placeholder="Search for medications, symptoms, or health tips..."
                            className="w-full bg-transparent border-none outline-none py-3 px-2 text-foreground placeholder:text-slate-400"
                            onChange={(e) => onSearch(e.target.value)}
                            value={searchQuery}
                        />

                        <div className="flex items-center gap-2 pr-1">
                            {/* Voice Search Button */}
                            <button 
                                type="button"
                                title="Voice Search"
                                className="p-2.5 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90 group/mic"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2m14 0a1 1 0 00-2 0v2a5 5 0 01-10 0v-2a1 1 0 00-2 0v2a7 7 0 007 7h2a7 7 0 007-7v-2z" />
                                    <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
                                    <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
                                </svg>
                                
                                {/* Tooltip or Pulse effect (Optional) */}
                                <span className="absolute -top-10 left-1/2 mt-2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/mic:opacity-100 transition-opacity pointer-events-none">
                                    Voice Search
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Suggestion Tags */}
                <div className="mt-4 w-full max-w-3xl mx-auto animate-fade-in-delay-4">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold italic uppercase tracking-[0.2em] text-primary/60 dark:text-primary/80">
                            Popular Searches
                        </span>
                        <div className="h-[1px] flex-grow bg-border/50"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 justify-start">
                        {['First Aid', 'Mental Health', 'Medication Safety', 'Emergency Protocols', 'Wellness Guides', 'Vaccination'].map((tag) => (
                            <button 
                                key={tag}
                                onClick={() => onSearch(tag)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold
                                        bg-card border border-border shadow-sm
                                        text-foreground/70 hover:text-primary hover:border-primary 
                                        hover:shadow-md hover:shadow-primary/5 
                                        transition-all duration-300 active:scale-95
                                        flex items-center gap-2 cursor-pointer"
                            >
                                {/* Visual indicator para sa bawat tag */}
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary" />
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LibraryHero;