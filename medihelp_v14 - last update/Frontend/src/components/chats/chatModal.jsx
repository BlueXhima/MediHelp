// chatModal.jsx

import { useRef, useEffect, useMemo, useCallback } from 'react';

import { 
  Mic, 
  X, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Pencil, 
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Bot,
  User,
  TriangleAlert,
  CircleAlert,
  AlertCircle,
  Info,
  Stethoscope,
  Activity,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ==================================================
// Helper functions (outside component - no hook rules)
// ==================================================
const cleanTextForCopy = (content) => {
  if (!content) return '';
  
  let cleaned = content;
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/\*/g, '');
  cleaned = cleaned.replace(/__/g, '');
  cleaned = cleaned.replace(/_/g, '');
  cleaned = cleaned.replace(/\[(.*?)\]\([^)]*\)/g, '$1');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
};

export default function ChatModal({ 
  open, 
  onClose, 
  messages, 
  onClearMessages,
  isGlobalTTSEnabled,
  toggleGlobalTTS,
  toggleMessageTTS,
  speakingMessageId,
  stopSpeaking,
  copiedID,
  handleCopyWithFeedback,
  editingMessageId,
  editInput,
  setEditInput,
  startEditing,
  cancelEditing,
  submitEdit,
  isLimitReached,
  remainingMessages,
  userMessageCount,
  MAX_MESSAGES,
  WARNING_THRESHOLD,
  isMicListening,
  toggleMic,
  handleClear,
  feedbackProps,
  input,
  setInput,
  handleSend,
  isSending,
}) {

  // ==================================================
  // ALL HOOKS AT TOP LEVEL - before any conditionals
  // ==================================================
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevMessageCount = useRef(messages.length);
  const micButtonRef = useRef(null);

  // FIX: Moved useCallback to top level, outside of any conditionals
  const parseStructuredResponse = useCallback((content) => {
    const sections = {
      explanation: '',
      possibleCauses: [],
      symptoms: [],
      suggestedAction: '',
      reminder: '',
      source: '',
      disclaimer: '',
      relatedArticles: [],
      urgencyLevel: 'normal'
    };

    const lines = content.split('\n');
    let currentSection = null;
    let currentText = '';

    const saveCurrentSection = () => {
      if (currentSection && currentText.trim()) {
        const cleanText = currentText.trim().replace(/\*\*/g, '');
        if (currentSection === 'possibleCauses' || currentSection === 'symptoms') {
          const items = cleanText.split('\n').map(s => s.trim()).filter(s => s && !s.match(/^(Possible Causes|Symptoms)/i));
          sections[currentSection] = items.map(item => item.replace(/^[•*-]\s*/, '').trim()).filter(Boolean);
        } else {
          sections[currentSection] = cleanText;
        }
      }
      currentText = '';
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) continue;

      const isExplanation = trimmed === '**Explanation**' || trimmed === 'Explanation';
      const isPossibleCauses = trimmed === '**Possible Causes**' || trimmed === 'Possible Causes';
      const isSymptoms = trimmed === '**Symptoms**' || trimmed === '**Symptoms You May Experience**' || 
                         trimmed === 'Symptoms' || trimmed === 'Symptoms You May Experience';
      const isSuggestedAction = trimmed === '**Suggested Action**' || trimmed === 'Suggested Action';
      const isReminder = trimmed === '**Reminder**' || trimmed === 'Reminder';
      const isSource = trimmed.startsWith('**Source:**') || trimmed.startsWith('Source:');
      const isDisclaimer = trimmed.startsWith('**Disclaimer:**') || trimmed.startsWith('Disclaimer:');
      const isRelatedArticles = trimmed === '**Related Articles**' || trimmed === 'Related Articles';

      if (isExplanation || isPossibleCauses || isSymptoms || isSuggestedAction || 
          isReminder || isSource || isDisclaimer || isRelatedArticles) {
        
        saveCurrentSection();

        if (isExplanation) currentSection = 'explanation';
        else if (isPossibleCauses) currentSection = 'possibleCauses';
        else if (isSymptoms) currentSection = 'symptoms';
        else if (isSuggestedAction) currentSection = 'suggestedAction';
        else if (isReminder) currentSection = 'reminder';
        else if (isSource) {
          currentSection = 'source';
          const sourceValue = trimmed.replace(/^\*\*Source:\*\*/, '').replace(/^Source:/, '').trim();
          if (sourceValue) {
            sections.source = sourceValue;
            currentSection = null;
          }
        }
        else if (isDisclaimer) {
          currentSection = 'disclaimer';
          const disclaimerValue = trimmed.replace(/^\*\*Disclaimer:\*\*/, '').replace(/^Disclaimer:/, '').trim();
          sections.disclaimer = disclaimerValue || 'Educational information only. Consult a doctor for personal advice.';
          currentSection = null;
        }
        else if (isRelatedArticles) currentSection = 'relatedArticles';
        
        continue;
      }

      if (currentSection) {
        currentText += (currentText ? '\n' : '') + line;
      }
    }

    saveCurrentSection();

    if (sections.relatedArticles && typeof sections.relatedArticles === 'string') {
      const articleLines = sections.relatedArticles.split('\n').filter(line => line.trim());
      sections.relatedArticles = articleLines.map(line => {
        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return { title: linkMatch[1], url: linkMatch[2] };
        }
        return { title: line.replace(/^[•*-]\s*/, '').trim(), url: null };
      }).filter(a => a.title);
    }

    const criticalKeywords = ['emergency', '911', 'immediately', 'critical', 'life-threatening', 'severe', 'call emergency'];
    const importantKeywords = ['within 24 hours', 'as soon as possible', 'urgent', 'important', 'schedule', 'consultation'];
    
    const fullText = content.toLowerCase();
    if (criticalKeywords.some(k => fullText.includes(k))) {
      sections.urgencyLevel = 'critical';
    } else if (importantKeywords.some(k => fullText.includes(k))) {
      sections.urgencyLevel = 'important';
    }

    return sections;
  }, []); // Empty deps - this function doesn't depend on props/state

  // FIX: Moved reconstructTextFromSections to top level as useCallback
  const reconstructTextFromSections = useCallback((sections) => {
    let text = '';
    
    if (sections.explanation) {
      text += `Explanation\n${sections.explanation}\n\n`;
    }
    if (sections.possibleCauses?.length > 0) {
      text += `Possible Causes\n${sections.possibleCauses.map(c => `• ${c}`).join('\n')}\n\n`;
    }
    if (sections.symptoms?.length > 0) {
      text += `Symptoms You May Experience\n${sections.symptoms.map(s => `• ${s}`).join('\n')}\n\n`;
    }
    if (sections.suggestedAction) {
      text += `Suggested Action\n${sections.suggestedAction}\n\n`;
    }
    if (sections.reminder) {
      text += `Reminder\n${sections.reminder}\n\n`;
    }
    if (sections.source) {
      text += `Source: ${sections.source}\n\n`;
    }
    if (sections.disclaimer) {
      text += `Disclaimer: ${sections.disclaimer}\n`;
    }
    
    return text.trim();
  }, []); // Empty deps - pure function

  // FIX: Moved handleCopy to top level as useCallback
  const handleCopy = useCallback((msg) => {
    let textToCopy;
    
    if (msg.role === 'assistant') {
      const sections = parseStructuredResponse(msg.content);
      
      if (sections.explanation || sections.suggestedAction) {
        textToCopy = reconstructTextFromSections(sections);
      } else {
        textToCopy = cleanTextForCopy(msg.content);
      }
    } else {
      textToCopy = cleanTextForCopy(msg.content);
    }
    
    navigator.clipboard.writeText(textToCopy);
    
    if (handleCopyWithFeedback) {
      handleCopyWithFeedback(msg.content, msg.id);
    }
  }, [handleCopyWithFeedback, parseStructuredResponse, reconstructTextFromSections]);

  // All useEffect hooks at top level
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    prevMessageCount.current = messages.length;
  }, [messages, editingMessageId]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (!isMicListening) return;

    const handleClickOutside = (event) => {
      if (micButtonRef.current && !micButtonRef.current.contains(event.target)) {
        toggleMic();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMicListening, toggleMic]);

  // FIX: Early return AFTER all hooks
  if (!open) return null;

  // Event handlers (not hooks, can be after return)
  const handleClose = () => {
    stopSpeaking?.();
    cancelEditing?.();
    onClose();
  };

  const handleTTSToggle = (msgId, content) => {
    if (editingMessageId) return;
    if (speakingMessageId === msgId) {
      stopSpeaking();
    } else {
      toggleMessageTTS(msgId, content);
    }
  };

  const handleMicClick = () => {
    stopSpeaking();
    toggleMic();
  };

  // Component for structured response (defined after hooks)
  const StructuredMedicalResponse = ({ content }) => {
    const sections = useMemo(() => parseStructuredResponse(content), [content, parseStructuredResponse]);
    
    if (!sections.explanation && !sections.suggestedAction) {
      return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
    }

    return (
      <div className="space-y-3 text-start">
        {sections.explanation && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <Info size={14} />
              Explanation
            </div>
            <p className="text-sm leading-relaxed">{sections.explanation}</p>
          </div>
        )}

        {sections.possibleCauses.length > 0 && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <Stethoscope size={14} />
              Possible Causes
            </div>
            <ul className="text-sm space-y-1">
              {sections.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sections.symptoms.length > 0 && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <Activity size={14} />
              Symptoms You May Experience
            </div>
            <ul className="text-sm space-y-1">
              {sections.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sections.suggestedAction && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <Check size={14} />
              Suggested Action
            </div>
            <p className="text-sm leading-relaxed">{sections.suggestedAction}</p>
          </div>
        )}

        {sections.reminder && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <AlertCircle size={14} />
              Reminder
            </div>
            <p className="text-sm leading-relaxed">{sections.reminder}</p>
          </div>
        )}

        {sections.source && (
          <div className="border rounded-lg p-2">
            <div className="flex items-center gap-2 text-xs">
              <BookOpen size={12} />
              <span>Source: {sections.source}</span>
            </div>
          </div>
        )}

        {sections.disclaimer && (
          <div className="border rounded-lg p-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <ShieldAlert size={12} />
              <span>{sections.disclaimer}</span>
            </div>
          </div>
        )}

        {sections.relatedArticles.length > 0 && (
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
              <ExternalLink size={14} />
              Related Articles
            </div>
            <ul className="space-y-1">
              {sections.relatedArticles.map((article, idx) => (
                <li key={idx}>
                  {article.url ? (
                    <a 
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline flex items-center gap-1 text-primary hover:text-primary/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">{article.title}</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{article.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/30 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2">
              <Bot size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Medical Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isMicListening ? (
                  <span className="flex items-center gap-2 text-red-500 animate-pulse">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    Listening...
                  </span>
                ) : (
                  <span className="flex items-center">Ask about symptoms</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleGlobalTTS}
              disabled={editingMessageId}
              className={cn(
                "p-2 rounded-lg transition-all",
                isGlobalTTSEnabled 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "hover:bg-muted text-muted-foreground",
                editingMessageId && "opacity-50 cursor-not-allowed"
              )}
              title={isGlobalTTSEnabled ? "Disable voice responses" : "Enable voice responses"}
            >
              {isGlobalTTSEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Warnings */}
        {userMessageCount >= WARNING_THRESHOLD && !isLimitReached && (
          <div className="bg-yellow-500/10 border-y border-yellow-500/20 px-4 py-2.5 text-xs text-yellow-700 dark:text-yellow-400 flex justify-center items-center gap-2">
            <span className="font-bold"><TriangleAlert size={14} className="text-yellow-600" /></span>
            <span>{remainingMessages} messages remaining in this session</span>
          </div>
        )}
        
        {isLimitReached && (
          <div className="bg-red-500/10 border-y border-red-500/20 px-4 py-2.5 text-xs text-red-700 dark:text-red-400 flex justify-center items-center gap-2">
            <span className="font-bold"><CircleAlert size={14} className="text-red-600" /></span>
            <span>
              Message limit reached.{' '}
              <a href="/register" className="underline font-semibold hover:text-red-800 dark:hover:text-red-300">
                Register
              </a>{' '}
              for full access.
            </span>
          </div>
        )}

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12 space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Bot size={32} className="text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-medium">How can I help you today?</p>
                <p className="text-xs mt-1">Try: "I have a headache" or "What should I do for chest pain?"</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Profile Icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted border text-muted-foreground"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div className={cn(
                'flex flex-col gap-1 max-w-[85%] min-w-0',
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm relative shadow-sm w-full',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md border w-full max-w-[600px]'
                  )}
                >
                  {msg.role === 'user' && editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-2 min-w-[250px]">
                      <textarea
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 resize-none"
                        rows={3}
                        autoFocus
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitEdit();
                          }
                          if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={cancelEditing}
                          className="text-xs px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={submitEdit}
                          disabled={isSending}
                          className="text-xs px-3 py-1.5 rounded-md bg-white text-primary font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                          {isSending ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.role === 'assistant' && msg.isTyping ? (
                        <TypingDots />
                      ) : msg.role === 'assistant' ? (
                        <StructuredMedicalResponse content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed text-start break-all">{msg.content}</div>
                      )}
                    </>
                  )}
                </div>
                
                {/* User Actions */}
                {msg.role === 'user' && !msg.isTyping && editingMessageId !== msg.id && (
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => handleCopy(msg)}
                      className="p-1.5 rounded-md text-xs bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedID === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    
                    <button
                      onClick={() => startEditing(msg.id, msg.content)}
                      disabled={isLimitReached || isSending}
                      className="p-1.5 rounded-md text-xs bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer disabled:opacity-50"
                      title="Edit message"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                )}
                
                {/* Assistant Actions */}
                {msg.role === 'assistant' && !msg.isTyping && (
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => handleTTSToggle(msg.id, msg.content)}
                      disabled={editingMessageId}
                      className={cn(
                        "p-1.5 rounded-md text-xs transition-all border cursor-pointer",
                        speakingMessageId === msg.id 
                          ? "bg-primary text-white border-primary animate-pulse" 
                          : "bg-muted border-border hover:bg-muted/80",
                        editingMessageId && "opacity-50 cursor-not-allowed"
                      )}
                      title={speakingMessageId === msg.id ? "Stop speaking" : "Read aloud"}
                    >
                      {speakingMessageId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    </button>
                    
                    <button
                      onClick={() => handleCopy(msg)}
                      className="p-1.5 rounded-md text-xs bg-muted border border-border hover:bg-muted/80 transition-all cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedID === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    
                    <div className="flex items-center gap-1 ml-1 pl-2 border-l border-border">
                      <button
                        title="Good response"
                        onClick={() => feedbackProps?.handleThumbsUp?.(msg.id)}
                        disabled={editingMessageId}
                        className={cn(
                          "p-1.5 border rounded-md text-xs transition-all cursor-pointer",
                          feedbackProps?.getFeedbackForMessage?.(msg.id)?.type === 'positive'
                            ? "text-green-600 border-green-600"
                            : "bg-muted border-border hover:bg-muted/80",
                          editingMessageId && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        title="Bad response"
                        onClick={() => feedbackProps?.handleThumbsDown?.(msg.id)}
                        disabled={editingMessageId}
                        className={cn(
                          "p-1.5 border rounded-md text-xs transition-all cursor-pointer",
                          feedbackProps?.getFeedbackForMessage?.(msg.id)?.type === 'negative'
                            ? "text-red-600 border-red-600"
                            : "bg-muted border-border hover:bg-muted/80",
                          editingMessageId && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Timestamp */}
                <span className="text-[10px] text-muted-foreground px-1 opacity-60">
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.edited && <span className="ml-1 italic">(edited)</span>}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-muted/30 rounded-b-2xl space-y-3">
          <div className="flex gap-2">
            <button
              ref={micButtonRef}
              onClick={handleMicClick}
              disabled={isLimitReached || isSending || editingMessageId}
              className={cn(
                "p-3 rounded-xl border-2 transition-all shrink-0",
                isMicListening 
                  ? "bg-red-500 text-white border-red-500 animate-pulse" 
                  : "bg-background border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              title={isMicListening ? "Stop listening" : "Voice input"}
            >
              <Mic size={20} className={isMicListening ? "animate-bounce" : ""} />
            </button>
            
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                onFocus={stopSpeaking}
                disabled={isSending || editingMessageId}
                className="w-full h-full rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50"
                placeholder={isLimitReached ? "Message limit reached..." : "Type your symptoms or question..."}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLimitReached || isSending || editingMessageId}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all font-semibold active:scale-95"
            >
              {isSending ? '...' : 'Send'}
            </button>
          </div>
          
          {/* Footer */}
          {(messages.length > 0 || isLimitReached) && (
            <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
              <button
                onClick={() => handleClear(onClearMessages)}
                disabled={isSending || editingMessageId}
                className="hover:text-destructive transition-colors flex items-center gap-1.5 font-medium cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={12} />
                Clear conversation
              </button>
              <span className="bg-muted px-2 py-1 rounded-full">
                {userMessageCount}/{MAX_MESSAGES}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center space-x-1 py-1 h-5">
      <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  );
}