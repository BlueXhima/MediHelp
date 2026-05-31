import React from 'react';
import { Shield, Mic, MicOff, Database, Brain, Volume2, History, Trash2 } from 'lucide-react';

const PrivacySettings = ({ isEditing }) => {
    // Mga totoong privacy settings para sa isang Voice Assistant System
    const [settings, setSettings] = React.useState({
        saveVoiceHistory: true,       // Ise-save ba ang text chat/logs ng assistant
        storeAudioRecordings: false,  // Ise-save ba ang mismong audio file ng boses
        continuousListening: false,   // "Hey Assistant" wake-word detection
        allowAiPersonalization: true, // Pwede bang basahin ng AI ang medical tabs mo para sa contextual advice
    });

    const toggleSetting = (key) => {
        if (!isEditing) return; // Gagana lang kapag pinindot ang "Edit Profile" sa MyProfile.jsx
        setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
        }));
    };

    // Mock function para sa pagbura ng voice history (Napakahalaga sa mga Voice AI apps)
    const clearVoiceHistory = () => {
        if (!isEditing) return;
        alert("Voice interaction history and cached audio files have been cleared.");
    };

    return (
        <div className="space-y-6">
            {/* CARD 1: VOICE & AUDIO PRIVACY */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Mic className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Voice & Audio Privacy</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                    Manage how the healthcare voice assistant captures, processes, and stores your voice interactions.
                </p>

                <div className="space-y-4">
                    {/* Toggle 1: Save Voice History */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex gap-3">
                            <div className="p-2 bg-indigo-50 rounded-md text-indigo-600 h-10 w-10 flex items-center justify-center">
                                <History className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700 text-sm">Store Interaction History</p>
                                <p className="text-xs text-slate-500">Save text transcripts of your voice commands to review past health queries.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleSetting('saveVoiceHistory')}
                            disabled={!isEditing}
                            className={`w-11 h-6 rounded-full transition-colors relative ${settings.saveVoiceHistory ? 'bg-indigo-600' : 'bg-slate-300'} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        >
                            <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.saveVoiceHistory ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Toggle 2: Store Audio Recordings */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex gap-3">
                            <div className="p-2 bg-emerald-50 rounded-md text-emerald-600 h-10 w-10 flex items-center justify-center">
                                {settings.storeAudioRecordings ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-slate-700 text-sm">Store Actual Audio Recordings</p>
                                <p className="text-xs text-slate-500">Keep voice clips (.wav) to help train the voice model recognize your accent better.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleSetting('storeAudioRecordings')}
                            disabled={!isEditing}
                            className={`w-11 h-6 rounded-full transition-colors relative ${settings.storeAudioRecordings ? 'bg-indigo-600' : 'bg-slate-300'} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        >
                            <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.storeAudioRecordings ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Toggle 3: Hands-Free Wake Word */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex gap-3">
                            <div className="p-2 bg-orange-50 rounded-md text-orange-600 h-10 w-10 flex items-center justify-center">
                                <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700 text-sm">Hands-Free "Hey Assistant" Activation</p>
                                <p className="text-xs text-slate-500">Allow the app to continuously listen for the wake-word while open.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleSetting('continuousListening')}
                            disabled={!isEditing}
                            className={`w-11 h-6 rounded-full transition-colors relative ${settings.continuousListening ? 'bg-indigo-600' : 'bg-slate-300'} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                        >
                            <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.continuousListening ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CARD 2: AI & DATA INTEGRATION */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-800">AI Personalization</h3>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-slate-700 text-sm">Allow Assistant Contextual Access</p>
                        <p className="text-xs text-slate-500 max-w-xl">
                            Permit the voice assistant to analyze your Health Metrics and Medication tabs to give tailored health insights instead of generic web information.
                        </p>
                    </div>
                    <button 
                        onClick={() => toggleSetting('allowAiPersonalization')}
                        disabled={!isEditing}
                        className={`w-11 h-6 rounded-full transition-colors relative ${settings.allowAiPersonalization ? 'bg-indigo-600' : 'bg-slate-300'} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    >
                        <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.allowAiPersonalization ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* CARD 3: DATA DELETION (MANU-MANONG FUNCTION) */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm border-t-rose-100">
                <div className="flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-rose-600" />
                    <h3 className="font-semibold text-rose-800">Data Cleansing</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                    Wipe cached data and voice prints stored locally or in the session cloud.
                </p>
                <button
                    onClick={clearVoiceHistory}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Voice Command History
                </button>
            </div>
        </div>
    );
};

export default PrivacySettings;