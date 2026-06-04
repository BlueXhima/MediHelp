import React, { useState, useEffect } from 'react';
import MediHelpLogo from "/MediHelpLogo.png";
import buttonlogo from "../assets/google.png";
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from "../api/axios"; 
import { showToast } from "../components/ToastMessage";
import BackgroundLoadingState from "../components/BackgroundLoadingState";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import Button from "../components/ui/Button"; // Imported your Button component
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Register = () => {
    useDocumentTitle("Register");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

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

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length === 0) {
            setPasswordStrength("");
        } else {
            setPasswordStrength(evaluatePasswordStrength(newPassword));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setEmailError(false);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            setEmailError(true);
            setIsLoading(false);
            return;
        }

        if (passwordStrength === "Weak") {
            showToast("Password is too weak. Please follow the requirements below.", "error");
            setIsLoading(false);
            return;
        }

        if (!agreedToTerms) {
            showToast("Please agree to the Terms and Privacy Policy.", "error");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post("/register", {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: password,
                confirmPassword: confirmPassword,
                agreedToTerms: agreedToTerms
            });

            if (response.status === 201) {
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("otpExpiry", response.data.expiresAt);
                showToast("Account created! Redirecting to verification...", "success");
                setTimeout(() => {
                    navigate("/otp");
                }, 1500);
            }
        } catch (error) {
            console.error("Registration Error:", error);
            showToast(error.response?.data?.message || "An error occurred during registration.", "error");
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const res = await api.post("/google-login", {
                    token: tokenResponse.access_token 
                });

                if (res.data.success) {
                    sessionStorage.setItem("userRole", res.data.role);
                    sessionStorage.setItem("email", res.data.email);
                    if (res.data.user) {
                        sessionStorage.setItem("user", JSON.stringify(res.data.user));
                    }
                    
                    showToast("Account linked with Google!", "success");
                    setTimeout(() => {
                        navigate(res.data.role === 'admin' ? "/admin" : "/dashboard/overview");
                    }, 1500);
                }
            } catch (err) {
                showToast(err.response?.data?.message || "Google Sign-up Failed", "error");
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary/20 relative">
            <BackgroundLoadingState isLoading={isLoading} />

            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-6 left-6 md:fixed md:top-8 md:left-8 flex items-center gap-2 text-foreground/60 hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[480px] bg-card rounded-[2.5rem] shadow-xl border border-border overflow-hidden animate-fade-in card-hover my-12 md:my-0">
                <form onSubmit={handleRegister} className="p-8 md:p-10">
                    <fieldset disabled={isLoading} className="space-y-6">

                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <img 
                                src={MediHelpLogo} 
                                alt="MediHelp Logo" 
                                className="w-20 h-auto mb-4 animate-pulse-subtle" 
                            />
                            <h1 className="text-3xl font-black text-foreground tracking-tight mb-1.5 text-glow">Create Account</h1>
                            <p className="text-[13px] text-foreground/50 font-medium leading-relaxed px-4">
                                Join MediHelp to start managing your healthcare records securely.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder=" "
                                        required
                                        className="peer w-full px-4 py-4 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-foreground text-[13px]" 
                                    />
                                    <label 
                                        htmlFor="firstName"
                                        className="absolute left-4 top-4 text-foreground/40 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                    >
                                        FIRST NAME
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder=" "
                                        required
                                        className="peer w-full px-4 py-4 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-foreground text-[13px]" 
                                    />
                                    <label 
                                        htmlFor="lastName"
                                        className="absolute left-4 top-4 text-foreground/40 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                    >
                                        LAST NAME
                                    </label>
                                </div>
                            </div>

                            <div className="relative group">
                                <input 
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    required
                                    className={`peer w-full px-4 py-4 rounded-xl border-2 ${emailError ? 'border-red-500' : 'border-border'} bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-foreground text-[13px]`} 
                                />
                                <label 
                                    htmlFor="email"
                                    className="absolute left-4 top-4 text-foreground/40 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                >
                                    EMAIL ADDRESS
                                </label>
                            </div>

                            <div className="relative group">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder=" "
                                    required
                                    className="peer w-full px-4 py-4 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:bg-card outline-none transition-all font-semibold text-foreground text-[13px]" 
                                />
                                <label 
                                    htmlFor="password"
                                    className="absolute left-4 top-4 text-foreground/40 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                >
                                    CREATE PASSWORD
                                </label>
                                <button 
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative group">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder=" "
                                    required
                                    className={`peer w-full px-4 py-4 rounded-xl border-2 bg-background/50 outline-none transition-all font-semibold text-foreground text-[13px]
                                        ${!confirmPassword 
                                            ? 'border-border focus:border-primary' 
                                            : confirmPassword === password 
                                                ? 'border-green-500 focus:border-green-600' 
                                                : 'border-red-500 focus:border-red-600'    
                                        }`} 
                                />
                                <label 
                                    htmlFor="confirmPassword"
                                    className={`absolute left-4 top-4 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 
                                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:font-black 
                                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px]
                                        ${!confirmPassword 
                                            ? 'text-foreground/40 peer-focus:text-primary' 
                                            : confirmPassword === password 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}
                                >
                                    CONFIRM PASSWORD
                                </label>
                                <button 
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-2
                                        ${!confirmPassword 
                                            ? 'text-foreground/30 hover:text-primary' 
                                            : confirmPassword === password 
                                                ? 'text-green-500' 
                                                : 'text-red-500'
                                        }`}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

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

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${password.length >= 8 ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                        <span className={`text-[10px] font-bold transition-colors ${password.length >= 8 ? 'text-foreground' : 'text-foreground/40'}`}>
                                            8+ Characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                        <span className={`text-[10px] font-bold transition-colors ${/[A-Z]/.test(password) ? 'text-foreground' : 'text-foreground/40'}`}>
                                            Uppercase Letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${/\d/.test(password) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                        <span className={`text-[10px] font-bold transition-colors ${/\d/.test(password) ? 'text-foreground' : 'text-foreground/40'}`}>
                                            Number Included
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                        <span className={`text-[10px] font-bold transition-colors ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-foreground' : 'text-foreground/40'}`}>
                                            Special Character
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {confirmPassword && (
                                <p className={`text-[10px] font-black uppercase mt-1 ml-2 tracking-wider animate-fade-in ${
                                    confirmPassword === password ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {confirmPassword === password ? '✓ Passwords Match' : '× Passwords do not match'}
                                </p>
                            )}

                            {/* Terms & Conditions */}
                            <div className="flex items-start gap-3 px-4 py-3 bg-background/50 rounded-2xl border border-border mb-2">
                                <div className="flex items-center h-5">
                                    <input 
                                        type="checkbox" 
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer transition-all"
                                    />
                                </div>
                                <label htmlFor="terms" className="text-[11px] text-foreground/70 font-medium leading-[1.5] cursor-pointer select-none">
                                    I have read and agree to the 
                                    <a href="/terms" className="text-primary font-bold hover:underline mx-1">Terms of Service</a> 
                                    and 
                                    <a href="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</a>. 
                                    <span className="block mt-1 text-foreground/40 italic">
                                        I understand that MediHelp handles my health data securely.
                                    </span>
                                </label>
                            </div>

                            {/* Updated Create Account Button */}
                            <Button 
                                buttonType="submit"
                                variant="primary"
                                type="rounded"
                                className="w-full py-4 text-[12px] tracking-[0.15em]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Create Account"}
                                {!isLoading && <ArrowRight size={16} className="ml-2" />}
                            </Button>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center py-3">
                                <div className="w-full border-t border-border"></div>
                                <span className="absolute bg-card px-4 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                                    or continue
                                </span>
                            </div>

                            {/* Updated Google Button */}
                            <Button 
                                onClick={() => googleLogin()}
                                variant="secondary"
                                type="rounded"
                                className="w-full py-4 gap-3 border-none"
                            >
                                <img src={buttonlogo} alt="Google" className="w-4 h-4" />
                                <span className="text-[12px]">Sign up with Google</span>
                            </Button>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 text-center">
                            <p className="text-[13px] font-bold text-foreground/40">
                                Already have an account? <button onClick={() => navigate('/login')} className="text-primary hover:underline font-black ml-1 cursor-pointer">Login here</button>
                            </p>
                        </div>

                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Register;
