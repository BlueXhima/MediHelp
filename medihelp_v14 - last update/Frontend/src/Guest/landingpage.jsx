// landingpage.jsx

import { useState, useRef, useCallback } from 'react';
import Navbar from '../components/navbar';
import HeroBanner from '../components/herobanner';
import PageEnd from '../components/footer';
import { Mic, Check, TriangleAlert, Star, UtensilsCrossed, Dumbbell, AlarmClock, Leaf, Ribbon, HeartPlus, Brain, X } from "lucide-react";
import { cn } from '../lib/utils';
import HeroModel3 from '../assets/HeroModel3.avif';
import HIPAACert from '../assets/HIPAACert.jpg';

import ChatModal from '../components/chats/chatModal';
import FeedbackModal from '../components/chats/FeedbackModal';
import { useChatMessages } from '../hooks/useChatMessage';
import useChatModal from '../hooks/useChatModal';
import useFeedback from '../hooks/useFeedback';
import { fetchResponse } from '../data/intentData';

const GUEST_COUNT_KEY = 'medical_assistant_guest_count';
const MAX_MESSAGES = 10;

function LimitReachedModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-card rounded-2xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Session Limit Reached</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 pt-4">
          <p className="text-foreground/70 leading-relaxed">
            You have reached the maximum number of messages for this guest session. 
            Create a free account to unlock unlimited conversations and premium features.
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
          >
            Maybe Later
          </button>
          <a 
            href="/register"
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm text-center"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
}

