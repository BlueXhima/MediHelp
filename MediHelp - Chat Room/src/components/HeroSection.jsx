// PATH: components/HeroSection.jsx

import { cn } from '../lib/utils';
import { Mic } from 'lucide-react';
import { useState, useRef, useContext } from 'react';
import HeroModel3 from '../assets/HeroModel3.avif';
import HIPAACert from '../assets/HIPAACert.jpg';
import { AuthContext,  } from '../context/AuthContext.jsx';

// Things I added
import ChatModal from './voice-assistant-widgets/ChatRoom/ChatModal.jsx';
import { useChatMessages } from '../hooks/useChatMessages';
import { GreetingVoice  } from '../components/voice-assistant-widgets/GreetingVoice.jsx'

// ------------------------------
// 🔹 VoiceWidget Component
// ------------------------------
function VoiceWidget({openAuth}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const recognitionRef = useRef(null);
  const stoppedRef = useRef(false);
  
  const { messages, addMessage, clearMessages } = useChatMessages();

  function initRecognition() {
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
        // Add user message
        addMessage('user', final);
        setChatOpen(true);

        // Compute bot reply
        const intent = parseIntent(final);
        const reply = intentToReply(intent);

        // Add bot reply directly and mark isTyping false
        addMessage('assistant', reply);

        // Speak bot reply immediately
        speakReply(reply);
      }

    };

    recog.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recog;
    return recog;
  }

  function toggleListening() {
    const recog = initRecognition();
    if (!recog) return;

    // Stop previous speech if any
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

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
  }

  // helper: simple intent parser (keyword-based)
  function parseIntent(text) {
      const t = text.toLowerCase();
      if (t.includes('chest') || t.includes('angina') || t.includes('heart')) return 'chest_pain';
      if (t.includes('fever') || t.includes('temperature')) return 'fever';
      if (t.includes('headache') || t.includes('migraine')) return 'headache';
      if (t.includes('covid') || t.includes('coronavirus')) return 'covid';
      return 'general_symptom';
  }

  function intentToReply(intent) {
      switch (intent) {
          case 'chest_pain':
              return 'Chest pain can be serious. If you are experiencing severe pain, shortness of breath, or fainting, seek emergency help. For general causes, it can be related to heart, lungs, or muscle issues. Consider visiting our chest pain guide.';
          case 'fever':
              return 'Fever may indicate infection. Stay hydrated and rest. If your temperature is very high or persistent, contact a healthcare provider.';
          case 'headache':
              return 'Headaches are common and can be caused by stress, dehydration, or other conditions. Try resting and hydrating. If severe or sudden, seek medical advice.';
          case 'covid':
              return 'If you suspect COVID-19, please follow local testing guidelines and isolate as recommended. Seek urgent care if you have trouble breathing.';
          default:
              return 'Thanks — I heard you. For better guidance, please provide a few more details about your symptoms.';
      }
  }

function speakReply(text) {
  if (!window.speechSynthesis) return;
  try {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const voices = window.speechSynthesis.getVoices();
    // Pick a female voice if available
    const femaleVoice = voices.find(
      (v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')
    ) || voices[0]; // fallback to first voice

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = femaleVoice;
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.error('TTS error', e);
  }
}


  return (
    <div className={cn("rounded-lg p-6 transition-shadow duration-200", isListening ? "ring-4 ring-primary/30 shadow-2xl bg-primary/5" : "bg-background")}>
      <div className="flex items-start mb-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0", isListening ? "bg-primary-600 text-white" : "bg-foreground")}>
          <Mic size={20} strokeWidth={1.5} className={isListening ? "text-white" : "text-primary"} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-foreground">Try Voice Demo</h3>
          <p className="text-sm text-foreground/60">Ask: "What causes chest pain?"</p>
        </div>
      </div>

      <button
        onClick={toggleListening}
        aria-pressed={isListening}
        className={cn(
          "w-full py-3 rounded-full font-semibold transition transform-gpu focus:outline-none focus:ring-2 cursor-pointer",
          isListening
            ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl"
            : "bg-primary text-primary-foreground hover:scale-105"
        )}
      >
        {isListening ? 'Listening — Tap to stop' : '🎤 Start Speaking'}
      </button>

      {transcript && (
        <div className="mt-3 text-sm text-foreground/70">
          <div className="font-medium mb-1">Suggested action</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-primary text-white text-xs">
              Open Symptom Guide
            </button>
            <button className="px-3 py-1 rounded-md border border-border/30 text-xs">
              Search Docs
            </button>
          </div>
        </div>
      )}

      <ChatModal
        open={chatOpen}
        onClose={() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          clearMessages();
          setChatOpen(false);
        }}
        messages={messages}
        onSend={(text) => {
          if (!text.trim()) return;

          // Add user message
          addMessage('user', text);

          // Compute bot reply
          const intent = parseIntent(text);
          const reply = intentToReply(intent);

          // Add bot reply
          addMessage('assistant', reply);

          // Speak bot reply
          speakReply(reply);
        }}
        onClear={() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          clearMessages();
        }}
        openAuth={openAuth}
      />

    </div>
  );
}

// ------------------------------
// 🔹 HeroSection Component
// ------------------------------
export const HeroSection = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { openAuth, user } = useContext(AuthContext);

  // Determine greeting text dynamically
  const greetingText = user?.username
    ? `Welcome back ${user.username}!`
    : 'Welcome to the MediHelp your voice-assistant healthcare information system.';

  return (
    <section 
      id="hero" 
      className="relative bg-linear-to-br from-primary-50 to-accent-50 dark:from-primary-900 dark:to-accent-900 min-h-screen flex items-center"
    >
    <GreetingVoice text={greetingText} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Get Medical Answers <span className="text-primary">Instantly</span> with Voice
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl">
              Skip the wait — speak your symptoms and get reliable health guidance in seconds, 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button 
                onClick={openAuth}
                className="inline-flex items-center justify-center bg-primary text-primary-foreground text-lg px-8 py-4 rounded-lg shadow-sm hover:shadow-md transition transform-gpu hover:scale-105 cursor-pointer">
                Start Free 7-Day Trial
              </button>
              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center bg-transparent border-2 border-primary text-primary font-semibold px-8 py-4 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                Try Voice Demo
              </button>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-card p-4 rounded-lg shadow-subtle">
                <div className="text-2xl font-bold text-accent">2,847</div>
                <div className="text-sm text-foreground/90">Queries Resolved Today</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-subtle">
                <div className="text-2xl font-bold text-accent">&lt; 30s</div>
                <div className="text-sm text-foreground/90">Average Response Time</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-subtle flex items-center justify-center">
                <img
                  src={HIPAACert}
                  alt="HIPAA Compliance Badge"
                  className="h-15 w-full object-cover"
                />
                <span className="ml-2 text-sm font-medium text-foreground/90">
                  HIPAA Compliant
                </span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-card rounded-2xl shadow-demo p-8">
              <img
                src={HeroModel3}
                alt="Voice-assisted healthcare consultation"
                className="w-full h-90 object-cover rounded-lg mb-6"
              />
              <VoiceWidget openAuth={openAuth} />
            </div>
          </div>

        </div>
      </div>

      {/* Demo modal */}
      <DemoModal
        open={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </section>
  );
};

// ------------------------------
// 🔹 DemoModal Component
// ------------------------------

function DemoModal({ open, onClose }) {
    const [consent, setConsent] = useState(() => {
        try { return localStorage.getItem('voice_demo_consent') === 'true'; } catch { return false; }
    });

    function startDemo() {
        try { localStorage.setItem('voice_demo_consent', consent ? 'true' : 'false'); } catch {}
        onClose(consent);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-card rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 border-b border-border/20">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center text-white">
                        <Mic size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl text-left font-semibold">Try Voice Demo</h3>
                        <p className="text-sm text-left text-foreground/70">
                            Experience on-device speech recognition. We process audio locally unless you opt-in to upload.
                        </p>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    <ul className="space-y-2 text-sm text-foreground/70 mb-5">
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Local transcription with instant results.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Keyword intent suggestions and spoken replies.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">✓</span>
                            <span>Your audio stays on-device by default.</span>
                        </li>
                    </ul>

                    <div className="flex items-center gap-3">
                        <input
                            id="demo-consent"
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                        />
                        <label htmlFor="demo-consent" className="text-sm text-foreground/80">
                            I consent to local processing of my audio for this demo
                        </label>
                    </div>
                </div>

                <div className="px-6 py-5 bg-background/50 flex items-center justify-end gap-3">
                    <button onClick={() => onClose(false)} className="px-4 py-2 rounded-md text-sm border border-border/20 bg-transparent cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={startDemo} className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white cursor-pointer">
                        Start Demo
                    </button>
                </div>
            </div>
        </div>
    );
}