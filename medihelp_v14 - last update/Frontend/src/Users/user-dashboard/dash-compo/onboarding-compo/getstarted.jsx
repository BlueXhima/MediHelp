import { Stethoscope, ShieldCheck, ArrowRight, Info } from "lucide-react";

const GetStarted = ({ onNext }) => {
    return (
        <div className="space-y-12 animate-fade-in flex flex-col h-full justify-between py-8">
            <div className="flex flex-col items-center text-center space-y-6 flex-1 justify-center">
                <div className="bg-primary/10 p-4 rounded-3xl shadow-inner shadow-primary/5">
                    <Stethoscope className="text-primary" size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-gray-800 leading-tight tracking-tight">
                        Welcome to <span className="text-primary">MediHelp.</span>
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg max-w-md leading-relaxed mx-auto">
                        Your intelligent companion for seamless healthcare management and personalized wellness insights.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 w-full max-w-md">
                    <button 
                        onClick={onNext} 
                        className="flex items-center justify-center space-x-2.5 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <span>Get Started</span>
                        <ArrowRight size={19} />
                    </button>
                    <button 
                        className="flex items-center justify-center space-x-2 py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer active:scale-95"
                    >
                        <Info size={18} className="opacity-70" />
                        <span>Learn More</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="flex items-center space-x-3.5 py-3 px-6 rounded-full bg-slate-50 border border-slate-100/80 shadow-inner select-none">
                    <div className="flex-shrink-0">
                        <ShieldCheck className="text-green-500" size={22} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5 text-left">
                        <h4 className="font-bold text-slate-900 text-[13px] tracking-tight uppercase">
                            Privacy First
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                            Industry-standard encryption ensures your data remains secure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;