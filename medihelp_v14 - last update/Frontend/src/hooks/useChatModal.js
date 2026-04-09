// hooks/useChatModal.js

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchResponse } from '../data/intentData';

const GUEST_COUNT_KEY = 'medical_assistant_guest_count';

const getStoredCount = () => {
  if (typeof window === 'undefined') return 0;
  const stored = sessionStorage.getItem(GUEST_COUNT_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const incrementStoredCount = () => {
  const current = getStoredCount();
  sessionStorage.setItem(GUEST_COUNT_KEY, (current + 1).toString());
};

const isLimitReached = () => getStoredCount() >= 10;

// Sections to exclude from TTS (metadata, not medical content)
const EXCLUDED_TTS_SECTIONS = ['source', 'disclaimer', 'confidence', 'related articles', 'reminder'];

// ==================================================
// OPTIMIZED: Faster delays for better UX
// ==================================================
const SECTION_DELAY_MS = 150; // Reduced from 300ms - snappier feel
const INITIAL_DELAY_MS = 100; // Reduced from 300ms - faster start

const parseSectionsForTTS = (text) => {
  if (!text) return [];
  const sections = [];
  const lines = text.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  const sectionHeaders = {
    'explanation': 'Explanation',
    'possible causes': 'Possible Causes',
    'symptoms': 'Symptoms You May Experience',
    'symptoms you may experience': 'Symptoms You May Experience',
    'suggested action': 'Suggested Action',
    'reminder': null,
    'source': null,
    'disclaimer': null,
    'confidence': null,
    'related articles': null,
    'this information is for educational purposes only': null,
  };
  
  const isSectionHeader = (line) => {
    const clean = line.replace(/\*\*/g, '').replace(/[:\s]*$/, '').toLowerCase().trim();
    return Object.prototype.hasOwnProperty.call(sectionHeaders, clean);
  };
  
  const getSectionTitle = (line) => {
    const clean = line.replace(/\*\*/g, '').replace(/[:\s]*$/, '').toLowerCase().trim();
    return sectionHeaders[clean];
  };
  
  const saveCurrentSection = () => {
    if (currentSection && currentContent.length > 0) {
      const content = currentContent.join('\n').trim();
      if (content) {
        sections.push({ title: currentSection, content: content });
      }
    }
    currentContent = [];
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (isSectionHeader(line)) {
      saveCurrentSection();
      const title = getSectionTitle(line);
      if (title === null) {
        currentSection = null;
        continue;
      }
      currentSection = title;
    } else if (currentSection) {
      let cleanLine = line
        .replace(/\*\*/g, '')
        .replace(/^\s*[•*-]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
        .replace(/https?:\/\/\S+/gi, '');
      
      if (cleanLine.trim()) {
        currentContent.push(cleanLine);
      }
    }
  }
  
  saveCurrentSection();
  return sections;
};

const cleanTextForTTS = (text) => {
  if (!text) return '';
  let cleaned = text;
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/\*/g, '');
  cleaned = cleaned.replace(/__/g, '');
  cleaned = cleaned.replace(/_/g, '');
  cleaned = cleaned.replace(/\[(.*?)\]\([^)]*\)/g, '$1');
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, '');
  cleaned = cleaned.replace(/^[•*-]\s*/gm, '');
  cleaned = cleaned.replace(/^\d+\.\s*/gm, '');
  cleaned = cleaned.replace(/^(Explanation|Possible Causes|Symptoms|Symptoms You May Experience|Suggested Action|Reminder|Source|Confidence|Related Articles|Disclaimer)[:\s]*$/gim, '');
  cleaned = cleaned.replace(/\[[^\]]*\]/g, '');
  cleaned = cleaned.replace(/this information is for educational purposes only/gi, '');
  cleaned = cleaned.replace(/not a substitute for professional medical advice/gi, '');
  cleaned = cleaned.replace(/consult a healthcare professional/gi, '');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();
  return cleaned;
};

const filterSectionsForTTS = (sections) => {
  return sections.filter(section => {
    const titleLower = section.title.toLowerCase();
    return !EXCLUDED_TTS_SECTIONS.some(excluded => titleLower.includes(excluded));
  });
};

