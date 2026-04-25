import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Download, Volume2, Send, Copy, Trash2, Check, AlertCircle, Pencil, X, User2,
        ThumbsUp, ThumbsDown, Square, ExternalLink, BookOpen, CheckCircle2, Zap
} from 'lucide-react';
import MediAvatar from '../../../assets/mediAvatar.png';
import ExportModal from './exportModal';
import axios from 'axios';

const ConversationHistory = ({ conversations, onReplay, onSave, onSendMessage, isProcessing, onDelete, isSpeakingId }) => {
    const [message, setMessage] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [tempEditText, setTempEditText] = useState('');
    const scrollRef = useRef(null);
    const prevCountRef = useRef(conversations?.length || 0);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const userData = JSON.parse(localStorage.getItem('user'));
    const [userAvatar, setUserAvatar] = useState(null);

    useEffect(() => {
        const fetchUserAvatar = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        params: { email },
                    });
                    // I-set ang avatar mula sa database response
                    setUserAvatar(response.data.profile_picture);
                    
                    // Optional: I-update na rin ang 'user' object sa localStorage para sync lahat
                    const existingUser = JSON.parse(localStorage.getItem('user')) || {};
                    localStorage.setItem('user', JSON.stringify({
                        ...existingUser,
                        profile_picture: response.data.profile_picture
                    }));
                } catch (error) {
                    console.error('Error fetching avatar:', error);
                }
            }
        };

        fetchUserAvatar();
    }, []);

    useEffect(() => {
        // I-check kung may bagong message o kung nagpa-process (typing animation)
        const hasNewMessage = conversations?.length > prevCountRef.current;

        if (scrollRef.current && (hasNewMessage || isProcessing)) {
            // Gagamit tayo ng scrollTo para mas smooth
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        prevCountRef.current = conversations?.length || 0;
    }, [conversations, isProcessing]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEditStart = (chat) => {
        setEditingId(chat.id);
        setTempEditText(chat.userMessage);
    };

    const handleEditSave = (id) => {
        if (tempEditText.trim()) {
            onSendMessage(tempEditText, id); 
            setEditingId(null);
        }
    };

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleExportClick = () => {
        setIsExportModalOpen(true);
    };

    return (
        <div 
            className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
            rounded-[2rem] p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <MessageCircle size={20} className="mr-3 text-accent" />
                    Conversation History
                </h3>
                <button
                    onClick={handleExportClick}
                    className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1
                        bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                    <Download size={18} className="mr-2" />
                    Export
                </button>
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="space-y-4 overflow-y-auto pr-2 custom-scrollbar transition-all"
                style={{ maxHeight: '400px', minHeight: '300px' }}
            >
                {conversations?.map((chat) => {
                    const isSpeaking = isSpeakingId === chat.id;

                    return (
                        <div key={chat?.id} className="space-y-4 animate-fade-in mb-6">
                            {/* USER MESSAGE ROW */}
                            <div className="flex items-start justify-end gap-3 group mb-4">
                                {/* HOVER ACTIONS - Adjusted Position */}
                                {editingId !== chat.id && (
                                    <div 
                                        className="flex flex-row items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 
                                        self-start pb-1 translate-y-2 group-hover:translate-y-0"
                                    >
                                        {/* Copy Button */}
                                        <button 
                                            onClick={() => handleCopy(chat.userMessage, chat.id)}
                                            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-500 hover:text-primary 
                                            hover:bg-white shadow-sm border border-border/50 cursor-pointer active:scale-90 transition-all"
                                            title="Copy Message"
                                        >
                                            {copiedId === chat.id ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} />}
                                        </button>
                                        
                                        {/* Edit Button */}
                                        <button 
                                            onClick={() => handleEditStart(chat)}
                                            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-500 hover:text-primary 
                                            hover:bg-white shadow-sm border border-border/50 cursor-pointer active:scale-90 transition-all"
                                            title="Edit Message"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                )}
                                {/* Message Bubble Container */}
                                <div className="flex flex-col items-end group animate-in slide-in-from-right duration-300">
                                    {editingId === chat.id ? (
                                        /* In-place edit area... */
                                        <div className="w-full space-y-1 animate-in fade-in zoom-in-95 duration-200">
                                            <textarea
                                                value={tempEditText}
                                                onChange={(e) => setTempEditText(e.target.value)}
                                                className="w-full p-4 text-sm bg-white border-2 border-primary rounded-xl focus:outline-none shadow-lg text-foreground min-h-[100px] resize-none"
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    onClick={() => setEditingId(null)} 
                                                    className="px-4 py-2 text-xs font-medium text-muted-foreground 
                                                    hover:text-red-500 transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                                <button 
                                                    onClick={() => handleEditSave(chat.id)} 
                                                    className="px-4 py-2 text-xs font-bold bg-primary 
                                                    text-primary-foreground rounded-lg hover:opacity-90 shadow-md 
                                                    transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <Check size={14} /> Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Normal Bubble... */
                                        <>
                                            <div className="max-w-[100%] text-left bg-gradient-to-br from-primary to-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md hover:shadow-lg transition-shadow">
                                                <p className="text-sm leading-relaxed">{chat.userMessage}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1 mr-1 font-medium">You • {chat.timestamp}</span>
                                        </>
                                    )}
                                </div>
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden flex-shrink-0 bg-gray-50">
                                    {userAvatar ? (
                                        <img 
                                            src={userAvatar} 
                                            alt="User" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback kapag hindi nag-load ang image (e.g. invalid URL)
                                                e.target.onerror = null; 
                                                e.target.src = 'https://ui-avatars.com/api/?name=User&background=0066FF&color=fff';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-blue-600">
                                            <User2 size={20} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Response Row */}
                            <div className="flex items-start justify-start gap-3 group animate-in slide-in-from-left duration-300">
                                {/* AI Avatar */}
                                <div className="relative flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        <img src={MediAvatar} alt="AI" className="w-7 h-7 object-cover" />
                                    </div>
                                    {/* Online Indicator Badge */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                
                                <div className="flex flex-col items-start max-w-[80%]">
                                    <div className="w-full p-5 rounded-2xl rounded-tl-none border border-border bg-background shadow-sm space-y-4">
                                        <div className="text-sm text-left leading-relaxed whitespace-pre-line text-foreground/90">
                                            {chat.aiResponse}
                                        </div>
                                        {chat.recommendations && (
                                            <div className="pt-2 space-y-2">
                                                <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    <CheckCircle2 size={12} className="text-emerald-500" /> Recommendations
                                                </div>
                                                <ul className="mt-1 space-y-1 text-left">
                                                    {chat.recommendations.map((rec, index) => (
                                                        <li key={index} className="p-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground/80 italic">
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {chat.warning && (
                                            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 flex items-start">
                                                <AlertCircle size={14} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs font-medium text-red-700 text-left">{chat.warning}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* HEALTH TIPS & PREVENTION - Bago ang Related Articles */}
                                    {chat?.healthtips && chat.healthtips.length > 0 && (
                                        <div className="mt-6  group">
                                            {/* Header with animated icon */}
                                            <div className="flex items-center gap-2 mb-4 px-1">
                                                <div className="p-1.5 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors duration-300">
                                                    <Zap 
                                                        className="text-amber-500 animate-pulse" 
                                                        size={18} 
                                                        fill="currentColor" 
                                                    />
                                                </div>
                                                <span className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                                    Health Tips & Prevention
                                                </span>
                                            </div>
                                            
                                            {/* Tips Container */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {chat.healthtips.map((tip, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="group/item flex items-start gap-4 p-4 
                                                                bg-gradient-to-r from-blue-50/80 to-white 
                                                                border border-blue-100/50 rounded-2xl
                                                                hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5
                                                                transition-all duration-300 ease-in-out
                                                                transform hover:-translate-y-0.5 w-full"
                                                    >
                                                        {/* Number or Icon Indicator */}
                                                        <div className="relative flex-shrink-0 mt-0.5">
                                                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-0 group-hover/item:opacity-40 transition-opacity" />
                                                            <div className="relative w-6 h-6 bg-white border-2 border-blue-100 rounded-full flex items-center justify-center transition-colors group-hover/item:border-blue-400">
                                                                <CheckCircle2 size={12} className="text-blue-500" />
                                                            </div>
                                                        </div>

                                                        {/* Tip Text */}
                                                        <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
                                                            {tip}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {chat.articles && chat.articles.length > 0 && (
                                        <div className="mt-4 w-full space-y-2 animate-fade-in text-left">
                                            <h5 className="text-[15px] font-bold tracking-widest text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
                                                <BookOpen size={14} className="text-blue-500" /> Related Articles
                                            </h5>

                                            <div className="grid grid-cols-1 gap-2 mt-2">
                                                {chat.articles.map((article, index) => (
                                                    <a 
                                                        key={index}
                                                        href={article.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
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
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-4 ml-1 mt-4">
                                        <button 
                                            title="Like" 
                                            aria-label='Like' 
                                            // onClick={() => handleReaction(chat.id, 'like')} 
                                            className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${
                                                chat.reaction === 'like' 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : 'border-border bg-background text-muted-foreground hover:text-emerald-500'
                                            }`}
                                        >
                                            <ThumbsUp size={14} fill={chat.reaction === 'like' ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            title="Dislike" 
                                            aria-label='Dislike' 
                                            // onClick={() => handleReaction(msg.id, 'dislike')}
                                            className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${
                                                chat.reaction === 'dislike' 
                                                ? 'bg-red-500 text-white shadow-inner' 
                                                : 'border-border bg-background text-muted-foreground hover:text-red-600'
                                            }`}
                                        >
                                            <ThumbsDown size={14} fill={chat.reaction === 'dislike' ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            title="Copy" 
                                            aria-label='Copy' 
                                            onClick={() => handleCopy(chat.aiResponse)}
                                            className="p-2 rounded-lg border border-border bg-background text-muted-foreground 
                                            hover:text-primary transition-all shadow-sm cursor-pointer"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button 
                                            title={isSpeaking ? "Stop" : "Replay"} 
                                            aria-label={isSpeaking ? "Stop speaking" : "Replay audio"} 
                                            onClick={() => onReplay(chat.aiResponse, chat.id)}
                                            className={`p-2 rounded-lg border border-border transition-all shadow-sm cursor-pointer ${
                                                isSpeaking ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-background text-muted-foreground hover:text-primary'
                                            }`}
                                        >
                                            {isSpeaking ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                                        </button>
                                        <button 
                                            title="Delete" 
                                            aria-label='Delete' 
                                            onClick={() => onDelete(chat.id)} 
                                            className="p-2 rounded-lg border border-border bg-background text-muted-foreground 
                                            hover:text-red-500 transition-all shadow-sm cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-2">{chat.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator with Avatar */}
                {isProcessing && (
                    <div className="flex items-start justify-start gap-3 animate-fade-in mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 mt-1">
                            <img src={MediAvatar} alt="MediAvatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your health concern here..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {isExportModalOpen && (
                <ExportModal 
                    isOpen={isExportModalOpen} 
                    onClose={() => setIsExportModalOpen(false)} 
                    conversationData={conversations} 
                />
            )}
        </div>
    );
};

export default ConversationHistory;