import { useState } from "react";
import { ShieldAlert, Trash2, Fingerprint, EyeOff } from "lucide-react";

const PrivacySettings = () => {
    const [dataSharing, setDataSharing] = useState(true);
    const [voiceDataRetention, setVoiceDataRetention] = useState(true);
    const [personalizedAds, setPersonalizedAds] = useState(true);
    const [incognitoMode, setIncognitoMode] = useState(false);

    return (
        <div className="space-y-8 text-left max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">Privacy & Security</h2>
                <p className="text-sm text-gray-500">
                    Control how your health data is handled and secured.
                </p>
            </div>

            <div className="space-y-4">
                {/* --- DATA USAGE SECTION --- */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Usage</h3>
                
                <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                    <div className="flex gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg h-fit"><EyeOff size={18} className="text-blue-600"/></div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Incognito Consultation</h4>
                            <p className="text-xs text-gray-500">Don't save chat history for this session.</p>
                        </div>
                    </div>
                    <button onClick={() => setIncognitoMode(!incognitoMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${incognitoMode ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${incognitoMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* --- SECURITY SECTION --- */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</h3>
                
                <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                    <div className="flex gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg h-fit"><Fingerprint size={18} className="text-purple-600"/></div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Biometric Authentication</h4>
                            <p className="text-xs text-gray-500">Use FaceID or Fingerprint to view history.</p>
                        </div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                </div>

                {/* --- DANGER ZONE --- */}
                <div className="mt-10 p-4 border border-red-100 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert size={18} className="text-red-600" />
                        <h4 className="font-bold text-red-700 text-sm">Danger Zone</h4>
                    </div>
                    <p className="text-xs text-red-600 mb-4 leading-relaxed">
                        Deleting your data is permanent. This will remove all chat history, voice logs, and personalized health recommendations.
                    </p>
                    <button 
                        onClick={() => {if(window.confirm("Delete all data?")) alert("Data Wiped")}}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={14} /> Wipe All Medical Records
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrivacySettings;