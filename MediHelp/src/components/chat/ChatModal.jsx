// PATH: components/chat/ChatModal.jsx

import { useState } from 'react';
import { Mic, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ChatModal({ open, onClose, messages, onSend }) {
  const [input, setInput] = useState('');

  if (!open) return null;

  function handleSend() {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Mic size={18} />
            <h3 className="font-semibold">Voice Assistant</h3>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[80%] px-4 py-2 rounded-lg text-sm',
                msg.role === 'user'
                  ? 'text-end ml-auto border text-white'
                  : 'text-start bg-muted'
              )}
            >
              {msg.role === 'assistant' && msg.isTyping ? <TypingDots /> : msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Type your message…"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

// Typing animation component
function TypingDots() {
  return (
    <span className="inline-flex space-x-1">
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-150"></span>
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-300"></span>
    </span>
  );
}
