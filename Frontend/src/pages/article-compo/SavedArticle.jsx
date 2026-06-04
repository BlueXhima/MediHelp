import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BookMarked, Trash2, ArrowRight, Loader2, Bookmark, RotateCcw, Eraser, RefreshCw, BookOpen  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ToastMessage';

const SavedArticles = ({ setModalConfig }) => {
    const [savedList, setSavedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSavedArticles = async () => {
        try {
            const res = await api.get('/articles/library');
            setSavedList(res.data);
        } catch (err) {
            console.error("Error fetching saved articles:", err);
            showToast("Failed to fetch saved articles", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedArticles();
    }, []);

    // --- GLOBAL ACTIONS ---
    // 1. Clear All Saved Articles
    const handleClearLibraryConfirm = async () => {
        try {
            const res = await api.delete('/articles/library/clear');
            if (res.data.success) {
                setSavedList([]);
                showToast("Library cleared successfully", "success");
            }
        } catch (err) {
            console.error("Error clearing library:", err);
            showToast("Failed to clear library", "error");
        }
    };

    const initiateClearLibrary = () => {
        setModalConfig({
            isOpen: true,
            title: "Clear Saved Library",
            message: "Are you sure you want to remove all articles from your saved library? This action cannot be undone.",
            onConfirm: handleClearLibraryConfirm
        });
    };

    // --- INDIVIDUAL ACTIONS ---
    // 2. Remove Single Saved Article
    const handleRemoveSingleConfirm = async (articleId) => {
        try {
            const res = await api.post('/articles/save-toggle', 
                { articleId }
            );

            if (res.status === 200) {
                // UI Update muna para ramdam ng user ang bilis
                setSavedList(prevList => prevList.filter(item => item.article_id !== articleId));
                // FEEDBACK
                showToast("Article removed from library", "success");
            }
        } catch (err) {
            console.error("Error removing article:", err);
            showToast("Failed to remove article", "error");
        }
    };

    const initiateRemoveSingle = (item) => {
        setModalConfig({
            isOpen: true,
            title: "Remove from Saved",
            message: `Are you sure you want to remove "${item.title}" from your saved articles?`,
            onConfirm: async () => {
                // 1. ISARA MUNA ANG MODAL
                setModalConfig(prev => ({ ...prev, isOpen: false }));
                
                // 2. TAWAGIN ANG DELETE LOGIC (Wait for it)
                await handleRemoveSingleConfirm(item.article_id);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <Loader2 className="animate-spin text-primary/40" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Fetching Library</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">

            {/* Header with Global Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Bookmark size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Saved Content</span>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight">
                        Your Article Library<span className="font-serif italic text-primary">.</span>
                    </h1>
                </div>

                {savedList.length > 0 && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="dangerGhost" 
                            size="sm" 
                            leadingIcon={Trash2}
                            onClick={initiateClearLibrary}
                            className="flex-1 sm:flex-initial border border-red-500/10"
                        >
                            Clear Library
                        </Button>
                    </div>
                )}
            </div>

            {/* TABLE CONTAINER */}
            {savedList.length > 0 ? (
                <div className="overflow-x-auto border-t border-border/40 scrollbar-custom">
                    <table className="w-full text-left border-collapse min-w-150 lg:min-w-full">
                        <thead>
                            <tr className="border-b border-border/40">
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12">#</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Article</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Category</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Saved Date</th>
                                <th className="py-5 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {savedList.map((item, index) => (
                                <tr key={item.article_id} className="group hover:bg-primary/3 transition-colors border-b border-border/20">
                                    <td className="py-4 sm:py-6 px-4">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="py-4 sm:py-6 px-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <img 
                                                src={item.image_url} 
                                                alt="" 
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm shrink-0"
                                            />
                                            <span className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                {item.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 hidden md:table-cell">
                                        <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {item.category_name}
                                        </span>
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                                        {item.saved_date ? new Date(item.saved_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <Button 
                                                onClick={() => initiateRemoveSingle(item)}
                                                variant="dangerGhost" // O "ghost" depende sa gusto mong kulay
                                                size="sm"
                                                type="circular" // Para saktong icon size lang
                                            >
                                                <Trash2 size={15} />
                                            </Button>
                                            <button 
                                                onClick={() => navigate(`/dashboard/library/article/${item.article_id}`)} 
                                                className="p-2 rounded-lg hover:bg-primary/10 text-slate-300 hover:text-primary transition-all cursor-pointer"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-24 text-center border-t border-border/40">
                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                        <BookOpen size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm text-muted-foreground font-light italic">Your reading history is currently empty.</p>
                </div>
            )}
        </div>
    );
};

export default SavedArticles;
