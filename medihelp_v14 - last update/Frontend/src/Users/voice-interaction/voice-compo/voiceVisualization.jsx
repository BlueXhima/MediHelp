import React from 'react';

const VoiceVisualization = ({ barColor = "bg-blue-500" }) => {
    // 12 dots para sa visualizer
    const dots = Array.from({ length: 18 });

    return (
        <div className="flex items-center justify-center space-x-2 h-16">
            {dots.map((_, index) => (
                <div
                    key={index}
                    className={`w-1.5 h-4.5 ${barColor} rounded-full animate-wave-dots`}
                    style={{
                        // Ito ang nagpapatakbo ng "sunod-sunod" na effect
                        animationDelay: `${index * 0.1}s`
                    }}
                />
            ))}
            
            {/* Custom CSS Animation Style */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes wave-dots {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.8); opacity: 1; }
                }
                .animate-wave-dots {
                    animation: wave-dots 1.2s infinite ease-in-out;
                }
            `}} />
        </div>
    );
};

export default VoiceVisualization;