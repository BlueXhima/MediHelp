import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import Button from '../ui/Button';

const LogoutModal = ({ isOpen, onClose, onConfirm, userData }) => {
    // Siguraduhin na nakuha ang firstName mula sa userData object
    const firstName = userData?.firstName || 'User';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop: Katulad ng DeleteModal */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
                    />

                    {/* Modal Content: Bento-style */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden"
                    >
                        {/* Header Accent: Subtle Blue/Primary line para maiba sa Danger Red */}
                        <div className="h-1.5 w-full bg-primary/10" />

                        <div className="p-8">
                            <div className="flex flex-col items-start text-left">
                                <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                                    <LogOut size={28} />
                                </div>
                                
                                <div className="space-y-2 mb-8">
                                    <h3 className="text-xl font-light tracking-tight text-foreground">
                                        Leaving so soon, <span className="font-bold text-primary">{firstName}</span>?
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                                        Are you sure you want to log out? Your current session will be ended.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-row-reverse gap-3">
                                <Button 
                                    variant="primary" 
                                    onClick={onConfirm}
                                    className="flex-1 shadow-lg shadow-primary/10 rounded-xl py-4"
                                >
                                    Log Out
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    type="bordered"
                                    onClick={onClose}
                                    className="flex-1 rounded-xl py-4 opacity-60 hover:opacity-100"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-primary/40 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;