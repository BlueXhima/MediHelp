import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Clock, ArrowRight, Loader2, X, BookOpen, Filter, ChevronLeft, Archive } from 'lucide-react';
import ReadingHistory from '../article-compo/RecentHistory';
import SavedArticles from '../article-compo/SavedArticle';
import ArchivedHistory from '../article-compo/ArchivedHistory';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Button from '../../components/ui/Button';

const AllArticles = ({ onViewChange, setModalConfig }) => {
    const location = useLocation();
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Ang viewMode ay pwedeng: 'list', 'history', o 'saved'
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('list');
    const navigate = useNavigate();

    useEffect(() => {
        // Check kung may pinasang 'viewMode' sa state galing sa navigate
        if (location.state?.viewMode) {
            setViewMode(location.state.viewMode);
            
            // Optional: Linisin ang state para 'di mag-loop pag nag-refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Dynamic Document Title
    const getTitle = () => {
        // Siguraduhing lowercase ang chine-check mo para match sa setViewMode mo
        if (viewMode === 'history') return 'Reading History';
        if (viewMode === 'saved') return 'Saved Articles';
        if (viewMode === 'archived') return 'Archived History';
        return 'Health Insights';
    };
    useDocumentTitle(getTitle());

    // I-notify ang Dashboard para sa TopHeader title
    useEffect(() => {
        const titles = {
            list: 'Health Insights',
            saved: 'Saved Articles',
            history: 'Reading History',
            archived: 'Archived Articles'
        };
        onViewChange(titles[viewMode] || 'Health Insights');
    }, [onViewChange, viewMode]);

    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'saved') setViewMode('saved');
        else if (view === 'history') setViewMode('history');
        else if (view === 'archived') setViewMode('archived');
        else setViewMode('list');
    }, [searchParams]);

    const handleBackToMainList = () => {
        setViewMode('list');
        setSearchParams({}); // Tinatanggal ang ?view=saved etc.
        
        // Siguraduhin na ang URL ay babalik sa tamang slug para sa Dashboard
        navigate('/dashboard/health-insights'); 
    };

    const handleViewChange = (newView) => {
        setViewMode(newView);
        setSearchParams({ view: newView });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/articles/all');
                setArticles(res.data);
                setFilteredArticles(res.data);
                const catRes = await api.get('/articles/categories');
                setCategories(catRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = articles.filter(art => {
            const matchesSearch = art.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                art.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || 
                                    art.category_name?.toUpperCase() === selectedCategory.toUpperCase();
            return matchesSearch && matchesCategory;
        });
        setFilteredArticles(filtered);
    }, [searchTerm, selectedCategory, articles]);

    const handleArticleClick = async (articleId) => { // Siguraduhing async ito
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const currentUserId = user?.UserID || user?.id;
            
            // Tawagin ang record-visit API
            await api.post('/articles/record-visit', 
                { articleId: articleId }, 
                { 
                    withCredentials: true 
                }
            );
            
            console.log("Visit recorded successfully");
            
            // Pagkatapos ma-record, tsaka pumunta sa Article Page
            navigate(`/dashboard/library/article/${articleId}`);
        } catch (error) {
            console.error("Error recording visit:", error);
            // Kahit may error sa record, ituloy pa rin ang navigate para hindi stuck ang user
            navigate(`/dashboard/library/article/${articleId}`);
        }
    };

    if (viewMode === 'history') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-w-6xl mx-auto px-6 pt-8">
                    <button 
                        onClick={handleBackToMainList}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} /> Back to Library
                    </button>
                </div>
                <ReadingHistory setModalConfig={setModalConfig}/>
            </div>
        );
    }

    // KUNG NAKA SAVED VIEW
    if (viewMode === 'saved') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-w-6xl mx-auto px-6 pt-8">
                    <button 
                        onClick={handleBackToMainList}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} /> Back to Library
                    </button>
                </div>
                <SavedArticles setModalConfig={setModalConfig}/>
            </div>
        );
    }

    // KUNG NAKA ARCHIVED VIEW
    if (viewMode === 'archived') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-w-6xl mx-auto px-6 pt-8">
                    <button 
                        onClick={handleBackToMainList}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} /> Back to Library
                    </button>
                </div>
                <ArchivedHistory setModalConfig={setModalConfig}/>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                <Loader2 className="animate-spin text-foreground/20" size={32} />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Loading Resources</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <div className="max-w-6xl mx-auto px-6 py-4 space-y-16">
                
                {/* Minimalist Header */}
                <header className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-light tracking-tight">
                                Article Library<span className="font-serif italic text-primary">.</span>
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                A curated collection of resources for your mental health and well-being.
                            </p>
                        </div>

                        {/* Action Buttons sa Right Side */}
                        <div className="flex items-center gap-3">
                            {/* SAVED */}
                            <Button 
                                onClick={() => handleViewChange('saved')}
                                variant={viewMode === 'saved' ? 'primary' : 'primary'}
                                type="pill"
                                size="sm"
                                leadingIcon={BookOpen}
                            >
                                Saved
                            </Button>

                            {/* ARCHIVED */}
                            <Button 
                                onClick={() => handleViewChange('archived')}
                                variant={viewMode === 'archived' ? 'secondary' : 'secondary'}
                                type="bordered"
                                size="sm"
                                leadingIcon={Archive}
                                className="rounded-full"
                            >
                                Archived
                            </Button>

                            {/* HISTORY */}
                            <Button 
                                onClick={() => handleViewChange('history')}
                                variant={viewMode === 'history' ? 'primary' : 'ghost'}
                                type="bordered"
                                size="sm"
                                leadingIcon={Clock}
                                className="rounded-full"
                            >
                                History
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-border/40">
                        {/* Search Component */}
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none pl-7 pr-4 py-2 text-sm focus:ring-0 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-custom w-full sm:w-auto">
                            <button 
                                onClick={() => setSelectedCategory('ALL')}
                                className={`text-[11px] font-medium uppercase tracking-widest whitespace-nowrap transition-colors ${selectedCategory === 'ALL' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat.category_id}
                                    onClick={() => setSelectedCategory(cat.category_name)}
                                    className={`text-[11px] font-medium uppercase tracking-widest whitespace-nowrap transition-colors ${selectedCategory === cat.category_name ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {cat.category_name}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Minimalist Grid */}
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {filteredArticles.map((article) => (
                            <article 
                                key={article.article_id}
                                onClick={() => handleArticleClick(article.article_id)}
                                className="group cursor-pointer space-y-5"
                            >
                                {/* Image Wrapper */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    <img 
                                        src={article.image_url || 'https://via.placeholder.com/800x450?text=Article'} 
                                        alt={article.title}
                                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-background/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-tighter">
                                            {article.category_name}
                                        </span>
                                    </div>
                                </div>

                                {/* Article Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {article.read_time || '5m'}</span>
                                        <span className="w-1 h-1 bg-border rounded-full" />
                                        <span>{article.view_count || 0} Views</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-medium leading-snug group-hover:text-primary transition-colors duration-300">
                                        {article.title}
                                    </h3>
                                    
                                    <p className="text-sm text-muted-foreground line-clamp-2 font-light leading-relaxed">
                                        {article.description || "Detailed health and well-being insights."}
                                    </p>

                                    <div className="pt-2">
                                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                            Read Article <ArrowRight size={14} className="text-primary" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    /* Minimalist Empty State */
                    <div className="py-24 text-center border-t border-border/40">
                        <p className="text-sm text-muted-foreground font-light italic">No results found for your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllArticles;
