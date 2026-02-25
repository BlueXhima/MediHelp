import { useState } from "react";

export function useChatMessages() {
  const [messages, setMessages] = useState([]);

  function addMessage(role, content) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
      },
    ]);
  }

  function clearMessages() {
    setMessages([]);
  }

  return { messages, addMessage, clearMessages };
}
