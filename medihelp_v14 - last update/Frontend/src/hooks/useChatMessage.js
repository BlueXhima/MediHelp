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
    let success = false;
    
    setMessages((prev) => {
      const messageIndex = prev.findIndex((msg) => msg.id === id);
      if (messageIndex === -1) return prev;
      
      // CRITICAL FIX: Only keep messages UP TO the edited message (not including)
      // This removes the old assistant response that comes after the user message
      const updatedMessages = prev.slice(0, messageIndex);
      
      // Add the updated user message
      updatedMessages.push({
        ...prev[messageIndex],
        content: newContent,
        timestamp: newTimestamp || Date.now(),
        edited: true,
      });
      
      success = true;
      return updatedMessages;
    });
    
    return success;
  }, []);

  return { 
    messages, 
    setMessages,
    addMessage, 
    clearMessages, 
    editMessage 
  };
}