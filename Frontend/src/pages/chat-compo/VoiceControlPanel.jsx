// Frontend/src/pages/chat-compo/VoiceControlPanel.jsx

import { Square, Mic, RotateCcw, ClipboardList, Info, Lock, MicOff, AlertCircle } from 'lucide-react';

const VoiceControlPanel = ({ 
    isLoggedIn, isListening, toggleListening, isSupported, permissionDenied, remainingAttempts,
    voiceAttempts, MAX_VOICE_ATTEMPTS, handleClearConversation, setIsInfoOpen 
}) => {
    
    const isLocked = !isLoggedIn && voiceAttempts >= MAX_VOICE_ATTEMPTS;

    // Determine button state text and icon
    const getButtonState = () => {
        if (!isSupported) {
            return { icon: <MicOff size={24} />, label: 'Unsupported', color: 'muted' };
        }
        if (permissionDenied) {
            return { icon: <AlertCircle size={24} />, label: 'Blocked', color: 'muted' };
        }
        if (isLocked) {
            return { icon: <Lock size={24} />, label: 'Locked', color: 'muted' };
        }
        if (isListening) {
            return { icon: <Square size={24} className="fill-current" />, label: 'Stop', color: 'recording' };
        }
        return { icon: <Mic size={24} />, label: 'Tap to Talk', color: 'ready' };
    };

    const buttonState = getButtonState();

    const getButtonClasses = () => {
        const base = 'w-24 h-24 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-xl border cursor-pointer active:scale-95 disabled:cursor-not-allowed';
        
        if (!isSupported || permissionDenied || isLocked) {
            return `${base} bg-muted text-muted-foreground/40 border-border shadow-none opacity-50`;
        }
        if (isListening) {
            return `${base} bg-red-500 text-white border-red-400 shadow-red-500/20 animate-pulse`;
        }
        return `${base} bg-primary text-primary-foreground border-primary/20 shadow-primary/20 hover:brightness-110`;
    };

    const getWaveformDisplay = () => {
        if (!isSupported) {
            return (
                <div className="w-full text-center text-xs font-medium text-muted-foreground/40 italic tracking-wider">
                    [ Browser Not Supported ]
                </div>
            );
        }
        if (permissionDenied) {
            return (
                <div className="w-full text-center text-xs font-medium text-red-500/60 italic tracking-wider">
                    [ Mic Permission Denied ]
                </div>
            );
        }
        if (isLocked) {
            return (
                <div className="w-full text-center text-xs font-medium text-muted-foreground/40 italic tracking-wider">
                    [ Audio Input Engine Suspended ]
                </div>
            );
        }
        if (isListening) {
            return Array.from({ length: 15 }).map((_, i) => (
                <div 
                    key={i}
                    className="w-1 bg-primary rounded-full animate-wave-dots"
                    style={{ animationDelay: `${i * 0.08}s`, height: '12px' }}
                />
            ));
        }
        return (
            <div className="w-full text-center text-xs font-medium text-muted-foreground/40 italic tracking-wider">
                Sound Engine Standby
            </div>
        );
    };

    return (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border p-6 lg:p-8 flex flex-col justify-between items-center bg-card/40 backdrop-blur-sm shrink-0">
            {/* Context Widget Top Title Header */}
            <div className="w-full text-center hidden lg:block">
                <h3 className="text-lg font-black tracking-wider text-foreground uppercase">Voice Control Center</h3>
                {isLoggedIn ? (
                    <p className="text-[10px] text-success font-black uppercase mt-1 tracking-widest">Unlimited Member System</p>
                ) : (
                    <p className="text-[10px] text-amber-500 font-black uppercase mt-1 tracking-widest">
                        Trial Account: {Math.max(0, remainingAttempts - voiceAttempts)} Left
                    </p>
                )}
            </div>

            {/* Premium Sound Waveform Visualization Matrix */}
            <div className="w-full max-w-xs h-20 lg:h-32 flex items-center justify-center space-x-1.5 my-4 lg:my-0">
                {getWaveformDisplay()}
            </div>

            {/* Core Action Command Console Module */}
            <div className="w-full flex flex-col items-center gap-6">
                
                {/* Central Microphone Triggers */}
                <div className="relative flex items-center justify-center">
                    
                    {/* Pulsing Outer Glow ring layers — only when listening */}
                    {isListening && isSupported && !permissionDenied && !isLocked && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-125" />
                            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse scale-150" />
                        </>
                    )}

                    <button 
                        onClick={toggleListening}
                        disabled={!isSupported || permissionDenied || isLocked}
                        className={getButtonClasses()}
                        title={
                            !isSupported ? "Your browser does not support speech recognition" :
                            permissionDenied ? "Microphone access blocked. Check browser settings." :
                            isLocked ? "Voice limit reached" :
                            isListening ? "Stop listening" : "Tap to start voice input"
                        }
                    >
                        {buttonState.icon}
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isListening ? 'animate-pulse' : ''}`}>
                            {buttonState.label}
                        </span>
                    </button>
                </div>

                {/* Status message below mic */}
                {!isSupported && (
                    <p className="text-[10px] text-muted-foreground/60 text-center max-w-[200px]">
                        Please use Chrome, Edge, or Safari for voice features.
                    </p>
                )}
                {permissionDenied && (
                    <p className="text-[10px] text-red-500/70 text-center max-w-[200px]">
                        Allow microphone access in your browser settings to use voice input.
                    </p>
                )}

                {/* Sub-Actions Footer Nodes layout */}
                <div className="w-full grid grid-cols-3 gap-2 border-t border-border/60 pt-6">
                    <button 
                        onClick={handleClearConversation}
                        className="group flex flex-col items-center gap-1.5 transition-all active:scale-90 cursor-pointer"
                    >
                        <div className="p-3 rounded-xl bg-muted/50 border border-border/50 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all duration-300">
                            <RotateCcw size={16} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70 group-hover:text-red-500 transition-colors">Reset</span>
                    </button>

                    {isLoggedIn ? (
                        <button className="group flex flex-col items-center gap-1.5 transition-all active:scale-90 cursor-pointer">
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                                <ClipboardList size={16} className="text-primary" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary/80 group-hover:text-primary transition-colors">Save</span>
                        </button>
                    ) : (
                        <div className="group flex flex-col items-center gap-1.5 opacity-30 cursor-not-allowed">
                            <div className="p-3 rounded-xl bg-muted border border-border">
                                <Lock size={16} className="text-muted-foreground" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Save</span>
                        </div>
                    )}

                    <button 
                        onClick={() => setIsInfoOpen(true)} 
                        className="group flex flex-col items-center gap-1.5 transition-all active:scale-90 cursor-pointer"
                    >
                        <div className="p-3 rounded-xl bg-muted/50 border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                            <Info size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70 group-hover:text-primary transition-colors">Info</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceControlPanel;
