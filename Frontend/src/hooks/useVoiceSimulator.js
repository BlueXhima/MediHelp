// Frontend/src/hooks/useVoiceSimulator.js

import { useState, useEffect, useRef } from 'react';

export const useVoiceSimulator = () => {
    // States: 'idle' | 'listening' | 'processing' | 'speaking'
    const [engineStatus, setEngineStatus] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const timeoutRef = useRef(null);

    // Listahan ng halimbawa na may kasamang custom na sagot bawat isa
    const voiceExamples = [
        { 
            phrase: '"What is a quick remedy for a severe toothache?"', 
            cat: 'Emergency Care',
            answer: "For a severe toothache, rinse your mouth with warm salt water, take over-the-counter pain relievers like ibuprofen if safe for you, and apply a cold compress to your cheek. Please schedule an urgent dental appointment to address the underlying infection."
        },
        { 
            phrase: '"What is Amoxicillin used for and how is it taken?"', 
            cat: 'Medications',
            answer: "Amoxicillin is an antibiotic used to treat bacterial infections. It should be taken exactly as prescribed by your doctor, usually with or without food, and it is crucial to finish the entire course even if you start feeling better."
        },
        { 
            phrase: '"What foods should be avoided with high uric acid?"', 
            cat: 'Nutrition',
            answer: "If you have high uric acid, you should limit or avoid high-purine foods. This includes red meat, organ meats like liver, seafood such as sardines and shellfish, sugary beverages containing high-fructose corn syrup, and alcohol."
        },
        { 
            phrase: '"What are the primary symptoms of hypertension?"', 
            cat: 'Symptoms',
            answer: "Hypertension is often called a silent killer because it usually has no symptoms. However, severe hypertension can cause headaches, shortness of breath, nosebleeds, dizziness, or chest pain. Regular blood pressure tracking is highly recommended."
        }
    ];

    // Linisin ang timers at audio streams kapag nag-unmount ang component para maiwasan ang memory leak
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    // Helper: Pag-trigger sa katutubong TTS Engine ng Web Browser
    const speakText = (text) => {
        if (!window.speechSynthesis) return;

        // I-cancel ang anumang natitirang audio stream para hindi mag-overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Maghanap ng natural na English voice sa system
        const voices = window.speechSynthesis.getVoices();
        const defaultVoice = voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
        if (defaultVoice) utterance.voice = defaultVoice;

        utterance.rate = 1.0;  // Bilis ng pananalita (Normal)
        utterance.pitch = 1.0; // Tono (Balanced)

        // BAGONG DAGDAG: Kapag tapos na magsalita ang TTS, kusa siyang magre-reset at magsasara
        utterance.onend = () => {
            resetSimulator();
        };

        window.speechSynthesis.speak(utterance);
    };

    // Function 1: Kapag klinick ng user ang isa sa mga suggestion badges
    const handleSelectExample = (exampleItem) => {
        resetSimulator();
        setEngineStatus('listening');
        
        let currentWordIndex = 0;
        const words = exampleItem.phrase.replace(/["]/g, '').split(' ');
        
        const typeInterval = setInterval(() => {
            if (currentWordIndex < words.length) {
                setTranscript(prev => (prev ? prev + ' ' : '') + words[currentWordIndex]);
                currentWordIndex++;
            } else {
                clearInterval(typeInterval);
                triggerProcessingPhase(exampleItem.answer);
            }
        }, 250);
    };

    // Function 2: Pagproseso ng Deep NLP Parameter Delay
    const triggerProcessingPhase = (customAnswer) => {
        setEngineStatus('processing');
        
        timeoutRef.current = setTimeout(() => {
            setEngineStatus('speaking');
            
            // Kung may ipinasang sagot mula sa halimbawa, gamitin ito. Kung wala (galing sa Mic button), gamitin ang default generic response.
            const finalFeedback = customAnswer || "Based on clinical guidelines, your concern indicates mild symptoms. Ensure proper rest, track your temperature hourly, and stay hydrated. If symptoms persist or escalate, seek professional care instantly.";
            
            setAiResponse(finalFeedback);
            speakText(finalFeedback); // Patakbuhin ang TTS audio voice output stream
        }, 1800);
    };

    // Function 3: Pagpindot sa bilog na manual Microphone toggle
    const handleMicToggle = () => {
        if (engineStatus !== 'idle') {
            resetSimulator();
            return;
        }
        
        setEngineStatus('listening');
        setTranscript('Listening to your raw audio stream...');
        
        timeoutRef.current = setTimeout(() => {
            setTranscript('"What are the side effects of taking paracetamol on an empty stomach?"');
            triggerProcessingPhase(null); // Walang custom answer, gagamit ng default mic response
        }, 3000);
    };

    // Function 4: Pagbura at pagsasara ng console pabalik sa benchmark idle configuration
    const resetSimulator = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (window.speechSynthesis) window.speechSynthesis.cancel(); // Hihinto agad sa pagsasalita kapag klinick ang close/reset
        setEngineStatus('idle');
        setTranscript('');
        setAiResponse('');
    };

    return {
        engineStatus,
        transcript,
        aiResponse,
        voiceExamples, // Ipinasa ang pinabagong data list sa UI
        handleSelectExample,
        handleMicToggle,
        resetSimulator
    };
};