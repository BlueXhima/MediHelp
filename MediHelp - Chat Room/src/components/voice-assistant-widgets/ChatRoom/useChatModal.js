// PATH: components/chat/useChatModal.js

import { useState, useRef } from 'react';

const MAX_MESSAGES = 10;
const WARNING_THRESHOLD = 5;
const STORAGE_KEY = 'guestMessageCount';

export default function useChatModal({ onSend, messages }) {
  const [input, setInput] = useState('');

  // Initialize storedCount directly from sessionStorage
  const [storedCount, setStoredCount] = useState(() => {
    return parseInt(sessionStorage.getItem(STORAGE_KEY)) || 0;
  });

  const [isMicListening, setIsMicListening] = useState(false);
  const recognitionRef = useRef(null);

  /* ===============================
     MESSAGE LIMIT LOGIC
  =============================== */
  const userMessageCount = storedCount;
  const remainingMessages = MAX_MESSAGES - userMessageCount;
  const isLimitReached = userMessageCount >= MAX_MESSAGES;

  /* ===============================
     SPEECH RECOGNITION
  =============================== */
  function initRecognition() {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && !isLimitReached) {
        sendMessage(finalTranscript);
      }
    };

    recog.onend = () => setIsMicListening(false);

    recognitionRef.current = recog;
    return recog;
  }

  function toggleMic() {
    if (isLimitReached) return;

    const recog = initRecognition();
    if (!recog) return;

    if (isMicListening) {
      recog.stop();
      setIsMicListening(false);
    } else {
      try {
        recog.start();
        setIsMicListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /* ===============================
     SEND MESSAGE HELPER
  =============================== */
  function sendMessage(text) {
    if (!text.trim() || isLimitReached) return;

    onSend(text);
    setInput('');

    // Increment sessionStorage count for guest
    const newCount = storedCount + 1;
    setStoredCount(newCount);
    sessionStorage.setItem(STORAGE_KEY, newCount.toString());
  }

  function handleSend() {
    sendMessage(input);
  }

  return {
    input,
    setInput,
    isMicListening,
    toggleMic,
    handleSend,
    isLimitReached,
    remainingMessages,
    userMessageCount,
    MAX_MESSAGES,
    WARNING_THRESHOLD,
  };
}