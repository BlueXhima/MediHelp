import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft, MessageSquareWarning } from 'lucide-react';
import heroimg2 from "../../assets/login-photo.webp";
import buttonlogo from "../../assets/google.png";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for background loading
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [captchaToken, setCaptchaToken] = useState(null); // State para sa token
    const [showCaptcha, setShowCaptcha] = useState(false);
    const recaptchaRef = useRef(null)

    // Kunin ang huling duration, kung wala pa, default sa 30000 (30s)
    const [cooldownDuration, setCooldownDuration] = useState(() => {
        const savedDuration = localStorage.getItem("nextCooldownDuration");
        return savedDuration ? parseInt(savedDuration) : 30000;
    });

    // Static admin credentials
    const adminCredentials = {
        email: "admin@medihelp.com",
        password: "admin123"
    };

    // Kunin ang lock data mula sa localStorage sa simula
    const [lockUntil, setLockUntil] = useState(() => {
        const savedLock = localStorage.getItem("loginLockUntil");
        return savedLock ? parseInt(savedLock) : null;
    });

    const [isSilentLock, setIsSilentLock] = useState(() => {
        return localStorage.getItem("isSilentLock") === "true";
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // 1. FRONTEND LOCKOUT CHECK (Check if user is currently timed out)
        if (lockUntil && Date.now() < lockUntil) {
            const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000);
            if (!isSilentLock) {
                setError(`Too many failed attempts. Try again in ${remainingTime}s.`);
            } else {
                showToast("Login temporarily unavailable. Please try again shortly.", "error");
            }
            return;
        }

        // 2. BASIC VALIDATION
        if (!email || !password || !captchaToken) {
            setError("Please complete all fields and verification.");
            return;
        }

        setIsLoading(true);

        try {
            // 3. API CALL TO BACKEND
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
                captchaToken,
            });

            // 4. SUCCESS FLOW
            if (response.data && response.data.success) {
                // --- SUCCESS FLOW: Save data to LocalStorage ---
                // Note: Token is now in HttpOnly Cookie, but we still save non-sensitive info
                // localStorage.setItem("token", response.data.token);
                localStorage.setItem("userRole", response.data.role);
                localStorage.setItem("email", email);
                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }

                // Reset all security states on success
                setFailedAttempts(0);
                setCaptchaToken(null);
                setShowCaptcha(false);
                setLockUntil(null);
                setIsSilentLock(false);
                setCooldownDuration(30000);

                // Clean up LocalStorage
                localStorage.removeItem("loginLockUntil");
                localStorage.removeItem("isSilentLock");
                localStorage.removeItem("nextCooldownDuration"); // Reset escalation

                showToast("Login Successful!", "success");
                setTimeout(() => {
                    navigate(response.data.role === 'admin' ? "/admin" : "/dashboard");
                }, 1500);
            }
        } catch (err) {
            // 5. CATCH / ERROR FLOW (Dito napupunta kapag 401, 429, or 500 ang error)
            console.error("Login Error:", err);

            // Reset CAPTCHA UI
            setCaptchaToken(null);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset(); // Ito ang magtatanggal ng "Check" sa box
            }
            
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);

            // Check for Rate Limit (429) from Backend
            if (err.response && err.response.status === 429) {
                setError(err.response.data.error || "Too many attempts.");
                return;
            }

            // Handle Failed Attempts & Lockout Escalation
            if (newAttempts >= 3) {
                setShowCaptcha(false);
                const currentLockDuration = cooldownDuration;
                const lockTime = Date.now() + cooldownDuration;

                setLockUntil(lockTime);
                setIsSilentLock(false);
                localStorage.setItem("loginLockUntil", lockTime.toString());
                localStorage.setItem("isSilentLock", "false");

                // Trigger Security Alert Email
                try {
                    await axios.post("http://localhost:5000/api/send-security-alert", {
                        Email: email,
                        Device: navigator.userAgent,
                        Time: new Date().toLocaleString()
                    });
                } catch (mailErr) {
                    console.error("Security alert email failed to send.");
                }

                // --- ESCALATION LOGIC ---
                // Escalate duration for NEXT lockout
                const nextDuration = cooldownDuration + 30000; 
                setCooldownDuration(nextDuration);
                localStorage.setItem("nextCooldownDuration", nextDuration.toString());
                
                setError(`Too many failed attempts. Account locked for ${cooldownDuration/1000}s.`);
                showToast("Security alert sent to your email.", "error");
            } else {
                setError("Invalid Email or Password.");
                showToast("Invalid credentials.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Effect para i-handle ang cooldown timer at silent lock
    useEffect(() => {
        let interval;
        if (lockUntil) {
            interval = setInterval(() => {
                const timeLeft = lockUntil - Date.now();
                
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    
                    if (!isSilentLock) {
                        // Transition: Countdown (30s/60s) -> SilentLock (5 mins)
                        showToast("Cooldown finished. Access will be restored shortly.", "success");
                        setError(""); // Nililinis ang error box pagtapos ng countdown
                        
                        const silentLockTime = Date.now() + (5 * 60 * 1000);
                        setLockUntil(silentLockTime);
                        setIsSilentLock(true);
                        localStorage.setItem("isSilentLock", "true");
                        localStorage.setItem("loginLockUntil", silentLockTime.toString());
                    } else {
                        // Tapos na ang SilentLock
                        setLockUntil(null);
                        setIsSilentLock(false);
                        setFailedAttempts(0); // I-reset ang counter sa 0

                        // OPTIONAL: Pwede mong i-reset din ang captcha visibility rito
                        setShowCaptcha(false);

                        localStorage.removeItem("loginLockUntil");
                        localStorage.removeItem("isSilentLock");
                    }
                } else {
                    // LIVE UPDATE: Dito nag-uupdate ang countdown sa UI
                    if (!isSilentLock) {
                        const seconds = Math.ceil(timeLeft / 1000);
                        setError(`Too many failed attempts. Account locked for ${seconds}s.`);
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [lockUntil, isSilentLock]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary/10">
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[420px] bg-card rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-border overflow-hidden animate-fade-in">
                <form onSubmit={handleLogin} className="p-8 md:p-10">
                    
                    {/* Header Section - Reduced sizes */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                            <Stethoscope size={24} className="text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight mb-1.5">Welcome Back</h1>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                            Enter your credentials to access the medical portal.
                        </p>
                    </div>

                    {/* Error Message - Reduced text */}
                    {error && (
                        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
                            <MessageSquareWarning size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-0.5">Alert</span>
                                <p className="text-[12px] font-bold text-red-900 leading-tight">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Email Field - Floating Label (Reduced text) */}
                        <div className="relative group">
                            <input 
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                required
                                className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]
                                placeholder:text-transparent focus:placeholder-slate-400" 
                            />
                            <label 
                                htmlFor="email"
                                className="absolute left-4 top-3.5 text-slate-400 font-bold text-[12px] transition-all pointer-events-none 
                                bg-card px-2 py-1
                                peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black
                                peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                            >
                                EMAIL ADDRESS
                            </label>
                        </div>

                        {/* Password Field - Floating Label (Reduced text) */}
                        <div className="relative group">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                required
                                className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]" 
                            />
                            <label 
                                htmlFor="password"
                                className="absolute left-4 top-3.5 text-slate-400 font-bold text-[12px] transition-all pointer-events-none 
                                bg-card px-2
                                peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black
                                peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                            >
                                PASSWORD
                            </label>
                            <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors p-2"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Checkbox & Forgot Password - Compact */}
                        <div className="flex items-center justify-between pt-0.5">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Remember me?</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-[11px] font-black cursor-pointer text-primary hover:text-indigo-700 uppercase tracking-wider transition-colors"
                            >
                                forgot password?
                            </button>
                        </div>

                        {(email && password && !lockUntil) && (
                            <div className="mb-4 flex justify-center scale-90 animate-fade-in">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey="6LdPzMwsAAAAAHbEB80m9dSZeKAOJ2qixqsPvng9" 
                                    onChange={(token) => setCaptchaToken(token)}
                                    onExpired={() => setCaptchaToken(null)}
                                />
                            </div>
                        )}

                        {/* Sign-in Button - Compact typography */}
                        <button 
                            type="submit" 
                            disabled={isLoading || (lockUntil && Date.now() < lockUntil && !isSilentLock)}
                            className={`
                                w-full py-3.5 rounded-xl font-black uppercase tracking-[0.1em] text-[11px] transition-all duration-300 
                                flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer
                                ${lockUntil && Date.now() < lockUntil && !isSilentLock 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                    : 'bg-primary text-white shadow-slate-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98]'
                                }
                            `}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (lockUntil && Date.now() < lockUntil && !isSilentLock) ? (
                                "System Locked"
                            ) : (
                                <>
                                    <span>Sign in to Portal</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>

                        {/* Divider - Smaller text */}
                        <div className="relative flex items-center justify-center py-3">
                            <div className="w-full border-t border-slate-100"></div>
                            <span className="absolute bg-card px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                                or continue
                            </span>
                        </div>

                        {/* Google Button - Compact */}
                        <button type="button" className="w-full py-3 cursor-pointer rounded-xl border-2 border-border bg-card flex items-center justify-center gap-3 hover:bg-slate-100 transition-all font-bold text-slate-700 text-[12px] shadow-sm active:scale-[0.98]">
                            <img src={buttonlogo} alt="Google" className="w-4 h-4" />
                            Sign in with Google
                        </button>
                    </div>

                    {/* Footer - Compact */}
                    <p className="mt-6 text-center text-[12px] font-bold text-slate-400">
                        New here? <button onClick={() => navigate('/register')} className="text-foreground hover:text-primary cursor-pointer ml-1 hover:underline underline-offset-4 decoration-2 decoration-primary/30 font-black">Create Profile</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;