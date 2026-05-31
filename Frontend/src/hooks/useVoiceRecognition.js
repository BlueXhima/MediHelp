import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom React Hook for real-time voice-to-text using the native Web Speech API.
 * Fixed: callback freshness, double-fire prevention, and proper cleanup.
 */
export const useVoiceRecognition = (options = {}) => {
    const {
        lang = 'en-US',
        continuous = true,
        interimResults = true,
        silenceTimeout = 5000,
        onResult,
        onError
    } = options;

    // Check browser support ONCE during initialization
    const [isSupported] = useState(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('[useVoiceRecognition] Web Speech API not supported in this browser.');
            return false;
        }
        return true;
    });

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [permissionDenied, setPermissionDenied] = useState(false);

    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const finalTranscriptRef = useRef('');
    const isListeningRef = useRef(false);
    const stopRequestedRef = useRef(false);
    const hasFiredResultRef = useRef(false);
    const isMountedRef = useRef(true);

    // Keep callbacks fresh without triggering effect re-runs
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    useEffect(() => { onResultRef.current = onResult; }, [onResult]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);
    useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
    useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

    // Initialize recognition instance — runs once
    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            if (!isMountedRef.current) return;
            setIsListening(true);
            setPermissionDenied(false);
            stopRequestedRef.current = false;
            hasFiredResultRef.current = false;
            finalTranscriptRef.current = '';
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (final) {
                finalTranscriptRef.current += final;
                setTranscript(prev => prev + final);
            }
            setInterimTranscript(interim);

            // Reset silence timer on speech detected
            if (interim || final) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                    if (!stopRequestedRef.current && isListeningRef.current) {
                        try {
                            recognition.stop();
                        } catch {
                            // Ignore
                        }
                    }
                }, silenceTimeout);
            }
        };

        recognition.onerror = (event) => {
            console.error('[useVoiceRecognition] Error:', event.error);

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setPermissionDenied(true);
                setIsListening(false);
                if (onErrorRef.current) {
                    onErrorRef.current('Microphone permission denied. Please allow microphone access in your browser settings.');
                }
                return;
            }

            if (event.error === 'no-speech') {
                if (isListeningRef.current && !stopRequestedRef.current) {
                    try { recognition.start(); } catch { /* Ignore */ }
                }
                return;
            }

            if (event.error === 'network') {
                setIsListening(false);
                if (onErrorRef.current) {
                    onErrorRef.current('Network error. Please check your internet connection.');
                }
                return;
            }

            if (event.error === 'aborted') {
                return;
            }

            setIsListening(false);
            if (onErrorRef.current) {
                onErrorRef.current(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            if (!isMountedRef.current) return;
            
            // Prevent double-firing result
            if (hasFiredResultRef.current) return;

            // If continuous and not manually stopped, restart
            if (isListeningRef.current && continuous && !stopRequestedRef.current) {
                try {
                    recognition.start();
                    return;
                } catch {
                    // Restart failed
                }
            }

            setIsListening(false);
            clearTimeout(silenceTimerRef.current);

            const finalText = finalTranscriptRef.current.trim();
            if (finalText && onResultRef.current) {
                hasFiredResultRef.current = true;
                onResultRef.current(finalText);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            clearTimeout(silenceTimerRef.current);
            const currentRecognition = recognitionRef.current;
            if (currentRecognition) {
                try {
                    currentRecognition.stop();
                } catch {
                    // Ignore
                }
                recognitionRef.current = null;
            }
        };
    }, []); // Empty deps — setup once, use refs for all dynamic values

    const startListening = useCallback(() => {
        if (!isSupported) {
            if (onErrorRef.current) {
                onErrorRef.current('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            }
            return;
        }

        const recognition = recognitionRef.current;
        if (!recognition) return;

        stopRequestedRef.current = false;
        hasFiredResultRef.current = false;
        setTranscript('');
        setInterimTranscript('');
        finalTranscriptRef.current = '';
        clearTimeout(silenceTimerRef.current);

        try {
            recognition.start();
        } catch {
            try {
                recognition.stop();
                setTimeout(() => {
                    if (isMountedRef.current && recognitionRef.current) {
                        recognitionRef.current.start();
                    }
                }, 150);
            } catch {
                // Ignore
            }
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        stopRequestedRef.current = true;
        clearTimeout(silenceTimerRef.current);

        const recognition = recognitionRef.current;
        if (recognition) {
            try {
                recognition.stop();
            } catch {
                // Ignore
            }
        }
        setIsListening(false);
        setInterimTranscript('');
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        finalTranscriptRef.current = '';
    }, []);

    const displayTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '');

    return {
        isListening,
        transcript,
        interimTranscript,
        displayTranscript,
        isSupported,
        permissionDenied,
        startListening,
        stopListening,
        resetTranscript
    };
};