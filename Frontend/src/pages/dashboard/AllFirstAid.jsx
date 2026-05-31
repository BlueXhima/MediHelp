import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, HeartPulse, ChevronLeft, Archive, Clock, BookOpen } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Button from '../../components/ui/Button';

const AllFirstAid = ({ onViewChange }) => {
    const [firstAid, setFirstAid] = useState([]);
    const [filteredFirstAid, setFilteredFirstAid] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // View state
    const [viewMode, setViewMode] = useState('list');
    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
        onViewChange('First Aid Guides');
    }, [onViewChange]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/sop/all');
                setFirstAid(res.data);
                setFilteredFirstAid(res.data);
                
                const catRes = await axios.get('http://localhost:5000/api/articles/categories');
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
        const filtered = firstAid.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || 
                                    item.category_name?.toUpperCase() === selectedCategory.toUpperCase();
            return matchesSearch && matchesCategory;
        });
        setFilteredFirstAid(filtered);
    }, [searchTerm, selectedCategory, firstAid]);

    const handleViewChange = (newView) => {
        setViewMode(newView);
        setSearchParams({ view: newView });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                <Loader2 className="animate-spin text-foreground/20" size={32} />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Loading Guides</p>
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
                                First Aid Guides<span className="font-serif italic text-primary">.</span>
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                Emergency response and life-saving procedures.
                            </p>
                        </div>

                        {/* Buttons (Saved, Archived, History) */}
                        <div className="flex items-center gap-3">
                            <Button onClick={() => handleViewChange('saved')} variant={viewMode === 'saved' ? 'primary' : 'ghost'} size="sm" leadingIcon={BookOpen}>Saved</Button>
                            <Button onClick={() => handleViewChange('archived')} variant={viewMode === 'archived' ? 'secondary' : 'ghost'} size="sm" leadingIcon={Archive}>Archived</Button>
                            <Button onClick={() => handleViewChange('history')} variant={viewMode === 'history' ? 'primary' : 'ghost'} size="sm" leadingIcon={Clock}>History</Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-border/40">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search guides..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none pl-7 pr-4 py-2 text-sm focus:ring-0 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>

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

                {filteredFirstAid.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredFirstAid.map((item) => (
                            <div key={item.firstaid_id} className="group p-6 rounded-2xl border border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                                    <span className="px-2 py-1 bg-primary/5 text-[9px] font-bold uppercase tracking-tighter text-primary">
                                        {item.category_name}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-t border-border/40">
                        <p className="text-sm text-muted-foreground font-light italic">No first aid guides found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllFirstAid;