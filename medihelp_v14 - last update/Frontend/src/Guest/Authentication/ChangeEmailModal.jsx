import React, { useState } from "react";
import { X, Mail, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";

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
            // Dito na mismo ang API call para sa change-email
            const response = await axios.put("http://localhost:5000/api/change-email", {
                oldEmail: currentEmail,
                newEmail: newEmail
            });

            if (response.data.success) {
                showToast("Email updated! We've sent a new code to your inbox.", "success");

                // Huwag munang tawagin ang onEmailUpdated agad-agad
                // Maghintay ng 2 seconds para makita ang Success Toast sa loob ng Modal
                setTimeout(() => {
                    onEmailUpdated(newEmail); 
                    onClose();
                    setIsLoading(false);
                }, 2000);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to update email.", "error");
            setIsLoading(false);
        }
    };

    return (
        <>
            <BackgroundLoadingState isLoading={isLoading} message="Updating email..." />
            <ToastMessage />

            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>
                <div className="relative w-full max-w-md bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-scale-in">
                    <div className="p-8 md:p-10">
                        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors">
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                <Mail size={24} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-black text-foreground tracking-tight">Change Email</h2>
                            <p className="text-[12px] text-slate-500 font-medium mt-2">Update your address to receive a new code.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Current Email</label>
                                <div className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-400 font-semibold text-[13px] italic">
                                    {currentEmail}
                                </div>
                            </div>

                            <div className="relative group">
                                <input 
                                    type="email" 
                                    value={newEmail} 
                                    onChange={(e) => setNewEmail(e.target.value)} 
                                    placeholder=" " 
                                    required 
                                    className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]" 
                                />
                                <label className="absolute left-4 top-3.5 text-slate-400 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-primary">
                                    NEW EMAIL ADDRESS
                                </label>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><span>Update & Resend OTP</span><ArrowRight size={14} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangeEmailModal;