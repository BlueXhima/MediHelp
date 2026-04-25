import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, MessageSquare, Mic2, Zap, ClipboardList, Activity, ChevronLeft, 
    Library, ShieldCheck, Clock, Shield, Award, Lock, Stethoscope
} from 'lucide-react';
import MedicalDisclaimer from './voice-compo/medicalDisclaimer';
import VoiceControls from './voice-compo/voiceControls';
import VoiceVisualization from './voice-compo/voiceVisualization';
import ConversationHistory from './voice-compo/conversationHistory';
import QuickActions from './voice-compo/quickActions';
import SessionControls from './voice-compo/sessionControls';
import HealthRecords from './voice-compo/healthRecords';

export const VoiceAssistantInteraction = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState('excellent');
    const [sessionDuration, setSessionDuration] = useState(0);
    const [audioLevels, setAudioLevels] = useState(new Array(12).fill(0));
    const [activeTab, setActiveTab] = useState('overview');
    const [isSpeakingId, setIsSpeakingId] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [conversations, setConversations] = useState([
        {
            id: 1,
            userMessage: "What are the common symptoms of seasonal allergies?",
            aiResponse: `Seasonal allergies, also known as hay fever, occur when your immune system overreacts to outdoor allergens like pollen.\n\nCommon indicators include:\n• Persistent sneezing and nasal congestion\n• Itchy, watery, or red eyes (allergic conjunctivitis)\n• An itchy throat or inside of the ears\n• Postnasal drip which may cause a mild cough.`,
            timestamp: "2:45 PM",
            category: "Allergies",
            healthtips: [
                "Avoid caffeine 6 hours before bed.",
                "Keep your room temperature cool.",
                "Use dim lights an hour before sleeping."
            ],
            recommendations: [
                "Keep windows closed during high pollen counts (usually morning)",
                "Use an air purifier with a HEPA filter in your bedroom",
                "Shower and change clothes after spending time outdoors"
            ],
            articles: [
                {
                    title: "Understanding Pollen Counts & Your Health",
                    source: "MediHelp Library",
                    readTime: "5 min read",
                    url: "#"
                },
                {
                    title: "Natural vs Medical Allergy Treatments",
                    source: "Health Insights",
                    readTime: "8 min read",
                    url: "https://www.healthline.com/health/natural-allergy-treatments"
                }
            ],
            warning: "Note: If you experience wheezing or shortness of breath, this may indicate allergic asthma and requires medical evaluation."
        },
        {
            id: 2,
            userMessage: "How can I manage stress naturally?",
            aiResponse: `Managing stress naturally involves activating your body's 'relaxation response' to counter the effects of cortisol.\n\nEffective techniques include:\n• Mindful Meditation: Focus on your breath for 5-10 minutes daily.\n• Physical Activity: Even a 15-minute walk can boost endorphins.\n• Proper Sleep Hygiene: Aim for 7-9 hours of rest to allow your nervous system to recover.\n• Limiting Stimulants: Reduce caffeine intake, especially in the afternoon.`,
            timestamp: "2:38 PM",
            category: "Mental Health",
            healthtips: [
                "Practice deep breathing exercises for 5-10 minutes daily.",
                "Engage in regular physical activity to reduce stress hormones.",
                "Prioritize adequate sleep to support emotional regulation."
            ],
            recommendations: [
                "Practice the 4-7-8 breathing technique twice a day",
                "Maintain a consistent sleep-wake cycle",
                "Consider journaling to process daily stressors"
            ],
            articles: [
                {
                    title: "Stress Management Techniques for Daily Life",
                    source: "Health Insights",
                    readTime: "6 min read",
                    url: "https://www.healthline.com/health/stress-management-techniques"
                }
            ],
            warning: "Important: If stress feels overwhelming or leads to persistent anxiety, please reach out to a mental health professional."
        },
        {
            id: 3,
            userMessage: "What are some tips for improving sleep quality?",
            aiResponse: `Improving sleep quality can significantly enhance your overall health and well-being.\n\nHere are some evidence-based tips:\n• Establish a Consistent Sleep Schedule: Go to bed and wake up at the same time every day, even on weekends.\n• Create a Relaxing Bedtime Routine: Engage in calming activities like reading or taking a warm bath 30 minutes before bed.\n• Optimize Your Sleep Environment: Keep your bedroom cool, dark, and quiet. Consider blackout curtains and white noise machines if needed.\n• Limit Screen Time Before Bed: The blue light emitted by phones and computers can interfere with melatonin production. Try to avoid screens at least an hour before bedtime.`,
            timestamp: "2:30 PM",
            category: "Wellness",
            healthtips: [
                "Maintain a consistent sleep schedule",
                "Create a relaxing bedtime routine",
                "Keep your bedroom cool and dark"
            ],
            recommendations: [
                "Maintain a consistent sleep schedule",
                "Create a relaxing bedtime routine",
                "Keep your bedroom cool and dark"
            ],
            articles: [
                {
                    title: "Understanding Pollen Counts and Allergy Weather",
                    source: "AAFA (Asthma and Allergy Foundation)",
                    readTime: "6 min read",
                    url: "https://aafa.org/allergies/allergy-symptoms/pollen-count/"
                }
            ],
            warning: "Note: If you continue to have trouble sleeping, consider speaking with a healthcare provider."
        }
    ]);

    // Session timer
    useEffect(() => {
        let interval;
        if (isListening || isProcessing) {
            interval = setInterval(() => {
                setSessionDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isListening, isProcessing]);

    const handleToggleListening = () => {
        if (isListening) {
            setIsListening(false);
            setIsProcessing(true);
            
            setTimeout(() => {
                setIsProcessing(false);
                const newConversation = {
                    id: Date.now(),
                    userMessage: "How much water should I drink daily?",
                    aiResponse: `Proper hydration is essential for maintaining energy levels, supporting digestion, and keeping your skin healthy.\n\nGeneral guidelines for daily intake:\n• Men: Approximately 3.7 liters (15.5 cups)\n• Women: Approximately 2.7 liters (11.5 cups)\n\nNote: This includes water from other beverages and food (which usually accounts for 20% of your daily intake).`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    healthtips: [
                        "Drink water consistently throughout the day rather than consuming large amounts at once.",
                        "Start your day with a glass of water to kickstart hydration.",
                        "Infuse water with fruits or herbs for added flavor and nutrients."
                    ],
                    recommendations: [
                        "Drink a glass of water immediately after waking up",
                        "Carry a reusable water bottle to track your intake",
                        "Eat water-rich foods like cucumbers, watermelon, and oranges"
                    ],
                    articles: [
                        {
                            title: "Understanding Pollen Counts and Allergy Weather",
                            source: "AAFA (Asthma and Allergy Foundation)",
                            readTime: "6 min read",
                            url: "https://aafa.org/allergies/allergy-symptoms/pollen-count/"
                        }
                    ],
                    warning: "Important: Factors like intense physical activity, hot weather, and certain medical conditions or medications can increase your hydration needs.", 
                    category: "Wellness"
                };
                setConversations(prev => [...prev, newConversation]);
            }, 3000);
        } else {
            setIsListening(true);
        }
    };

    const handleClearConversation = () => {
        setConversations([]);
        setSessionDuration(0);
    };

    const handleQuickAction = (actionId, title) => {
        setIsProcessing(true);

        const detailedResponses = {
            'symptoms': `I can help you analyze your symptoms. To give you the best guidance, please describe:\n1. When did the symptoms start?\n2. What makes them feel better or worse?\n3. Are you experiencing any pain or discomfort?`,
            'nutrition': `Proper nutrition is the foundation of recovery and energy. A balanced plate typically consists of:\n• 50% Vegetables and Fruits\n• 25% Lean Protein\n• 25% Whole Grains\n\nWould you like to know about specific meal plans for your health goals?`,
            'emergency': `If you are experiencing a life-threatening situation, please do not wait.\n\nWarning signs include:\n• Sudden numbness or weakness (especially on one side)\n• Severe chest pain spreading to the arms or jaw\n• Major bleeding that won't stop\n• Loss of consciousness.`
        };

        const response = detailedResponses[actionId] || `I'm ready to assist you with ${title}. This module provides evidence-based information to help you make informed health decisions.`;

        const newConversation = {
            id: Date.now(),
            userMessage: title,
            aiResponse: response,
            healthtips: actionId === 'emergency' 
                ? ["Stay calm and call for help", "Apply pressure to any bleeding wounds", "Do not attempt to drive yourself to the hospital"] 
                : ["Keep a symptom diary to track changes", "Focus on nutrient-dense foods", "Seek medical attention if symptoms worsen"],
            recommendations: actionId === 'emergency' 
                ? ["Call emergency services immediately", "Unlock your front door for responders", "Do not drive yourself to the hospital"]
                : ["Document your symptoms in a health log", "Stay hydrated and rest", "Follow up if symptoms persist"],
            warning: actionId === 'emergency' 
                ? "CRITICAL: Do not delay professional medical help for emergency symptoms." 
                : "Reminder: This AI guidance is for informational purposes and does not replace professional medical advice.",
            articles: [
                {
                    title: "Pollen Count: What It Is and How It Affects You",
                    source: "Mayo Clinic",
                    readTime: "5 min read",
                    url: "https://www.mayoclinic.org/diseases-conditions/hay-fever/in-depth/seasonal-allergies/art-20048343"
                }
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: "Health Guidance"
        };

        setTimeout(() => {
            setConversations(prev => [...prev, newConversation]);
            setIsProcessing(false);
            
            // 1. Lipat muna ng tab
            setActiveTab('assistant'); 

            // 2. Optional: Force scroll after tab switch
            // Minsan kailangan ng micro-task delay para hayaan ang DOM na mag-render
            setTimeout(() => {
                const scrollContainer = document.querySelector('.custom-scrollbar');
                if (scrollContainer) {
                    scrollContainer.scrollTo({
                        top: scrollContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100); // 100ms lang para tapos na ang render ng tab
        }, 1500);
    };    

    const handleDeleteMessage = (id) => {
        setConversations(prev => prev.filter(chat => chat.id !== id));
    };

    const handleReplay = (text, id) => {
        if (isSpeakingId === id) {
            window.speechSynthesis.cancel();
            setIsSpeakingId(null);
        } else {
            window.speechSynthesis.cancel();
            setIsSpeakingId(id);
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeakingId(null);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSaveSession = () => {
        console.log('Saving session to health records');
    };

    const handleScheduleAppointment = () => {
        console.log('Opening appointment scheduler');
    };

    const handleShareSession = () => {
        console.log('Sharing session with healthcare provider');
    };

    const handleSaveConversation = () => {
        console.log('Exporting conversation history');
    };

    const handleSendMessage = (text, editingId = null) => {
        if (!text.trim()) return;

        if (editingId) {
            // EDIT MODE: I-update ang message sa array
            setConversations(prev => prev.map(chat => 
                chat.id === editingId 
                    ? { ...chat, userMessage: text } 
                    : chat
            ));
        } else {
            const newMessage = {
                id: Date.now(), // Mas safe gamitin ang timestamp as ID
                userMessage: text,
                aiResponse: "Thinking...",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setConversations(prev => [...prev, newMessage]);
        }
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* --- LEFT SIDEBAR (Sidebar) --- */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 h-full shadow-sm">
                {/* Brand Logo Section */}
                <div className="p-8">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Stethoscope size={28} className="text-primary" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-800">
                            Medi<span className="text-primary">Help</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 space-y-1.5">
                    <p className="px-4 text-[10px] text-left font-bold uppercase tracking-widest text-gray-400 mb-2">Main Menu</p>
                    
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'assistant', label: 'Voice Assistant', icon: Mic2 },
                        { id: 'actions', label: 'Quick Actions', icon: Zap },
                        { id: 'records', label: 'Health Records', icon: ClipboardList },
                        { id: 'session', label: 'Session Control', icon: Activity },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center cursor-pointer justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-primary'} />
                                <span className="font-bold text-sm">{item.label}</span>
                            </div>
                            {activeTab === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-glow" />}
                        </button>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="p-4 mt-auto">
                    <div className="bg-gray-50 rounded-3xl p-2 space-y-1">
                        <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-primary hover:bg-white rounded-2xl transition-all group">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:bg-primary/10">
                                <ChevronLeft size={18} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
                        </Link>
                        
                        <Link to="/dashboard/guidance-library" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-primary hover:bg-white rounded-2xl transition-all group">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:bg-primary/10">
                                <Library size={18} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Medical Library</span>
                        </Link>
                    </div>
                    
                    {/* User Status Tag (Optional) */}
                    <div className="mt-4 px-4 py-2 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">System Online</span>
                    </div>
                </div>
            </aside>

            {/* --- RIGHT CONTENT (Main) --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/30">

                {/* Scrollable Dynamic Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* Welcome Section */}
                                <div className="bg-white border border-border rounded-3xl p-1 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary/5 to-indigo-500/5 rounded-[1.4rem] p-10 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                            <MessageSquare size={32} className="text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-800 mb-3 italic">
                                            Hello! I'm your Health Assistant
                                        </h2>
                                        <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">
                                            I'm here to help you understand your symptoms, manage your wellness, and keep track of your health records through natural conversation.
                                        </p>
                                        <div className="flex gap-4 mt-8">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-500 flex items-center">
                                                Joined by 1,000+ users today
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats/Info Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                            <MessageSquare size={24} />
                                        </div>
                                        <h3 className="font-bold text-text-primary">Recent Chats</h3>
                                        <p className="text-2xl font-bold text-primary">{conversations.length}</p>
                                        <p className="text-xs text-text-secondary mt-1">Stored in current session</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                            <Clock size={24} />
                                        </div>
                                        <h3 className="font-bold text-text-primary">Session Time</h3>
                                        <p className="text-2xl font-bold text-primary">{Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</p>
                                        <p className="text-xs text-text-secondary mt-1">Active interaction time</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                            <Shield size={24} />
                                        </div>
                                        <h3 className="font-bold text-text-primary">Security</h3>
                                        <p className="text-sm font-medium text-success mt-2 flex items-center justify-center">
                                            <Lock size={14} className="mr-1" /> AES-256 Encrypted
                                        </p>
                                        <p className="text-xs text-text-secondary mt-1">End-to-end encrypted</p>
                                    </div>
                                </div>

                                {/* How to use section */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-text-primary flex items-center">
                                            <Award size={20} className="mr-2 text-primary" /> How to get started
                                        </h3>
                                        <ul className="space-y-3">
                                            {[
                                                { title: "Voice Interaction", desc: "Click 'Voice Assistant' and hit the mic to start talking.", icon: "🎙️" },
                                                { title: "Health Records", desc: "Save your sessions to view them later in the Records tab.", icon: "📂" },
                                                { title: "Quick Actions", desc: "Use pre-set buttons for common medical inquiries.", icon: "⚡" }
                                            ].map((step, i) => (
                                                <li key={i} className="flex items-start text-left space-x-4 p-4 bg-white rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-default shadow-sm">
                                                    <span className="text-2xl">{step.icon}</span>
                                                    <div>
                                                        <p className="font-semibold text-text-primary">{step.title}</p>
                                                        <p className="text-sm text-text-secondary">{step.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                                            <Shield size={18} className="mr-2" /> Important Reminders
                                        </h3>
                                        <div className="space-y-4">
                                            <MedicalDisclaimer />
                                            <div className="bg-white/60 p-4 rounded-lg text-sm text-amber-900 leading-relaxed border border-amber-200/50">
                                                <strong>Privacy:</strong> We never share your health data with third parties. All voice processing is done securely.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'assistant' && (
                            <div className="grid lg:grid-cols-12 gap-8 items-start">
                                
                                {/* Left: Interactive Tools (4 columns) */}
                                <div className="lg:col-span-5 xl:col-span-4">
                                    <VoiceControls
                                        isListening={isListening}
                                        isProcessing={isProcessing}
                                        onToggleListening={handleToggleListening}
                                        onClearConversation={handleClearConversation}
                                        connectionQuality={connectionQuality}
                                        audioLevels={audioLevels}
                                        setAudioLevels={setAudioLevels}
                                    />
                                    
                                    <div 
                                        className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
                                        rounded-[2rem] p-6 mt-6"
                                    >
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center tracking-widest">Live Visualizer</h3>
                                        <div className="h-12 flex items-center justify-center">
                                            {isListening ? (
                                                <VoiceVisualization barColor="bg-primary" />
                                            ) : (
                                                <div className="flex space-x-1.5 opacity-30">
                                                    {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: History (8 columns) */}
                                <div className="lg:col-span-7 xl:col-span-8">
                                    <ConversationHistory
                                        conversations={conversations}
                                        onReplay={handleReplay}
                                        onSave={handleSaveConversation}
                                        isProcessing={isProcessing}
                                        onDelete={handleDeleteMessage}
                                        onSendMessage={handleSendMessage}
                                        isSpeakingId={isSpeakingId}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'actions' && (
                            <div>
                                <QuickActions onQuickAction={handleQuickAction} />
                            </div>
                        )}

                        {activeTab === 'records' && (
                            <div>
                                <HealthRecords conversations={conversations} />
                            </div>
                        )}

                        {activeTab === 'session' && (
                            <div>
                                <SessionControls 
                                    sessionDuration={sessionDuration} 
                                    onSaveSession={handleSaveSession} 
                                    onScheduleAppointment={handleScheduleAppointment} 
                                    onShareSession={handleShareSession} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VoiceAssistantInteraction;