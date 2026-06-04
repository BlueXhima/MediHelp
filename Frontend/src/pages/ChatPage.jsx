//Frontend/src/pages/ChatPage.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, AlertTriangle, Terminal, Mic } from 'lucide-react';

import ChatHeader from './chat-compo/ChatHeader';
import ChatMessageArea from './chat-compo/ChatMessageArea';
import VoiceControlPanel from './chat-compo/VoiceControlPanel';

import { showToast } from '../components/ToastMessage';
import DeleteModal from '../components/modals/DeleteModal';
import InfoModal from '../components/modals/InfoModal';

import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { userService } from '../services/userService';
import { groqService } from '../services/groqService';
import { articleService } from '../services/articleService';

const SESSION_KEY = 'medi_chat_messages';
const SESSION_GUEST_CHAT = 'medi_guest_chat_attempts';
const SESSION_GUEST_CHAT_TIMESTAMP = 'medi_guest_chat_attempts_timestamp';

const getInitialMessages = () => {
    try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [
        {
            id: 1,
            type: 'bot',
            text: "Hello! I am Medi, your AI Voice Assistant. How can I help you analyze your symptoms today?",
            reaction: null,
            category: "General"
        }
    ];
};

const getInitialGuestChatAttempts = () => {
    try {
        const saved = sessionStorage.getItem(SESSION_GUEST_CHAT);
        const timestamp = sessionStorage.getItem(SESSION_GUEST_CHAT_TIMESTAMP);
        if (saved && timestamp) {
            const age = Date.now() - parseInt(timestamp, 10);
            if (age < 24 * 60 * 60 * 1000) {
                return parseInt(saved, 10);
            }
        }
    } catch { /* ignore */ }
    return 0;
};

const ChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const chatEndRef = useRef(null);
    const [userProfile, setUserProfile] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [speakingMessageId, setSpeakingMessageId] = useState(null);
    const ttsUtteranceRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [deleteMode, setDeleteMode] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [tempText, setTempText] = useState("");

    const [textInput, setTextInput] = useState("");
    const [voicePreview, setVoicePreview] = useState("");

    const processedVoiceQueryRef = useRef(false);

    const MAX_GUEST_ATTEMPTS = 10;
    const [guestAttempts, setGuestAttempts] = useState(getInitialGuestChatAttempts);

    const remainingAttempts = Math.max(0, MAX_GUEST_ATTEMPTS - guestAttempts);
    useDocumentTitle(
        isLoggedIn
            ? "Symptom Checker"
            : `Guest Mode (${remainingAttempts} Left)`
    );

    const [messages, setMessages] = useState(getInitialMessages);

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
        } catch { /* ignore */ }
    }, [messages]);

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_GUEST_CHAT, guestAttempts.toString());
            sessionStorage.setItem(SESSION_GUEST_CHAT_TIMESTAMP, Date.now().toString());
        } catch { /* ignore */ }
    }, [guestAttempts]);

    const speakText = useCallback((text, messageId) => {
        if (!window.speechSynthesis) {
            showToast("Text-to-speech is not supported in your browser.", "error");
            return;
        }

        window.speechSynthesis.cancel();

        if (speakingMessageId === messageId) {
            setSpeakingMessageId(null);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const defaultVoice = voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
        if (defaultVoice) utterance.voice = defaultVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setSpeakingMessageId(messageId);
        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);

        ttsUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [speakingMessageId]);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    const simulateBotResponse = useCallback(async (userQuery) => {
        const userMsgId = Date.now();

        setMessages(prev => [
            ...prev,
            { id: userMsgId, type: 'user', text: userQuery, reaction: null }
        ]);

        setIsTyping(true);

        if (!isLoggedIn) {
            setGuestAttempts(prev => {
                const next = prev + 1;
                return next > MAX_GUEST_ATTEMPTS ? MAX_GUEST_ATTEMPTS : next;
            });
        }

        try {
            const currentMessages = messagesRef.current;
            const groqResponse = await groqService.analyzeSymptoms(userQuery, currentMessages);

            let mappedArticles = [];
            if (groqResponse.articles && groqResponse.articles.length > 0) {
                try {
                    mappedArticles = await articleService.mapAiArticles(groqResponse.articles);
                } catch (err) {
                    console.warn("Article mapping failed, using AI fallback:", err);
                    mappedArticles = groqResponse.articles.map(a => ({
                        id: null,
                        title: a.title,
                        source: a.source,
                        readTime: a.readTime,
                        url: '/library'
                    }));
                }
            }

            const botMessageId = Date.now() + 1;

            setMessages(prev => [
                ...prev,
                {
                    id: botMessageId,
                    type: 'bot',
                    category: groqResponse.category || "General",
                    aiResponse: groqResponse.aiResponse || "I was unable to analyze your symptoms. Please try again.",
                    recommendations: groqResponse.recommendations || [],
                    articles: mappedArticles,
                    reaction: null
                }
            ]);

        } catch (error) {
            console.error("Groq API call failed:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: 'bot',
                    category: "Error",
                    aiResponse: `I'm having trouble connecting right now. Please try again in a moment.\n\n${error.message}`,
                    recommendations: [
                        "Check your internet connection and try again.",
                        "Refresh the page if the issue persists.",
                        "For urgent concerns, please consult a medical professional directly."
                    ],
                    articles: [],
                    reaction: null
                }
            ]);
            showToast("Failed to reach Medi AI. Please try again.", "error");
        } finally {
            setIsTyping(false);
        }
    }, [isLoggedIn]);

    const messagesRef = useRef(messages);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        const voiceQuery = location.state?.voiceQuery;
        if (voiceQuery && voiceQuery.trim() && !processedVoiceQueryRef.current) {
            processedVoiceQueryRef.current = true;
            navigate(location.pathname, { replace: true, state: {} });
            simulateBotResponse(voiceQuery.trim());
        }
    }, [location.state, navigate, simulateBotResponse]);

    const handleVoiceResult = useCallback((finalText) => {
        setVoicePreview('');
        if (finalText.trim()) simulateBotResponse(finalText.trim());
    }, [simulateBotResponse]);

    const handleVoiceError = useCallback((errorMsg) => {
        showToast(errorMsg, "error");
    }, []);

    const {
        isListening,
        displayTranscript,
        isSupported,
        permissionDenied,
        startListening,
        stopListening,
        resetTranscript
    } = useVoiceRecognition({
        lang: 'en-US',
        continuous: true,
        interimResults: true,
        silenceTimeout: 5000,
        onResult: handleVoiceResult,
        onError: handleVoiceError
    });

    useEffect(() => {
        if (isListening && displayTranscript) setVoicePreview(displayTranscript);
    }, [displayTranscript, isListening]);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const role = sessionStorage.getItem("userRole");
            setIsLoggedIn(!!role && role !== 'guest');
        };
        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            userService.getFullDetails()
                .then(data => setUserProfile(data))
                .catch(err => console.error("Failed to load profile:", err));
        }
    }, [isLoggedIn]);

    const isActionRestricted = () => {
        if (!isLoggedIn && guestAttempts >= MAX_GUEST_ATTEMPTS) {
            showToast("Limit met! Please register or login for unlimited checkups.", "error");
            return true;
        }
        return false;
    };

    const handleToggleListening = () => {
        if (isActionRestricted()) return;
        if (!isSupported) {
            showToast("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.", "error");
            return;
        }
        if (permissionDenied) {
            showToast("Microphone access denied. Please allow microphone permission in your browser settings.", "error");
            return;
        }
        if (!isListening) {
            resetTranscript();
            setVoicePreview("");
            startListening();
        } else {
            stopListening();
            setVoicePreview("");
        }
    };

    const handleSendText = async () => {
        if (!textInput.trim()) return;
        if (isActionRestricted()) return;

        const query = textInput;
        setTextInput("");
        await simulateBotResponse(query);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!", "success");
    };

    const promptDelete = (id) => {
        setMessageToDelete(id);
        setDeleteMode('single');
        setIsModalOpen(true);
    };

    const handleClearConversation = () => {
        setDeleteMode('all');
        setIsModalOpen(true);
    };

    const confirmDeleteAction = () => {
        if (deleteMode === 'all') {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    text: "Hello! I am Medi, your AI Voice Assistant. How can I help you analyze your symptoms today?",
                    reaction: null,
                    category: "General"
                }
            ]);
            // REMOVED: setGuestAttempts(0);
            // Guest attempts persist even after clearing chat — prevents limit bypass
        } else if (deleteMode === 'single') {
            const targetId = messageToDelete;
            const current = messagesRef.current;
            const targetIndex = current.findIndex(m => m.id === targetId);
            if (targetIndex === -1) {
                setIsModalOpen(false);
                return;
            }

            const targetMsg = current[targetIndex];
            let indicesToRemove = new Set([targetIndex]);

            if (targetMsg.type === 'bot') {
                const userIndex = targetIndex - 1;
                if (userIndex >= 0 && current[userIndex].type === 'user') {
                    indicesToRemove.add(userIndex);
                }
            } else if (targetMsg.type === 'user') {
                const botIndex = targetIndex + 1;
                if (botIndex < current.length && current[botIndex].type === 'bot') {
                    indicesToRemove.add(botIndex);
                }
            }

            setMessages(prev => prev.filter((_, idx) => !indicesToRemove.has(idx)));
        }
        setIsModalOpen(false);
    };

    const startEditing = useCallback((msg) => {
        setEditingId(msg.id);
        setTempText(msg.text || '');
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingId(null);
        setTempText("");
    }, []);

    const saveEdit = useCallback((targetMsg) => {
        const trimmedText = tempText.trim();
        if (!trimmedText) {
            showToast("Message cannot be empty", "error");
            return;
        }
        if (trimmedText === targetMsg.text) {
            setEditingId(null);
            setTempText("");
            return;
        }

        const msgIndex = messagesRef.current.findIndex(m => m.id === targetMsg.id);
        if (msgIndex === -1) return;

        const newMessages = messagesRef.current.slice(0, msgIndex);
        setMessages(newMessages);
        setEditingId(null);
        setTempText("");
        showToast("Message updated — getting fresh response...", "success");

        setTimeout(() => simulateBotResponse(trimmedText), 100);
    }, [tempText, simulateBotResponse]);

    const handleReaction = (id, mode) => {
        setMessages(p => p.map(m => m.id === id ? { ...m, reaction: m.reaction === mode ? null : mode } : m));
        showToast("Feedback noted", "success");
    };

    const isGuestExceeded = !isLoggedIn && guestAttempts >= MAX_GUEST_ATTEMPTS;

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans antialiased">
            <DeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDeleteAction}
                title="Confirm Deletion"
                message="Are you sure you want to delete this structural entry?"
            />

            <InfoModal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
            />

            <ChatHeader
                navigate={navigate}
                isLoggedIn={isLoggedIn}
                MAX_GUEST_ATTEMPTS={MAX_GUEST_ATTEMPTS}
                remainingAttempts={remainingAttempts}
                guestAttempts={guestAttempts}
                handleClearConversation={handleClearConversation}
                setIsInfoOpen={setIsInfoOpen}
            />

            <main className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto flex flex-col">

                    <ChatMessageArea
                        messages={messages}
                        chatEndRef={chatEndRef}
                        editingId={editingId}
                        tempText={tempText}
                        setTempText={setTempText}
                        handleCopy={handleCopy}
                        startEditing={startEditing}
                        cancelEditing={cancelEditing}
                        saveEdit={saveEdit}
                        speakingMessageId={speakingMessageId}
                        handleReplay={speakText}
                        promptDelete={promptDelete}
                        handleReaction={handleReaction}
                        isTyping={isTyping}
                        userProfile={userProfile}
                    />

                    {isGuestExceeded && !isTyping && (
                        <div className="mx-4 mb-4 p-4 md:p-6 rounded-2xl bg-linear-to-br from-primary/10 to-background border border-primary/20 shadow-sm animate-fade-in">
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-black tracking-wider uppercase">Free Trial Limit Met</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        You have used {MAX_GUEST_ATTEMPTS} of your free queries. Register or login for unlimited access.
                                    </p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto justify-center">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                                    >
                                        Register
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-5 py-2 rounded-xl bg-muted border border-border text-foreground text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-3 md:p-4 bg-card/60 backdrop-blur-md border-t border-r border-border flex gap-2 items-center sticky bottom-0 z-20">
                        <button
                            onClick={handleToggleListening}
                            disabled={isGuestExceeded || isTyping}
                            className={`md:hidden p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${isListening
                                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                                    : 'bg-primary/10 border-primary/20 text-primary'
                                }`}
                            title={isListening ? "Stop listening" : "Start voice input"}
                        >
                            <Mic size={18} />
                        </button>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={isListening ? voicePreview : textInput}
                                onChange={(e) => {
                                    if (!isListening) setTextInput(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isTyping && !isListening) handleSendText();
                                }}
                                disabled={isGuestExceeded || isTyping || isListening}
                                placeholder={
                                    isGuestExceeded
                                        ? "Limit reached. Login to continue..."
                                        : isListening
                                            ? "Listening... speak now"
                                            : isTyping
                                                ? "Medi is analyzing..."
                                                : "Describe your symptoms (e.g., 'I have a headache and fever...')"
                                }
                                className={`w-full bg-background/50 border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isListening ? 'border-red-400/50 text-foreground animate-pulse' : 'border-border'}`}
                            />
                            {isListening && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">REC</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSendText}
                            disabled={isGuestExceeded || isTyping || isListening || !textInput.trim()}
                            className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110 active:scale-95"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <VoiceControlPanel
                        isLoggedIn={isLoggedIn}
                        isListening={isListening}
                        toggleListening={handleToggleListening}
                        isSupported={isSupported}
                        permissionDenied={permissionDenied}
                        guestAttempts={guestAttempts}
                        MAX_GUEST_ATTEMPTS={MAX_GUEST_ATTEMPTS}
                        remainingAttempts={remainingAttempts}
                        handleClearConversation={handleClearConversation}
                        setIsInfoOpen={setIsInfoOpen}
                    />
                </div>
            </main>

            <footer className="bg-card text-[9px] text-muted-foreground/50 font-bold uppercase tracking-[0.15em] px-4 md:px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-border/60 shrink-0">
                <div className="flex items-center gap-2 text-muted-foreground/60">
                    <Terminal size={11} className="text-primary/70" />
                    <span>Terminal Engaged:</span>
                    <span className="text-foreground/70 font-mono font-medium lowercase tracking-normal bg-muted px-1.5 py-0.5 rounded border border-border/40">
                        medi.v1-responsive
                    </span>
                    <div className={`w-1 h-1 rounded-full ${isGuestExceeded ? 'bg-amber-500' : 'bg-success'} animate-pulse hidden sm:block`} />
                    <span className={`${isGuestExceeded ? 'text-amber-500/80' : 'text-success/80'} hidden sm:inline text-[8px] tracking-widest font-black`}>
                        {isGuestExceeded ? 'LOCKED' : 'ONLINE'}
                    </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-muted-foreground/40 font-medium">Session:</span>
                        {isLoggedIn ? (
                            <span className="text-primary font-black tracking-wider text-[8px]">UNLIMITED PRO MEMBER</span>
                        ) : (
                            <span className="text-amber-500 font-black tracking-wider text-[8px]">
                                GUEST ({remainingAttempts} LEFT)
                            </span>
                        )}
                    </div>
                    <div className="w-px h-3 bg-border/80 hidden sm:block" />
                    <div className="text-muted-foreground/40 hidden md:block normal-case tracking-normal font-normal text-right">
                        Need immediate help?{" "}
                        <span
                            onClick={() => navigate('/help-support')}
                            className="text-red-500/80 font-bold uppercase text-[9px] tracking-wider hover:underline cursor-pointer pl-1"
                        >
                            Call Emergency
                        </span>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes wave-dots { 
                        0%, 100% { transform: scaleY(1); opacity: 0.3; } 
                        50% { transform: scaleY(3.5); opacity: 1; } 
                    }
                    .animate-wave-dots { 
                        animation: wave-dots 1.2s infinite ease-in-out; 
                        transform-origin: center; 
                    }
                `
            }} />
        </div>
    );
};

export default ChatPage;
