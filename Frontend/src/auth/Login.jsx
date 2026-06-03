import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft, MessageSquareWarning } from 'lucide-react';
import buttonlogo from "../assets/google.png";
import MediHelpLogo from "/MediHelpLogo.png";
import BackgroundLoadingState from "../components/BackgroundLoadingState";
import { showToast } from "../components/ToastMessage";
import Button from "../components/ui/Button";
import api from '../api/axios';
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleLogin } from '@react-oauth/google';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const LoginPage = () => {
    useDocumentTitle("Login");

    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [failedAttempts, setFailedAttempts] = useState(0);
    
    const [rememberMe, setRememberMe] = useState(() => {
        return sessionStorage.getItem("rememberMe") === "true";
    });

    const [email, setEmail] = useState(() => {
        const savedEmail = sessionStorage.getItem("rememberedEmail");
        return savedEmail ? savedEmail : "";
    });

    const [cooldownDuration, setCooldownDuration] = useState(() => {
        const savedDuration = sessionStorage.getItem("nextCooldownDuration");
        return savedDuration ? parseInt(savedDuration) : 30000;
    });

    const [lockUntil, setLockUntil] = useState(() => {
        const savedLock = sessionStorage.getItem("loginLockUntil");
        return savedLock ? parseInt(savedLock) : null;
    });

    const [isSilentLock, setIsSilentLock] = useState(() => {
        return sessionStorage.getItem("isSilentLock") === "true";
    });

    // Login Logic (Same as your old file)
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // 1. FRONTEND LOCKOUT CHECK (Check if user is currently timed out)
        if (lockUntil && Date.now() < lockUntil) {
            if (isSilentLock) {
                showToast("Login temporarily unavailable. Please try again shortly.", "error");
            } else {
                const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
                setError(`Too many failed attempts. Try again in ${remaining}s.`);
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
            const response = await api.post("/login", {
                email,
                password,
                captchaToken
            });

            if (response.data && response.data.success) {
                // SUCCESS FLOW: Reset everything
                const storage = rememberMe ? sessionStorage : sessionStorage; // Consistent use of sessionStorage based on your file
                
                if (rememberMe) {
                    sessionStorage.setItem("rememberedEmail", email);
                    sessionStorage.setItem("rememberMe", "true");
                } else {
                    sessionStorage.removeItem("rememberedEmail");
                    sessionStorage.setItem("rememberMe", "false");
                }

                sessionStorage.setItem("userRole", response.data.role);

                // Reset all security states on success
                setFailedAttempts(0);
                setCaptchaToken(null);
                setShowCaptcha(false);
                setLockUntil(null);
                setIsSilentLock(false);
                setCooldownDuration(30000);

                // Clean up SessionStorage
                sessionStorage.removeItem("loginLockUntil");
                sessionStorage.removeItem("isSilentLock");
                sessionStorage.removeItem("nextCooldownDuration");

                // 2. PATAYIN ANG LOADING STATE DITO
                // setIsLoading(false); 

                // 3. TSAKA IPAKITA ANG TOAST
                showToast("Login Successful!", "success");

                setTimeout(() => {
                    if (response.data.role === 'admin') {
                        navigate("/admin");
                    } else {
                        navigate("/dashboard/overview");
                    }
                }, 1500);
                // return;
            }
        } catch (err) {
            // 5. CATCH / ERROR FLOW (Dito napupunta kapag 401, 429, or 500 ang error)
            console.error("Login Error:", err);

            // Always reset reCAPTCHA on failure
            setCaptchaToken(null);
            if (recaptchaRef.current) recaptchaRef.current.reset();
            
            // Increment attempts immediately
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);

            // Logic para sa 3rd attempt (Multiple of 3)
            if (newAttempts % 3 === 0) {
                setShowCaptcha(false);
                const lockTime = Date.now() + cooldownDuration;

                setLockUntil(lockTime);
                setIsSilentLock(false);

                // I-update ang error message na ipapakita kapag tapos na ang countdown (buffer)
                setError("Too many attempts. Please wait.");

                sessionStorage.setItem("loginLockUntil", lockTime.toString());
                sessionStorage.setItem("isSilentLock", "false");

                // --- ESCALATION LOGIC ---
                // Escalate duration for NEXT lockout
                const nextDuration = cooldownDuration + 30000;
                setCooldownDuration(nextDuration);
                sessionStorage.setItem("nextCooldownDuration", nextDuration.toString());

                // Trigger Security Alert Email
                try {
                    await api.post("/send-security-alert", {
                        Email: email,
                        Device: navigator.userAgent,
                        Time: new Date().toLocaleString()
                    });
                } catch (mailErr) {
                    console.error("Security alert email failed to send.");
                }

                // Toast message kapag na-lock na
                setError(`Too many failed attempts. Account locked for ${cooldownDuration/1000}s.`);
                showToast("Security alert sent to your email.", "error");
            } else {
                // 3. KUNG HINDI PA LOCKET, DUN LANG TITINGIN SA SERVER ERROR
                if (err.response?.status === 429) {
                    // Kung na-trigger pa rin ang backend rate limit
                    setError(err.response.data.error);
                } else {
                    setError("Invalid email or password.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Cooldown Effect
    useEffect(() => {
        let interval;
        // Mag-start lang ang interval kung may lockUntil
        if (lockUntil) {
            interval = setInterval(() => {
                const timeLeft = lockUntil - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);

                    if (!isSilentLock) {
                        // Transition: Countdown (30s/60s) -> SilentLock (5 mins)
                        showToast("Cooldown finished. Access will be restored shortly.", "success");
                        setError(""); // Nililinis ang error box pagtapos ng countdown

                        // Transition to Silent Lock (5 mins)
                        const silentLockTime = Date.now() + (5 * 60 * 1000);
                        setLockUntil(silentLockTime);
                        setIsSilentLock(true);
                        sessionStorage.setItem("isSilentLock", "true");
                        sessionStorage.setItem("loginLockUntil", silentLockTime.toString());
                    } else {
                        // Full Unlock
                        setLockUntil(null);
                        setIsSilentLock(false);
                        setFailedAttempts(0);

                        // OPTIONAL: Pwede mong i-reset din ang captcha visibility rito
                        setShowCaptcha(false);

                        sessionStorage.removeItem("loginLockUntil");
                        sessionStorage.removeItem("isSilentLock");
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [lockUntil, isSilentLock]);

    // --- SHORTCUT KEY FOR ADMIN REDIRECT ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Shortcut: CTRL + SHIFT + A
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
                e.preventDefault(); // Iwasan ang default browser actions
                showToast("Redirecting to Admin Gateway...", "success");
                setTimeout(() => {
                    navigate('/admin-gateway');
                }, 800);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError(""); // Kapag nag-type ang user, mawawala na yung error message indicator
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            if (!tokenResponse?.access_token) return;

            setIsLoading(true);
            try {
                const res = await axios.post("https://medihelp-production-af7b.up.railway.app/api/google-login", {
                    token: tokenResponse.access_token 
                }, { withCredentials: true });

                if (res.data.success) {
                    sessionStorage.setItem("userRole", res.data.role);
                    sessionStorage.setItem("email", res.data.email);
                    showToast("Logged in with Google!", "success");
                    setTimeout(() => navigate(res.data.role === 'admin' ? "/admin" : "/dashboard/overview"), 1500);
                }
            } catch (err) {
                console.error("Auth Error:", err);
                showToast("Google Login Failed", "error");
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20">
            <BackgroundLoadingState isLoading={isLoading} />

            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-6 left-6 md:fixed md:top-8 md:left-8 flex items-center gap-2 text-foreground/60 hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Login Card */}
            <div className="w-full max-w-105 bg-card rounded-[2.5rem] shadow-xl border border-border overflow-hidden animate-fade-in card-hover my-12 md:my-0">
                <form onSubmit={handleLogin} className="p-8 md:p-10">
                    <fieldset disabled={isLoading} className="space-y-4">

                        {/* Brand Header */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <img 
                                src={MediHelpLogo} 
                                alt="MediHelp Logo" 
                                className="w-20 h-auto mb-4 animate-pulse-subtle" 
                            />
                            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 text-glow">MediHelp</h1>
                            <p className="text-[13px] text-foreground/50 font-medium">
                                Your health journey continues here
                                {/* Hidden Admin Link */}
                                <span 
                                    onClick={() => navigate('/admin-gateway')} 
                                    className="cursor-default select-none active:opacity-30 transition-opacity"
                                    title=""
                                >
                                    .
                                </span>
                            </p>
                        </div>

                        {/* Alert Box */}
                        {error && (
                            <div className="mb-6 flex flex-col justify-center items-center animate-pulse">
                                <p className="text-red-600 font-bold text-center leading-tight tracking-wide" 
                                style={{ fontSize: '0.8rem' }}>
                                    {/* Kung may lock at HINDI silent, ipakita ang countdown */}
                                    {(lockUntil && !isSilentLock) 
                                        ? `Too many attempts. Try again in ${Math.max(0, Math.ceil((lockUntil - currentTime) / 1000))}s`
                                        : error} 
                                </p>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="relative group">
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-[14px]" 
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handleInputChange(setPassword)}
                                    placeholder="Password"
                                    required
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-[14px]" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Actions Row */}
                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)} 
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary" 
                                    />
                                    <span className="text-[11px] font-bold text-foreground/60 group-hover:text-foreground">Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-[11px] font-black text-primary hover:opacity-80 uppercase tracking-tighter"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* CAPTCHA */}
                            {(email && password && !lockUntil && import.meta.env.VITE_RECAPTCHA_SITE_KEY) ? (
                                <div className="py-2 flex justify-center scale-90">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                        onChange={setCaptchaToken}
                                    />
                                </div>
                            ) : (
                                // Opsyonal: Magpakita ng error o babala kung walang sitekey sa dev
                                !import.meta.env.VITE_RECAPTCHA_SITE_KEY && email && password && (
                                    <p className="text-[10px] text-red-500 text-center">reCAPTCHA configuration missing.</p>
                                )
                            )}

                            {/* Submit Button */}
                            <Button 
                                buttonType="submit"
                                variant="primary"
                                className="w-full py-4 rounded-2xl text-[12px] tracking-[0.15em]"
                                disabled={isLoading || (lockUntil && !isSilentLock)}
                            >
                                {isLoading ? "Authenticating..." : lockUntil ? "Locked" : "Sign In"}
                                {!isLoading && !lockUntil && <ArrowRight size={16} className="ml-2" />}
                            </Button>

                            {/* Social Login */}
                            <div className="relative flex items-center justify-center py-2">
                                <div className="w-full border-t border-border"></div>
                                <span className="absolute bg-card px-4 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                                    or continue
                                </span>
                            </div>

                            <Button 
                                onClick={() => googleLogin()}
                                variant="secondary"
                                className="w-full py-4 rounded-2xl gap-3 border-none"
                            >
                                <img src={buttonlogo} alt="G" className="w-4 h-4" />
                                <span className="text-[12px]">Sign in with Google</span>
                            </Button>
                        </div>

                        {/* Register Link */}
                        <p className="mt-8 text-center text-[13px] font-bold text-foreground/40">
                            No account? 
                            <button
                                type="button" 
                                onClick={() => navigate('/register')} 
                                className="text-primary hover:underline font-black ml-1"
                            >
                                    Create Account
                            </button>
                        </p>

                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
