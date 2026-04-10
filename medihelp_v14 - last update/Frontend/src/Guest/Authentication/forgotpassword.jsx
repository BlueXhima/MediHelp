import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ToastMessage, { showToast } from "../../components/ToastMessage";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("email");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

    return (
        <>
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-background overflow-hidden text-left">
                
                {/* --- LEFT SIDE: Sticky Branding (Consistent with Register/OTP) --- */}
                <div className="relative hidden md:flex w-full h-full bg-[#0f172a] overflow-hidden items-center justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:-translate-x-1 transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={18} className="group-hover:text-primary transition-colors" />
                        Back to Login
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-[#4c1d95]"></div>
                    <div 
                        className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }}
                    ></div>

                    <div className="relative z-10 px-12 py-10 mx-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in text-left">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 text-white">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight">Recovery</h2>
                        </div>
                        <div className="max-w-md space-y-6">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                Protect Your <br/>
                                <span className="text-primary-foreground drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">Account.</span>
                            </h1>
                            <p className="text-lg text-slate-300/80 leading-relaxed">
                                Don't worry, it happens to the best of us. Let's get you back into your medical dashboard securely.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Reset Form --- */}
                <div className="flex flex-col w-full h-full bg-slate-50/40 backdrop-blur-md overflow-y-auto">
                    <div className="w-full max-w-lg mx-auto px-8 md:px-16 pt-24 pb-16 animate-fade-in">
                        
                        {step === "success" ? (
                            <div className="text-center space-y-6 py-10 animate-pop-up">
                                <div className="flex justify-center">
                                    <div className="p-6 bg-green-100 rounded-full text-green-600 animate-bounce">
                                        <CheckCircle2 size={64} />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black text-foreground">Success!</h2>
                                <p className="text-foreground/60 font-medium">
                                    Your password has been updated. Redirecting you to login...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <h2 className="text-4xl font-black text-foreground tracking-tight">
                                        {step === "email" ? "Forgot Password?" : "Reset Password"}
                                    </h2>
                                    <p className="mt-3 text-foreground/60 font-medium italic">
                                        {step === "email" 
                                            ? "Enter your email to receive recovery instructions." 
                                            : "Create a strong password to protect your records."}
                                    </p>
                                </div>

                                <form onSubmit={handleForgotPassword} className="space-y-6">
                                    {step === "email" ? (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Enter your email"
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input
                                                        type="password"
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input
                                                        type="password"
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <span>{step === "email" ? "Send Reset Link" : "Update Password"}</span>
                                        {!isLoading && <ArrowRight size={18} />}
                                    </button>

                                    <div className="pt-6 text-center">
                                        <p className="text-sm font-bold text-foreground/60">
                                            Suddenly remembered? 
                                            <button 
                                                type="button"
                                                onClick={() => navigate('/login')}
                                                className="ml-2 text-primary hover:underline underline-offset-4"
                                            >
                                                Back to Login
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;