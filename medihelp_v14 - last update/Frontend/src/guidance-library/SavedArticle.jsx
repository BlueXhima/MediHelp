import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, Clock, ChevronRight, Trash2, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/navbar'; // Siguraduhin na tama ang path
import ToastMessage, { showToast } from '../../components/ToastMessage';
import DeleteModal from '../../components/DeleteModal';

const SavedArticles = () => {
    const navigate = useNavigate();
    const [savedList, setSavedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSavedArticles = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData?.UserID) {
            try {
                const res = await axios.get(`http://localhost:5000/api/articles/library/${userData.UserID}`);
                setSavedList(res.data);
            } catch (err) {
                console.error("Failed to fetch library:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSavedArticles();
    }, []);

    const handleRemove = async (e, articleId) => {
        e.preventDefault(); // Para hindi mag-trigger ang Link
        const userData = JSON.parse(localStorage.getItem('user'));
        try {
            await axios.post('http://localhost:5000/api/articles/save-toggle', {
                userId: userData.UserID,
                articleId: articleId
            });
            showToast("Article removed from library", "info");
            fetchSavedArticles(); // Refresh list
        } catch (err) {
            showToast("Failed to remove article", "error");
        }
    };

    const handleClearAll = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        try {
            await axios.delete(`http://localhost:5000/api/articles/library/clear/${userData.UserID}`);
            showToast("Library cleared", "success");
            setSavedList([]);
        } catch (err) {
            showToast("Failed to clear library", "error");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <ToastMessage />

            <DeleteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleClearAll}
                title="Clear Library"
                message="Are you sure you want to remove all saved articles? This action cannot be undone and your library will be completely empty."
            />
            
            <main className="max-w-7xl mx-auto px-6 py-8 pt-24">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-10">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group px-4 py-2 bg-card rounded-full border hover:border-emerald-600 flex items-center gap-2 cursor-pointer text-slate-500 hover:text-emerald-600 font-bold transition-colors w-fit"
                    >
                        <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                            <ArrowLeft size={14} />
                        </div>
                        <span>Go Back</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-wide uppercase text-sm">
                                <Bookmark size={18} fill="currentColor" />
                                <span>Knowledge Base</span>
                            </div>
                            <h1 className="text-4xl font-black text-foreground text-left tracking-tight">
                                My Saved Library
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Manage and revisit your bookmarked health guides and articles.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {savedList.length > 0 && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={16} />
                                    Clear All
                                </button>
                            )}

                            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-fit">
                                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                                    {savedList.length}
                                </div>
                                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Articles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold animate-pulse">Fetching your library...</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {savedList.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card rounded-3xl p-12 text-center border-2 border-dashed border-border"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No saved articles yet</h3>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                    Start exploring our guidance library and save articles you want to read later.
                                </p>
                                <Link 
                                    to="/dashboard/guidance-library/all-articles"
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    Explore Articles
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6">
                                {savedList.map((article, index) => (
                                    <motion.div
                                        key={article.article_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link 
                                            to={`/dashboard/guidance-library/article/${article.article_id}`}
                                            className="group relative bg-card p-4 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
                                        >
                                            {/* Eto yung numbering indicator */}
                                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                                                {index + 1}
                                            </div>

                                            {/* Article Image */}
                                            <div className="relative shrink-0">
                                                <img 
                                                    src={article.image_url} 
                                                    alt={article.title}
                                                    className="w-full md:w-32 h-32 object-cover rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-emerald-700">
                                                    {article.category_name}
                                                </div>
                                            </div>

                                            {/* Article Info */}
                                            <div className="flex-1 space-y-2 text-left">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                    <Clock size={12} />
                                                    <span>Saved on {new Date(article.saved_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    {article.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                                    {article.description || "Learn more about this topic in our comprehensive health guide..."}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                <button 
                                                    onClick={(e) => handleRemove(e, article.article_id)}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                    title="Remove from Library"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                                <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 rounded-2xl transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
};

export default SavedArticles;