function VoiceWidget() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const recognitionRef = useRef(null);
    const stoppedRef = useRef(false);
    const { messages, addMessage, editMessage, clearMessages } = useChatMessages();

    const checkLimitReached = useCallback(() => {
        if (typeof window === 'undefined') return false;
        const stored = sessionStorage.getItem(GUEST_COUNT_KEY);
        const count = stored ? parseInt(stored, 10) : 0;
        return count >= MAX_MESSAGES;
    }, []);

    const incrementStoredCount = useCallback(() => {
        if (typeof window === 'undefined') return;
        const current = parseInt(sessionStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
        sessionStorage.setItem(GUEST_COUNT_KEY, (current + 1).toString());
    }, []);

    // FIX: Check limit before sending, no double increment
    const handleSend = useCallback(async (text) => {
        if (!text.trim() || checkLimitReached()) return;
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1);
        addMessage('user', formattedText);
        incrementStoredCount(); // Only increment here
        const reply = await fetchResponse(formattedText);
        addMessage('assistant', reply.text, reply.link);
    }, [addMessage, checkLimitReached, incrementStoredCount]);

    const handleEditMessage = useCallback((messageId, newContent, newTimestamp) => {
        const formattedContent = newContent.charAt(0).toUpperCase() + newContent.slice(1);
        editMessage(messageId, formattedContent, newTimestamp);
    }, [editMessage]);

    const chatModalProps = useChatModal({
        onSend: handleSend,
        messages,
        onEditMessage: handleEditMessage,
        addMessage,
    });

    const feedbackProps = useFeedback();

    // FIX: Unified TTS stop function
    const stopAllTTS = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        chatModalProps.stopSpeaking?.();
    }, [chatModalProps]);

    function initRecognition() {
        if (recognitionRef.current) return recognitionRef.current;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition API not supported in this browser.');
            return null;
        }

        const recog = new SpeechRecognition();
        recog.lang = 'en-US';
        recog.interimResults = true;
        recog.maxAlternatives = 1;

        recog.onresult = async (event) => {
            if (stoppedRef.current) return;

            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) final += res[0].transcript;
                else interim += res[0].transcript;
            }

            const current = final || interim;
            setTranscript(current);

            if (final) {
                // FIX: Check limit before processing final result
                if (checkLimitReached()) {
                    setShowLimitModal(true);
                    setIsListening(false);
                    return;
                }
                
                const formattedFinal = final.charAt(0).toUpperCase() + final.slice(1);
                addMessage('user', formattedFinal);
                incrementStoredCount(); // Only increment here, not twice
                setChatOpen(true);
                const reply = await fetchResponse(formattedFinal);
                addMessage('assistant', reply.text, reply.link);
                speakReply(reply.text);
            }
        };

        recog.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recog;
        return recog;
    }

    function toggleListening() {
        if (!isListening && checkLimitReached()) {
            setShowLimitModal(true);
            return;
        }

        const recog = initRecognition();
        if (!recog) return;

        stopAllTTS();

        if (!isListening) {
            try {
                stoppedRef.current = false;
                recog.start();
                setTranscript('');
                setIsListening(true);
            } catch (e) {
                console.error('Speech recognition start error:', e);
            }
        } else {
            stoppedRef.current = true;
            try {
                recog.stop();
            } catch (e) {
                console.error('Speech recognition stop error:', e);
            }
            setIsListening(false);
            setChatOpen(true);
        }
    }

    // FIX: Skip Source and Disclaimer in TTS
    function speakReply(text) {
        if (!window.speechSynthesis) return;
        const isSpeechEnabled = localStorage.getItem("speech_enabled") !== "false";
        if (!isSpeechEnabled) return;
        
        try {
            window.speechSynthesis.cancel();

            let cleaned = text;
            // Remove markdown
            cleaned = cleaned.replace(/\*\*/g, '');
            cleaned = cleaned.replace(/\*/g, '');
            cleaned = cleaned.replace(/__/g, '');
            cleaned = cleaned.replace(/_/g, '');
            cleaned = cleaned.replace(/\[(.*?)\]\([^)]*\)/g, '$1');
            cleaned = cleaned.replace(/https?:\/\/\S+/gi, '');
            cleaned = cleaned.replace(/^[•*-]\s*/gm, '');
            cleaned = cleaned.replace(/^\d+\.\s*/gm, '');
            
            // Remove section headers including Source and Disclaimer
            cleaned = cleaned.replace(/^(Explanation|Possible Causes|Symptoms|Symptoms You May Experience|Suggested Action|Reminder|Source|Confidence|Related Articles|Disclaimer)[:\s]*$/gim, '');
            
            // Remove content between Source/Disclaimer sections
            cleaned = cleaned.replace(/Source:.*$/gim, '');
            cleaned = cleaned.replace(/Disclaimer:.*$/gim, '');
            cleaned = cleaned.replace(/This information is for educational purposes only.*?(\n|$)/gi, '');
            cleaned = cleaned.replace(/Not a substitute for professional medical advice.*?(\n|$)/gi, '');
            cleaned = cleaned.replace(/Consult a healthcare professional.*?(\n|$)/gi, '');
            
            cleaned = cleaned.replace(/\[[^\]]*\]/g, '');
            cleaned = cleaned.replace(/\n\s*\n/g, '\n');
            cleaned = cleaned.replace(/\s+/g, ' ');
            cleaned = cleaned.trim();

            // Don't speak if nothing left after cleaning
            if (!cleaned || cleaned.length < 10) return;

            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find((v) => 
                v.name.toLowerCase().includes('female') || 
                v.name.toLowerCase().includes('woman') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('samantha')
            ) || voices[0];

            const utter = new SpeechSynthesisUtterance(cleaned);
            utter.voice = femaleVoice;
            utter.rate = 1;
            utter.pitch = 1;
            window.speechSynthesis.speak(utter);
        } catch (e) {
            console.error('TTS error', e);
        }
    }

    const handleCloseChat = () => {
        stopAllTTS();
        chatModalProps.cancelEditing?.();
        setChatOpen(false);
    };

    return (
        <div className={cn("rounded-lg p-6 transition-shadow duration-200", isListening ? "ring-4 ring-primary/30 shadow-2xl bg-primary/5" : "bg-background")}>
            <div className="flex items-start mb-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0", isListening ? "bg-primary text-white" : "bg-muted")}>
                    <Mic size={20} strokeWidth={1.5} className={isListening ? "text-white" : "text-primary"} />
                </div>
                <div className="text-left">
                    <h3 className="font-semibold text-foreground">Try Voice Demo</h3>
                    <p className="text-sm text-foreground/60">Ask: "What causes chest pain?"</p>
                </div>
            </div>

            <button
                onClick={toggleListening}
                aria-pressed={isListening}
                className={cn(
                    "w-full py-3 rounded-full font-semibold transition transform-gpu focus:outline-none focus:ring-2 cursor-pointer",
                    isListening
                        ? "bg-linear-to-r from-teal-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl"
                        : "bg-primary text-primary-foreground hover:scale-105"
                )}
            >
                {isListening 
                    ? 'Listening — Tap to stop' 
                    : '🎤 Start Speaking'}
            </button>

            {transcript && !isListening && (
                <div className="mt-3 text-sm text-foreground/70">
                    <div className="font-medium mb-1">Heard: "{transcript}"</div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setChatOpen(true)}
                            className="px-3 py-1 rounded-md bg-primary text-white text-xs hover:bg-primary/90"
                        >
                            Open Chat
                        </button>
                    </div>
                </div>
            )}

            <ChatModal
                open={chatOpen}
                onClose={handleCloseChat}
                messages={messages}
                onSend={handleSend}
                {...chatModalProps}
                onClearMessages={clearMessages}
                feedbackProps={feedbackProps}
            />

            <FeedbackModal
                isOpen={feedbackProps.isModalOpen}
                onClose={feedbackProps.handleCloseModal}
                options={feedbackProps.FEEDBACK_OPTIONS}
                selectedOptions={feedbackProps.selectedOptions}
                onOptionToggle={feedbackProps.handleOptionToggle}
                feedbackText={feedbackProps.feedbackText}
                onTextChange={feedbackProps.setFeedbackText}
                onSubmit={feedbackProps.handleSubmitFeedback}
            />

            <LimitReachedModal 
                open={showLimitModal} 
                onClose={() => setShowLimitModal(false)} 
            />
        </div>
    );
}

