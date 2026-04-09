// src/hooks/useVoiceChat.js

import { useState, useRef, useCallback, useEffect } from 'react';

export default function useVoiceChat({ addMessage, parseIntent, intentToReply }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  
  const recognitionRef = useRef(null);
  const stoppedRef = useRef(false);
  const synthRef = useRef(window.speechSynthesis);
  const femaleVoiceRef = useRef(null);
  const voiceInitializedRef = useRef(false);

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
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        femaleVoiceRef.current = selectedVoice;
        voiceInitializedRef.current = true;
      }
    };

    selectFemaleVoice();
    
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = () => {
        if (!voiceInitializedRef.current) {
          selectFemaleVoice();
        }
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  const speakReply = useCallback((text) => {
    if (!window.speechSynthesis) return;
    
    const isSpeechEnabled = localStorage.getItem("speech_enabled") !== "false";
    if (!isSpeechEnabled) return;
    
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = femaleVoiceRef.current || voices.find(
        (v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')
      ) || voices[0];

      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = femaleVoice;
      utter.rate = 1;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error('TTS error', e);
    }
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
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      if (stoppedRef.current) return;

      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }

      const current = final || interim;
      setTranscript(current);

      if (final) {
        const formattedFinal = final.charAt(0).toUpperCase() + final.slice(1);
        
        addMessage('user', formattedFinal);
        setChatOpen(true);

        const intent = parseIntent(final);
        const reply = intentToReply(intent);

        addMessage('assistant', reply.text, reply.link);
        speakReply(reply.text);
      }
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recog;
    return recog;
  }, [addMessage, parseIntent, intentToReply, speakReply]);

  const toggleListening = useCallback(() => {
    const recog = initRecognition();
    if (!recog) return;

    stopSpeaking();

    if (!isListening) {
      try {
        stoppedRef.current = false;
        recog.start();
        setTranscript('');
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition start error:', e);
      }
    } else {
      stoppedRef.current = true;
      try {
        recog.stop();
      } catch (e) {
        console.error('Speech recognition stop error:', e);
      }
      setIsListening(false);
      setChatOpen(true);
    }
  }, [isListening, initRecognition, stopSpeaking]);

  const handleSend = useCallback((text) => {
    if (!text.trim()) return;

    const formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    addMessage('user', formattedText);

    const intent = parseIntent(formattedText);
    const reply = intentToReply(intent);

    addMessage('assistant', reply.text, reply.link);
    speakReply(reply.text);
  }, [addMessage, parseIntent, intentToReply, speakReply]);

  const handleEditMessage = useCallback((messageId, newContent) => {
    const formattedContent = newContent.charAt(0).toUpperCase() + newContent.slice(1);
    
    const intent = parseIntent(formattedContent);
    const reply = intentToReply(intent);
    
    addMessage('assistant', reply.text, reply.link);
    speakReply(reply.text);
  }, [addMessage, parseIntent, intentToReply, speakReply]);

  const clearChat = useCallback((clearMessages) => {
    stopSpeaking();
    clearMessages();
  }, [stopSpeaking]);

  return {
    isListening,
    transcript,
    chatOpen,
    setChatOpen,
    toggleListening,
    stopSpeaking,
    handleSend,
    handleEditMessage,
    clearChat,
  };
}