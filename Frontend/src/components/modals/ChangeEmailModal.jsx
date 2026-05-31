import React, { useState } from "react";
import { X, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import ToastMessage, { showToast } from "../ToastMessage";
import BackgroundLoadingState from "../BackgroundLoadingState";
import Button from "../ui/Button"; // Using your Button component

const ChangeEmailModal = ({ isOpen, onClose, currentEmail, onEmailUpdated }) => {
    const [newEmail, setNewEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newEmail === currentEmail) {
            showToast("Please enter a different email address.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.put("http://localhost:5000/api/change-email", {
                oldEmail: currentEmail,
                newEmail: newEmail
            });

            if (response.data.success) {
                showToast("OTP sent to your new email!", "success");
                
                // I-update agad ang local storage para sa verification process
                sessionStorage.setItem("email", newEmail); 
                
                // I-set ang bagong expiry sa localStorage para sa timer sa OTP.jsx
                const newExpiry = Date.now() + 60000;
                sessionStorage.setItem("otpExpiry", newExpiry);

                setTimeout(() => {
                    onEmailUpdated(newEmail); // Itatriget nito ang setTimeLeft(60) sa OTP.jsx
                    onClose();
                    setIsLoading(false);
                }, 1500);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to send code.", "error");
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden"
                    >
                        {/* Header Accent Line */}
                        <div className="h-1.5 w-full bg-primary/20" />

                        <div className="p-8">
                            {/* Icon & Title */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Mail className="text-primary" size={28} />
                                </div>
                                <h3 className="text-xl font-black text-foreground tracking-tight">
                                    Change Email Address
                                </h3>
                                <p className="text-[12px] text-foreground/50 mt-2 leading-relaxed">
                                    Replace your current email with a new one to receive your code.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* OLD EMAIL (Disabled/Read-only) */}
                                <div className="relative opacity-60">
                                    <input 
                                        type="email" 
                                        value={currentEmail} 
                                        readOnly 
                                        disabled
                                        className="w-full px-4 py-4 rounded-2xl border-2 border-border bg-background/30 font-bold text-foreground/50 text-[13px] cursor-not-allowed outline-none" 
                                    />
                                    <label className="absolute left-4 -top-2.5 bg-card px-2 text-foreground/30 font-black text-[9px] uppercase tracking-[0.2em]">
                                        Current Email
                                    </label>
                                </div>

                                {/* NEW EMAIL (Input) */}
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        value={newEmail} 
                                        onChange={(e) => setNewEmail(e.target.value)} 
                                        placeholder=" " 
                                        required 
                                        className="peer w-full px-4 py-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary outline-none transition-all font-bold text-foreground text-[13px]" 
                                    />
                                    <label className="absolute left-4 top-4 text-foreground/40 font-black text-[9px] uppercase tracking-[0.2em] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2.5 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-primary">
                                        New Email Address
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col-reverse sm:flex-row gap-3">
                                    <Button
                                        onClick={onClose}
                                        variant="ghost"
                                        type="bordered"
                                        disabled={isLoading}
                                        className="w-full py-4 border-none opacity-70 hover:opacity-100 text-[10px] font-black tracking-[0.2em] rounded-full uppercase"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        buttonType="submit"
                                        variant="primary"
                                        type="rounded"
                                        disabled={isLoading}
                                        className="w-full py-4 shadow-lg shadow-primary/10"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Update Email</span>
                                                <ArrowRight size={16} className="ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Close Icon */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-primary/10 rounded-full transition-colors cursor-pointer text-foreground/30 hover:text-primary"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ChangeEmailModal;