import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Award, Clock } from 'lucide-react';
import MedicalDisclaimer from './voice-compo/medicalDisclaimer';
import VoiceControls from './voice-compo/voiceControls';
import VoiceVisualization from './voice-compo/voiceVisualization';
import ConversationHistory from './voice-compo/conversationHistory';
import QuickActions from './voice-compo/quickActions';
import SessionControls from './voice-compo/sessionControls';

export const VoiceAssistantInteraction = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState('excellent');
    const [sessionDuration, setSessionDuration] = useState(0);
    const [audioLevels, setAudioLevels] = useState(new Array(12).fill(0));

    const [conversations, setConversations] = useState([
        {
            id: 1,
            userMessage: "What are the common symptoms of seasonal allergies?",
            aiResponse: `Seasonal allergies, also known as hay fever, occur when your immune system overreacts to outdoor allergens like pollen.\n\nCommon indicators include:\n• Persistent sneezing and nasal congestion\n• Itchy, watery, or red eyes (allergic conjunctivitis)\n• An itchy throat or inside of the ears\n• Postnasal drip which may cause a mild cough.`,
            timestamp: "2:45 PM",
            category: "Allergies",
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
        }, 1500);
    };

    const handleDeleteMessage = (id) => {
        setConversations(prev => prev.filter(chat => chat.id !== id));
    };

    const handleReplay = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const savedVoice = localStorage.getItem("assistantVoice") || "Arial"; 
        const savedPitch = localStorage.getItem("assistantPitch") || (savedVoice === "Arial" ? 1.2 : 0.8);

        utterance.pitch = parseFloat(savedPitch);
        utterance.rate = 0.9; // Professional speed
        
        window.speechSynthesis.speak(utterance);
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
        <div className="min-h-screen bg-background pt-10 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl text-left font-bold text-text-primary mb-2">Voice Health Assistant</h1>
                            <p className="text-text-secondary">
                                Have a natural conversation about your health questions and concerns
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/dashboard">
                                <button
                                    className="px-4 py-2 rounded-md border border-border text-sm font-medium 
                                    text-foreground hover:text-primary hover:border-primary 
                                    cursor-pointer transition-colors"
                                >
                                    Back to Dashboard
                                </button>
                            </Link>
                            <Link to="/dashboard/guidance-library">
                                <button
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary
                                    text-primary-foreground hover:bg-primary/80 transition-colors
                                    cursor-pointer"
                                >
                                    Browse Library
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="mb-8">
                    <MedicalDisclaimer />
                </div>

                {/* Main Interface Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Voice Controls & Visualization */}
                    <div className="lg:col-span-1 space-y-6">
                        <VoiceControls
                            isListening={isListening}
                            isProcessing={isProcessing}
                            onToggleListening={handleToggleListening}
                            onClearConversation={handleClearConversation}
                            connectionQuality={connectionQuality}
                            audioLevels={audioLevels}
                            setAudioLevels={setAudioLevels}
                        />

                        {/* Voice Visualization */}
                        <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
                                Audio Visualization
                            </h3>
                            <div className="flex items-center justify-center h-20">
                                {isListening ? (
                                    // I-render ang bagong CSS-based animation
                                    <VoiceVisualization barColor="bg-blue-500" />
                                ) : (
                                    // Static dots kapag IDLE
                                    <div className="flex space-x-2">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 bg-blue-200 rounded-full opacity-30" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <SessionControls
                            sessionDuration={sessionDuration}
                            onSaveSession={handleSaveSession}
                            onScheduleAppointment={handleScheduleAppointment}
                            onShareSession={handleShareSession}
                        />
                    </div>

                    {/* Center Column - Conversation History */}
                    <div className="lg:col-span-1">
                        <ConversationHistory
                            conversations={conversations}
                            onReplay={handleReplay}
                            onSave={handleSaveConversation}
                            isProcessing={isProcessing}
                            onDelete={handleDeleteMessage}
                            onSendMessage={handleSendMessage}
                        />
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="lg:col-span-1">
                        <QuickActions onQuickAction={handleQuickAction} />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden mt-8 flex space-x-4">
                    <Link to="/user-dashboard" className="flex-1">
                        <button
                            className="w-full px-4 py-2 rounded-md border border-border text-sm font-medium 
                            text-foreground hover:text-primary hover:border-primary transition-colors"
                        >
                            Dashboard
                        </button>
                    </Link>
                    <Link to="/health-profile" className="flex-1">
                        <button
                            className="w-full px-4 py-2 rounded-md text-sm font-medium 
                            text-foreground hover:text-primary transition-colors"
                        >
                            Profile
                        </button>
                    </Link>
                </div>

                {/* Trust Signals Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap items-center justify-center space-x-8 text-sm text-text-secondary">
                        <div className="flex items-center space-x-2 trust-signal">
                            <Shield size={16} className="text-success" />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center space-x-2 trust-signal">
                            <Lock size={16} className="text-success" />
                            <span>End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-2 trust-signal">
                            <Award size={16} className="text-success" />
                            <span>Medical Board Certified</span>
                        </div>
                        <div className="flex items-center space-x-2 trust-signal">
                            <Clock size={16} className="text-accent" />
                            <span>Available 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistantInteraction;

