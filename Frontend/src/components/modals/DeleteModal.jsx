// Frontend/src/components/modals/DeleteModal.jsx

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const DeleteModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Deletion", 
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete Now",
    loading = false 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop with Framer Motion */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
                    />
                    
                    {/* Modal Content with Framer Motion */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                        className="relative w-full max-w-md bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden"
                    >
                        
                        {/* Header Accent */}
                        <div className="h-1.5 w-full bg-red-500/10" />

                        <div className="p-8">
                            {/* Icon & Close Button */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
                                    <AlertCircle size={24} />
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 hover:bg-primary/40 rounded-full transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-2 mb-8 text-left">
                                <h3 className="text-xl font-light tracking-tight text-foreground">
                                    {title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                                    {message}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                <Button 
                                    variant="ghost" 
                                    type="bordered"
                                    onClick={onClose}
                                    className="flex-1 rounded-full"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={onConfirm}
                                    className="flex-1 shadow-lg shadow-red-500/20"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;