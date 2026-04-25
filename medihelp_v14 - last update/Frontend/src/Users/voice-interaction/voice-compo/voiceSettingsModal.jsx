import { X, Settings, User, Shield, RotateCcw } from "lucide-react";
import AssistantSettings from "./settings-compo/assistantSettings";
import GeneralSettings from "./settings-compo/generalSettings";
import PrivacySettings from "./settings-compo/privacySettings";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. I-import ito
import { motion, AnimatePresence } from 'framer-motion';

const VoiceSettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("general"); // State to track active tab

    const renderContent = () => {
        switch (activeTab) {
            case "general":
                return <GeneralSettings />;
            case "assistant":
                return <AssistantSettings />;
            case "privacy":
                return <PrivacySettings />;
            default:
                return <GeneralSettings />;
        }
    };

    useEffect(() => {
        // I-set ang overflow sa hidden
        document.body.style.overflow = "hidden";

        // Clean-up function: Siguraduhin na maibabalik sa "auto" pag-close
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return createPortal (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden relative"
            >
                <div className="h-[90vh] flex flex-row overflow-hidden p-1">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r p-6 flex flex-col justify-between text-left">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Settings</h2>
                            <p className="text-sm text-gray-500 mb-6">{new Date().toDateString()}</p>

                            {/* Top Navlinks */}
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("general")}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md w-full cursor-pointer ${
                                        activeTab === "general" ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Settings size={18} /> General
                                </button>
                                <button
                                    onClick={() => setActiveTab("assistant")}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md w-full cursor-pointer ${
                                        activeTab === "assistant" ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <User size={18} /> Assistant
                                </button>
                                <button
                                    onClick={() => setActiveTab("privacy")}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md w-full cursor-pointer ${
                                        activeTab === "privacy" ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Shield size={18} /> Privacy
                                </button>
                            </nav>
                        </div>

                        {/* Bottom Navlink */}
                        <div className="mt-6">
                            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 w-full">
                                <RotateCcw size={18} /> Reset all settings
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div
                        className="w-2/3 p-6 relative overflow-y-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Render Active Content */}
                        {renderContent()}
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default VoiceSettingsModal;