export default function useChatModal({ onSend, messages, onEditMessage, addMessage }) {
  const [input, setInput] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);
  const [isGlobalTTSEnabled, setIsGlobalTTSEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("speech_enabled") !== "false";
    }
    return true;
  });
  const [copiedID, setCopiedID] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const MAX_MESSAGES = 10;
  const WARNING_THRESHOLD = 7;
  
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const speakingMessageIdRef = useRef(null);
  const autoSpokenRef = useRef(new Set());
  const isListeningRef = useRef(false);
  const voiceInitializedRef = useRef(false);
  const sectionsQueueRef = useRef([]);
  const currentSectionIndexRef = useRef(0);
  const sectionDelayRef = useRef(null);

  const [messageCount, setMessageCount] = useState(getStoredCount());
  
  const limitReached = messageCount >= MAX_MESSAGES;
  const remainingMessages = MAX_MESSAGES - messageCount;
  const userMessageCount = messageCount;

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getStoredCount();
      if (current !== messageCount) {
        setMessageCount(current);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [messageCount]);

  useEffect(() => {
    speakingMessageIdRef.current = speakingMessageId;
  }, [speakingMessageId]);

  useEffect(() => {
    isListeningRef.current = isMicListening;
  }, [isMicListening]);

  useEffect(() => {
    if (voiceInitializedRef.current) return;
    const selectFemaleVoice = () => {
      if (!synthRef.current) return;
      const voices = synthRef.current.getVoices();
      if (voices.length === 0) return;
      const priorityChecks = [
        v => v.name === 'Microsoft Zira Desktop',
        v => v.name === 'Microsoft Zira',
        v => v.name === 'Samantha',
        v => v.name === 'Victoria',
        v => v.name === 'Moira',
        v => v.name === 'Tessa',
        v => v.name === 'Karen',
        v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'),
        v => v.name.toLowerCase().includes('zira'),
      ];
      let selectedVoice = null;
      for (const check of priorityChecks) {
        selectedVoice = voices.find(check);
        if (selectedVoice) break;
      }
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith('en'));
      if (selectedVoice) {
        setFemaleVoice(selectedVoice);
        voiceInitializedRef.current = true;
      }
    };
    selectFemaleVoice();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = selectFemaleVoice;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("speech_enabled", isGlobalTTSEnabled.toString());
    }
  }, [isGlobalTTSEnabled]);

  useEffect(() => {
    return () => {
      if (sectionDelayRef.current) {
        clearTimeout(sectionDelayRef.current);
      }
    };
  }, []);

  const initRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return null;
    }
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.continuous = false;
    recog.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim();
      transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      if (transcript && isListeningRef.current && !isLimitReached()) {
        onSend(transcript);
        incrementStoredCount();
        setMessageCount(getStoredCount());
      }
      setIsMicListening(false);
    };
    recog.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
      setIsMicListening(false);
    };
    recog.onend = () => {
      setIsMicListening(false);
    };
    recognitionRef.current = recog;
    return recog;
  }, [onSend]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    if (sectionDelayRef.current) {
      clearTimeout(sectionDelayRef.current);
      sectionDelayRef.current = null;
    }
    currentUtteranceRef.current = null;
    sectionsQueueRef.current = [];
    currentSectionIndexRef.current = 0;
    setSpeakingMessageId(null);
  }, []);

  // ==================================================
  // OPTIMIZED: Faster sequential speaking with shorter delays
  // ==================================================
  const speakSectionsSequentially = useCallback((sections, messageId) => {
    if (!synthRef.current || sections.length === 0) return;
    sectionsQueueRef.current = sections;
    currentSectionIndexRef.current = 0;
    
    const speakNext = () => {
      const index = currentSectionIndexRef.current;
      if (index >= sectionsQueueRef.current.length) {
        setSpeakingMessageId(null);
        sectionsQueueRef.current = [];
        currentSectionIndexRef.current = 0;
        return;
      }
      
      const section = sectionsQueueRef.current[index];
      // Add natural pause indicator between sections
      const textToSpeak = index === 0 
        ? `${section.title}. ${section.content}`
        : `${section.title}. ${section.content}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.onend = () => {
        currentSectionIndexRef.current += 1;
        // Use shorter delay for faster UX
        sectionDelayRef.current = setTimeout(() => {
          speakNext();
        }, SECTION_DELAY_MS);
      };
      
      utterance.onerror = () => {
        currentSectionIndexRef.current += 1;
        sectionDelayRef.current = setTimeout(() => {
          speakNext();
        }, SECTION_DELAY_MS);
      };
      
      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    };
    
    if (messageId) setSpeakingMessageId(messageId);
    // Faster initial start
    sectionDelayRef.current = setTimeout(() => {
      speakNext();
    }, INITIAL_DELAY_MS);
  }, [femaleVoice]);

  const speakMessage = useCallback((text, messageId = null) => {
    if (!synthRef.current) return;
    if (synthRef.current.speaking) synthRef.current.cancel();
    
    const sections = parseSectionsForTTS(text);
    const filteredSections = filterSectionsForTTS(sections);
    
    if (filteredSections.length > 0) {
      speakSectionsSequentially(filteredSections, messageId);
      return;
    }
    
    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.onend = () => {
      currentUtteranceRef.current = null;
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      currentUtteranceRef.current = null;
      setSpeakingMessageId(null);
    };
    currentUtteranceRef.current = utterance;
    if (messageId) setSpeakingMessageId(messageId);
    synthRef.current.speak(utterance);
  }, [femaleVoice, speakSectionsSequentially]);

  useEffect(() => {
    if (!isGlobalTTSEnabled || messages.length === 0 || editingMessageId) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant' || 
        lastMessage.isTyping || 
        autoSpokenRef.current.has(lastMessage.id)) {
      return;
    }
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
      currentUtteranceRef.current = null;
      speakingMessageIdRef.current = null;
    }
    autoSpokenRef.current.add(lastMessage.id);
    const timeoutId = setTimeout(() => {
      speakMessage(lastMessage.content, lastMessage.id);
    }, 50); // Reduced from 100ms for faster response
    return () => clearTimeout(timeoutId);
  }, [messages, isGlobalTTSEnabled, speakMessage, editingMessageId]);

  const handleSend = useCallback(async (text) => {
    if (isSending) return;
    
    const messageText = typeof text === 'string' ? text : input;
    
    if (!messageText || !messageText.trim() || isLimitReached()) return;
    
    setIsSending(true);
    const formattedInput = messageText.charAt(0).toUpperCase() + messageText.slice(1);
    
    addMessage('user', formattedInput);
    incrementStoredCount();
    setMessageCount(getStoredCount());
    setInput('');
    
    try {
      const reply = await fetchResponse(formattedInput);
      addMessage('assistant', reply.text, reply.link);
    } catch (error) {
      console.error('Failed to get response:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [input, addMessage, isSending]);

  const toggleMic = useCallback(() => {
    stopSpeaking();
    if (!isMicListening) {
      const recog = initRecognition();
      if (!recog) return;
      try {
        recog.start();
        setIsMicListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    } else {
      const recog = recognitionRef.current;
      if (recog) {
        try {
          recog.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      setIsMicListening(false);
    }
  }, [isMicListening, initRecognition, stopSpeaking]);

  const toggleMessageTTS = useCallback((messageId, text) => {
    if (editingMessageId) return;
    
    const currentSpeakingId = speakingMessageIdRef.current;
    if (currentSpeakingId === messageId) {
      stopSpeaking();
    } else {
      speakMessage(text, messageId);
    }
  }, [speakMessage, stopSpeaking, editingMessageId]);

  const toggleGlobalTTS = useCallback(() => {
    setIsGlobalTTSEnabled(prev => {
      const newValue = !prev;
      if (!newValue) stopSpeaking();
      return newValue;
    });
  }, [stopSpeaking]);

  const handleCopyWithFeedback = useCallback((content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedID(id);
    setTimeout(() => setCopiedID(null), 2000);
  }, []);

  const handleClear = useCallback((clearMessagesFn) => {
    autoSpokenRef.current.clear();
    stopSpeaking();
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      setIsMicListening(false);
    }
    if (typeof clearMessagesFn === 'function') {
      clearMessagesFn();
    }
    setMessageCount(getStoredCount());
  }, [stopSpeaking]);

  const resetGuestLimit = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(GUEST_COUNT_KEY);
    }
    setMessageCount(0);
  }, []);

  const startEditing = useCallback((messageId, currentContent) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      const nextMessage = messages[messageIndex + 1];
      if (nextMessage && nextMessage.role === 'assistant') {
        autoSpokenRef.current.add(nextMessage.id);
      }
    }
    
    stopSpeaking();
    setEditingMessageId(messageId);
    setEditInput(currentContent);
  }, [messages, stopSpeaking]);

  const cancelEditing = useCallback(() => {
    setEditingMessageId(null);
    setEditInput('');
  }, []);

  const submitEdit = useCallback(async () => {
      if (!editInput.trim() || !editingMessageId) return;
      
      if (isLimitReached()) return;
      
      const formattedInput = editInput.charAt(0).toUpperCase() + editInput.slice(1);
      
      const editedMessageIndex = messages.findIndex(m => m.id === editingMessageId);
      if (editedMessageIndex === -1) return;
      
      stopSpeaking();
      
      const nextMessage = messages[editedMessageIndex + 1];
      const hasExistingResponse = nextMessage && nextMessage.role === 'assistant';
      
      if (hasExistingResponse) {
        autoSpokenRef.current.add(nextMessage.id);
      }
      
      onEditMessage(editingMessageId, formattedInput, Date.now());
      
      incrementStoredCount();
      setMessageCount(getStoredCount());
      setEditingMessageId(null);
      setEditInput('');
      
      try {
        const reply = await fetchResponse(formattedInput);
        addMessage('assistant', reply.text, reply.link);
      } catch (error) {
        console.error('Failed to get response:', error);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      }
  }, [editInput, editingMessageId, onEditMessage, addMessage, messages, stopSpeaking]);

  return {
    input,
    setInput,
    isMicListening,
    toggleMic,
    handleSend,
    isLimitReached: limitReached,
    remainingMessages,
    userMessageCount,
    MAX_MESSAGES,
    WARNING_THRESHOLD,
    speakMessage,
    stopSpeaking,
    speakingMessageId,
    toggleMessageTTS,
    copiedID,
    handleCopyWithFeedback,
    isGlobalTTSEnabled,
    toggleGlobalTTS,
    handleClear,
    resetGuestLimit,
    editingMessageId,
    editInput,
    setEditInput,
    startEditing,
    cancelEditing,
    submitEdit,
    isSending,
  };
}