import React from 'react';
import { Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-xs animate-in fade-in duration-300">
            <div className="w-full max-w-[380px] bg-background border border-border/50 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                <div className="p-8">
                    {/* Header with Close Icon */}
                    <div className="flex justify-end mb-2">
                        <button 
                            onClick={onClose} 
                            className="group p-2 rounded-xl border border-transparent 
                                    hover:border-border hover:bg-card hover:shadow-sm
                                    transition-all duration-200 text-muted-foreground 
                                    hover:text-primary active:scale-90 cursor-pointer"
                            title="Close Directory"
                        >
                            <X 
                                size={18} 
                                className="transition-transform duration-200 group-hover:rotate-90" 
                            />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-[24px] flex items-center justify-center mb-6 border border-red-100 shadow-sm shadow-red-100/50">
                            <Trash2 size={36} className="text-red-500" />
                        </div>
                        
                        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                            {title || "Confirm Delete"}
                        </h3>
                        
                        <p className="text-[15px] text-muted-foreground leading-relaxed px-2">
                            {message || "Are you sure you want to remove this? This action cannot be undone."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mt-10">
                        <button 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 cursor-pointer"
                        >
                            Delete Message
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl bg-muted/50 text-foreground font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 border border-border/40 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;