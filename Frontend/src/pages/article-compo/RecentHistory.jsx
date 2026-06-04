import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BookOpen, Trash2, ArrowRight, Loader2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ToastMessage';

const ReadingHistory = ({ setModalConfig}) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const res = await api.get('/articles/history');
            setHistory(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // 1. Function para sa Clear All (Purge) Archive
    const handlePurgeConfirm = async () => {
        try {
            // DINAGDAGAN NG /articles PARA TUMAMA SA ROUTE
            const res = await api.post(`http://localhost:5000/api/articles/history/purge`);
            
            if (res.data.success) {
                setHistory([]);
                showToast("History successfully moved to archives!", "success");
            }
        } catch (err) {
            console.error("Purge Error:", err);
            showToast("Failed to archive history.", "error");
        }
    };
    
    // 2. Function para sa Single Archive
    const handleArchiveSingle = async (historyId) => {
        try {
            const res = await api.post(`/articles/history/archive-single/${historyId}`);

            if (res.data.success) {
                // I-filter ang state para mawala agad sa listahan yung in-archive
                setHistory(prev => prev.filter(item => item.history_id !== historyId));
                showToast("Article moved to archives!", "success");
            }
        } catch (err) {
            console.error("Archive Error:", err);
            showToast("Failed to archive article.", "error");
        }
    };

    // 3. Trigger para sa Delete All button
    const initiatePurge = () => {
        setModalConfig({
            isOpen: true,
            title: "Clear History",
            message: `Are you sure? This will move all ${history.length} articles from your recent footprints to the archived reading history.`,
            onConfirm: handlePurgeConfirm
        });
    };

    // 4. Trigger para sa Individual Trash icon
    const handleDeleteItem = (item) => {
        setModalConfig({
            isOpen: true,
            title: "Archive Article",
            message: `Are you sure you want to move "${item.title}" to your archives?`,
            onConfirm: () => handleArchiveSingle(item.history_id)
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <Loader2 className="animate-spin text-primary/40" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retrieving History</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <History size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Activity Log</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                        Reading History<span className="font-serif italic text-primary">.</span>
                    </h1>
                </div>

                {history.length > 0 && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="dangerGhost" 
                            size="sm" 
                            leadingIcon={Trash2}
                            onClick={initiatePurge}
                            className="flex-1 sm:flex-initial border border-red-500/10"
                        >
                            Clear History
                        </Button>
                    </div>
                )}
            </div>

            {history.length > 0 ? (
                <div className="overflow-x-auto border-t border-border/40 scrollbar-custom">
                    <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
                        <thead>
                            <tr className="border-b border-border/40">
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12">#</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Article</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Category</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">Date</th>
                                <th className="py-5 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {history.map((item, index) => (
                                <tr key={item.history_id} className="group hover:bg-primary/[0.03] transition-colors border-b border-border/20">
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
                                    <td className="py-4 sm:py-6 px-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-12 sm:w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-1000" 
                                                    style={{ width: `${item.progress_percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400">{item.progress_percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 hidden lg:table-cell text-xs text-slate-400 font-medium">
                                        {new Date(item.last_visited).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            {/* Individual Delete Button */}
                                            <button 
                                                onClick={() => handleDeleteItem(item)}
                                                className="p-2 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all cursor-pointer"
                                                title="Remove from history"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            {/* Read/Go to Article Button */}
                                            <button 
                                                onClick={() => navigate(`/dashboard/library/article/${item.article_id}`)}
                                                className="p-2 rounded-full hover:bg-primary/10 text-slate-300 hover:text-primary transition-all cursor-pointer"
                                            >
                                                <ArrowRight size={18} />
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

export default ReadingHistory;
