import { useState } from "react";
import { Mic, Volume2, CheckCircle2 } from "lucide-react";

const VoiceSetup = ({ onNext, onBack }) => {
    const [selectedVoice, setSelectedVoice] = useState("Arial");
    const [isPreviewing, setIsPreviewing] = useState(false);

    const handlePreview = () => {
        window.speechSynthesis.cancel();
        setIsPreviewing(true);

        const message = `Hello, I am ${selectedVoice}. I will be your assistant for MediHelp.`;
        const utterance = new SpeechSynthesisUtterance(message);

        // Kumuha ng lahat ng boses na available sa computer mo
        const voices = window.speechSynthesis.getVoices();

        if (selectedVoice === "Arial") {
            // Humanap ng boses na "Female" o may pangalang "Zira" o "Google US English"
            utterance.voice = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google US English"));
            utterance.pitch = 1.2; // Mas mataas ang tono
        } else {
            // Humanap ng boses na "Male" o may pangalang "David"
            utterance.voice = voices.find(v => v.name.includes("Male") || v.name.includes("David"));
            utterance.pitch = 0.8; // Mas malalim ang tono
        }

        utterance.onend = () => setIsPreviewing(false);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-8 text-center animate-fade-in flex flex-col items-center">
            {/* Animated Icon Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center border-2 border-primary/20">
                    <Mic size={32} strokeWidth={2.5} />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Voice <span className="text-primary">Assistant</span>
                </h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    MediHelp AI can read your health insights and process voice commands for a hands-free, accessible experience.
                </p>
            </div>

            {/* Voice Selection Grid */}
            <div className="w-full max-w-md space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left ml-1">
                    Select Assistant Voice
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {["Arial", "Marcus"].map((voice) => (
                        <button
                            key={voice}
                            onClick={() => setSelectedVoice(voice)}
                            className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                selectedVoice === voice
                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                            }`}
                        >
                            <div className={`p-2 rounded-full mb-2 ${
                                selectedVoice === voice ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                            }`}>
                                <Volume2 size={18} />
                            </div>
                            <span className={`font-bold text-sm ${
                                selectedVoice === voice ? "text-primary" : "text-gray-600"
                            }`}>
                                {voice}
                            </span>
                            {selectedVoice === voice && (
                                <CheckCircle2 className="absolute top-2 right-2 text-primary" size={16} />
                            )}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handlePreview}
                    className={`text-[11px] font-bold flex items-center justify-center w-full mt-4 transition-all cursor-pointer ${
                        isPreviewing ? "text-green-500" : "text-primary hover:underline"
                    }`}
                >
                    {isPreviewing ? (
                        <div className="flex items-center space-x-1">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce [animation-delay:0.2s]">●</span>
                            <span className="animate-bounce [animation-delay:0.4s]">●</span>
                            <span className="ml-2 uppercase tracking-tighter italic">Playing {selectedVoice}'s Preview...</span>
                        </div>
                    ) : (
                        `Preview ${selectedVoice}'s Voice`
                    )}
                </button>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md space-y-4">
                <div className="flex space-x-3">
                    <button 
                        onClick={onBack} 
                        className="flex-1 py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Back
                    </button>
                    <button 
                        onClick={onNext} 
                        className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95"
                    >
                        Enable Voice
                    </button>
                </div>
                <button 
                    onClick={onNext} 
                    className="text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors uppercase tracking-widest"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
};

export default VoiceSetup;