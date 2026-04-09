import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

const LogoutModal = ({ onCancel, onLogout }) => {
    const navigate = useNavigate(); // Initialize navigate function

    const handleLogout = () => {
        localStorage.clear(); // Clear session storage
        onLogout(); // Call the passed onLogout function
        navigate("/landingpage"); // Redirect to landing page after logout
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                {/* Heading */}
                <h2 className="text-xl font-bold text-gray-800 mb-2 text-left">
                    Are you sure you want to Logout?
                </h2>

                {/* Sub description */}
                <p className="text-sm text-gray-600 mb-6 text-left">
                    You will be signed out of your account and redirected to the homepage.
                </p>

                {/* Action buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;