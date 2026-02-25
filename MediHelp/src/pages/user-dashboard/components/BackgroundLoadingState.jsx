import React from 'react';
import { Loader } from "lucide-react";

const BackgroundLoadingState = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <Loader className="animate-spin text-white w-12 h-12 mb-4" />
                <p className="text-white text-lg">Fetching your location...</p>
            </div>
        </div>
    );
};

export default BackgroundLoadingState;