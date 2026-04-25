import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, Archive, ArrowLeft, BookOpen, Calendar, Clock, Trash2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ToastMessage, { showToast } from "../../../components/ToastMessage";

const ArchivedHistory = () => {
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [processingAction, setProcessingAction] = useState(null); // 'restore-all' o 'delete-all'
    const [processingId, setProcessingId] = useState(null);

    const fetchArchives = async () => {
        if (!userData?.UserID) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/articles/history/archives/${userData.UserID}`);
            setArchives(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArchives(); }, []);

    const handleBulkAction = async (url, method, actionType) => {
        const itemCount = archives.length; // Kunin ang count bago ma-clear
        setProcessingAction(actionType);
        
        try {
            const res = await axios[method](url);
            if (res.data.success) {
                // Siguraduhin na tama ang logic ng message
                const message = actionType === 'restore-all'
                    ? `Full restoration complete! ${itemCount} records moved back to history.`
                    : `The vault has been cleared. ${itemCount} records permanently removed.`;
                
                showToast(message, "success");
                fetchArchives();
            }
        } catch (err) {
            console.error("Bulk Error:", err);
            showToast("Bulk operation failed.", "error");
        } finally {
            setProcessingAction(null);
        }
    };

    // Handler para sa Individual Actions (Restore/Delete)
    const handleIndividualAction = async (url, item, method, actionType) => {
        setProcessingId(`${actionType}-${item.ArchiveID}`);
        try {
            const res = await axios[method](url);
            if (res.data.success) {
                const message = actionType === 'restore' 
                    ? `Successfully restored "${item.Title}"!` 
                    : `Permanently deleted "${item.Title}".`;
                
                showToast(message, "success"); // <--- Dapat itong lumabas
                fetchArchives();
            }
        } catch (err) {
            console.error("Individual Action Error:", err);
            showToast("Failed to process request.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <ToastMessage />
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center text-left gap-5">
                        <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-[24px]">
                            <Archive className="text-primary" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Archived Footprints</h1>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">Safety vault for your history</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-2xl font-bold 
                        border border-slate-100 hover:border-primary/30 transition-all shadow-sm self-start 
                        md:self-center cursor-pointer"
                    >
                        <ArrowLeft size={18} /> Back to Library
                    </button>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {archives.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-[24px] mb-8 shadow-xl"
                        >
                            <div className="flex items-center gap-3 ml-4">
                                <ShieldAlert className="text-amber-400" size={20} />
                                <span className="text-foreground font-bold text-sm">Quick Actions ({archives.length} items)</span>
                            </div>
                            <div className="flex gap-2">
                                {/* Restore All Button */}
                                <button 
                                    disabled={processingAction !== null}
                                    onClick={() => handleBulkAction(
                                        `http://localhost:5000/api/articles/history/restore-all/${userData.UserID}`, 
                                        'post', 
                                        "All records restored!",
                                        'restore-all'
                                    )}
                                    className={`flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all ${processingAction === 'restore-all' ? 'opacity-70' : ''}`}
                                >
                                    <motion.div
                                        animate={processingAction === 'restore-all' ? { rotate: 360 } : { rotate: 0 }}
                                        transition={processingAction === 'restore-all' ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.5 }}
                                    >
                                        <RefreshCcw size={14} />
                                    </motion.div>
                                    {processingAction === 'restore-all' ? 'Restoring...' : 'Restore All'}
                                </button>

                                {/* Delete All Button */}
                                <button 
                                    disabled={processingAction !== null}
                                    onClick={() => handleBulkAction(
                                        `http://localhost:5000/api/articles/history/archive-all/${userData.UserID}`, 
                                        'delete', 
                                        "Archive cleared!",
                                        'delete-all'
                                    )}
                                    className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <motion.div
                                        animate={processingAction === 'delete-all' ? { 
                                            x: [0, -2, 2, -2, 2, 0],
                                            color: ["#f87171", "#ffffff", "#f87171"] 
                                        } : {}}
                                        transition={processingAction === 'delete-all' ? { repeat: Infinity, duration: 0.4 } : {}}
                                    >
                                        <Trash2 size={14} />
                                    </motion.div>
                                    {processingAction === 'delete-all' ? 'Deleting...' : 'Delete All'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-white rounded-[32px] animate-pulse border border-slate-100" />)}
                    </div>
                ) : archives.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {archives.map((item) => (
                            <motion.div 
                                layout
                                key={item.ArchiveID} 
                                className="group relative bg-white border border-slate-200/60 p-0 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                            >
                                {/* Decorative Accent */}

                                <div className="p-7">
                                    <div className="flex items-start text-left justify-between mb-6">
                                        <div className="flex items-center gap-5">
                                            {/* Icon Container */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                                    <BookOpen size={24} />
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-extrabold text-slate-800 text-md line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                                    {item.Title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider">{item.ProgressPercentage}% Completed</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2.5">
                                            <button 
                                                disabled={processingAction !== null || processingId !== null}
                                                onClick={() => handleIndividualAction(
                                                    `http://localhost:5000/api/articles/history/restore/${item.ArchiveID}`, 
                                                    item, 'post', 'restore'
                                                )}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-slate-100 cursor-pointer active:scale-90"
                                                title="Restore to History"
                                            >
                                                <motion.div
                                                    animate={processingId === `restore-${item.ArchiveID}` ? { rotate: 360 } : { rotate: 0 }}
                                                    transition={processingId === `restore-${item.ArchiveID}` ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.5 }}
                                                >
                                                    <RefreshCcw size={18} />
                                                </motion.div>
                                            </button>
                                            <button 
                                                disabled={processingAction !== null || processingId !== null}
                                                onClick={() => handleIndividualAction(
                                                    `http://localhost:5000/api/articles/history/archive/${item.ArchiveID}`, 
                                                    item, 'delete', 'delete'
                                                )}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100 cursor-pointer active:scale-90"
                                                title="Delete Permanently"
                                            >
                                                <motion.div
                                                    animate={processingId === `delete-${item.ArchiveID}` ? { x: [0, -1, 1, -1, 1, 0] } : {}}
                                                    transition={processingId === `delete-${item.ArchiveID}` ? { repeat: Infinity, duration: 0.3 } : {}}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Visual) */}
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.ProgressPercentage}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                    
                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-5 mt-auto">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px]">
                                                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                                                    <Calendar size={14} />
                                                </div>
                                                <span>{new Date(item.ArchivedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px]">
                                                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                                                    <Clock size={14} />
                                                </div>
                                                <span className="tracking-tighter">{item.ArchivedTime}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 group-hover:border-primary/20 group-hover:text-primary/50 transition-colors">
                                            ID: #{item.ArchiveID}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
                            <div className="relative p-12 bg-white rounded-full shadow-inner border border-slate-50">
                                <Archive size={80} className="text-slate-100" />
                            </div>
                        </div>
                        <h3 className="text-slate-400 font-black uppercase tracking-widest italic text-xl">Vault is Empty</h3>
                        <p className="text-sm text-slate-400 max-w-xs mt-3 font-medium leading-relaxed">Safety first! Your archived activity will be stored here for future restoration.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivedHistory;