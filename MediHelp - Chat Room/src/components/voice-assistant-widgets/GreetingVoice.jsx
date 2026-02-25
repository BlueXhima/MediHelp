// PATH: components/voice-assistant-widgets/GreetingVoice.jsx
import { useEffect, useRef } from 'react';

export function GreetingVoice({ text }) {
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    if (!text) return;                 // do nothing if no text
    if (!window.speechSynthesis) return;

    function speak() {
      if (hasSpokenRef.current) return; // already spoken

      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;       // voices not loaded yet

      // Common female voice names (Windows/macOS/Chrome)
      const femaleVoiceNames = [
        'Microsoft Zira Desktop', // Windows
        'Samantha',               // macOS
        'Fiona',                  // macOS
        'Google US English',      // Chrome/Edge
        'Google UK English Female'
      ];

      let selectedVoice = voices.find(v => femaleVoiceNames.includes(v.name));
      if (!selectedVoice) {
        // fallback to any voice that has "female" in its name
        selectedVoice = voices.find(v =>
          v.name.toLowerCase().includes('female')
        );
      }
      if (!selectedVoice) selectedVoice = voices[0]; // ultimate fallback

      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1;

      window.speechSynthesis.speak(utter);
      hasSpokenRef.current = true;
    }

    // Try immediately
    speak();

    // Listen for voiceschanged in case voices not loaded yet
    window.speechSynthesis.onvoiceschanged = speak;

  }, [text]);

  return null; // no UI
}
