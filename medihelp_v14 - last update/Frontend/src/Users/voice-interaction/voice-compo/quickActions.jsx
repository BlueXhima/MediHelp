import React from 'react';
import { motion } from 'framer-motion'; // Siguraduhin na installed ito
import { 
    Stethoscope, Pill, Heart, Apple, Dumbbell, Brain, AlertTriangle, 
    MapPin, ChevronRight, Zap, Shield, Baby, PhoneCall, Navigation 
} from 'lucide-react';

const QuickActions = ({ onQuickAction }) => {
    const quickTopics = [
        {
            id: 'general',
            title: 'General Health',
            description: 'Common health tips and FAQs',
            icon: <MapPin size={24} />,
            color: 'from-slate-500/20 to-slate-600/20',
            iconColor: 'text-slate-600',
            borderColor: 'hover:border-slate-300'
        },
        {
            id: 'symptoms',
            title: 'Symptom Checker',
            description: 'AI-powered diagnostic assistance',
            icon: <Stethoscope size={24} />,
            color: 'from-blue-500/20 to-blue-600/20',
            iconColor: 'text-blue-600',
            borderColor: 'hover:border-blue-300'
        },
        {
            id: 'medications',
            title: 'Medication Info',
            description: 'Dosage and interaction guides',
            icon: <Pill size={24} />,
            color: 'from-emerald-500/20 to-emerald-600/20',
            iconColor: 'text-emerald-600',
            borderColor: 'hover:border-emerald-300'
        },
        {
            id: 'nutrition',
            title: 'Nutrition Guide',
            description: 'Dietary plans and food facts',
            icon: <Apple size={24} />,
            color: 'from-amber-500/20 to-amber-600/20',
            iconColor: 'text-amber-600',
            borderColor: 'hover:border-amber-300'
        },
        {
            id: 'exercises',
            title: 'Exercise',
            description: 'Personalized workout routines',
            icon: <Dumbbell size={24} />,
            color: 'from-lime-500/20 to-lime-600/20',
            iconColor: 'text-lime-600',
            borderColor: 'hover:border-lime-300'
        },
        {
            id: 'mental-health',
            title: 'Mental Health',
            description: 'Stress relief and mindfulness tips',
            icon: <Brain size={24} />,
            color: 'from-indigo-500/20 to-indigo-600/20',
            iconColor: 'text-indigo-600',
            borderColor: 'hover:border-indigo-300'
        },
        {
            id: 'chronic',
            title: 'Chronic Conditions',
            description: 'Management strategies and advice',
            icon: <Heart size={24} />,
            color: 'from-rose-500/20 to-rose-600/20',
            iconColor: 'text-rose-600',
            borderColor: 'hover:border-rose-300'
        },
        {
            id: 'preventive',
            title: 'Preventive Care',
            description: 'Vaccination and screening info',
            icon: <Shield size={24} />,
            color: 'from-cyan-500/20 to-cyan-600/20',
            iconColor: 'text-cyan-600',
            borderColor: 'hover:border-cyan-300'
        },
        {
            id: 'emergency',
            title: 'Emergency Care',
            description: 'Immediate first aid instructions',
            icon: <AlertTriangle size={24} />,
            color: 'from-red-500/20 to-red-600/20',
            iconColor: 'text-red-600',
            borderColor: 'hover:border-red-300'
        },
        {
            id: 'pediatric',
            title: 'Pediatric',
            description: 'Child health and development tips',
            icon: <Baby size={24} />,
            color: 'from-fuchsia-500/20 to-fuchsia-600/20',
            iconColor: 'text-fuchsia-600',
            borderColor: 'hover:border-fuchsia-300'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 text-left">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Zap size={20} className="text-indigo-600 fill-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Quick Health Actions</h3>
                </div>
                <p className="text-gray-500 text-sm ml-11">Choose a category to start your medical consultation.</p>
            </div>

            {/* Topics Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
            >
                {quickTopics.map((topic) => (
                    <motion.button
                        key={topic.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, translateY: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onQuickAction(topic.id, topic.title)}
                        className={`group relative flex items-center gap-5 p-5 rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all duration-300 ${topic.borderColor} hover:shadow-md text-left`}
                    >
                        {/* Icon Container with Gradient Background */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center transition-transform group-hover:rotate-6`}>
                            <div className={`${topic.iconColor}`}>
                                {topic.icon}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-grow">
                            <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                {topic.title}
                            </h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {topic.description}
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-indigo-500">
                            <ChevronRight size={20} />
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Emergency & Urgent Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Emergency & Urgent</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onQuickAction('emergency', 'Emergency Help')}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors text-left group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
                            <PhoneCall size={24} />
                        </div>
                        <div>
                            <span className="block font-bold text-red-700">Emergency Help</span>
                            <span className="text-xs text-red-600/80 uppercase font-medium">Immediate First Aid</span>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onQuickAction('nearby-hospital', 'Nearby Hospital')}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors text-left group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <Navigation size={24} />
                        </div>
                        <div>
                            <span className="block font-bold text-orange-700">Nearby Hospital</span>
                            <span className="text-xs text-orange-600/80 uppercase font-medium">Locate Medical Facilities</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Suggestion Chips Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                    <Brain size={18} className="text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Suggested Questions</h4>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {[
                        "What are the symptoms of flu?",
                        "How to lower blood pressure?",
                        "Safe exercises for back pain?",
                        "When to see a doctor?"
                    ].map((suggestion, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05, backgroundColor: '#EEF2FF' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onQuickAction('suggestion', suggestion)}
                            className="px-5 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-sm font-medium hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickActions;