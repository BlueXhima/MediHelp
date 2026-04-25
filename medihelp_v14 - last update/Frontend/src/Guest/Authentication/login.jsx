import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft, MessageSquareWarning } from 'lucide-react';
import heroimg2 from "../../assets/login-photo.webp";
import buttonlogo from "../../assets/google.png";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for background loading
    const [failedAttempts, setFailedAttempts] = useState(0);
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

        // 1. Countdown Lock Check (Visible timer)
        if (lockUntil && Date.now() < lockUntil && !isSilentLock) {
            const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000);
            setError(`Too many failed attempts. Try again in ${remainingTime}s.`);
            return;
        }

        // 2. SilentLock Logic (5 mins)
        if (isSilentLock && lockUntil && Date.now() < lockUntil) {
            showToast("Login temporarily unavailable. Please try again shortly.", "error");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
            });

            if (response.data && response.data.success) {
                // --- SUCCESS FLOW: Save data to LocalStorage ---
                localStorage.setItem("token", response.data.token || "temp-token");
                localStorage.setItem("userRole", response.data.role);
                localStorage.setItem("email", email);
                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }

                // Reset all security states
                setFailedAttempts(0);
                setLockUntil(null);
                setIsSilentLock(false);
                setCooldownDuration(30000); // Back to 30s

                localStorage.removeItem("loginLockUntil");
                localStorage.removeItem("isSilentLock");
                localStorage.removeItem("nextCooldownDuration"); // Reset escalation

                showToast("Login Successful!", "success");
                setTimeout(() => {
                    navigate(response.data.role === 'admin' ? "/admin" : "/dashboard");
                }, 1500);
            }
        } catch (err) {
            console.error("Login Error:", err);
            
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);

            if (newAttempts >= 3) {
                // TRIGGER LOCKOUT & SEND ALERT
                const currentLockDuration = cooldownDuration;
                const lockTime = Date.now() + cooldownDuration;

                setLockUntil(lockTime);
                setIsSilentLock(false);
                setFailedAttempts(0);
                
                localStorage.setItem("loginLockUntil", lockTime.toString());
                localStorage.setItem("isSilentLock", "false");

                // API Call para sa Security Alert Email
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
                // Dagdagan ng 30s ang duration para sa SUSUNOD na lockout
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
        <>
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                {/* Left Side */}
                <div className="relative hidden md:flex w-full min-h-screen bg-[#0f172a] overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-[#4c1d95]"></div>
                    
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:-translate-x-1 transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={18} className="group-hover:text-primary transition-colors" />
                        Back to Home
                    </button>

                    <div 
                        className="absolute inset-0 opacity-20" 
                        style={{ 
                            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                            backgroundSize: '50px 50px' 
                        }}
                    ></div>

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute top-1/4 left-1/2 w-[2px] h-[50px] bg-gradient-to-b from-primary to-transparent animate-meteor opacity-0"></span>
                        <span className="absolute top-10 left-1/3 w-[2px] h-[80px] bg-gradient-to-b from-blue-400 to-transparent animate-meteor opacity-0 [animation-delay:1.5s]"></span>
                        <span className="absolute top-2/3 left-1/4 w-[2px] h-[60px] bg-gradient-to-b from-purple-400 to-transparent animate-meteor opacity-0 [animation-delay:3s]"></span>
                    </div>

                    <div className="relative z-10 px-12 py-10 mx-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                <Stethoscope size={32} className="text-white" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight">MediHelp</h2>
                        </div>
                        <div className="max-w-md space-y-6">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                Smart Care, <br/>
                                <span className="text-primary-foreground drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">Better Life.</span>
                            </h1>
                            <p className="text-lg text-slate-300/80 leading-relaxed">
                                Simplify your medical journey with our secure and intuitive healthcare platform.
                            </p>
                        </div>

                        {/* Feature Tags with Glow */}
                        <div className="mt-10 flex flex-wrap gap-3">
                            {['Cloud Security', 'Real-time Sync', 'Smart Insights'].map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary-foreground uppercase tracking-widest shadow-[0_0_10px_rgba(167,139,250,0.1)]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Footer Quote */}
                    <div className="absolute bottom-10 left-0 right-0 px-12 flex items-center justify-between opacity-50">
                        <p className="text-xs font-medium text-white/60 tracking-widest uppercase">© 2026 MediHelp Platform</p>
                        <div className="h-[1px] flex-grow mx-6 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <p className="text-xs italic text-white/40 font-semibold uppercase tracking-wider">v1.0 Stable Build</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-center px-8 md:px-16 py-4 bg-background backdrop-blur-md relative">
                    <div className="w-full max-w-md mx-auto animate-fade-in">
                        {/* Header section with better spacing */}
                        <div className="text-left mb-6">
                            <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Welcome Back</h2>
                            <p className="mt-3 text-foreground/60 font-medium">
                                Please enter your details to access your MediHelp account.
                            </p>
                        </div>

                        {/* --- Error Message Display --- */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="shrink-0 p-1.5 bg-red-100 rounded-lg">
                                    <MessageSquareWarning size={18} className="text-red-600" />
                                </div>
                                <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-red-500/80">
                                        Security Alert
                                    </span>
                                    <p className="text-sm font-semibold text-red-700 leading-tight">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email Field with focus-ring effect */}
                            <div className="space-y-1.5 flex flex-col text-left">
                                <label className="text-xs font-bold uppercase tracking-widest mb-2 text-foreground/50 ml-1">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200" 
                                />
                            </div>

                            {/* Password Field with cleaner toggle icon */}
                            <div className="space-y-1.5 flex flex-col text-left">
                                <label className="text-xs font-bold uppercase tracking-widest mb-2 text-foreground/50 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password" 
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot in one line */}
                            <div className="flex items-center justify-between text-sm font-medium">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                                    <span className="text-foreground/70 group-hover:text-foreground transition-colors">Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-primary font-bold hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Primary Action Button with shadow and hover lift */}
                            <button 
                                type="submit" 
                                disabled={isLoading || (lockUntil && Date.now() < lockUntil && !isSilentLock)}
                                className={`
                                    relative overflow-hidden w-full py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 
                                    flex items-center justify-center gap-2 group
                                    ${lockUntil && Date.now() < lockUntil && !isSilentLock 
                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-80' 
                                        : 'bg-primary text-white shadow-[0_10px_20px_-10px_rgba(var(--primary-rgb),0.4)] active:scale-[0.98] hover:shadow-[0_15px_25px_-10px_rgba(var(--primary-rgb),0.5)] hover:-translate-y-1 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {/* Shimmer Effect kapag hindi locked */}
                                {!(lockUntil && Date.now() < lockUntil && !isSilentLock) && !isLoading && (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
                                )}

                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (lockUntil && Date.now() < lockUntil && !isSilentLock) ? (
                                        <>
                                            <span className="opacity-60">Account Locked</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>

                            {/* Minimalist Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            {/* Google Button with cleaner border */}
                            <button className="w-full border-2 border-slate-100 bg-white py-3 rounded-xl flex items-center justify-center 
                                            hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer font-bold text-slate-700">
                                <img src={buttonlogo} alt="Google" className="w-5 h-5 mr-3" />
                                Continue with Google
                            </button>

                            {/* Bottom Navigation Link */}
                            <div className="pt-4 text-center">
                                <p className="text-sm text-foreground/60 font-medium">
                                    Don't have an account? 
                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="ml-1 text-primary font-bold hover:underline underline-offset-4"
                                    >
                                        Register for free
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;