const LandingPage = () => {
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-16">
                <section className="bg-linear-to-br from-primary-50 to-accent-50 dark:from-primary-900 dark:to-accent-900 min-h-screen flex items-center">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                                    Get Medical Answers <span className="text-primary">Instantly</span> with Voice
                                </h1>
                                <p className="text-xl text-foreground/70 mb-8 max-w-2xl">
                                    Skip the wait — speak your symptoms and get reliable health guidance in seconds, 24/7.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                    <button 
                                        className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-lg shadow-sm transition-colors cursor-pointer"
                                    >
                                        Start Free 7-Day Trial
                                    </button>
                                    <button
                                        onClick={() => setShowDemoModal(true)}
                                        className="inline-flex items-center justify-center bg-transparent border-2 text-foreground font-semibold px-8 py-4 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                                    >
                                        Try Voice Demo
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                    <div className="bg-card p-4 rounded-lg shadow-subtle">
                                        <div className="text-2xl font-bold text-accent">2,847</div>
                                        <div className="text-sm text-foreground/90">Queries Resolved Today</div>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg shadow-subtle">
                                        <div className="text-2xl font-bold text-accent">&lt; 30s</div>
                                        <div className="text-sm text-foreground/90">Average Response Time</div>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg shadow-subtle flex items-center justify-center">
                                        <img
                                            src={HIPAACert}
                                            alt="HIPAA Compliance Badge"
                                            className="h-15 w-full object-cover"
                                        />
                                        <span className="ml-2 text-sm font-medium text-foreground/90">
                                            HIPAA Compliant
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-card rounded-2xl shadow-demo p-8">
                                    <img
                                        src={HeroModel3}
                                        alt="Voice-assisted healthcare consultation"
                                        className="w-full h-90 object-cover rounded-lg mb-6"
                                    />
                                    <VoiceWidget />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <DemoModal
                        open={showDemoModal}
                        onClose={() => setShowDemoModal(false)}
                    />
                </section>

                <section className="bg-card py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Discover MediHelp
                        </span>
                        <h2 className="mt-6 text-4xl font-bold text-foreground">
                            Healthcare information shouldn't <br /> be this hard
                        </h2>
                        <p className="mt-4 text-foreground/80 max-w-2xl mx-auto">
                            Why wait weeks of answers when your health concerns need immediate <br /> attention?
                        </p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-4">
                            <div className="flex flex-col items-center bg-primary/5 p-6 rounded-lg w-80 hover:shadow-lg transition-transform transform">
                                <div className='w-16 h-16 flex items-center justify-center rounded-full bg-red-200'> 
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold">
                                        <Check size={28} />
                                    </div>
                                </div>
                                <h1 className="mt-4 text-xl font-semibold text-foreground">2-3 Weeks Wait Times</h1>
                                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                    Average doctor appointment scheduling leaves you anxious and uncertain about your health symptoms.
                                </p>
                            </div>
                            <div className="flex flex-col items-center bg-primary/5 p-6 rounded-lg w-80 hover:shadow-lg transition-transform transform">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-200 text-yellow-500 text-lg font-bold">
                                    <TriangleAlert size={32} />
                                </div>
                                <h1 className="mt-4 text-xl font-semibold text-foreground">Confusing Medical Websites</h1>
                                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                    Complex medical terminology and contradictory information increase your worry instead of providing clarity.
                                </p>
                            </div>
                            <div className="flex flex-col items-center bg-primary/5 p-6 rounded-lg w-80 hover:shadow-lg transition-transform transform">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-200 text-blue-500 text-lg font-bold">
                                    <Star size={32} />
                                </div>
                                <h1 className="mt-4 text-xl font-semibold text-foreground">Late-Night Health Anxiety</h1>
                                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                    When symptoms appear after hours, you're left searching the internet and increasing your stress levels.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <div className="space-y-4">
                                <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Health Tips
                                </span>
                                <h3 className="text-4xl font-bold text-foreground">Stay Informed, Stay Healthy</h3>
                                <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                    Get practical advice on nutrition, exercise, sleep, and lifestyle habits to prevent health issues before they arise.
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4'>
                                        <UtensilsCrossed size={28} className="text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Nutrition</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Eat balanced meals rich in fiber and vitamins.
                                    </p>
                                </div>
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4'>
                                        <Dumbbell size={28} className="text-blue-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Exercise</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Stay active with at least 30 minutes of movement daily.
                                    </p>
                                </div>
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-4'>
                                        <AlarmClock size={28} className="text-purple-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Sleep</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Maintain 7–8 hours of restful sleep each night.
                                    </p>
                                </div>
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mb-4'>
                                        <Leaf size={28} className="text-orange-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Lifestyle</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Avoid smoking and limit alcohol consumption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-card py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <div className="space-y-4">
                                <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Trusted Resources
                                </span>
                                <h3 className="text-4xl font-bold text-foreground">Explore Our Health Resources</h3>
                                <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                    Access a curated library of articles, guides, and brochures on common health topics to empower your wellness journey.
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mb-4'>
                                        <Ribbon size={28} className="text-orange-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Cancer Awareness</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Learn about prevention, screening, and support resources for various cancers.
                                    </p>
                                </div>
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4'>
                                        <HeartPlus size={28} className="text-blue-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Heart Health</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Tips to keep your heart strong and healthy, including diet, exercise, and risk factors to watch for.
                                    </p>
                                </div>
                                <div className="p-6 flex flex-col items-center rounded-lg border hover:shadow-lg transition-transform transform">
                                    <div className='w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-4'>
                                        <Brain size={28} className="text-purple-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-foreground">Mental Wellness</h4>
                                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                        Resources to support emotional and mental well-being.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <div className="space-y-4">
                                <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Timeline
                                </span>
                                <h3 className="text-4xl font-bold text-foreground">How MediHelp Works</h3>
                                <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                    MediHelp uses advanced AI to understand your voice queries and provide instant, reliable health information. Here's how you can get started:
                                </p>
                            </div>

                            <div className="relative mt-12">
                                <div className="absolute top-1/4 left-0 w-full border-t-2 border-gray-300 transform -translate-y-1/2 z-0"></div>
                                <div className="grid grid-cols-4 gap-8 text-center relative z-10">
                                    <div className="flex flex-col items-center p-4 rounded-lg z-10">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                            1
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground">Ask a Question</h4>
                                            <p className="text-sm text-foreground/80">Use the voice assistant to inquire about symptoms or conditions.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center p-4 rounded-lg z-10">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                            2
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground">Get Health Tips</h4>
                                            <p className="text-sm text-foreground/80">Receive practical advice to prevent and manage health risks.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center p-4 rounded-lg z-10">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                            3
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground">Explore Resources</h4>
                                            <p className="text-sm text-foreground/80">Access articles and brochures for deeper understanding.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center p-4 rounded-lg z-10">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                            4
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground">Stay Informed</h4>
                                            <p className="text-sm text-foreground/80">Continue learning with MediHelp's trusted health content.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <HeroBanner />
                <PageEnd />
            </main>
        </div>
    );
};

