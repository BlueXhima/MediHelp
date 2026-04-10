import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle, X } from 'lucide-react';

const LogoutModal = ({ onCancel, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear session storage
        onLogout(); // Call the passed onLogout function
        
        navigate("/landingpage"); // Redirect to landing page after logout
    };

    // Animation Variants para sa Framer Motion
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { 
            opacity: 0, 
            scale: 0.9, 
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {/* Main Backdrop Container */}
            <motion.div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
                onClick={onCancel} // Mag-close kapag kinlik ang labas
            >
                {/* Modal Card */}
                <motion.div 
                    className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 border border-border overflow-hidden"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()} // Pigilan ang close kapag kinlik ang loob
                >
                    {/* Background Decor (Aesthetic mula sa dashboard) */}
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

                    {/* Header: Icon + Title */}
                    <div className="flex justify-between items-center gap-6 mb-8">
                        <div className="flex items-center gap-3 text-left">
                            <div className="flex-shrink-0 p-4 rounded-2xl bg-red-100 dark:bg-red-500/15 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 shadow-inner-sm">
                                <LogOut size={28} strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                                    Account Sign Out
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Confirming your action
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onCancel} 
                            className="group p-2 rounded-xl border border-transparent 
                                    hover:border-border hover:bg-card hover:shadow-sm
                                    transition-all duration-200 text-muted-foreground 
                                    hover:text-primary active:scale-90 cursor-pointer"
                            title="Close Directory"
                        >
                            <X 
                                size={18} 
                                className="transition-transform duration-200 group-hover:rotate-90" 
                            />
                        </button>
                    </div>

                    {/* Main Description */}
                    <div className="bg-accent/50 border border-border rounded-2xl p-6 mb-10 flex gap-4 items-start">
                        <AlertTriangle className="w-10 h-10 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div className="text-left space-y-2">
                            <p className="text-base font-semibold text-foreground">
                                Are you sure you want to log out of MediHelp?
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                You will be signed out of your current session and redirected to the landing page. Any unsaved changes in your profile might be lost.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button
                            className="px-8 py-3.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-accent transition-all cursor-pointer w-full sm:w-auto"
                            onClick={onCancel}
                        >
                            Stay Logged In
                        </button>
                        <button
                            className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-500/20 cursor-pointer w-full sm:w-auto"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Yes, Sign Me Out
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogoutModal;