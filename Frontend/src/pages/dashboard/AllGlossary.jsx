import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, BookOpen, Clock, Archive, ChevronLeft } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Button from '../../components/ui/Button';

// Import mo rin dito yung mga kaukulang components kung meron ka na nito
// import GlossaryHistory from '../glossary-compo/GlossaryHistory'; 

const AllGlossary = ({ onViewChange }) => {
    const [glossary, setGlossary] = useState([]);
    const [filteredGlossary, setFilteredGlossary] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    
    // View state
    const [viewMode, setViewMode] = useState('list');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        onViewChange('Medical Glossary');
    }, [onViewChange, viewMode]);

    // Sync viewMode from URL
    useEffect(() => {
        const view = searchParams.get('view');
        setViewMode(view || 'list');
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Siguraduhin na tama ang endpoints mo rito
                const res = await api.get('/glossary/all');
                setGlossary(res.data);
                setFilteredGlossary(res.data);
                
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
        const filtered = glossary.filter(item => {
            const matchesSearch = item.term?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.definition?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || 
                                    item.category_name?.toUpperCase() === selectedCategory.toUpperCase();
            return matchesSearch && matchesCategory;
        });
        setFilteredGlossary(filtered);
    }, [searchTerm, selectedCategory, glossary]);

    const handleViewChange = (newView) => {
        setViewMode(newView);
        setSearchParams({ view: newView });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                <Loader2 className="animate-spin text-foreground/20" size={32} />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Loading Glossary</p>
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
                                Medical Glossary<span className="font-serif italic text-primary">.</span>
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                Quick reference for medical terms and health concepts.
                            </p>
                        </div>

                        {/* Buttons (Saved, Archived, History) */}
                        <div className="flex items-center gap-3">
                            <Button onClick={() => handleViewChange('saved')} variant={viewMode === 'saved' ? 'primary' : 'ghost'} size="sm" leadingIcon={BookOpen}>Saved</Button>
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

                {/* Content... */}
                {filteredGlossary.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGlossary.map((item) => (
                            <div 
                                key={item.infographic_id} 
                                className="group border border-border/40 hover:border-border-foreground/20 rounded-xl p-5 bg-card/40 backdrop-blur-xs transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                            >
                                <div className="space-y-2">
                                    {/* Header: Term at Pronunciation */}
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="text-md font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-200">
                                            {item.term}
                                        </h3>
                                        {item.pronunciation && (
                                            <span className="text-[12px] font-mono text-muted-foreground/70 italic tracking-wide">
                                                /{item.pronunciation}/
                                            </span>
                                        )}
                                    </div>
                
                                    {/* Body: Definition */}
                                    <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3 font-light">
                                        {item.definition}
                                    </p>
                                </div>
                
                                {/* Optional subtle anchor element at the bottom */}
                                <div className="pt-3 flex justify-end">
                                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary/60 transition-colors font-medium">
                                        View Term
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Minimalist Empty State */
                    <div className="py-20 text-center border border-dashed border-border/40 rounded-2xl bg-card/20">
                        <p className="text-xs text-muted-foreground font-light tracking-wide">
                            No medical glossary entries found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllGlossary;