function DemoModal({ open, onClose }) {
    const [consent, setConsent] = useState(() => {
        try { return localStorage.getItem('voice_demo_consent') === 'true'; } catch { return false; }
    });

    function startDemo() {
        try { localStorage.setItem('voice_demo_consent', consent ? 'true' : 'false'); } catch {}
        onClose(consent);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-card rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 border-b border-border/20">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Mic size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl text-left font-semibold">Try Voice Demo</h3>
                        <p className="text-sm text-left text-foreground/70">
                            Experience on-device speech recognition. We process audio locally unless you opt-in to upload.
                        </p>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    <ul className="space-y-2 text-sm text-foreground/70 mb-5">
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Local transcription with instant results.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Keyword intent suggestions and spoken replies.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Your audio stays on-device by default.</span>
                        </li>
                    </ul>

                    <div className="flex items-center gap-3">
                        <input
                            id="demo-consent"
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                        />
                        <label htmlFor="demo-consent" className="text-sm text-foreground/80">
                            I consent to local processing of my audio for this demo
                        </label>
                    </div>
                </div>

                <div className="px-6 py-5 bg-background/50 flex items-center justify-end gap-3">
                    <button onClick={() => onClose(false)} className="px-6 py-3 rounded-md text-sm border bg-transparent hover:scale-105 cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={startDemo} className="px-6 py-3 rounded-md text-sm bg-primary text-primary-foreground font-semibold hover:scale-105 cursor-pointer">
                        Start Demo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;