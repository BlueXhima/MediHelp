// Frontend/src/pages/chat-compo/ChatMessageArea.jsx

import { 
    User2, Activity, Tag, CheckCircle2, BookOpen, ExternalLink, 
    ThumbsUp, ThumbsDown, Copy, Volume2, Square, Trash2, Pencil, X, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvatarBot from '../../assets/mediAvatar.png';

const ChatMessageArea = ({ 
    messages, chatEndRef, editingId, tempText, setTempText, userProfile,
    handleCopy, startEditing, cancelEditing, saveEdit, speakingMessageId, 
    handleReplay, promptDelete, handleReaction, isTyping 
}) => {
    const navigate = useNavigate();

    const formatAiResponse = (text) => {
        if (!text) return null;

        const lines = text.split('\n');

        return lines.map((line, index) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                return (
                    <div key={index} className="flex items-start gap-2.5 ml-1 my-1.5">
                        <span className="mt-2 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                        </span>
                        <span className="text-sm text-foreground/85 leading-relaxed">
                            {trimmed.substring(1).trim()}
                        </span>
                    </div>
                );
            }

            if (trimmed === '') {
                return <div key={index} className="h-2" />;
            }

            return (
                <p key={index} className="text-sm text-foreground/90 leading-relaxed my-1">
                    {trimmed}
                </p>
            );
        });
    };

    const handleArticleClick = (article, e) => {
        if (!article.id) {
            e.preventDefault();
            navigate('/library');
            return;
        }
        if (article.url && article.url !== '#') {
            e.preventDefault();
            navigate(article.url);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-custom bg-background">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-full md:max-w-[85%] flex gap-3 md:gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 overflow-hidden border border-border shadow-sm">
                            {msg.type === 'user' ? (
                                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                                    {userProfile?.profile_picture ? (
                                        <img 
                                            src={userProfile.profile_picture} 
                                            alt="User" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <User2 size={16} />
                                    )}
                                </div>
                            ) : (
                                <img src={AvatarBot} alt="Medi" className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="flex-1 group relative">
                            {msg.type === 'user' && (
                                <div className="flex flex-col items-end gap-2 w-full">
                                    {editingId === msg.id ? (
                                        <div className="w-full min-w-70 md:min-w-100 flex flex-col gap-2 bg-card p-3 rounded-2xl border border-primary/40 shadow-xl">
                                            <textarea 
                                                value={tempText}
                                                onChange={(e) => setTempText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        saveEdit(msg);
                                                    }
                                                    if (e.key === 'Escape') {
                                                        cancelEditing();
                                                    }
                                                }}
                                                className="w-full p-2 bg-transparent text-sm focus:outline-none resize-none min-h-15"
                                                autoFocus
                                                placeholder="Edit your message..."
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={cancelEditing} 
                                                    className="px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-all flex items-center gap-1"
                                                >
                                                    <X size={12} /> Cancel
                                                </button>
                                                <button 
                                                    onClick={() => saveEdit(msg)} 
                                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1"
                                                >
                                                    <Check size={12} /> Save & Resend
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group/bubble flex items-center gap-2">
                                            <div className="opacity-0 group-hover/bubble:opacity-100 flex gap-1 transition-all duration-200 mr-1">
                                                <button 
                                                    onClick={() => handleCopy(msg.text)} 
                                                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary transition-all"
                                                    title="Copy message"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => startEditing(msg)} 
                                                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary transition-all"
                                                    title="Edit message"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                            </div>
                                            <div className="p-3.5 rounded-2xl rounded-tr-none border border-primary/20 bg-primary/5 text-sm font-medium text-foreground shadow-sm">
                                                {msg.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {msg.type === 'bot' && (
                                <div className="flex flex-col gap-4 w-full items-start max-w-[90%]">
                                    
                                    <div className="w-full p-5 rounded-2xl rounded-tl-none border border-border bg-background shadow-sm space-y-4">
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

                                        <div className="text-foreground/90">
                                            {msg.aiResponse ? formatAiResponse(msg.aiResponse) : (
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            )}
                                        </div>

                                        {msg.recommendations && msg.recommendations.length > 0 && (
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

                                    {msg.articles && msg.articles.length > 0 && (
                                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="space-y-4 mt-2">
                                                <h5 className="text-[14px] font-bold tracking-widest text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
                                                    <BookOpen size={14} className="text-blue-500" /> Suggested Library Articles
                                                </h5>
                                                <div className="flex flex-col gap-3">
                                                    {msg.articles.map((article, i) => (
                                                        <a 
                                                            href={article.url || '/library'} 
                                                            key={i}
                                                            onClick={(e) => handleArticleClick(article, e)}
                                                            className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group/item bg-muted/20 w-full cursor-pointer"
                                                        >
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm font-bold group-hover/item:text-primary transition-colors">{article.title}</span>
                                                                <span className="text-[10px] text-muted-foreground font-medium">{article.source} • {article.readTime}</span>
                                                            </div>
                                                            <div className="p-2 rounded-lg bg-background border border-border group-hover/item:text-primary group-hover/item:border-primary/30 transition-all">
                                                                <ExternalLink size={14} />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 ml-1">
                                        <button 
                                            onClick={() => handleReaction(msg.id, 'like')} 
                                            className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${msg.reaction === 'like' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border bg-background text-muted-foreground hover:text-emerald-500'}`}
                                            title="Helpful"
                                        >
                                            <ThumbsUp size={14} fill={msg.reaction === 'like' ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            onClick={() => handleReaction(msg.id, 'dislike')} 
                                            className={`p-2 rounded-lg border transition-all shadow-sm cursor-pointer ${msg.reaction === 'dislike' ? 'bg-red-500 text-white shadow-inner' : 'border-border bg-background text-muted-foreground hover:text-red-600'}`}
                                            title="Not helpful"
                                        >
                                            <ThumbsDown size={14} fill={msg.reaction === 'dislike' ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            onClick={() => handleCopy(msg.aiResponse || msg.text)} 
                                            className="p-2 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary transition-all shadow-sm cursor-pointer"
                                            title="Copy response"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleReplay(msg.aiResponse || msg.text, msg.id)} 
                                            className={`p-2 rounded-lg border border-border transition-all shadow-sm cursor-pointer ${speakingMessageId === msg.id ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-background text-muted-foreground hover:text-primary'}`}
                                            title={speakingMessageId === msg.id ? "Stop speaking" : "Read aloud"}
                                        >
                                            {speakingMessageId === msg.id ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                                        </button>
                                        
                                        <button 
                                            onClick={() => promptDelete(msg.id)} 
                                            className="p-2 rounded-lg border border-border bg-background text-muted-foreground hover:text-red-500 transition-all shadow-sm cursor-pointer"
                                            title="Delete message"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={`mt-1.5 text-[9px] font-bold text-muted-foreground uppercase opacity-40 ml-1 
                                ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp || "Just Now"}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex justify-start animate-fade-in">
                    <div className="flex gap-3 md:gap-4 items-start">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 overflow-hidden border border-border shadow-sm">
                            <img src={AvatarBot} alt="Medi" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col gap-1 text-left">
                            <div className="px-4 py-3 rounded-2xl rounded-tl-none border border-border bg-card shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-3.5 h-3.5">
                                        <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                    <span className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">
                                        Analyzing Health Query...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatMessageArea;