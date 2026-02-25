import React, { useState } from 'react';
import { Loader } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

    if (!isOpen) return null;

    const handleLogoutClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsFeedbackVisible(true);
            setTimeout(() => {
                setIsFeedbackVisible(false);
                onLogout();
            }, 2000); // Delay to show feedback before logging out
        }, 1500); // Simulate loading state
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 transform scale-95 hover:scale-100 transition-transform duration-300">
                    <div className="flex justify-start mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Confirm Logout</h2>
                    </div>
                    <p className="text-sm text-gray-600 text-left mb-6">
                        Are you sure you want to log out? This action will end your session.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow-md transition-all"
                            onClick={onClose}
                            disabled={isLoading} // Disable button during loading
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 cursor-pointer rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all"
                            onClick={handleLogoutClick}
                            disabled={isLoading} // Disable button during loading
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                        <Loader className="animate-spin text-white w-12 h-12 mb-4" />
                        <p className="text-white text-lg">Logging out...</p>
                    </div>
                </div>
            )}

            {isFeedbackVisible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 transform scale-95 hover:scale-100 transition-transform duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Logout Successful</h2>
                        <p className="text-sm text-gray-600 text-left mb-6">
                            You have been successfully logged out. Thank you for using our service.
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 cursor-pointer rounded-md bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md transition-all"
                                onClick={() => setIsFeedbackVisible(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogoutModal;