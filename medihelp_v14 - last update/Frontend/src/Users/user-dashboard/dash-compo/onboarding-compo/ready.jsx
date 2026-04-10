import { CheckCircle2 } from "lucide-react";

const Ready = ({ onBack, onClose }) => {
    return (
        <div className="space-y-8 text-center animate-fade-in">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <CheckCircle2 size={100} className="text-green-500 relative" />
                </div>
            </div>
            
            <div>
                <h2 className="text-3xl font-bold text-gray-800">You're all set!</h2>
                <p className="text-gray-500 mt-2">
                    Your profile is ready. You can now explore your personalized MediHelp dashboard.
                </p>
            </div>

            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-left">
                <h4 className="text-green-800 font-bold text-sm uppercase tracking-wider">Quick Tip</h4>
                <p className="text-green-700 text-sm mt-1">
                    You can always update your personal information and voice settings in the Health Profile section.
                </p>
            </div>

            <div className="flex space-x-3 pt-2">
                <button 
                    onClick={onBack} 
                    className="flex-1 py-4 border-2 border-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                    Review Settings
                </button>
                <button 
                    onClick={onClose} 
                    className="flex-[2] py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all transform hover:-translate-y-1 cursor-pointer"
                >
                    Take me to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Ready;