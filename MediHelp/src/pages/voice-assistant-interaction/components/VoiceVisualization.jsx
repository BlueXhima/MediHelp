import React from 'react';

const VoiceVisualization = ({ audioLevels }) => {
    return (
        <div className="flex items-center justify-center space-x-1 h-16">
            {audioLevels.map((level, index) => (
                <div
                    key={index}
                    className="w-1 bg-blue-500 rounded-full transition-all duration-300"
                    style={{
                        height: `${Math.max(level * 100, 10)}%`,
                    }}
                />
            ))}
        </div>
    );
};

export default VoiceVisualization;