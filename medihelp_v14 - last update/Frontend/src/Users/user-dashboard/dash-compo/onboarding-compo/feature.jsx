import { BrainCircuit, BookOpen, Search, Sparkles } from "lucide-react";

const Features = ({ onNext, onBack }) => {
    const features = [
        { 
            id: 1, 
            icon: <BrainCircuit className="text-purple-500" />, 
            label: 'AI Medical Summarizer', 
            desc: 'Simplifying complex medical jargon into easy-to-understand information for everyone.' 
        },
        { 
            id: 2, 
            icon: <Search className="text-blue-500" />, 
            label: 'Verified Health Search', 
            desc: 'Access health information sourced from legitimate medical journals and peer-reviewed research.' 
        },
        { 
            id: 3, 
            icon: <Sparkles className="text-amber-500" />, 
            label: 'Personalized Insights', 
            desc: 'Our AI adjusts content depth based on your interests and medical knowledge level.' 
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 italic">
                    How <span className="text-primary">MediHelp AI</span> Works
                </h2>
                <p className="text-gray-500 mt-2">
                    Explore how MediHelp AI empowers you with accurate and accessible healthcare education.
                </p>
            </div>
            
            <div className="space-y-4">
                {features.map(f => (
                    <div key={f.id} className="flex items-start space-x-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm group hover:border-primary/30 transition-all">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                            {f.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">{f.label}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex space-x-3 pt-4">
                <button 
                    onClick={onBack} 
                    className="flex-1 py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                    Back
                </button>
                <button 
                    onClick={onNext} 
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer"
                >
                    I Understand
                </button>
            </div>
        </div>
    );
};

export default Features;