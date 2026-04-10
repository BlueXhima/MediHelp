import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Download, Volume2, Send, Copy, Trash2, Check, AlertCircle, Pencil, X } from 'lucide-react';

const ConversationHistory = ({ conversations, onReplay, onSave, onSendMessage, isProcessing, onDelete }) => {
    const [message, setMessage] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [tempEditText, setTempEditText] = useState('');
    const scrollRef = useRef(null);
    const prevCountRef = useRef(conversations?.length || 0);

    useEffect(() => {
        const hasNewMessage = conversations?.length > prevCountRef.current;
        if (scrollRef.current && (hasNewMessage || isProcessing)) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl 
            shadow-medical p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <MessageCircle size={20} className="mr-3 text-accent" />
                    Conversation History
                </h3>
                <button
                    onClick={onSave}
                    className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1
                        bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                    <Download size={18} className="mr-2" />
                    Export
                </button>
            </div>
            <div 
                ref={scrollRef}
                className="space-y-4 overflow-y-auto pr-2 custom-scrollbar transition-all"
                style={{ maxHeight: '400px', minHeight: '300px' }}
            >
                {conversations?.map((chat) => (
                    <div key={chat?.id} className="space-y-4 animate-fade-in mb-6">
                        {/* USER MESSAGE ROW */}
                        <div className="flex items-start justify-end gap-3 group mb-4">
                            {/* HOVER ACTIONS - Adjusted Position */}
                            {editingId !== chat.id && (
                                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 
                                    self-start pb-1 translate-x-2 group-hover:translate-x-0">
                                    
                                    <button 
                                        onClick={() => handleCopy(chat.userMessage, chat.id)}
                                        className="p-2 rounded-lg bg-white dark:bg-slate-200 text-slate-500 hover:text-blue-800 
                                        shadow-sm border border-border cursor-pointer active:scale-90"
                                    >
                                        {copiedId === chat.id ? <Check size={14} className="text-success"/> : <Copy size={14} />}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleEditStart(chat)}
                                        className="p-2 rounded-lg bg-white dark:bg-slate-200 text-slate-500 hover:text-blue-800 
                                        shadow-sm border border-border cursor-pointer active:scale-90"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                </div>
                            )}
                            {/* Message Bubble Container */}
                            <div className="flex flex-col items-end max-w-[85%]">
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
                                        <div className="bg-blue-500 text-left text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-none shadow-md break-words">
                                            <p className="text-sm leading-relaxed">{chat.userMessage}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-2">{chat.timestamp}</span>
                                    </>
                                )}
                            </div>
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary border border-border flex-shrink-0 mt-1 uppercase text-xs font-bold shadow-inner">
                                U
                            </div>
                        </div>

                        {/* AI Response Row */}
                        <div className="flex items-start justify-start gap-3">
                            {/* AI Avatar */}
                            <div className="relative flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                    <MessageCircle size={16} />
                                </div>
                                {/* Online Indicator Badge */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            
                            <div className="flex flex-col items-start max-w-[80%]">
                                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200">
                                    <p className="text-sm leading-relaxed whitespace-pre-line text-left">{chat.aiResponse}</p>
                                    {chat.recommendations && (
                                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                            <span className="text-[10px] font-bold text-blue-700 uppercase">Suggested Actions:</span>
                                            <ul className="mt-1 space-y-1 text-left">
                                                {chat.recommendations.map((rec, index) => (
                                                    <li key={index} className="text-[11px] text-blue-800 flex items-center">
                                                        <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {chat.warning && (
                                        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 flex items-start">
                                            <AlertCircle size={14} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-medium text-red-700 text-left">{chat.warning}</p>
                                        </div>
                                    )}
                                    <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                                        <button 
                                            onClick={() => onReplay(chat.aiResponse)}
                                            className="flex items-center text-[10px] font-bold text-blue-600 
                                            hover:text-blue-700 transition uppercase tracking-tighter cursor-pointer"
                                        >
                                            <Volume2 size={12} className="mr-1" /> Replay
                                        </button>
                                        <button 
                                            onClick={() => handleCopy(chat.aiResponse, chat.id)}
                                            className="flex items-center text-[10px] font-bold text-gray-400 
                                            hover:text-gray-600 transition uppercase tracking-tighter cursor-pointer"
                                        >
                                            {copiedId === chat.id ? <Check size={12} className="text-green-500 mr-1"/> : <Copy size={12} className="mr-1"/>}
                                            {copiedId === chat.id ? 'Copied' : 'Copy'}
                                        </button>
                                        <button 
                                            onClick={() => onDelete(chat.id)}
                                            className="flex items-center text-[10px] font-bold text-red-300 
                                            hover:text-red-500 transition uppercase tracking-tighter cursor-pointer"
                                        >
                                            <Trash2 size={12} className="mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                                {chat.articles && chat.articles.length > 0 && (
                                    <div className="mt-2 w-full space-y-2 animate-fade-in text-left">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-2">Related Articles</span>
                                        <div className="grid grid-cols-1 gap-2 mt-2">
                                            {chat.articles.map((article, index) => (
                                                <a 
                                                    key={index}
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <Download size={14} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xs font-semibold text-gray-700 leading-tight">{article.title}</h4>
                                                        <p className="text-[10px] text-gray-500">{article.source} • {article.readTime}</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <span className="text-[10px] text-gray-400 mt-2">{chat.timestamp}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator with Avatar */}
                {isProcessing && (
                    <div className="flex items-start justify-start gap-3 animate-fade-in mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 mt-1">
                            <MessageCircle size={16} />
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
        </div>
    );
};

export default ConversationHistory;