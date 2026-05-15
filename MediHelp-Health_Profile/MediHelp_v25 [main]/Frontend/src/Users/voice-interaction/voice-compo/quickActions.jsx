import React from 'react';
import { Stethoscope, Pill, Heart, Apple, Dumbbell, Brain, AlertTriangle, MapPin, ChevronRight, Zap } from 'lucide-react';

const QuickActions = ({ onQuickAction }) => {
    const quickTopics = [
        {
            id: 'symptoms',
            title: 'Symptom Checker',
            description: 'Describe your symptoms',
            icon: <Stethoscope size={20} />,
            color: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
            id: 'medications',
            title: 'Medication Info',
            description: 'Ask about medications',
            icon: <Pill size={20} />,
            color: 'bg-green-50 text-green-700 border-green-200'
        },
        {
            id: 'wellness',
            title: 'Wellness Tips',
            description: 'Get health advice',
            icon: <Heart size={20} />,
            color: 'bg-purple-50 text-purple-700 border-purple-200'
        },
        {
            id: 'nutrition',
            title: 'Nutrition Guide',
            description: 'Diet and nutrition',
            icon: <Apple size={20} />,
            color: 'bg-orange-50 text-orange-700 border-orange-200'
        },
        {
            id: 'exercise',
            title: 'Exercise Plans',
            description: 'Fitness recommendations',
            icon: <Dumbbell size={20} />,
            color: 'bg-teal-50 text-teal-700 border-teal-200'
        },
        {
            id: 'mental-health',
            title: 'Mental Health',
            description: 'Stress and anxiety support',
            icon: <Brain size={20} />,
            color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }
    ];

    const emergencyActions = [
        {
            id: 'emergency',
            title: 'Emergency Help',
            description: 'Urgent medical guidance',
            icon: <AlertTriangle size={20} />,
            color: 'bg-red-50 text-red-700 border-red-200'
        },
        {
            id: 'find-doctor',
            title: 'Find Doctor',
            description: 'Locate healthcare providers',
            icon: <MapPin size={20} />,
            color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Zap size={20} className="mr-3 text-accent" />
                Quick Actions
            </h3>
            {/* Health Topics */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-left text-text-secondary mb-3">Health Topics</h4>
                <div className="grid grid-cols-2 gap-3">
                    {quickTopics?.map((topic) => (
                        <button
                            key={topic?.id}
                            onClick={() => onQuickAction(topic?.id, topic?.title)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-medical text-left ${topic?.color}
                                        cursor-pointer hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`}
                        >
                            <div className="flex items-start space-x-3">
                                {topic?.icon}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-md">{topic?.title}</p>
                                    <p className="text-xs opacity-75 mt-1">{topic?.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {/* Emergency Actions */}
            <div>
                <h4 className="text-sm font-medium text-left text-text-secondary mb-3">Emergency & Urgent</h4>
                <div className="space-y-3">
                    {emergencyActions?.map((action) => (
                        <button
                            key={action?.id}
                            onClick={() => onQuickAction(action?.id, action?.title)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-medical text-left ${action?.color}
                                        cursor-pointer hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`}
                        >
                            <div className="flex items-center space-x-3">
                                {action?.icon}
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{action?.title}</p>
                                    <p className="text-xs opacity-75">{action?.description}</p>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {/* Suggestion Chips */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-left text-text-secondary mb-3">Suggested Questions</h4>
                <div className="flex flex-wrap gap-2">
                    {[
                        "What are the symptoms of flu?",
                        "How to lower blood pressure?",
                        "Safe exercises for back pain?",
                        "When to see a doctor?"
                    ]?.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => onQuickAction('suggestion', suggestion)}
                            className="px-3 py-2 bg-muted text-text-secondary border border-gray-300 rounded-full text-xs hover:bg-accent hover:text-indigo-500 transition-colors
                                        cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickActions;