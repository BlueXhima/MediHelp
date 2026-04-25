import React from 'react';
import { X, Volume2, Shield, Languages, Trash2, CheckCircle2 } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: Slightly darker for better focus on the modal */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content: Increased width for better text spacing */}
            <div className="relative bg-background w-full max-w-lg rounded-[28px] shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header: Simplified for focus */}
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Settings</h2>
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

                {/* Body: High-contrast controls and clear labels */}
                <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto text-left">
                    
                    {/* Voice Preferences Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600/80">Audio & Feedback</h3>
                        
                        <div className="space-y-3">
                            {/* Toggle Control: Better UX than a simple checkbox */}
                            <label className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Volume2 size={18} className="text-slate-500" />
                                    <span className="text-sm font-semibold">Voice Responses</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>

                            {/* Dropdown Control: Large hit target */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                                <div className="flex items-center gap-3">
                                    <Languages size={18} className="text-slate-500" />
                                    <span className="text-sm font-semibold">Language</span>
                                </div>
                                <select className="bg-background text-sm font-bold p-2 rounded-lg border border-border outline-none">
                                    <option>Taglish</option>
                                    <option>English</option>
                                    <option>Filipino</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Security Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Privacy & Data</h3>
                        
                        <div className="space-y-3">
                            {/* Informational Badge for Trust */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/50">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} className="text-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">Security Level</span>
                                        <span className="text-[10px] text-blue-600/70 font-bold uppercase">On-Device Encryption Active</span>
                                    </div>
                                </div>
                                <CheckCircle2 size={18} className="text-blue-600" />
                            </div>

                            {/* Destructive Action: Visual warning */}
                            <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-600 text-sm font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                <Trash2 size={16} />
                                Clear Conversation History
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer: Prominent Save button */}
                <div className="p-6 border-t border-border flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-card border border-border text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm transition-all hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button 
                        onClick={() => {
                            onClose();
                        }}
                        className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;