import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, CheckCircle2, LifeBuoy, Eye, EyeOff, KeyRound } from 'lucide-react';
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ToastMessage, { showToast } from "../../components/ToastMessage";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("email");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (step === "email") {
            // Simulate API Call for Email Verification
            setTimeout(() => {
                showToast("Verification link sent to your email!", "success");
                setStep("reset");
                setIsLoading(false);
            }, 1500);
        } else if (step === "reset") {
            if (newPassword !== confirmPassword) {
                showToast("Passwords do not match!", "error");
                setIsLoading(false);
                return;
            }
            // Simulate API Call for Password Update
            setTimeout(() => {
                showToast("Password updated successfully!", "success");
                setStep("success");
                setIsLoading(false);
                setTimeout(() => navigate('/login'), 3000);
            }, 1500);
        }
    };

    const toggleVisibility = (field) => {
        if (field === 'new') {
            setShowNewPassword(prev => !prev);
        } else if (field === 'confirm') {
            setShowConfirmPassword(prev => !prev);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans selection:bg-primary/10 relative">
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            {/* Back Button - Top Left */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[450px] bg-card rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-border overflow-hidden animate-fade-in transition-all duration-500">
                <div className="p-10 md:p-12">
                    {step === "success" ? (
                        /* Success State View */
                        <div className="text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 border border-green-100">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">Check your Inbox</h2>
                            <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                                We've sent a recovery link to <span className="font-bold foreground underline">{email}</span>. 
                                Please check your email to continue.
                            </p>
                        </div>
                    ) : step === "reset" ? (
                        /* 2. RESET STATE (New Password Fields) - ITO ANG WALA SA CODE MO */
                        <form onSubmit={handleForgotPassword} className="animate-fade-in">
                            <div className="text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 border border-green-100">
                                    <KeyRound size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">Create New Password</h2>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 px-4">
                                    Set a secure password for your account linked to <span className="font-bold text-foreground underline">{email}</span>. 
                                    Make sure it's something you haven't used before.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newpass" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder=" " 
                                        required
                                        className="peer w-full pl-12 pr-12 py-4 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-slate-400 text-[13px]" 
                                    />
                                    <label 
                                        htmlFor="newpass"
                                        className="absolute left-11 top-4 text-slate-400 font-bold text-[11px] transition-all pointer-events-none 
                                        bg-card px-2 py-1
                                        peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black
                                        peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                    >
                                        New Password
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => toggleVisibility('new')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors p-2"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {/* Confirm Password Input */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}  
                                        id="conpass"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder=" "
                                        className="peer w-full pl-12 pr-12 py-4 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-slate-400 text-[13px]"                                
                                    />
                                    <label 
                                        htmlFor="conpass"
                                        className="absolute left-11 top-4 text-slate-400 font-bold text-[11px] transition-all pointer-events-none 
                                        bg-card px-2 py-1
                                        peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black
                                        peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                    >
                                        Confirm Password
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => toggleVisibility('confirm')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors p-2"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-[0.15em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer shadow-slate-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Email Input State */
                        <form onSubmit={handleForgotPassword}>
                            {/* Header */}
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                    <Mail size={28} className="text-primary" />
                                </div>
                                <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">Reset your password</h1>
                                <p className="text-[13px] text-slate-400 font-medium leading-relaxed px-2">
                                    Please enter your email address. We will send a recovery link to help you regain access to your account.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Email Field - Floating Label */}
                                <div className="relative group">
                                    {/* Mail Icon */}
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                        <Mail size={18} />
                                    </div>

                                    <input 
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@gmail.com"
                                        required
                                        className="peer w-full pl-12 pr-5 py-4 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-slate-400 text-[13px] 
                                                placeholder:text-transparent focus:placeholder-slate-400" 
                                    />

                                    {/* Floating Label */}
                                    <label 
                                        htmlFor="email"
                                        className="absolute left-11 top-4 text-slate-400 font-bold text-[11px] transition-all pointer-events-none 
                                        bg-card px-3 py-1
                                        peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black
                                        peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                    >
                                        EMAIL ADDRESS
                                    </label>
                                </div>

                                {/* Action Button */}
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-[0.15em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer shadow-slate-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    <span>{isLoading ? "Sending Link..." : "Send Reset Link"}</span>
                                    {!isLoading && <ArrowRight size={16} />}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Assistance Section - Outside of Card */}
            <div className="mt-8 max-w-[400px] w-full animate-fade-in delay-200">
                <div className="bg-indigo-100 border border-indigo-700 rounded-2xl p-5 flex gap-4 items-start">
                    {/* Icon Side */}
                    <div className="w-10 h-10 bg-indigo-200 rounded-xl flex items-center justify-center shadow-sm border border-indigo-400 shrink-0 text-amber-600">
                        <LifeBuoy size={20} />
                    </div>

                    {/* Text Side */}
                    <div className="space-y-1 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600">
                            Need immediate assistance?
                        </h3>
                        <p className="text-[12px] text-indigo-400 font-medium leading-relaxed">
                            If you've lost access to your email or are having trouble, contact our 
                            <button className="text-black dark:text-indigo-600 hover:text-primary font-black hover:underline ml-2 mr-2 cursor-pointer">
                                Support Team
                            </button> available 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;