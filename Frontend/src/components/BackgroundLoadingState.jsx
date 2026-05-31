import React from 'react';
import { Loader2 } from "lucide-react";

const BackgroundLoadingState = ({ isLoading, message = "Processing..." }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden">
            {/* Backdrop: Gagamit ng background variable para sa dark/light mode consistency */}
            <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-md transition-opacity" />

            {/* Modal Container: Gagamit ng card variable */}
            <div className="relative flex flex-col items-center bg-card/50 p-8 rounded-3xl border border-border shadow-2xl">
                <div className="relative flex items-center justify-center">
                    {/* Loader: Gagamit ng primary purple color */}
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    {/* Pulsing effect gamit ang primary color opacity[cite: 11] */}
                    <div className="absolute w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
                </div>

                <div className="mt-6 text-center">
                    <p className="text-foreground text-xl font-medium tracking-wide">
                        {message}
                    </p>
                    <p className="text-primary/60 text-sm mt-1 animate-pulse">
                        Please don't close this tab
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BackgroundLoadingState;