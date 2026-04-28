import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/navbar';

const AllArticles = () => {
    const [articles, setArticles] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL CATEGORIES");
    const gridRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/articles/all');
                setArticles(res.data);
            } catch (err) {
                console.error("Error fetching all articles:", err);
            }
        };
        fetchAll();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesSearch = 
            article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            article.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = 
            selectedCategory === "ALL CATEGORIES" || 
            article.category_name?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    const handleArticleClick = async (articleId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const currentUserId = user?.UserID || user?.id;

            if (currentUserId && articleId) {
                // Siguraduhin na ang URL ay tama: http://localhost:5000/api/articles/history
                await axios.post('http://localhost:5000/api/articles/record-visit', {
                    userId: currentUserId,
                    articleId: articleId
                });
                console.log("History saved successfully!");
            }
        } catch (err) {
            // Ang HTML error na nakita mo ay lalabas dito
            console.error("Error saving history:", err.response?.data || err.message);
        } finally {
            navigate(`/dashboard/guidance-library/article/${articleId}`);
        }
    };

    const isScrollable = filteredArticles.length >= 12;

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden text-left">
            <Navbar />

            {/* Background Decor - consistent sa MediHelp theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-subtle" />
                <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-blue/5 blur-[100px] rounded-full" />
            </div>

            <div className="pt-28 pb-12 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 animate-fade-in">
                    {/* Left Side: Back Button & Title */}
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-3 bg-card border border-border rounded-2xl hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer group shadow-sm active:scale-90"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Knowledge Base</p>
                            </div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground">
                                All <span className="text-primary text-glow">Articles</span>
                            </h1>
                        </div>
                    </div>
                    
                    {/* Right Side: Filters & Search */}
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        {/* Search Bar */}
                        <div className="relative group max-w-md">
                            {/* Animated Background Glow (Focus state) */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                            
                            <div className="relative flex items-center">
                                {/* Search Icon */}
                                <div className="absolute left-4 flex items-center pointer-events-none text-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Input Field */}
                                <input 
                                    type="text" 
                                    placeholder="SEARCH RESOURCES..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full md:w-72 pl-11 pr-10 py-3.5 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl text-[11px] font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-card/80transition-all duration-300"
                                />

                                {/* Clear Button (Lalabas lang kapag may tinype) */}
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Shortcut Hint (Optional - pang desktop feel) */}
                            <div className="absolute right-4 top-1/3 -translate-y-1/3 pointer-events-none hidden lg:group-focus-within:hidden lg:block">
                                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[9px] font-bold text-muted-foreground/60 shadow-sm">
                                    /
                                </kbd>
                            </div>
                        </div>

                        {/* Category Dropdown/Filter */}
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none pl-5 pr-10 py-3 bg-card/50 backdrop-blur-md 
                                border border-border rounded-2xl text-[10px] font-black uppercase 
                                tracking-widest focus:outline-none focus:border-primary/50 cursor-pointer 
                                hover:bg-secondary/50 transition-all"
                            >
                                <option value="ALL CATEGORIES">ALL CATEGORIES</option>
                                <option value="General Health">GENERAL HEALTH</option>
                                <option value="Symptoms">SYMPTOMS</option>
                                <option value="Medications">MEDICATIONS</option>
                                <option value="Nutrition">NUTRITION</option>
                                <option value="Exercise">EXERCISE</option>
                                <option value="Mental Health">MENTAL HEALTH</option>
                                <option value="Chronic Conditions">CHRONIC CONDITIONS</option>
                                <option value="Preventive Care">PREVENTIVE CARE</option>
                                <option value="Emergency Care">EMERGENCY CARE</option>
                                <option value="Pediatric">PEDIATRIC</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Counter Badge */}
                        <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-2xl hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                {articles.length} <span className="opacity-60">Total</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                <div 
                    ref={gridRef}
                    className={`
                        p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left pr-4
                        transition-all duration-500 ease-in-out
                        ${isScrollable 
                            ? 'max-h-[1030px] overflow-y-auto scrollbar-custom' 
                            : 'h-auto overflow-visible'}
                    `}
                    style={{
                        // Gumamit ng scrollbarGutter para hindi gumagalaw ang layout kapag lumabas ang scrollbar
                        scrollbarGutter: isScrollable ? 'stable' : 'auto',
                        scrollbarWidth: isScrollable ? 'thin' : 'none',
                        scrollbarColor: '#4F46E5 #f1f5f9',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {filteredArticles.map((res, index) => (
                        <div 
                            key={res.article_id} 
                            className="group flex flex-col bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Image Container with Overlay */}
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10 opacity-60" />
                                <img 
                                    src={res.image_url || "https://via.placeholder.com/400x250?text=MediHelp"} 
                                    alt={res.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=MediHelp"; }}
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="px-3 py-1.5 bg-card/90 backdrop-blur-md border border-border rounded-xl flex items-center gap-2 shadow-lg min-h-[32px]">
                                        <span className="text-sm shrink-0">{res.icon_emoji || '📄'}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary truncate max-w-[100px]">
                                            {res.category_name || res.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-7 flex flex-col flex-grow relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <h3 className="text-xl font-black mb-3 leading-tight text-foreground group-hover:text-primary transition-colors duration-300 italic">
                                    {res.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-8 leading-relaxed font-medium">
                                    {res.description}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{res.read_time || '5 min read'}</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleArticleClick(res.article_id)}
                                        className="flex items-center gap-2 text-primary text-[10px] 
                                        font-black uppercase tracking-[0.15em] group/btn cursor-pointer"
                                    >
                                        View Full Article
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredArticles.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center animate-fade-in text-center">
                        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 opacity-50 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black uppercase italic tracking-widest text-muted-foreground">No articles discovered yet</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllArticles;