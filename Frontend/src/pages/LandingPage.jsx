// Frontend/src/pages/LandingPage.jsx

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import BackgroundLoadingState from '../components/BackgroundLoadingState';
import { showToast } from '../components/ToastMessage';

// Sub-sections import
import Hero from './sections/Hero';
import Overview from './sections/Overview';
import Prevention from './sections/Prevention';
import Features from './sections/Features';
import Workflow from './sections/Workflow';
import Accessability from './sections/Accessibility';
import Testimonial from './sections/Testimonial';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';

const SILENCE_THRESHOLD = 3000;
const HEARTBEAT_INTERVAL = 500;

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoading] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const [displayTranscript, setDisplayTranscript] = useState("Tap the mic to ask about your health...");
    const [isTextVisible, setIsTextVisible] = useState(true);

    const transcriptRef = useRef('');
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const heartbeatRef = useRef(null);
    const maxDurationTimerRef = useRef(null);
    const isProcessingRef = useRef(false);
    const hasSpeechRef = useRef(false);
    const lastSpeechTimeRef = useRef(0);

    const isSupported = (() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return !!SpeechRecognition;
    })();

    // Smooth text transition helper
    const transitionText = useCallback((newText) => {
        setIsTextVisible(false);
        setTimeout(() => {
            setDisplayTranscript(newText);
            setIsTextVisible(true);
        }, 200);
    }, []);

    const stopListening = useCallback(() => {
        clearTimeout(silenceTimerRef.current);
        clearInterval(heartbeatRef.current);
        clearTimeout(maxDurationTimerRef.current);

        const recognition = recognitionRef.current;
        if (recognition) {
            try {
                recognition.stop();
            } catch {
                // Ignore
            }
            recognitionRef.current = null;
        }

        setIsListening(false);
        transitionText("Tap the mic to ask about your health...");
        isProcessingRef.current = false;
        hasSpeechRef.current = false;
        lastSpeechTimeRef.current = 0;
        transcriptRef.current = '';
    }, [transitionText]);

    const navigateToChat = useCallback((capturedText) => {
        if (capturedText) {
            navigate('/voice-assistant', { state: { voiceQuery: capturedText } });
        } else {
            navigate('/voice-assistant');
        }
    }, [navigate]);

    const startHeartbeat = useCallback(() => {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = setInterval(() => {
            if (!isProcessingRef.current) {
                clearInterval(heartbeatRef.current);
                return;
            }

            const timeSinceLastSpeech = Date.now() - lastSpeechTimeRef.current;
            
            if (lastSpeechTimeRef.current > 0 && timeSinceLastSpeech >= SILENCE_THRESHOLD) {
                clearInterval(heartbeatRef.current);
                
                const capturedText = transcriptRef.current.trim();
                if (capturedText && hasSpeechRef.current) {
                    stopListening();
                    navigateToChat(capturedText);
                } else {
                    stopListening();
                }
            }
        }, HEARTBEAT_INTERVAL);
    }, [stopListening, navigateToChat]);

    const startVoiceQuery = useCallback(() => {
        if (!isSupported) {
            showToast("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.", "error");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            isProcessingRef.current = true;
            hasSpeechRef.current = false;
            lastSpeechTimeRef.current = 0;
            transcriptRef.current = '';
            transitionText("Listening... Say something like 'How to manage hypertension?'");

            clearTimeout(maxDurationTimerRef.current);
            maxDurationTimerRef.current = setTimeout(() => {
                if (isProcessingRef.current && !hasSpeechRef.current) {
                    stopListening();
                }
            }, 15000);
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

            const gotMeaningfulText = (final && final.trim().length > 0) || (interim && interim.trim().length > 0);
            
            if (final) {
                transcriptRef.current += final;
                hasSpeechRef.current = true;
            }
            if (interim && interim.trim().length > 0) {
                hasSpeechRef.current = true;
            }

            if (gotMeaningfulText) {
                lastSpeechTimeRef.current = Date.now();
            }

            const currentDisplay = transcriptRef.current + (interim ? ' ' + interim : '');
            if (currentDisplay !== displayTranscript) {
                transitionText(currentDisplay || "Listening...");
            }

            if (gotMeaningfulText && !heartbeatRef.current) {
                startHeartbeat();
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                showToast("Microphone permission denied.", "error");
                stopListening();
                return;
            }
            if (event.error === 'no-speech') {
                if (isProcessingRef.current && !hasSpeechRef.current) {
                    try { recognition.start(); } catch { /* Ignore */ }
                }
                return;
            }
            stopListening();
        };

        recognition.onend = () => {
            if (isProcessingRef.current && recognitionRef.current === recognition) {
                try {
                    recognition.start();
                } catch {
                    stopListening();
                }
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch {
            showToast("Could not start microphone. Please try again.", "error");
            stopListening();
        }
    }, [isSupported, stopListening, startHeartbeat, transitionText, displayTranscript]);

    const handleVoiceQuery = useCallback(() => {
        if (!isListening) {
            startVoiceQuery();
        } else {
            const capturedText = transcriptRef.current.trim();
            stopListening();
            navigateToChat(capturedText);
        }
    }, [isListening, startVoiceQuery, stopListening, navigateToChat]);

    useEffect(() => {
        return () => {
            clearInterval(heartbeatRef.current);
            clearTimeout(silenceTimerRef.current);
            clearTimeout(maxDurationTimerRef.current);
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch { /* Ignore */ }
            }
        };
    }, []);

    return (
        <MainLayout isLoggedIn={false}>
            <BackgroundLoadingState isLoading={isLoading} message="Consulting our health database..." />

            <div className="px-6 max-w-7xl mx-auto">
                <Hero 
                    isListening={isListening} 
                    transcript={displayTranscript} 
                    isTextVisible={isTextVisible}
                    onVoiceQuery={handleVoiceQuery}
                    isSupported={isSupported}
                />
                <hr className="border-t border-border/50" />
                <Overview />
                <hr className="border-t border-border/50" />
                <Prevention />
                <hr className="border-t border-border/50" />
                <Features />
                <hr className="border-t border-border/50" />
                <Workflow />
                <hr className="border-t border-border/50" />
                <Accessability />
                <hr className="border-t border-border/50" />
                <Testimonial />
                <hr className="border-t border-border/50" />
                <FAQ />
                <hr className="border-t border-border/50" />
                <CTA />
            </div>
        </MainLayout>
    );
};

export default LandingPage;