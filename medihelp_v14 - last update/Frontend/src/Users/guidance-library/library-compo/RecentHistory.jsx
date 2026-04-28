import React, { useState, useEffect } from 'react';
import { Clock, History, X, BookOpen, Trash2, ArrowRight, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

// Import components
import BackgroundLoadingState from "../../../components/BackgroundLoadingState";
import DeleteModal from "../../../components/DeleteModal";
import ToastMessage, { showToast } from "../../../components/ToastMessage";

const RecentHistory = ({ isOpen, onClose }) => {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [isPurging, setIsPurging] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);
    const [deleteMode, setDeleteMode] = useState('single'); // 'single' o 'all'
    const [selectedArticleTitle, setSelectedArticleTitle] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            // Kunin ang user object para ma-verify kung logged in
            // const userData = JSON.parse(localStorage.getItem('user'));
            
            // TRIGGER: Kapag bukas ang drawer AT may user session
            if (isOpen) {
                setLoading(true);
                try {
                    // Ang withCredentials: true ang bahalang magpadala ng httpOnly cookie mo
                    const res = await axios.get(`http://localhost:5000/api/articles/history`, {
                        withCredentials: true // ITO ANG PINAKA-IMPORTANTE para sa cookies
                    });
                    
                    setHistoryItems(res.data);
                } catch (err) {
                    console.error("Fetch error:", err);
                    if (err.response?.status === 401) {
                        showToast("Session expired. Please login again.", "error");
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHistory();
    }, [isOpen]);

    const handlePurgeConfirm = async () => {
        setIsPurging(true);
        try {
            // DINAGDAGAN NG /articles PARA TUMAMA SA ROUTE
            const res = await axios.post(`http://localhost:5000/api/articles/history/purge`, {
                withCredentials: true
            });
            
            if (res.data.success) {
                setHistoryItems([]);
                showToast("History successfully moved to archives!", "success");
            }
        } catch (err) {
            console.error("Purge Error:", err);
            showToast("Failed to archive history.", "error");
        } finally {
            setIsPurging(false);
            setIsModalOpen(false);
        }
    };

    const handleArchiveSingle = async (historyId) => {
        // Siguraduhin na may historyId na natatanggap
        if (!historyId) {
            console.error("History ID is missing!");
            return;
        }

        setIsPurging(true); 
        try {
            const res = await axios.post(`http://localhost:5000/api/articles/history/archive-single/${historyId}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                // I-filter ang state para mawala agad sa listahan yung in-archive
                setHistoryItems(prev => prev.filter(item => item.history_id !== historyId));
                showToast("Article moved to archives!", "success");
            }
        } catch (err) {
            console.error("Archive Error:", err);
            showToast("Failed to archive article.", "error");
        } finally {
            setIsPurging(false);
        }
    };

    const initiatePurge = () => {
        onClose();
        setDeleteMode('all'); 
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (deleteMode === 'single') {
            handleArchiveSingle(selectedHistoryId);
        } else {
            handlePurgeConfirm();
        }
    };

    return (
        <>
            <ToastMessage />
            <BackgroundLoadingState isLoading={isPurging} message="Archiving your history..." />
            
            <DeleteModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedHistoryId(null);
                }}
                onConfirm={handleConfirmAction} // Use the unified handler
                title={deleteMode === 'single' ? "Archive Article" : "Clear History"}
                message={deleteMode === 'single' 
                    ? `Are you sure you want to move "${selectedArticleTitle}" to your archives?` 
                    : `Are you sure? This will move all ${historyItems.length} articles from your recent footprints to the archived reading history.`}
            />

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        {/* Backdrop with Fade In/Out */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
                            onClick={onClose} 
                        />
                        
                        {/* Drawer with Spring Slide In/Out */}
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-[400px] bg-background shadow-2xl flex flex-col h-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 flex items-center justify-between border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <History size={20} />
                                    </div>
                                    <h2 className="font-black uppercase italic tracking-tight">Recent Footprints</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors cursor-pointer">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-24 bg-secondary/50 rounded-[24px] animate-pulse" />
                                        ))}
                                    </div>
                                ) : historyItems.length > 0 ? (
                                    <motion.div 
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            show: { transition: { staggerChildren: 0.05 } }
                                        }}
                                        className="space-y-4"
                                    >
                                        {historyItems.map((item) => (
                                            <motion.div 
                                                key={item.article_id}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => { 
                                                    onClose(); 
                                                    navigate(`/dashboard/guidance-library/article/${item.article_id}`); 
                                                }}
                                                className="group relative p-6 bg-card backdrop-blur-sm border border-border rounded-[24px] 
                                                        hover:bg-white hover:border-primary/30 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] 
                                                        transition-all duration-300 cursor-pointer overflow-hidden"
                                                title="Redirecting to Article Page"
                                            >
                                                <div className="relative flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                                        <BookOpen size={18} className="text-slate-400 group-hover:text-primary" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-left text-[15px] text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            <Calendar size={12} />
                                                            <span>{new Date(item.last_visited).toLocaleDateString()}</span>
                                                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                            <span className="text-primary">{item.progress_percentage}% DONE</span>
                                                        </div>
                                                        
                                                        <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.progress_percentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className="h-full bg-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={14} className="text-slate-300 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Iwasan ang pag-trigger ng Link/Click ng card
                                                        // 1. Close the RecentHistory drawer first
                                                        onClose(); 
                                                        // 2. Set the ID and the dynamic message (Title)
                                                        setSelectedHistoryId(item.history_id);
                                                        setDeleteMode('single');
                                                        // 3. Store the title temporarily if you want to use it in the message
                                                        setSelectedArticleTitle(item.title); 
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                    title="Archive this record"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic text-sm py-20">
                                        No footprints found.
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border bg-card">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={initiatePurge}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                                    bg-slate-50 text-slate-400 font-black uppercase italic text-xs tracking-[0.2em]
                                    hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100 cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    <span>Clear History Data</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RecentHistory;