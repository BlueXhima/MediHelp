import React from 'react';
import { Loader } from "lucide-react";

const BackgroundLoadingState = ({ isLoading, message = "Processing..." }) => {
    console.log("BackgroundLoadingState isLoading value:", isLoading);

    if (!isLoading) return null;

    console.log("BackgroundLoadingState is rendering");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <Loader className="animate-spin text-white w-12 h-12 mb-4" />
                <p className="text-white text-lg">{message}</p>
            </div>
        </div>
    );
};

export default BackgroundLoadingState;