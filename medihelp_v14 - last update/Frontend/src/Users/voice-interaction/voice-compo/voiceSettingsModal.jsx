import { X, Settings, User, Shield, RotateCcw } from "lucide-react";
import AssistantSettings from "./settings-compo/assistantSettings";
import GeneralSettings from "./settings-compo/generalSettings";
import PrivacySettings from "./settings-compo/privacySettings";
import { useState, useEffect } from "react";

const VoiceSettingsModal = ({ onClose }) => {
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
        // Prevent background scrolling when modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"; // Restore scrolling when modal is closed
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[90vh] flex flex-row animate-pop-up overflow-hidden">
                
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
        </div>
    );
};

export default VoiceSettingsModal;