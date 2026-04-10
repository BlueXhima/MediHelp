import React from 'react';
import { FileSearch, ArrowLeft, Home, Search, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';

const ArticleNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* BACKGROUND DECORATION */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* ICON WITH FLOATING ANIMATION */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transform transition-transform duration-500 group-hover:-translate-y-2">
                            <FileSearch size={80} className="text-primary stroke-[1.5]" />
                            
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                <AlertCircle size={10} /> 404
                            </div>
                        </div>
                    </div>

                    {/* TEXT WITH BETTER TYPOGRAPHY */}
                    <div className="text-center space-y-3 mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Content in Progress
                        </h2>
                        <p className="text-slate-500 max-w-[400px] text-sm md:text-base leading-relaxed mx-auto">
                            Don't worry! Our <span className="text-primary font-bold">MediHelp Editors</span> are currently finalizing the information for this topic. 
                        </p>
                    </div>

                    {/* REFINED BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none">
                        <button 
                            onClick={() => navigate(-1)}
                            className="group flex items-center cursor-pointer justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                        
                        <button 
                            onClick={() => navigate('/library')}
                            className="group flex items-center cursor-pointer justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:border-primary/20 hover:text-primary active:scale-95 transition-all shadow-sm"
                        >
                            <Home size={18} />
                            Return Home
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ArticleNotFound;