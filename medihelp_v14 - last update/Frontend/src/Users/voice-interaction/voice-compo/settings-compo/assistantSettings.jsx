import { useState } from "react";
import { Play, Turtle, Rabbit, MessageSquareText, Mic } from "lucide-react";

const AssistantSettings = () => {
    const [voice, setVoice] = useState("Aria");
    const [speechRate, setSpeechRate] = useState(1.0);
    const [notifications, setNotifications] = useState(true);
    const [voiceAlerts, setVoiceAlerts] = useState(false);
    const [micLevel, setMicLevel] = useState(0.5);

    const segments = 8;
    const activeSegments = Math.round(micLevel * segments);
    const [verbosity, setVerbosity] = useState("detailed");

    const handleTestSpeed = () => {
        // Web Speech API logic
        const utterance = new SpeechSynthesisUtterance("Testing voice speed at " + speechRate + "x");
        utterance.rate = speechRate; // Dito gagamitin yung slider value
        utterance.pitch = 1;
        window.speechSynthesis.cancel(); // I-stop muna kung may nagsasalita pa
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-8 text-left max-w-2xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-semibold">Assistant Settings</h2>
                <p className="text-gray-600">
                    Refine your interaction experience.
                </p>
            </div>

            {/* Voice Profile */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-2">VOICE PROFILE</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setVoice("Aria")}
                        className={`p-4 border rounded-md text-left cursor-pointer ${
                        voice === "Aria" ? "border-2 border-blue-500" : "bg-gray-50"
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Aria</h3>
                        <p className="text-sm text-gray-600">
                            Calm, articulate, and empathetic tone.
                        </p>
                    </button>

                    <button
                        onClick={() => setVoice("Marcus")}
                        className={`p-4 border rounded-md text-left cursor-pointer ${
                        voice === "Marcus" ? "border-2 border-blue-500" : "bg-gray-50"
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Marcus</h3>
                        <p className="text-sm text-gray-600">
                            Deep, steady, and authoritative voice.
                        </p>
                    </button>
                </div>
            </div>

            {/* Speech Rate */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="block text-sm text-gray-700 font-medium">SPEECH RATE</label>
                        <p className="text-[11px] text-gray-500 mt-0.5">Adjust how fast the assistant speaks</p>
                    </div>
                    
                    {/* Modern Test Button - No Alert */}
                    <button 
                        onClick={handleTestSpeed}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full 
                        text-xs font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 
                        shadow-sm cursor-pointer"
                    >
                        <Play size={12} fill="currentColor" /> Play Sample
                    </button>
                </div>

                <div className="relative px-2">
                    <div className="flex items-center gap-5">
                        <Turtle size={20} className={`${speechRate < 1 ? 'text-blue-500' : 'text-gray-300'} transition-colors`} />
                        
                        <div className="relative flex-1 flex items-center">
                            {/* Custom Styled Slider */}
                            <input 
                                type="range" 
                                min="0.5" max="2.0" step="0.1"
                                value={speechRate}
                                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer 
                                        accent-blue-600 hover:accent-blue-700 transition-all"
                                style={{
                                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(speechRate-0.5)/1.5 * 100}%, #f3f4f6 ${(speechRate-0.5)/1.5 * 100}%, #f3f4f6 100%)`
                                }}
                            />
                        </div>
                        <Rabbit size={20} className={`${speechRate > 1.5 ? 'text-blue-500' : 'text-gray-300'} transition-colors`} />
                    </div>
                    {/* Dynamic Badge */}
                    <div className="mt-4 flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                            speechRate === 1.0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                            {speechRate === 1.0 ? 'Normal Speed' : `${speechRate}x Pace`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Microphone Sensitivity */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-2">MICROPHONE SENSITIVITY</label>
                <div className="p-6 rounded-lg bg-blue-50">
                    {/* Top row: icon + segmented bar */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Mic className="text-gray-700" size={24} />
                        <div className="flex gap-1">
                        {Array.from({ length: segments }).map((_, i) => (
                            <div
                            key={i}
                            className={`h-2 w-10 rounded-sm ${
                                i < activeSegments ? "bg-blue-700" : "bg-blue-200"
                            }`}
                            />
                        ))}
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={micLevel}
                            onChange={(e) => setMicLevel(parseFloat(e.target.value))}
                            className="w-full accent-blue-600 cursor-grabbing"
                        />
                    </div>

                    {/* Bottom labels */}
                    <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">Low</span>
                        <span className="text-sm text-gray-500">High</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-700 font-medium mb-2">AI RESPONSE DEPTH</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setVerbosity("concise")}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${verbosity === 'concise' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <span className={`text-lg font-bold ${verbosity === 'concise' ? 'text-blue-700' : 'text-gray-700'}`}>Concise</span>
                        <span className="text-[12px] text-gray-500 mt-1">Short & direct answers</span>
                    </button>
                    <button 
                        onClick={() => setVerbosity("detailed")}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${verbosity === 'detailed' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <span className={`text-lg font-bold ${verbosity === 'detailed' ? 'text-blue-700' : 'text-gray-700'}`}>Detailed</span>
                        <span className="text-[12px] text-gray-500 mt-1">Full medical explanations</span>
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-4">NOTIFICATIONS</label>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                            <h4 className="font-medium">Save Conversation History</h4>
                            <p className="text-sm text-gray-600">
                                Keep a record of your health dialogues.
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications ? "translate-x-6" : "translate-x-1"
                            }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                            <h4 className="font-medium">Improve Assistant</h4>
                            <p className="text-sm text-gray-600">
                                Help us improve the assistant by sharing your conversations.
                            </p>
                        </div>
                        <button
                            onClick={() => setVoiceAlerts(!voiceAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                voiceAlerts ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                voiceAlerts ? "translate-x-6" : "translate-x-1"
                            }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning Section */}
            <div className="mt-6 border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-md">
                <h4 className="font-semibold text-yellow-700">⚠ Important Notice</h4>
                <p className="text-sm text-gray-700 mt-1">
                    Some settings may affect how your assistant interacts with you and how your
                    data is stored. Adjust these options carefully to balance personalization
                    with privacy.
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/80"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default AssistantSettings;