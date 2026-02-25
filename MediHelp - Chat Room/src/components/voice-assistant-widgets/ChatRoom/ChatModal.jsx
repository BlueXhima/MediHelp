// PATH: components/voice-assistant-widgets/ChatRoom/ChatModal.jsx

import { Bot, Mic, User, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import useChatModal from './useChatModal';

import "./ChatModal.css"

export default function ChatModal({
  open,
  onClose,
  messages,
  onSend,
  onClear,
  openAuth,
}) {

  /* ===============================
     USE LOGIC HOOK
  =============================== */

  const {
    input,
    setInput,
    isMicListening,
    toggleMic,
    handleSend,
    isLimitReached,
    remainingMessages,
    userMessageCount,
    MAX_MESSAGES,
    WARNING_THRESHOLD
  } = useChatModal({ onSend, messages });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Mic size={18} />
            <h3 className="font-semibold">Voice Assistant</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-xs px-3 py-1 border rounded-md hover:bg-muted"
            >
              Clear
            </button>

            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start w-full gap-2',
                msg.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex-none p-1 border-2 rounded-full">
                  <Bot size={24} />
                </div>
              )}

              <div
                className={cn(
                  "px-4 py-2 rounded-lg text-sm max-w-xs",
                  msg.role === "user"
                    ? " text-end border"
                    : " text-start border"
                )}
              >
                {msg.role === "assistant" && msg.isTyping
                  ? <TypingDots />
                  : msg.content}
              </div>

              {msg.role === 'user' && (
                <div className='flex-none p-1 border-2 rounded-full'>
                  <User size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Limit Info */}

        {!isLimitReached && userMessageCount >= WARNING_THRESHOLD && (
          <div className="p-4 text-xs text-yellow-400 border-t">
            You have {remainingMessages} free messages remaining.
          </div>
        )}

        {isLimitReached && (
          <div className="space-y-2 p-4 items-center text-sm text-center border-t">
            <p>
              You’ve reached the free demo limit.
            </p>
            <button
            onClick={openAuth} 
            className="px-4 py-2 bg-primary text-white rounded-md">
              Sign In to Continue
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t flex gap-2 items-center">

          <button
            onClick={toggleMic}
            disabled={isLimitReached}
            className="p-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            title={isMicListening ? 'Stop Listening' : 'Speak'}
          >
            <Mic
              size={18}
              className={isMicListening ? 'text-primary' : 'text-white'}
            />
          </button>

          <input
            value={input}
            disabled={isLimitReached}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Type your message…"
          />

          <button
            onClick={handleSend}
            disabled={isLimitReached}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}