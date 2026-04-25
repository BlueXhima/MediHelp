import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Mic, Send, ShieldCheck, Activity, Heart, 
    Info, RotateCcw, Terminal, AlertTriangle, BookOpen, 
    ExternalLink, CheckCircle2, Tag , Pencil, Copy, ThumbsUp, ThumbsDown, Trash2,
    Volume2, Square, User2
} from 'lucide-react';
import AvatarBot from '../../assets/mediAvatar.png';
import ToastMessage, { showToast } from '../../components/ToastMessage';
import DeleteModal from '../../components/DeleteModal';
import InfoModal from '../../components/InfoModal';

const ChatPage = () => {
    const navigate = useNavigate();

    // 1. STATES INITIALIZATION (Dapat mauna ito)
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [deleteMode, setDeleteMode] = useState(null); 
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tempText, setTempText] = useState("");
    const messagesEndRef = React.useRef(null);
    
    // Voice Attempts Logic
    const MAX_VOICE_ATTEMPTS = 5;
    const [voiceAttempts, setVoiceAttempts] = useState(() => {
        const saved = localStorage.getItem('guest_voice_attempts');
        return saved ? parseInt(saved) : 0;
    });

    // Full Object Data based on your structure
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'user',
            text: "What are the common symptoms of seasonal allergies?",
            reaction: null
        },
        // Tanggalin muna dito yung bot response (id: 2)
    ]);

    const chatEndRef = React.useRef(null);

    // 2. EFFECTS (Ngayon safe na gamitin ang 'messages')
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Automated "Thinking" effect pagkapasok sa page
    useEffect(() => {
        // 1. Pagkapasok sa page, mag-isip muna si Medi
        setIsTyping(true);

        const timer = setTimeout(() => {
            // 2. Patayin ang loading
            setIsTyping(false);

            // 3. I-add ang static bot response sa listahan
            const staticBotResponse = {
                id: 2,
                type: 'bot',
                reaction: null,
                category: "Allergies",
                aiResponse: `Seasonal allergies, also known as hay fever (allergic rhinitis), occur when your immune system overreacts to typically harmless outdoor substances called allergens. Instead of ignoring them, your body releases histamine and other chemicals, leading to inflammation in the nasal passages and eyes.\n
                    Common indicators include:
                    • Persistent sneezing and nasal congestion that worsens outdoors
                    • Allergic conjunctivitis (itchy, watery, or red eyes)
                    • Tickling sensation in the throat or inside of the ears
                    • Postnasal drip which may lead to a dry, irritating cough
                    • Temporary loss of smell or mild facial pressure\n
                    These symptoms often peak during specific seasons when plants release pollen. For example, trees are common triggers in the spring, grasses in the summer, and ragweed or mold in the fall. Unlike a common cold, seasonal allergies are not caused by a virus and typically do not involve a fever.`,
                recommendations: [
                    "Keep windows closed during high pollen counts",
                    "Use an air purifier with a HEPA filter",
                    "Shower and change clothes after spending time outdoors",
                    "Consider over-the-counter antihistamines for relief"
                ],
                articles: [
                    {
                        title: "Understanding Pollen Counts & Your Health",
                        source: "MediHelp Library",
                        readTime: "5 min read",
                        url: "#"
                    },
                    {
                        title: "Top 10 Tips to Manage Seasonal Allergies",
                        source: "Healthline",
                        readTime: "7 min read",
                        url: "#"
                    }
                ],
                warning: "Note: If you experience wheezing or shortness of breath..."
            };

            setMessages(prev => [...prev, staticBotResponse]);
        }, 3000); // 3 seconds na delay para ramdam yung "thinking"

        return () => clearTimeout(timer);
    }, []);

    // 3. HANDLERS
    const toggleListening = () => {
        if (voiceAttempts >= MAX_VOICE_ATTEMPTS && !isListening) {
            showToast("Voice limit reached!", "warning");
            return;
        }

        if (!isListening) {
            setIsListening(true);
            setVoiceAttempts(prev => {
                const newCount = prev + 1;
                localStorage.setItem('guest_voice_attempts', newCount.toString());
                return newCount;
            });
        } else {
            // PAG-STOP NG MIC
            setIsListening(false);
            
            // 1. Add User Query agad
            const userMsg = {
                id: Date.now(),
                type: 'user',
                text: "I've been feeling a sharp pain in my lower back, what should I do?",
                reaction: null
            };
            setMessages(prev => [...prev, userMsg]);

            // 2. Medi starts thinking (Dito mag-u-auto scroll din dahil sa isTyping)
            setIsTyping(true);

            // 3. Simulated Response Delay
            setTimeout(() => {
                setIsTyping(false);
                const botMsg = {
                    id: Date.now() + 1,
                    type: 'bot',
                    category: "Physical Health",
                    aiResponse: "Sharp lower back pain can result from muscle strain or spinal issues. It is important to rest and avoid heavy lifting.",
                    recommendations: ["Apply heat/cold packs", "Gentle stretching", "Consult a specialist"],
                    articles: [{ title: "Back Pain Relief", source: "MediHelp", readTime: "4 min", url: "#" }],
                    warning: "Seek immediate care if you feel numbness or loss of bladder control."
                };
                setMessages(prev => [...prev, botMsg]);
            }, 3000);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: Magdagdag ng alert o toast dito
        showToast("Copied to clipboard!", "success");
    };

    // Triggered by the Header button
    const handleClearConversation = () => {
        setDeleteMode('all');
        setIsModalOpen(true);
    };

    // Triggered by individual message trash icons
    const promptDelete = (id) => {
        setMessageToDelete(id);
        setDeleteMode('single');
        setIsModalOpen(true);
    };

    // Final execution after modal confirmation
    const confirmDeleteAction = () => {
        if (deleteMode === 'all') {
            setMessages([]); // Clears all user queries and AI responses
            showToast("Chat history cleared", "info");
        } else if (deleteMode === 'single' && messageToDelete) {
            setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
            showToast("Message deleted", "info");
        }
        setIsModalOpen(false);
        setMessageToDelete(null);
        setDeleteMode(null);
    };

    const handleReplay = (text) => {
        // Kung nagsasalita na, i-stop natin (toggle behavior)
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;

        // Kapag nagsimula na ang boses
        utterance.onstart = () => setIsSpeaking(true);

        // Kapag natapos o hininto ang boses
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const handleReaction = (id, type) => {
        // 1. First, check the current state to see if we are toggling or setting
        const currentMsg = messages.find(m => m.id === id);
        if (!currentMsg) return;

        const isTogglingOff = currentMsg.reaction === type;

        // 2. Trigger the toast ONLY if we are actually setting a new reaction
        if (!isTogglingOff) {
            if (type === 'like') {
                showToast("Thank you! We're glad this helped.", "success");
            } else if (type === 'dislike') {
                showToast("Thanks for the feedback. We'll improve this.", "info");
            }
        }

        // 3. Finally, update the state
        setMessages(prevMessages => 
            prevMessages.map(msg => {
                if (msg.id === id) {
                    return { ...msg, reaction: isTogglingOff ? null : type };
                }
                return msg;
            })
        );
    };

    {/* const handleSendMessage = (text) => {
        if (!text.trim()) return;

        // 1. I-add ang user message sa state
        const newUserMsg = { id: Date.now(), type: 'user', text: text };
        setMessages(prev => [...prev, newUserMsg]);

        // 2. Simulan ang "Thinking" state
        setIsTyping(true);

        // 3. Simulate API/AI delay (halimbawa 2 seconds)
        setTimeout(() => {
            setIsTyping(false); // Patayin ang loading

            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                category: "General Health",
                aiResponse: "This is a simulated AI response based on your query...",
                // ... (other bot properties)
            };

            setMessages(prev => [...prev, botResponse]);
            showToast("Medi has responded", "success");
        }, 2500); 
    }; */}

    // Magdagdag ng useEffect para i-save ang count
    useEffect(() => {
        localStorage.setItem('guest_voice_attempts', voiceAttempts.toString());
    }, [voiceAttempts]);

    // Ilagay mo ito sa loob ng ChatPage component
    const resetAttempts = () => {
        localStorage.removeItem('guest_voice_attempts');
        setVoiceAttempts(0);
        showToast("Testing: Attempts Reset!", "success");
    };

    // 2. Function para sa pag-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 3. Trigger scroll tuwing may pagbabago sa messages o kapag nag-iisip si Medi
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans">
            <ToastMessage />

            <DeleteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDeleteAction}
                title="Delete Message?"
                message="This will permanently remove the message from your current session."
            />

            <InfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)} 
            />

            <main className="flex-1 flex overflow-hidden">
                {/* --- LEFT COLUMN: Chat Interface (60%) --- */}
                <div className="flex-[1.5] flex flex-col border-r border-border relative">
                    
                    {/* GUEST HEADER */}
                    <div className="h-16 flex justify-between items-center px-6 border-b border-border shrink-0">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary 
                            font-bold text-sm transition-all group cursor-pointer"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                        </button>
                        <div className="flex items-center gap-4">
                            {/* VOICE ATTEMPTS TRACKER - DITO LALABAS YUNG ATTEMPTS */}
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${
                                voiceAttempts >= MAX_VOICE_ATTEMPTS 
                                ? 'border-red-500/30 bg-red-500/5 text-red-500' 
                                : 'border-primary/30 bg-primary/5 text-primary'
                            }`}>
                                <Mic size={12} className={isListening ? "animate-pulse" : ""} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                    {MAX_VOICE_ATTEMPTS - voiceAttempts <= 0 
                                        ? "0 Attempts Left" 
                                        : `${MAX_VOICE_ATTEMPTS - voiceAttempts} Voice Attempts Left`
                                    }
                                </span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter">Secured Session</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div 
                        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-background" 
                        ref={chatEndRef}
                    >
                        {/* --- DYNAMIC MESSAGE RENDERING --- */}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-700`}>
                                <div className={`max-w-[90%] flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    
                                    {/* Avatar/Icon */}
                                    <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden border border-border shadow-sm">
                                        {msg.type === 'user' ? (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                                                <User2 size={18} />
                                            </div>
                                        ) : (
                                            <img src={AvatarBot} alt="Medi" className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    {/* Dynamic Message Content */}
                                    <div className={`w-fit group relative ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        
                                        {/* USER BUBBLE (Dynamic Width) */}
                                        {msg.type === 'user' && (
                                            <div className="relative group flex items-start gap-3 w-full justify-end">
                                                
                                                {/* Hover Buttons */}
                                                {editingId !== msg.id && (
                                                    <div className="absolute -left-24 top-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pr-4"> 
                                                        <button onClick={() => handleCopy(msg.text)} className="p-2.5 rounded-xl bg-background border border-border hover:text-primary transition-all shadow-sm active:scale-90">
                                                            <Copy size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setEditingId(msg.id);
                                                                setTempText(msg.text);
                                                            }}
                                                            className="p-2.5 rounded-xl bg-background border border-border hover:text-primary transition-all shadow-sm active:scale-90"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Bubble Content */}
                                                <div className={`transition-all duration-300 ${editingId === msg.id ? 'w-full max-w-xl' : 'w-fit'}`}>
                                                    {editingId === msg.id ? (
                                                        /* --- EDIT MODE VIEW --- */
                                                        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="relative w-full">
                                                                <textarea 
                                                                    value={tempText}
                                                                    onChange={(e) => {
                                                                        setTempText(e.target.value);
                                                                        // Auto-resize logic
                                                                        e.target.style.height = 'inherit';
                                                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                                                    }}
                                                                    onFocus={(e) => {
                                                                        // I-set ang initial height pagka-focus
                                                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                                                    }}
                                                                    className="w-full p-4 rounded-2xl border-2 border-primary bg-background text-sm font-medium focus:outline-none shadow-xl overflow-hidden resize-none min-h-[50px]"
                                                                    placeholder="Edit your message..."
                                                                    autoFocus
                                                                />
                                                            </div>

                                                            {/* Action Buttons sa Ibaba */}
                                                            <div className="flex justify-end gap-2 px-1">
                                                                <button 
                                                                    onClick={() => setEditingId(null)}
                                                                    className="px-5 py-2 rounded-xl border border-border bg-background text-[11px] font-black uppercase tracking-wider hover:bg-muted transition-all active:scale-95"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        msg.text = tempText; 
                                                                        setEditingId(null);
                                                                    }}
                                                                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                                                                >
                                                                    Save Changes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* --- NORMAL VIEW --- */
                                                        <div className="p-4 rounded-2xl rounded-tr-none border border-primary/30 bg-primary/5 text-sm font-medium shadow-sm group-hover:bg-primary/10 transition-all">
                                                            {msg.text}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* BOT RESPONSE CARD */}
                                        {msg.type === 'bot' && (
                                            <div className="flex flex-col gap-4 w-full items-start max-w-[90%]">
                                                
                                                {/* FIRST DIV: Main AI Response (Patterned after your conversationHistory) */}
                                                <div className="w-full p-5 rounded-2xl rounded-tl-none border border-border bg-background shadow-sm space-y-4">
                                                    {/* Header Area */}
                                                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Activity size={16} className="text-primary" />
                                                            <span className="text-[14px] font-bold tracking-widest text-primary">Medi Intelligence</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Tag size={14} className="text-muted-foreground" />
                                                            <span className="text-[11px] text-muted-foreground font-medium tracking-wide">{msg.category}</span>
                                                        </div>
                                                    </div>

                                                    {/* AI Text Body */}
                                                    <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                                        {msg.aiResponse}
                                                    </div>

                                                    {/* Recommendations */}
                                                    {msg.recommendations && (
                                                        <div className="pt-2 space-y-2">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                <CheckCircle2 size={12} className="text-emerald-500" /> Recommendations
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                {msg.recommendations.map((rec, i) => (
                                                                    <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs text-foreground/80 italic">
                                                                        "{rec}"
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* SECOND DIV: Articles (Full Width na rin) */}
                                                {msg.articles && (
                                                    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                        <div className="space-y-4 mt-2">
                                                            <h5 className="text-[14px] font-bold tracking-widest text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
                                                                <BookOpen size={14} className="text-blue-500" /> Suggested Library Articles
                                                            </h5>
                                                            
                                                            <div className="flex flex-col gap-3">
                                                                {msg.articles.map((article, i) => (
                                                                    <a 
                                                                        href={article.url} 
                                                                        key={i} 
                                                                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group/item bg-muted/20 w-full"
                                                                    >
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-sm font-bold group-hover/item:text-primary transition-colors">{article.title}</span>
                                                                            <span className="text-[10px] text-muted-foreground font-medium">{article.source} • {article.readTime}</span>
                                                                        </div>
                                                                        <div className="p-2 rounded-lg bg-background border border-border group-hover/item:text-primary">
                                                                            <ExternalLink size={14} />
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* THIRD DIV: Interaction Buttons (Like, Dislike, Copy, etc.) */}
                                                <div className="flex items-center gap-4 ml-1">
                                                    <button 
                                                        title="Like" 
                                                        aria-label='Like' 
                                                        onClick={() => handleReaction(msg.id, 'like')} 
                                                        className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${
                                                            msg.reaction === 'like' 
                                                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                            : 'border-border bg-background text-muted-foreground hover:text-emerald-500'
                                                        }`}
                                                    >
                                                        <ThumbsUp size={14} fill={msg.reaction === 'like' ? "currentColor" : "none"} />
                                                    </button>
                                                    <button 
                                                        title="Dislike" 
                                                        aria-label='Dislike' 
                                                        onClick={() => handleReaction(msg.id, 'dislike')}
                                                        className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${
                                                            msg.reaction === 'dislike' 
                                                            ? 'bg-red-500 text-white shadow-inner' 
                                                            : 'border-border bg-background text-muted-foreground hover:text-red-600'
                                                        }`}
                                                    >
                                                        <ThumbsDown size={14} fill={msg.reaction === 'dislike' ? "currentColor" : "none"} />
                                                    </button>
                                                    <button 
                                                        title="Copy" 
                                                        aria-label='Copy' 
                                                        onClick={() => handleCopy(msg.aiResponse)}
                                                        className="p-2 rounded-lg border border-border bg-background text-muted-foreground 
                                                        hover:text-primary transition-all shadow-sm cursor-pointer"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                    <button 
                                                        title={isSpeaking ? "Stop" : "Replay"} 
                                                        aria-label={isSpeaking ? "Stop speaking" : "Replay audio"} 
                                                        onClick={() => handleReplay(msg.aiResponse)} 
                                                        className={`p-2 rounded-lg border border-border transition-all shadow-sm cursor-pointer ${
                                                            isSpeaking ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-background text-muted-foreground hover:text-primary'
                                                        }`}
                                                    >
                                                        {isSpeaking ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                                                    </button>
                                                    <button 
                                                        title="Delete" 
                                                        aria-label='Delete' 
                                                        onClick={() => promptDelete(msg.id)} 
                                                        className="p-2 rounded-lg border border-border bg-background text-muted-foreground 
                                                        hover:text-red-500 transition-all shadow-sm cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Timestamp */}
                                        <div className="mt-2 text-[9px] font-bold text-muted-foreground uppercase opacity-40">
                                            {msg.timestamp || "Just Now"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* VOICE LIMIT WARNING */}
                        {voiceAttempts >= MAX_VOICE_ATTEMPTS && !isTyping && (
                            <div className="mt-8 p-8 rounded-[32px] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 shadow-xl shadow-primary/5 animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-foreground uppercase">Voice Access Limited</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                            You've reached the maximum voice attempts for guest users. Create an account to get **unlimited voice interaction** and personalized health tracking.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 mt-2">
                                        <button 
                                            onClick={() => navigate('/signup')}
                                            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                                        >
                                            Create Account
                                        </button>
                                        <button 
                                            onClick={() => navigate('/login')}
                                            className="px-6 py-3 rounded-xl bg-secondary border border-border font-bold text-xs uppercase tracking-widest hover:bg-muted transition-all"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI THINKING STATE */}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-500">
                                <div className="flex gap-4 max-w-[80%] items-start">
                                    {/* Bot Avatar */}
                                    <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden border border-border shadow-sm">
                                        <img src={AvatarBot} alt="Medi" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Thinking Bubble */}
                                    <div className="flex flex-col gap-2 text-left">
                                        <div className="px-5 py-4 rounded-2xl rounded-tl-none border border-border bg-background shadow-sm">
                                            <div className="flex items-center gap-3">
                                                {/* Animated Spinner */}
                                                <div className="relative w-4 h-4">
                                                    <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                                </div>
                                                <span className="text-xs font-bold tracking-widest text-primary animate-pulse">
                                                    Medi is thinking...
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 ml-1">
                                            Analyzing Health Query
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} className="h-4" />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-background border-t border-border flex gap-3">
                        <input 
                            type="text" 
                            placeholder="Type your health question..." 
                            className="flex-1 bg-transparent border border-border rounded-2xl px-5 py-2 text-sm 
                            focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:opacity-50
                            " 
                        />
                        <button aria-label='Send' className="p-2 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"><Send size={20} /></button>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Voice Dashboard (Same logic) --- */}
                <div className="flex-1 p-8 flex flex-col justify-between items-center text-center bg-background">
                    <div className="w-full pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
                            <span className={`w-2 h-2 rounded-full bg-primary ${isListening ? 'animate-ping' : ''}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{isListening ? 'Listening' : 'Ready'}</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">Voice Interface</h3>
                        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto italic opacity-70 leading-relaxed">"What treatments are best for allergy symptoms?"</p>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="w-full max-w-sm h-32 flex items-center justify-center space-x-2">
                        {isListening ? (
                            Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="w-1.5 bg-primary rounded-full animate-wave-dots" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))
                        ) : (
                            Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                            ))
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-10 w-full pb-10">
                        <button
                            disabled={voiceAttempts >= MAX_VOICE_ATTEMPTS && !isListening} 
                            aria-label={isListening ? "Stop Listening" : "Start Listening"} 
                            onClick={toggleListening}
                            className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 cursor-pointer shadow-lg active:scale-95 ${
                                isListening 
                                ? 'border-red-500 bg-red-500/10 text-red-500 shadow-red-500/20' 
                                : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40'
                            }`}
                        >
                            {isListening ? (
                                /* STOP ICON kapag nakikinig */
                                <Square size={32} fill="currentColor" className="animate-pulse" />
                            ) : (
                                /* MIC ICON kapag ready */
                                <Mic size={32} />
                            )}
                        </button>

                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">
                            {MAX_VOICE_ATTEMPTS - voiceAttempts} attempts remaining
                        </span>
                        
                        <div className="flex items-center gap-8">
                            {/* CLEAR CONVERSATION BUTTON */}
                            <button 
                                onClick={handleClearConversation} 
                                aria-label="Clear Chat" 
                                className="group relative cursor-pointer flex flex-col items-center gap-2.5 transition-all active:scale-90"
                            >
                                <div className="relative p-4 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md shadow-sm group-hover:bg-red-500/10 group-hover:border-red-500/20 group-hover:shadow-md group-hover:shadow-red-500/5 transition-all duration-300">
                                    <RotateCcw 
                                        size={20} 
                                        className="text-muted-foreground group-hover:text-red-500 group-hover:rotate-[-45deg] transition-all duration-500" 
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 group-hover:text-red-500 transition-colors duration-300">
                                    Clear
                                </span>
                            </button>

                            {/* INFO BUTTON */}
                            <button 
                                onClick={() => setIsInfoOpen(true)}
                                aria-label="Info" 
                                className="group relative cursor-pointer flex flex-col items-center gap-2.5 transition-all active:scale-90"
                            >
                                <div className="relative p-4 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:shadow-md group-hover:shadow-primary/5 transition-all duration-300">
                                    <Info 
                                        size={20} 
                                        className="text-muted-foreground group-hover:text-primary transition-all duration-300" 
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 group-hover:text-primary transition-colors duration-300">
                                    Info
                                </span>
                            </button>
                        </div>
                    </div>

                    <div 
                        onClick={resetAttempts}
                        className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 
                        uppercase tracking-[0.4em]"
                    >
                        <Terminal size={12} /> Medi.v1
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes wave-dots { 0%, 100% { height: 12px; opacity: 0.3; } 50% { height: 40px; opacity: 1; } }
                .animate-wave-dots { animation: wave-dots 1.2s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ChatPage;