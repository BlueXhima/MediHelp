import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MobileDrawer = ({ isOpen, onClose, children, side = 'left' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: Nag-o-overlay sa main content */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60] lg:hidden"
                    />

                    {/* Drawer Panel */}
                    <motion.div 
                        initial={{ x: side === 'left' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: side === 'left' ? '-100%' : '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} bottom-0 w-[280px] bg-card border-${side === 'left' ? 'r' : 'l'} border-border z-[70] flex flex-col lg:hidden`}
                    >
                        {/* Close Action Container */}
                        <div className="flex justify-end p-4 shrink-0">
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-primary/10 rounded-full text-foreground/50 transition-colors"
                            >
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Content Area with internal scroll if needed */}
                        <div className="flex-1 overflow-y-auto px-6 pb-8">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileDrawer;