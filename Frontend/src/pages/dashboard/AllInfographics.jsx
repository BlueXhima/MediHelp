import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, Image as ImageIcon, Clock, Archive } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Button from '../../components/ui/Button';

const AllInfographics = ({ onViewChange }) => {
    const [infographics, setInfographics] = useState([]);
    const [filteredInfographics, setFilteredInfographics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    useEffect(() => {
        onViewChange('Infographics');
    }, [onViewChange, viewMode]);

    useEffect(() => {
        const view = searchParams.get('view');
        setViewMode(view || 'list');
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/infographics/all');
                setInfographics(res.data);
                setFilteredInfographics(res.data);

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
        const filtered = infographics.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || 
                                    item.category_name?.toUpperCase() === selectedCategory.toUpperCase();
            return matchesSearch && matchesCategory;
        });
        setFilteredInfographics(filtered);
    }, [searchTerm, selectedCategory, infographics]);

    const handleViewChange = (newView) => {
        setViewMode(newView);
        setSearchParams({ view: newView });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                <Loader2 className="animate-spin text-foreground/20" size={32} />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Loading Infographics</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <div className="max-w-6xl mx-auto px-6 py-4 space-y-16">
                <header className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-light tracking-tight">
                                Infographics<span className="font-serif italic text-primary">.</span>
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                Visual health guides and summaries.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button onClick={() => handleViewChange('saved')} variant={viewMode === 'saved' ? 'primary' : 'ghost'} size="sm" leadingIcon={ImageIcon}>Saved</Button>
                            <Button onClick={() => handleViewChange('archived')} variant={viewMode === 'archived' ? 'secondary' : 'ghost'} size="sm" leadingIcon={Archive}>Archived</Button>
                            <Button onClick={() => handleViewChange('history')} variant={viewMode === 'history' ? 'primary' : 'ghost'} size="sm" leadingIcon={Clock}>History</Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-border/40">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search terms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none pl-7 pr-4 py-2 text-sm focus:ring-0 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>

                        {/* Categories Filter */}
                        <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-custom w-full sm:w-auto">
                            <button onClick={() => setSelectedCategory('ALL')} className={`text-[11px] font-medium uppercase tracking-widest ${selectedCategory === 'ALL' ? 'text-primary' : 'text-muted-foreground'}`}>All</button>
                            {categories.map(cat => (
                                <button 
                                    key={cat.category_id}
                                    onClick={() => setSelectedCategory(cat.category_name)}
                                    className={`text-[11px] font-medium uppercase tracking-widest whitespace-nowrap ${selectedCategory === cat.category_name ? 'text-primary' : 'text-muted-foreground'}`}
                                >
                                    {cat.category_name}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {filteredInfographics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredInfographics.map((item) => (
                            <div key={item.infographic_id} className="group cursor-pointer relative aspect-3/4 rounded-2xl overflow-hidden bg-card border border-border/40">
                                {/* Image Background */}
                                <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-2 py-1 bg-background/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-tighter">
                                        {item.category_name || 'Uncategorized'}
                                    </span>
                                </div>

                                {/* Content Overlay with Gradient Shadow */}
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-md font-semibold text-white tracking-tight">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-[12px] text-white/80 line-clamp-2 mt-1 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-t border-border/40">
                        <p className="text-sm text-muted-foreground font-light italic">No infographics found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllInfographics;
