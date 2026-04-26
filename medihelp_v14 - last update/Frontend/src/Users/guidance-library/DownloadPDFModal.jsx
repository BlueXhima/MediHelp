import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, X, User, Calendar, ShieldCheck } from 'lucide-react';

const DownloadPDFModal = ({ isOpen, onClose, onConfirm, articleData, isGenerating }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Modal Container */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl h-[95vh] bg-card rounded-[2rem] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
                >
                    {/* LEFT SIDE: LIVE PREVIEW */}
                    <div className="lg:col-span-7 bg-card p-6 md:p-10 overflow-y-auto flex justify-center">
                        <div className="w-full max-w-[595px] min-h-[842px] bg-white shadow-lg p-12 flex flex-col text-left font-serif border border-slate-200 origin-top transform scale-[0.85] md:scale-100">
                            {/* PDF Header Mockup */}
                            <div className="border-b-2 border-primary pb-4 mb-6">
                                <h1 className="text-primary text-xl font-sans font-black uppercase tracking-tighter">MediHelp</h1>
                                <p className="text-[10px] text-slate-500 font-sans uppercase tracking-widest">Guidance Library | Official Document</p>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                                {articleData?.title}
                            </h2>

                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-sans uppercase mb-8">
                                <span>Author: {articleData?.author_name || 'MediHelp Team'}</span>
                                <span>•</span>
                                <span>Published: {new Date(articleData?.created_date).toLocaleDateString()}</span>
                            </div>

                            {/* Content Preview (Stripped HTML) */}
                            <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                                {articleData?.full_content?.replace(/<[^>]*>/g, '').substring(0, 1000)}...
                                <p className="mt-4 italic text-slate-400">[End of Preview]</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: ACTIONS */}
                    <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-card">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>

                        <div className="space-y-6 mt-8">
                            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary">
                                <FileText size={28} />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-foreground tracking-tight">Export to PDF</h3>
                                <p className="text-slate-400 text-sm mt-2">
                                    Generate a high-quality, print-ready document of this health guidance.
                                </p>
                            </div>

                            <div className="space-y-4 pt-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={12} strokeWidth={3} />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        <b>Official Reference:</b> Includes citations, publication date, and medical category.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={12} strokeWidth={3} />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        <b>Clean Layout:</b> Optimized font sizes and spacing for readability.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <button
                                onClick={onConfirm}
                                disabled={isGenerating}
                                className="w-full cursor-pointer py-4 bg-slate-950 hover:bg-primary text-white rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        Download Now
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full cursor-pointer py-4 bg-transparent border border-border rounded-2xl text-slate-400 hover:border-primary hover:text-primary font-bold text-[13px] uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DownloadPDFModal;