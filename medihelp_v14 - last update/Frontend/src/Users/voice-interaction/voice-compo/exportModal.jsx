import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Share2, FileJson } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, conversationData }) => {
    if (!isOpen) return null;

    const exportOptions = [
        { id: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Best for printing and sharing' },
        { id: 'json', label: 'JSON Data', icon: FileJson, desc: 'Technical format for data backup' },
        { id: 'txt', label: 'Plain Text', icon: Share2, desc: 'Simple text file of the chat' }
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Export Conversation</h2>
                        <p className="text-xs text-gray-500 mt-1">Choose your preferred format</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                    {exportOptions.map((option) => (
                        <button 
                            key={option.id}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                        >
                            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-white transition-colors">
                                <option.icon size={24} className="text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{option.label}</h4>
                                <p className="text-xs text-gray-500">{option.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> Export Now
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default ExportModal;