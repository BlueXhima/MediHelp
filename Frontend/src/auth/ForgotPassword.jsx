import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck, CheckCircle2, LifeBuoy, Eye, EyeOff, KeyRound } from 'lucide-react';
import BackgroundLoadingState from "../components/BackgroundLoadingState";
import { showToast } from "../components/ToastMessage";
import MediHelpLogo from "/MediHelpLogo.png"; // Sinunod ang logo pattern sa Login
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import axios from 'axios';

const ForgotPassword = () => {
    useDocumentTitle("Forgot Password");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("email");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (urlToken && urlEmail) {
            setEmail(urlEmail);
            setStep("reset");
        }
    }, [urlToken, urlEmail]);

    useEffect(() => {
        const bc = new BroadcastChannel('password_reset_channel');
        
        bc.onmessage = (event) => {
            // TANGGALIN: navigate('/login') agad.
            // DAGDAGAN: I-check kung ang tab na ito ay nasa "success" step (yung naghihintay sa email)
            // o kaya ay hindi ang "reset" step.
            if (event.data === 'finished' && step !== "reset") {
                navigate('/login');
            }
        };

        return () => bc.close();
    }, [navigate, step]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (step === "email") {
                const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
                if (response.data.success) {
                    showToast("Verification link sent to your email!", "success");
                    setStep("success");
                }
            } 
            else if (step === "reset") {
                if (newPassword !== confirmPassword) {
                    showToast("Passwords do not match!", "error");
                    setIsLoading(false);
                    return;
                }

                const response = await axios.post("http://localhost:5000/api/reset-password", {
                    email,
                    token: urlToken,
                    newPassword
                });

                if (response.data.success) {
                    showToast("Password updated successfully!", "success");

                    // Sabihan ang ibang tabs na mag-redirect na
                    const bc = new BroadcastChannel('password_reset_channel');
                    bc.postMessage('finished');
                    bc.close(); // Isara agad ang channel pagkapadala

                    // Hayaan ang user na makita ang toast bago mag-redirect ang tab na ito
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Something went wrong. Please try again.";
            showToast(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const evaluatePasswordStrength = (password) => {
        if (password.length === 0) return "None";
        if (password.length < 8) return "Weak";
        
        const hasNumbers = /\d/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (hasNumbers && hasLowercase && hasUppercase && hasSpecialChar) return "Strong";
        if ((hasNumbers && hasLowercase) || (hasLowercase && hasUppercase)) return "Medium";
        return "Weak";
    };

    const [passwordStrength, setPasswordStrength] = useState("");

    // Handler para sa pagbabago ng password
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setNewPassword(val);
        setPasswordStrength(evaluatePasswordStrength(val));
    };

    const toggleVisibility = (field) => {
        if (field === 'new') setShowNewPassword(prev => !prev);
        else if (field === 'confirm') setShowConfirmPassword(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/20 relative">
            <BackgroundLoadingState isLoading={isLoading} />
            {/* <ToastMessage /> */}

            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-6 left-6 md:fixed md:top-8 md:left-8 flex items-center gap-2 text-foreground/60 hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[420px] bg-card rounded-[2.5rem] shadow-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-6 md:p-8">
                    
                    {/* Header: Dynamic based on step */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <img src={MediHelpLogo} alt="Logo" className="w-16 h-auto mb-4 animate-pulse-subtle" />
                        <h1 className="text-2xl font-black text-foreground tracking-tight text-glow">
                            {step === "reset" ? "New Password" : step === "success" ? "Check Email" : "Reset Password"}
                        </h1>
                    </div>

                    {step === "success" ? (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success border border-success/20">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-[13px] text-foreground/60 font-medium leading-relaxed mb-6">
                                We've sent a recovery link to <span className="font-bold text-foreground underline">{email}</span>.
                            </p>
                            
                            <div className="space-y-3">
                                <div className="p-4 bg-background/50 rounded-2xl border border-dashed border-border">
                                    <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest mb-1">Next Step</p>
                                    <p className="text-[11px] text-foreground/60">Follow the instructions in the email to reset your account.</p>
                                </div>

                                {/* Note Section */}
                                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                                    <p className="text-[0.8rem] text-primary/60 font-bold uppercase tracking-tight">
                                        Note: You may safely close this tab now.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                            {step === "email" ? (
                                <>
                                    <p className="text-[13px] text-foreground/50 text-center mb-6 px-2">
                                        Enter your email and we'll send you a link to get back into your account.
                                    </p>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-[14px]"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* New Password Input */}
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary" size={18} />
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onChange={handlePasswordChange} // Gamitin ang bagong handler
                                            placeholder="New Password"
                                            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-[14px]"
                                        />
                                        <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary p-2">
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="relative group">
                                        <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                                            !confirmPassword ? 'text-foreground/30' : confirmPassword === newPassword ? 'text-green-500' : 'text-red-500'
                                        }`} size={18} />
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-background/50 outline-none transition-all font-semibold text-[14px] ${
                                                !confirmPassword 
                                                    ? 'border-border focus:border-primary' 
                                                    : confirmPassword === newPassword 
                                                        ? 'border-green-500 focus:border-green-600' 
                                                        : 'border-red-500 focus:border-red-600'
                                            }`}
                                        />
                                        <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary p-2">
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    <div className="px-3 py-4 rounded-2xl border border-border bg-background/30 space-y-3 transition-colors duration-300">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-foreground/40">Security Check</span>
                                            <span className={`text-[10px] font-black uppercase transition-colors ${
                                                passwordStrength === 'Strong' ? 'text-green-600' : 
                                                passwordStrength === 'Medium' ? 'text-yellow-600' :
                                                passwordStrength === 'Weak' ? 'text-red-600' :
                                                'text-foreground/30'
                                            }`}>
                                                {passwordStrength || "None"}
                                            </span>
                                        </div>
                                        
                                        <div className="flex gap-1.5 h-1.5 px-1">
                                            <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Weak' ? 'bg-red-400' : passwordStrength === 'Medium' ? 'bg-yellow-400' : passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-border'}`} />
                                            <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Medium' ? 'bg-yellow-400' : passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-border'}`} />
                                            <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-border'}`} />
                                        </div>

                                        {/* Buong listahan ng requirements mula sa Register.jsx */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                                <span className={`text-[10px] font-bold transition-colors ${newPassword.length >= 8 ? 'text-foreground' : 'text-foreground/40'}`}>
                                                    8+ Characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                                <span className={`text-[10px] font-bold transition-colors ${/[A-Z]/.test(newPassword) ? 'text-foreground' : 'text-foreground/40'}`}>
                                                    Uppercase Letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                                <span className={`text-[10px] font-bold transition-colors ${/\d/.test(newPassword) ? 'text-foreground' : 'text-foreground/40'}`}>
                                                    Number Included
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                                <span className={`text-[10px] font-bold transition-colors ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-foreground' : 'text-foreground/40'}`}>
                                                    Special Character
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Match Message */}
                                    {confirmPassword && (
                                        <p className={`text-[10px] font-black uppercase mt-1 ml-2 tracking-wider animate-fade-in ${
                                            confirmPassword === newPassword ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {confirmPassword === newPassword ? '✓ Passwords Match' : '× Passwords do not match'}
                                        </p>
                                    )}
                                </>
                            )}

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.15em] text-[11px] transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                <span>{isLoading ? "Processing..." : step === "reset" ? "Update Password" : "Send Reset Link"}</span>
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Support Footer */}
            <div className="mt-8 max-w-[400px] w-full animate-fade-in">
                <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                        <LifeBuoy size={20} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Need Help?</h3>
                        <p className="text-[12px] text-foreground/50 font-medium">
                            Contact our <button className="text-foreground font-black hover:text-primary underline">Support Team</button> available 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
