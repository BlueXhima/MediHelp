// Frontend/src/pages/chat-compo/ChatHeader.jsx

import React from 'react';
import { ChevronLeft, ShieldCheck, RotateCcw, Info } from 'lucide-react';

const ChatHeader = ({ 
    navigate, 
    isLoggedIn, 
    MAX_GUEST_ATTEMPTS, 
    guestAttempts,
    handleClearConversation,
    setIsInfoOpen 
}) => {
    const remainingAttempts = Math.max(0, MAX_GUEST_ATTEMPTS - guestAttempts);

    return (
        <div className="h-16 flex justify-between items-center px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-md shrink-0 sticky top-0 z-10">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm transition-all group cursor-pointer"
            >
                <ChevronLeft size={18} /> 
                <span className="hidden sm:inline">Back</span>
            </button>
            
            {/* Status at Actions Container */}
            <div className="flex items-center gap-3">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isLoggedIn ? 'border-primary bg-primary/10' : 'border-amber-500/30 bg-amber-500/5'}`}>
                    {isLoggedIn ? (
                        <>
                            <ShieldCheck size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider hidden sm:inline">Unlimited Member Access</span>
                        </>
                    ) : (
                        <span className="text-[10px] font-black tracking-wider text-amber-500 uppercase">
                            {remainingAttempts} / {MAX_GUEST_ATTEMPTS} <span className="sm:inline">FREE ATTEMPTS LEFT</span>
                        </span>
                    )}
                </div>

                {/* Mobile Actions (Visible lang sa mobile) */}
                <div className="flex items-center gap-2 md:hidden">
                    <button onClick={handleClearConversation} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                        <RotateCcw size={18} />
                    </button>
                    <button onClick={() => setIsInfoOpen(true)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Info size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;