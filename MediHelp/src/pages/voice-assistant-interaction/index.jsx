import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import MedicalDisclaimer from "./components/MedicalDisclaimer.jsx";
import VoiceControls from './components/VoiceControls.jsx';
import VoiceVisualization from './components/VoiceVisualization.jsx';
import ConversationHistory from './components/ConversationHistory.jsx';
import QuickActions from './components/QuickActions.jsx';
import SessionControls from './components/SessionControls.jsx';
import { Shield, Lock, Award, Clock } from 'lucide-react';

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
            aiResponse: `Seasonal allergies commonly present with sneezing, runny or stuffy nose, itchy and watery eyes, and scratchy throat. You might also experience fatigue and headaches.\n\nThese symptoms typically occur during specific seasons when allergens like pollen are high. Consider tracking your symptoms and consulting with an allergist for proper testing and treatment options.`,
            timestamp: "2:45 PM",
            category: "Allergies"
        },
        {
            id: 2,
            userMessage: "How can I manage stress naturally?",
            aiResponse: `Natural stress management techniques include deep breathing exercises, regular physical activity, adequate sleep (7-9 hours), and mindfulness meditation.\n\nOther effective methods are maintaining a balanced diet, staying hydrated, limiting caffeine, and engaging in hobbies you enjoy. If stress persists or affects daily life, consider speaking with a mental health professional.`,
            timestamp: "2:38 PM",
            category: "Mental Health"
        },
        {
            id: 3,
            userMessage: "Is it safe to take vitamin D supplements daily?",
            aiResponse: `Vitamin D supplements are generally safe for most adults when taken within recommended doses (600-800 IU daily for most adults).\n\nHowever, dosage needs can vary based on factors like sun exposure, diet, skin color, and geographic location. It's best to have your vitamin D blood level tested and consult with your healthcare provider for personalized dosing recommendations.`,
            timestamp: "2:30 PM",
            category: "Nutrition"
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
        // Simulate processing time
        setTimeout(() => {
            setIsProcessing(false);
            // Add mock response to conversation
            const newConversation = {
                id: conversations?.length + 1,
                userMessage: "How much water should I drink daily?",
                aiResponse: `The general recommendation is about 8 glasses (64 ounces) of water per day, but individual needs vary based on activity level, climate, and overall health.\n\nFactors like exercise, hot weather, pregnancy, or certain medical conditions may increase your fluid needs. Listen to your body's thirst cues and monitor urine color as indicators of hydration status.`,
                timestamp: new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                category: "Wellness"
            };
            setConversations(prev => [newConversation, ...prev]);
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
        const quickResponses = {
            'symptoms': `I can help you understand common symptoms, but remember that symptom checking tools are for informational purposes only.\n\nFor accurate diagnosis and treatment, please consult with a healthcare professional. Would you like to describe your specific symptoms?`,
            'medications': `I can provide general information about medications, including common uses and side effects.\n\nHowever, always consult your pharmacist or doctor before starting, stopping, or changing any medications. What medication would you like to know about?`,
            'wellness': `I'm here to share evidence-based wellness tips for maintaining good health.\n\nThis includes advice on nutrition, exercise, sleep, and stress management. What aspect of wellness interests you most?`,
            'nutrition': `Good nutrition is fundamental to health. I can provide information about balanced diets, nutrients, and healthy eating patterns.\n\nFor personalized nutrition plans, especially if you have medical conditions, consult with a registered dietitian. What nutrition topic can I help with?`,
            'exercise': `Regular physical activity is crucial for health. I can suggest general exercise guidelines and safe practices.\n\nBefore starting any new exercise program, especially if you have health conditions, consult your healthcare provider. What type of exercise guidance do you need?`,
            'mental-health': `Mental health is as important as physical health. I can share strategies for stress management, mood improvement, and general mental wellness.\n\nFor clinical mental health concerns, please reach out to a mental health professional. How can I support your mental wellness today?`,
            'emergency': `For medical emergencies, call 911 immediately. I can provide general first aid information, but emergency situations require immediate professional medical attention.\n\nWhat type of emergency guidance do you need?`,
            'find-doctor': `I can help you understand different types of healthcare providers and when to see them.\n\nFor finding specific doctors in your area, use your insurance provider's directory or healthcare facility websites. What type of healthcare provider are you looking for?`
        };

        const response = quickResponses?.[actionId] || `Let me help you with "${title}". Please provide more specific details about what you'd like to know.`;
        
        const newConversation = {
            id: conversations?.length + 1,
            userMessage: title,
            aiResponse: response,
            timestamp: new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: title?.includes('Emergency') ? 'Emergency' : 'General Health'
        };
        
        setConversations(prev => [newConversation, ...prev]);
    };

    const handleReplay = (text) => {
        // Mock audio playback
        console.log('Playing audio:', text);
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
                                <Button variant="outline">
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <Link to="/guidance-library">
                                <Button variant="ghost">
                                    Browse Library
                                </Button>
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
                            <VoiceVisualization 
                                audioLevels={audioLevels} 
                            />
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
                        <Button variant="outline" fullWidth>
                            Dashboard
                        </Button>
                    </Link>
                    <Link to="/health-profile" className="flex-1">
                        <Button variant="ghost" fullWidth>
                            Profile
                        </Button>
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

