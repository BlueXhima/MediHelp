import React, { useEffect, useState, useRef } from 'react';
import { Loader2, MicOff, Mic, Wifi } from 'lucide-react';
import VoiceVisualization from './voiceVisualization';

const VoiceControls = ({ 
    isListening, 
    isProcessing, 
    onToggleListening, 
    onClearConversation,
    connectionQuality,
    audioLevels,
    setAudioLevels
}) => {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (isListening) {
            startAudioProcessing();
        } else {
            stopAudioProcessing();
        }

        return () => stopAudioProcessing();
    }, [isListening]);

    const startAudioProcessing = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const audioContext = audioContextRef.current;

            const source = audioContext.createMediaStreamSource(stream);
            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 512; // Taasan ang resolution ng frequency data
            analyserRef.current.smoothingTimeConstant = 0.8; // Ito ang nagpapakinis ng transition

            source.connect(analyserRef.current);

            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            const updateAudioLevels = () => {
                if (!analyserRef.current) return; // Safety check
                
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                
                // Kumuha ng 12 samples para sa 12 bars sa visualizer
                const levels = Array.from(dataArrayRef.current.slice(0, 12)).map(
                    (value) => value / 255 // I-normalize sa 0-1 range
                );
                
                setAudioLevels(levels);
                animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
            };

            updateAudioLevels();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopAudioProcessing = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setAudioLevels(new Array(12).fill(0));
    };

    const getConnectionColor = () => {
        switch (connectionQuality) {
            case 'excellent': return 'text-success';
            case 'good': return 'text-accent';
            case 'poor': return 'text-warning';
            default: return 'text-error';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-6 flex flex-col items-stretch justify-center">
            <div className="text-center">
                {/* Main Voice Button */}
                <div className="mb-6 flex items-center justify-center">
                    <button
                        onClick={onToggleListening}
                        disabled={isProcessing}
                        className={`w-24 h-24 cursor-pointer rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
                            isListening ? 'voice-pulse animate-pulse bg-red-500 text-white' : 'bg-blue-500 text-white'
                        } ${isProcessing ? 'animate-spin bg-gray-300' : ''}`}
                    >
                        {isProcessing ? (
                            <Loader2 size={32} className="animate-pulse text-gray-700" />
                        ) : isListening ? (
                            <MicOff size={32} />
                        ) : (
                            <Mic size={32} />
                        )}
                    </button>
                </div>

                {/* Status Text */}
                <div className="mb-6">
                    <p className="text-lg font-medium text-gray-800 mb-2">
                        {isProcessing 
                            ? "Processing your question..." 
                        : isListening 
                            ? "Listening... Speak now" :"Click to start speaking"
                        }
                    </p>
                    
                    {/* Connection Quality */}
                    <div className="flex items-center justify-center space-x-2">
                        <Wifi size={16} className={getConnectionColor()} />
                        <span className={`text-sm ${getConnectionColor()}`}>
                            Connection: {connectionQuality}
                        </span>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={onClearConversation}
                        className="px-3 py-2 rounded-md border border-gray-300 text-sm 
                        font-medium text-gray-700 hover:text-primary hover:border-primary 
                        transition-colors cursor-pointer"
                    >
                        Clear Chat
                    </button>
                    
                    <button
                        className="px-3 py-2 rounded-md text-sm font-medium text-primary-foreground 
                        transition-colors cursor-pointer bg-primary hover:bg-primary/90"
                    >
                        Settings
                    </button>
                </div>

                {/* Voice Commands Help */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full max-w-none">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Voice Commands:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>"Stop listening" - End voice input</p>
                        <p>"Repeat that" - Replay last response</p>
                        <p>"Clear conversation" - Start new session</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceControls;