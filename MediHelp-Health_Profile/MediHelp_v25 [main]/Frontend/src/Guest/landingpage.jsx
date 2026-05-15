// landingpage.jsx 

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/navbar';
import HeroBanner from '../components/herobanner';
import PageEnd from '../components/footer';
import { Mic, Check, TriangleAlert, UtensilsCrossed, Dumbbell, 
    AlarmClock, Leaf, Ribbon, HeartPlus, Brain, CheckCircle2, X, ShieldCheck } from "lucide-react";
import { cn } from '../lib/utils';
import HIPAACert from '../assets/HIPAACert.jpg';
import ChatModal from '../components/chats/chatModal';
import FeedbackModal from '../components/chats/FeedbackModal';
import { useChatMessages } from '../hooks/useChatMessage';
import useChatModal from '../hooks/useChatModal';
import useFeedback from '../hooks/useFeedback';

const GUEST_COUNT_KEY = 'medical_assistant_guest_count';
const MAX_MESSAGES = 10;

// ------------------------------ 
// 🔹 LimitReachedModal Component (unchanged)
// ------------------------------ 
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

// ------------------------------ 
// 🔹 VoiceWidget Component (FIXED)
// ------------------------------ 
function VoiceWidget() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const recognitionRef = useRef(null);
    const stoppedRef = useRef(false);
    
    // Use the chat messages hook
    const { messages, addMessage, editMessage, clearMessages } = useChatMessages();

    // Initialize useChatModal with proper callbacks
    const chatModalProps = useChatModal({
        onSend: (text) => {
            // This is called by voice input - just open chat, message is already added
            setChatOpen(true);
        },
        messages,
        onEditMessage: editMessage,
        addMessage,
    });

    // Check limit
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

    // Unified TTS stop
    const stopAllTTS = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        chatModalProps.stopSpeaking?.();
    }, [chatModalProps]);

    // Feedback hook
    const feedbackProps = useFeedback();

    // FIXED: Voice input uses chatModalProps.handleSend which has proper fetch logic
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
                // Check limit before processing
                if (checkLimitReached()) {
                    setShowLimitModal(true);
                    setIsListening(false);
                    return;
                }
                
                const formattedFinal = final.charAt(0).toUpperCase() + final.slice(1);
                
                // FIXED: Use chatModalProps.handleSend which has fetch logic built-in
                await chatModalProps.handleSend(formattedFinal);
                setChatOpen(true);
                
                // Speak the response if TTS is enabled
                if (chatModalProps.isGlobalTTSEnabled) {
                    // Get the last assistant message
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                        speakReply(lastMsg.content);
                    }
                }
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

    // TTS function
    function speakReply(text) {
        if (!window.speechSynthesis) return;
        const isSpeechEnabled = localStorage.getItem("speech_enabled") !== "false";
        if (!isSpeechEnabled) return;
        
        try {
            window.speechSynthesis.cancel();

            let cleaned = text
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/__/g, '')
                .replace(/_/g, '')
                .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
                .replace(/https?:\/\/\S+/gi, '')
                .replace(/^[•*-]\s*/gm, '')
                .replace(/^\d+\.\s*/gm, '')
                .replace(/^(Explanation|Possible Causes|Symptoms|Symptoms You May Experience|Suggested Action|Reminder|Source|Confidence|Related Articles|Disclaimer)[:\s]*$/gim, '')
                .replace(/Source:.*$/gim, '')
                .replace(/Disclaimer:.*$/gim, '')
                .replace(/This information is for educational purposes only.*?(\n|$)/gi, '')
                .replace(/Not a substitute for professional medical advice.*?(\n|$)/gi, '')
                .replace(/Consult a healthcare professional.*?(\n|$)/gi, '')
                .replace(/\[[^\]]*\]/g, '')
                .replace(/\n\s*\n/g, '\n')
                .replace(/\s+/g, ' ')
                .trim();

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
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0", isListening ? "bg-primary-600 text-white" : "bg-foreground")}>
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
                    ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl"
                    : "bg-primary text-primary-foreground hover:scale-105"
                )}
            >
                {isListening ? 'Listening — Tap to stop' : '🎤 Start Speaking'}
            </button>

            {transcript && (
                <div className="mt-3 text-sm text-foreground/70">
                    <div className="font-medium mb-1">Suggested action</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-md bg-primary text-white text-xs">
                            Open Symptom Guide
                        </button>
                        <button className="px-3 py-1 rounded-md border border-border/30 text-xs">
                            Search Docs
                        </button>
                    </div>
                </div>
            )}

            {/* FIXED: ChatModal with all required props from chatModalProps */}
            <ChatModal
                open={chatOpen}
                onClose={handleCloseChat}
                messages={messages}
                onClearMessages={clearMessages}
                feedbackProps={feedbackProps}
                {...chatModalProps}
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
                <section className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900 dark:to-accent-900 min-h-screen flex items-center">
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
                                        className="inline-flex items-center justify-center bg-transparent border-2 border text-foreground font-semibold px-8 py-4 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
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
                                <div className="bg-card rounded-2xl shadow-demo p-8 border border-border/50">
                                    <div className="w-full h-80 bg-slate-950 rounded-xl mb-6 overflow-hidden relative group">
                                        <div className="absolute inset-0 opacity-20" 
                                            style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 -m-8 border-2 border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                                <div className="absolute inset-0 -m-12 border border-dashed border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                                
                                                <div className="relative z-10 w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.3)]">
                                                    <HeartPlus size={48} className="text-primary animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-scan"></div>

                                        <div className="absolute top-4 left-4 font-mono text-[10px] text-primary/60 space-y-1">
                                            <p>SYS_STATUS: ACTIVE</p>
                                            <p>ENCRYPTION: AES-256</p>
                                            <p>LOC: CAVITE_PH</p>
                                        </div>
                                        
                                        <div className="absolute bottom-4 right-4 flex gap-1 items-end">
                                            {[...Array(5)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-1 bg-primary/40 rounded-full animate-bounce" 
                                                    style={{ height: `${Math.random() * 30 + 10}px`, animationDelay: `${i * 0.1}s` }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
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

                <section className="bg-card py-20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-2xl text-left">
                                <span className="text-primary font-bold tracking-wider uppercase text-sm">The Problem</span>
                                <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                    Healthcare shouldn't be <br/> <span className="text-primary/60 italic">this complicated.</span>
                                </h2>
                            </div>
                            <p className="text-foreground/70 text-lg max-w-sm pb-2">
                                We're bridging the gap between your symptoms and the clarity you deserve.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-7 bg-red-50 dark:bg-red-950/20 p-10 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col justify-between min-h-[320px]">
                                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                    <AlarmClock size={30} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">The 3-Week Wait Gap</h3>
                                    <p className="text-foreground/80 text-lg">Traditional scheduling leaves you in a state of anxiety. MediHelp provides the "right now" answers you need while waiting for your specialist.</p>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-6">
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-8 rounded-3xl border border-yellow-100 dark:border-yellow-900/30">
                                    <TriangleAlert className="text-yellow-600 mb-4" size={28} />
                                    <h4 className="text-xl font-bold mb-2">Information Overload</h4>
                                    <p className="text-sm text-foreground/80">Stop "doom-scrolling" medical forums that only increase your stress levels.</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                    <Brain className="text-blue-600 mb-4" size={28} />
                                    <h4 className="text-xl font-bold mb-2">24/7 Accessibility</h4>
                                    <p className="text-sm text-foreground/80">Health concerns don't follow a 9-to-5 schedule. Neither do we.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-background/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                            <div className="text-left max-w-xl">
                                <span className="text-primary font-bold tracking-widest uppercase text-xs">Prevention First</span>
                                <h3 className="text-4xl font-extrabold text-foreground mt-2">Stay Informed, Stay Healthy</h3>
                                <p className="mt-4 text-foreground/70">
                                    Practical habits to prevent health issues before they arise.
                                </p>
                            </div>
                            <button className="mt-6 md:mt-0 px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-all font-medium">
                                View All Tips
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group p-8 rounded-3xl bg-green-50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-green-900 text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <UtensilsCrossed size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Nutrition & Diet</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Eat balanced meals rich in fiber and vitamins to fuel your recovery.</p>
                                </div>
                            </div>

                            <div className="group p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-blue-900 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Dumbbell size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Active Movement</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Stay active with at least 30 minutes of intentional movement daily.</p>
                                </div>
                            </div>

                            <div className="group p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-purple-900 text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <AlarmClock size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Restful Sleep</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Maintain 7–8 hours of restful sleep to support cognitive health.</p>
                                </div>
                            </div>

                            <div className="group p-8 rounded-3xl bg-orange-50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-orange-900 text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Leaf size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xl font-bold text-foreground">Mindful Lifestyle</h4>
                                    <p className="text-sm text-foreground/70 mt-1">Avoid habits like smoking and limit alcohol for long-term wellness.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-card py-24 relative">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h3 className="text-4xl font-bold mb-12">Trusted Knowledge Hub</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-orange-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <Ribbon className="text-orange-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Cancer Awareness</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Learn about prevention, screening, and support resources for various conditions.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>

                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-blue-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <HeartPlus className="text-blue-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Heart Health</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Keep your heart strong with expert-backed tips on diet and risk management.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>

                            <div className="relative group bg-background rounded-3xl overflow-hidden border border-border/50 
                                hover:border-primary/50 transition-all shadow-subtle
                                backdrop-blur-md bg-white/10"
                            >
                                <div className="h-2 bg-purple-400 w-full"></div>
                                <div className="p-8 text-left">
                                    <Brain className="text-purple-500 mb-4" size={32} />
                                    <h4 className="text-2xl font-bold mb-3">Mental Wellness</h4>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Resources to support your emotional well-being and stress management.
                                    </p>
                                    <a href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                                        Read Guide <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-24 bg-background">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h3 className="text-4xl font-bold mb-4">Three Steps to Peace of Mind</h3>
                            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"></div>

                            <div className="space-y-20">
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1 text-right hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">01</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Mic size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-2xl font-bold mb-2">Voice Activation</h4>
                                        <p className="text-foreground/70 leading-relaxed">Simply tap and speak. No typing complex medical terms—just describe how you feel in your own words.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                                    <div className="flex-1 text-left hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">02</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Brain size={20} />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h4 className="text-2xl font-bold mb-2">Smart Analysis</h4>
                                        <p className="text-foreground/70 leading-relaxed">Our system analyzes your intent and symptoms against trusted medical databases to provide instant context.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1 text-right hidden md:block">
                                        <h4 className="text-2xl font-bold text-primary">03</h4>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white ring-8 ring-background font-bold">
                                        <Check size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-2xl font-bold mb-2">Actionable Guidance</h4>
                                        <p className="text-foreground/70 leading-relaxed">Receive clear next steps—whether it's home care, scheduling a checkup, or seeking urgent medical attention.</p>
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
        try {
            return localStorage.getItem('voice_demo_consent') === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    function handleStart() {
        if (!consent) return;
        try {
            localStorage.setItem('voice_demo_consent', 'true');
        } catch {}
        onClose(true);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 transition-opacity">
            <div className="bg-card rounded-[32px] max-w-[480px] w-full shadow-2xl overflow-hidden border border-border animate-pop-up flex flex-col">
                
                <div className="p-8 pb-0 relative"> 
                    <button 
                        onClick={() => onClose(false)}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 transition-colors 
                        text-foreground/40 hover:text-foreground z-10 cursor-pointer"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5 animate-float mb-4">
                            <Mic size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            Voice Demo
                        </h3>
                        <p className="text-foreground/60 mt-2 text-sm leading-relaxed max-w-[320px]">
                            Experience real-time speech recognition. Your privacy is our priority—audio is processed on your device.
                        </p>
                    </div>
                </div>

                <div className="px-8 mt-4">
                    <div className="space-y-4 py-6 border-t border-border/50">
                        <FeatureItem text="Instant local transcription with zero lag." />
                        <FeatureItem text="Smart intent recognition for voice commands." />
                        <FeatureItem text="Your audio data never leaves this device." />
                    </div>
                </div>

                <div className="px-8 py-4">
                    <label 
                        className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                            consent ? 'bg-primary/5 border-primary/40' : 'bg-background border-border hover:border-foreground/20'
                        }`}
                    >
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background transition-all checked:bg-primary checked:border-primary"
                            />
                            <CheckCircle2 className="absolute h-5 w-5 text-primary-foreground scale-0 peer-checked:scale-100 transition-transform pointer-events-none p-0.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-foreground">Enable Local Processing</span>
                            <span className="text-[12px] text-foreground/50 leading-snug mt-0.5">
                                I consent to processing my audio locally for this demonstration.
                            </span>
                        </div>
                    </label>
                </div>

                <div className="p-8 pt-2 flex items-center gap-3">
                    <button 
                        onClick={() => onClose(false)} 
                        className="flex-1 h-12 rounded-xl text-sm font-bold border border-border text-foreground/70 
                        hover:bg-foreground/5 transition-all active:scale-95 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleStart}
                        disabled={!consent}
                        className={`flex-[1.8] h-12 rounded-xl text-sm font-bold shadow-lg transition-all 
                            active:scale-95 ${
                            consent 
                            ? 'bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90 cursor-pointer' 
                            : 'bg-foreground/10 text-foreground/30 cursor-not-allowed'
                        }`}
                    >
                        Launch Demo
                    </button>
                </div>

                <div className="pb-6 flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-foreground/30 font-bold">
                    <ShieldCheck size={12} />
                    On-Device Encrypted
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 size={13} className="text-success" />
            </div>
            <span className="text-sm font-medium text-foreground/70">{text}</span>
        </div>
    );
}

export default LandingPage;