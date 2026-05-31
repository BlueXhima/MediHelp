import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Archive, Trash2, RotateCcw, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ToastMessage';

const ArchivedHistory = ({ setModalConfig }) => {
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchArchives = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/articles/history/archives', {
                withCredentials: true
            });
            setArchives(res.data);
        } catch (err) {
            console.error("Error fetching archives:", err);
            showToast("Failed to fetch archives", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchives();
    }, []);

    // --- GLOBAL ACTIONS ---
    // --- RESTORE ACTIONS (No Modal, Direct Toast) ---
    const handleRestoreAll = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/articles/history/restore-all', {}, { withCredentials: true });
            if (res.data.success) {
                setArchives([]);
                showToast("All articles restored to history!", "success");
            }
        } catch (err) {
            console.error("Restore all failed:", err);
            showToast("Failed to restore all articles", "error");
        }
    };

    // --- DELETE ACTIONS (With DeleteModal via setModalConfig) ---
    // 1. Delete All Logic
    const handleDeleteAllConfirm = async () => {
        try {
            const res = await axios.delete('http://localhost:5000/api/articles/history/archive-all', { withCredentials: true });
            if (res.data.success) {
                setArchives([]);
                showToast("Archive cleared permanently", "success");
            }
        } catch (err) {
            console.error("Delete all failed:", err);
            showToast("Failed to clear archive", "error");
        }
    };

    const initiateDeleteAll = () => {
        setModalConfig({
            isOpen: true,
            title: "Clear All Archives",
            message: "Are you sure you want to permanently delete all archived articles? This action cannot be undone",
            onConfirm: handleDeleteAllConfirm
        });
    };

    // --- INDIVIDUAL ACTIONS ---
    const handleRestoreSingle = async (archiveId) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/articles/history/restore/${archiveId}`, {}, { withCredentials: true });
            setArchives(prevArchives => 
                prevArchives.filter(item => {
                    const currentId = item.ArchiveID || item.archive_id;
                    return currentId !== archiveId;
                })
            );
            showToast("Article restored successfully", "success");
        } catch (err) {
            console.error("Restore failed:", err);
            showToast("Failed to restore article", "error");
        }
    };

    // 2. Delete Single Logic
    const handleDeleteSingleConfirm = async (archiveId) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/articles/history/archive/${archiveId}`, { withCredentials: true });
            if (res.data.success) {
                setArchives(prev => prev.filter(item => (item.ArchiveID || item.archive_id) !== archiveId));
                showToast("Article permanently deleted", "success");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            showToast("Failed to delete record", "error");
        }
    };

    const initiateDeleteSingle = (item) => {
        const id = item.ArchiveID || item.archive_id;
        setModalConfig({
            isOpen: true,
            title: "Permanent Delete",
            message: `Are you sure you want to permanently delete "${item.title}"? This record will be lost forever.`,
            onConfirm: () => handleDeleteSingleConfirm(id)
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] gap-3">
                <Loader2 className="animate-spin text-primary/20" size={32} />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Accessing Archives</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Archive size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Archived Content</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                        Your Archived History<span className="font-serif italic text-primary">.</span>
                    </h1>
                </div>

                {archives.length > 0 && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            leadingIcon={RotateCcw}
                            onClick={handleRestoreAll}
                            className="flex-1 sm:flex-initial"
                        >
                            Restore All
                        </Button>
                        <Button 
                            variant="dangerGhost" 
                            size="sm" 
                            leadingIcon={Trash2}
                            onClick={initiateDeleteAll}
                            className="flex-1 sm:flex-initial border border-red-500/10"
                        >
                            Delete All
                        </Button>
                    </div>
                )}
            </div>

            {archives.length > 0 ? (
                <div className="overflow-x-auto border-t border-border/40 scrollbar-custom">
                    <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
                        <thead>
                            <tr className="border-b border-border/40">
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12">#</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Article</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Category</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Archived Date</th>
                                <th className="py-5 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {archives.map((item, index) => (
                                <tr key={item.ArchiveID || item.archive_id || index} className="group hover:bg-primary/[0.03] transition-colors border-b border-border/20">
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
                                                    style={{ width: `${item.ProgressPercentage || item.progress_percentage || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400">
                                                {item.ProgressPercentage || item.progress_percentage || 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                        {new Date(item.ArchivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 sm:py-6 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <Button
                                                variant="ghost"
                                                type="circular"
                                                size="sm"
                                                onClick={() => handleRestoreSingle(item.ArchiveID || item.archive_id)}
                                                leadingIcon={RotateCcw}
                                                className="text-slate-400 hover:text-primary p-2"
                                                title="Restore to History"
                                            />
                                            <Button
                                                variant="ghost"
                                                type="circular"
                                                size="sm"
                                                onClick={() => initiateDeleteSingle(item)}
                                                leadingIcon={Trash2}
                                                className="text-slate-400 hover:text-red-500 p-2"
                                                title="Delete Permanently"
                                            />
                                            <Button
                                                variant="ghost"
                                                type="circular"
                                                size="sm"
                                                onClick={() => navigate(`/dashboard/library/article/${item.article_id}`)}
                                                leadingIcon={ArrowRight}
                                                className="text-slate-400 hover:text-primary p-2"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-24 text-center border-t border-border/40">
                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4 dark:bg-slate-900">
                        <Archive size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm text-muted-foreground font-light italic">Your archive is currently empty.</p>
                </div>
            )}
        </div>
    );
};

export default ArchivedHistory;