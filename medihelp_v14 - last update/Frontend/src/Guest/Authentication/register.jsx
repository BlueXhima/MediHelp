import React, { useState, useEffect } from 'react';
import heroimg2 from "../../assets/unnamed.jpg";
import buttonlogo from "../../assets/google.png";
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from "axios"; // Import axios for API requests
import ToastMessage, { showToast } from "../../components/ToastMessage";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
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
        if (password.length === 0) return "None"; // Bagong state para sa default
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

        // 1. Email Format Validation
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

        // Frontend pre-validation (Double check bago mag-API call)
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
            // STANDARD REGISTER FLOW ONLY
            const response = await axios.post("http://localhost:5000/api/register", {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: password,
                confirmPassword: confirmPassword,
                agreedToTerms: agreedToTerms
            });

            if (response.status === 201) {
                localStorage.setItem("email", email);
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
                const res = await axios.post("http://localhost:5000/api/google-login", {
                    token: tokenResponse.access_token 
                }, { withCredentials: true });

                if (res.data.success) {
                    // I-save ang mahahalagang info sa localStorage gaya ng sa login
                    localStorage.setItem("userRole", res.data.role);
                    localStorage.setItem("email", res.data.email);
                    if (res.data.user) {
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                    }
                    
                    showToast("Account linked with Google!", "success");
                    setTimeout(() => {
                        navigate(res.data.role === 'admin' ? "/admin" : "/dashboard");
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
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary/10 relative">
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            {/* Back Button - Positioned top-left outside the card */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[480px] bg-card rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-border overflow-hidden animate-fade-in">
                <form onSubmit={handleRegister} className="p-8 md:p-10">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                            <Stethoscope size={24} className="text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight mb-1.5">Create Account</h1>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-4">
                            Join MediHelp to start managing your healthcare records securely.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* 2-Column Name Fields with Floating Labels */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <input 
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder=" "
                                    required
                                    className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]" 
                                />
                                <label 
                                    htmlFor="firstName"
                                    className="absolute left-4 top-3.5 text-slate-400 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
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
                                    className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]" 
                                />
                                <label 
                                    htmlFor="lastName"
                                    className="absolute left-4 top-3.5 text-slate-400 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                                >
                                    LAST NAME
                                </label>
                            </div>
                        </div>

                        {/* Email Field - Floating Label */}
                        <div className="relative group">
                            <input 
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                                required
                                className={`peer w-full px-4 py-3.5 rounded-xl border-2 ${emailError ? 'border-red-500' : 'border-border'} bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]`} 
                            />
                            <label 
                                htmlFor="email"
                                className="absolute left-4 top-3.5 text-slate-400 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                            >
                                EMAIL ADDRESS
                            </label>
                        </div>

                        {/* Password Field - Floating Label */}
                        <div className="relative group">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder=" "
                                required
                                className="peer w-full px-4 py-3.5 rounded-xl border-2 border-border bg-transparent focus:border-primary outline-none transition-all font-semibold text-foreground text-[13px]" 
                            />
                            <label 
                                htmlFor="password"
                                className="absolute left-4 top-3.5 text-slate-400 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-primary"
                            >
                                CREATE PASSWORD
                            </label>
                            <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors p-2"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative group">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder=" "
                                required
                                className={`peer w-full px-4 py-3.5 rounded-xl border-2 bg-transparent outline-none transition-all font-semibold text-foreground text-[13px]
                                    ${!confirmPassword 
                                        ? 'border-border focus:border-primary' // Default state kapag walang laman
                                        : confirmPassword === password 
                                            ? 'border-green-500 focus:border-green-600' // Green kapag match
                                            : 'border-red-500 focus:border-red-600'    // Red kapag mali
                                    }`} 
                            />
                            <label 
                                htmlFor="confirmPassword"
                                className={`absolute left-4 top-3.5 font-bold text-[11px] transition-all pointer-events-none bg-card px-2 
                                    peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:font-black 
                                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px]
                                    ${!confirmPassword 
                                        ? 'text-slate-400 peer-focus:text-primary' 
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
                                        ? 'text-slate-300 hover:text-primary' 
                                        : confirmPassword === password 
                                            ? 'text-green-500' 
                                            : 'text-red-500'
                                    }`}
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator (Same logic preserved) */}
                        <div className="px-2 py-3 rounded-2xl border border-border space-y-3 transition-colors duration-300">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Security Check</span>
                                <span className={`text-[10px] font-black uppercase transition-colors ${
                                    passwordStrength === 'Strong' ? 'text-green-600 dark:text-green-4r00' : 
                                    passwordStrength === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                    passwordStrength === 'Weak' ? 'text-red-600 dark:text-red-400' :
                                    'text-slate-500 dark:text-slate-600'
                                }`}>
                                    {passwordStrength || "None"}
                                </span>
                            </div>
                            
                            {/* Strength Bars */}
                            <div className="flex gap-1.5 h-1 px-1">
                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Weak' ? 'bg-red-400' : passwordStrength === 'Medium' ? 'bg-yellow-400' : passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Medium' ? 'bg-yellow-400' : passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            </div>

                            {/* Requirements Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1">
                                {/* Requirement 1 */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    <span className={`text-[10px] font-bold transition-colors ${password.length >= 8 ? 'text-green-900 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                        8+ Characters
                                    </span>
                                </div>
                                
                                {/* Requirement 2 */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    <span className={`text-[10px] font-bold transition-colors ${/[A-Z]/.test(password) ? 'text-green-900 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Uppercase Letter
                                    </span>
                                </div>

                                {/* Requirement 3 */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${/\d/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    <span className={`text-[10px] font-bold transition-colors ${/\d/.test(password) ? 'text-green-900 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Number Included
                                    </span>
                                </div>

                                {/* Requirement 4 */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    <span className={`text-[10px] font-bold transition-colors ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-900 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Special Char
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
                        <div className="flex items-start gap-3 px-3 py-2 bg-transparent rounded-xl border border-border mb-2">
                            <div className="flex items-center h-5">
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all"
                                />
                            </div>
                            <label htmlFor="terms" className="text-[11px] text-foreground font-medium leading-[1.5] cursor-pointer select-none">
                                I have read and agree to the 
                                <a href="/terms" className="text-primary font-bold hover:underline mx-1">Terms of Service</a> 
                                and 
                                <a href="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</a>. 
                                <span className="block mt-1 text-slate-400 italic">
                                    I understand that MediHelp handles my health data securely.
                                </span>
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-primary text-white font-black uppercase tracking-[0.1em] text-[11px] shadow-sm 
                            hover:bg-indigo-700 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex 
                            items-center justify-center gap-2 mt-2 shadow-slate-200"
                        >
                            <span>{isLoading ? "Processing..." : "Create Account"}</span>
                            {!isLoading && <ArrowRight size={14} />}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center py-3">
                            <div className="w-full border-t border-slate-100"></div>
                            <span className="absolute bg-card px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
                                or continue on
                            </span>
                        </div>

                        {/* Google Button */}
                        <button 
                            type="button"
                            onClick={() => googleLogin()} 
                            className="w-full py-3 rounded-xl border-2 border-border bg-card flex items-center 
                            justify-center gap-3 hover:bg-slate-100 cursor-pointer transition-all font-bold 
                            text-slate-700 text-[12px] shadow-sm"
                        >
                            <img src={buttonlogo} alt="Google" className="w-4 h-4" />
                            Sign up with Google
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-[12px] font-bold text-slate-400">
                            Already have an account? <button onClick={() => navigate('/login')} className="text-foreground hover:text-primary cursor-pointer hover:underline underline-offset-4 decoration-2 decoration-primary/30 font-black">Login here</button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;