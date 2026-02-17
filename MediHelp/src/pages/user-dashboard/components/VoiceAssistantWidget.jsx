import { useState } from 'react';
import Icon from './Icon';
import Button from './Button';

const VoiceAssistantWidget = () => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-8 text-center mb-12">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-primary mb-4">Voice Health Assistant</h2>
                <p className="text-text-secondary mb-6">
                    Ask me about symptoms, medications, or general health questions. I provide guidance and information to help you make informed decisions.
                </p>

                {/* Microphone Button */}
                <div className="mb-6">
                    <button
                        onClick={toggleListening}
                        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                            isListening
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg animate-pulse'
                                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-lg shadow-md'
                        }`}
                        aria-label={isListening ? "Stop listening" : "Start voice assistant"}
                    >
                        <Icon 
                            name={isListening ? "MicOff" : "Mic"} 
                            size={40} 
                            color="white" 
                        />
                    </button>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                    {isListening ? "Listening... Speak your health question" : "Click the microphone to start speaking"}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Button variant="outline" className="text-sm">
                        <Icon name="Pill" size={16} className="mr-2" />
                        Medication Info
                    </Button>
                    <Button variant="outline" className="text-sm">
                        <Icon name="Thermometer" size={16} className="mr-2" />
                        Symptom Check
                    </Button>
                    <Button variant="outline" className="text-sm">
                        <Icon name="Heart" size={16} className="mr-2" />
                        Wellness Tips
                    </Button>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-5">
                    <div className="flex items-start space-x-3">
                        <Icon name="Shield" size={20} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                            <p className="text-sm text-yellow-800 font-medium mb-1">Important Disclaimer</p>
                            <p className="text-xs text-yellow-700">
                                MediHelp provides general health information and guidance only. This is not medical diagnosis or treatment. 
                                Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistantWidget;
