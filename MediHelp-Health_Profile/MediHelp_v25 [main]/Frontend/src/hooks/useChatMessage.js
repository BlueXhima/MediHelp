// src/hooks/useChatMessage.js

import { useState, useCallback } from "react";

export function useChatMessages() {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((role, content, link = null, isTyping = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
        link,
        timestamp: Date.now(),
        isTyping,
      },
    ]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const editMessage = useCallback((id, newContent, newTimestamp) => {
    setMessages((prev) => {
      const messageIndex = prev.findIndex((msg) => msg.id === id);
      if (messageIndex === -1) return prev;
      
      // Create new array up to and including edited message
      const updatedMessages = prev.slice(0, messageIndex + 1).map((msg, idx) => {
        if (idx === messageIndex) {
          return {
            ...msg,
            content: newContent,
            timestamp: newTimestamp || Date.now(),
            edited: true,
          };
        }
        return msg;
      });
      
      return updatedMessages;
    });
    
    return true;
  }, []);

  return { 
    messages, 
    setMessages,
    addMessage, 
    clearMessages, 
    editMessage 
  };
}