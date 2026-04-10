import React, { useState, useEffect } from 'react';
import heroimg2 from "../../assets/unnamed.jpg";
import buttonlogo from "../../assets/google.png";
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from "axios"; // Import axios for API requests
import ToastMessage, { showToast } from "../../components/ToastMessage";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [isLoading, setIsLoading] = useState(false); // Set initial state to false
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isChangeEmail = urlParams.get("changeEmail");

        if (isChangeEmail) {
            const storedFirstName = localStorage.getItem("firstName");
            const storedLastName = localStorage.getItem("lastName");
            const storedEmail = localStorage.getItem("email");
            const storedPassword = localStorage.getItem("password");

            if (storedFirstName) setFirstName(storedFirstName);
            if (storedLastName) setLastName(storedLastName);
            if (storedEmail) setEmail(storedEmail);
            if (storedPassword) setPassword(storedPassword);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };

    const evaluatePasswordStrength = (password) => {
        if (password.length < 8) {
            return "Weak";
        }
        const hasNumbers = /\d/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (hasNumbers && hasLowercase && hasUppercase && hasSpecialChar) {
            return "Strong";
        } else if ((hasNumbers && hasLowercase) || (hasLowercase && hasUppercase)) {
            return "Medium";
        } else {
            return "Weak";
        }
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

        // Kinukuha ang mga parameters sa URL (halimbawa: ?changeEmail=true)
        const urlParams = new URLSearchParams(window.location.search);
        const isChangeEmail = urlParams.get("changeEmail");
        
        // Kinukuha ang dating email na naka-save sa browser (pang-hanap sa database)
        const oldEmail = localStorage.getItem("email"); 

        try {
            if (isChangeEmail) {
                // --- CHANGE EMAIL FLOW (Kapag galing sa "Change Email" button) ---
                
                // 1. UPDATE USER: Binabago ang details sa database gamit ang oldEmail bilang reference
                console.log("Sending request to update user details...");

                const response = await axios.put(`http://localhost:5000/api/update-user/${oldEmail}`, {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email, // Ito yung bagong email na nilagay sa input
                    Password: password,
                });

                if (response.status === 200) {
                    // Store the updated user details in localStorage
                    localStorage.setItem("email", email);
                    localStorage.setItem("firstName", firstName);
                    localStorage.setItem("lastName", lastName);
                    localStorage.setItem("password", password);

                    // Notify the user and navigate to OTP verification page
                    showToast("Update successful! Verify your new email.", "success");

                    setTimeout(() => {
                        console.log("Navigating to OTP page...");
                        setIsLoading(false);
                        navigate("/otp");
                    }, 1500); // Small delay to display the toast
                }
            } else {
                // --- STANDARD REGISTER FLOW (Normal na paggawa ng account) ---
                
                // Nagpapadala ng POST request para i-save ang bagong user
                const response = await axios.post("http://localhost:5000/api/register", {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Password: password,
                });

                if (response.status === 201) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("firstName", firstName);
                    localStorage.setItem("lastName", lastName);
                    localStorage.setItem("password", password);
                    
                    showToast("Account created! Redirecting...", "success");
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate("/otp");
                    }, 1500); // Konting delay para mabasa yung Toast
                }
            }
        } catch (error) {
            // Kapag may nag-error (halimbawa: offline ang server o mali ang data)
            console.error("Error during process:", error);
            console.error("Error response:", error.response);
            showToast(error.response?.data?.message || "An error occurred.", "error");
        } finally {
            // 5. SAFETY NET: Kahit mag-success o mag-fail, siguraduhin na mamamatay ang loading screen
            setIsLoading(false);
        }
    };

    return (
        <>
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />
            <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-background overflow-hidden">
                
                {/* --- LEFT SIDE: Animated Grid & Back Button --- */}
                <div className="relative hidden md:flex w-full h-full bg-[#0f172a] overflow-hidden items-center justify-center">
                    
                    {/* Back to Home Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:-translate-x-1 transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={18} className="group-hover:text-primary transition-colors" />
                        Back to Home
                    </button>

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-[#4c1d95]"></div>
                    <div 
                        className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }}
                    ></div>

                    {/* Meteor Effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute top-1/4 left-1/2 w-[2px] h-[50px] bg-gradient-to-b from-primary to-transparent animate-meteor opacity-0"></span>
                        <span className="absolute top-10 left-1/3 w-[2px] h-[80px] bg-gradient-to-b from-blue-400 to-transparent animate-meteor opacity-0 [animation-delay:1.5s]"></span>
                    </div>

                    {/* Left Side Content Card */}
                    <div className="relative z-10 px-12 py-10 mx-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in text-left">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 text-white">
                                <Stethoscope size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight">MediHelp</h2>
                        </div>
                        <div className="max-w-md space-y-6">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                Start Your <br/>
                                <span className="text-primary-foreground drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">Healthy Journey.</span>
                            </h1>
                            <p className="text-lg text-slate-300/80 leading-relaxed">
                                Create an account to experience seamless healthcare management and secure medical records.
                            </p>
                        </div>
                    </div>

                    {/* Version Label */}
                    <div className="absolute bottom-10 left-0 right-0 px-12 flex items-center justify-between opacity-50">
                        <p className="text-xs font-medium text-white/60 tracking-widest uppercase">© 2026 MediHelp Platform</p>
                        <div className="h-[1px] flex-grow mx-6 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <p className="text-xs italic text-white/40 font-semibold uppercase tracking-wider">v2.0 Stable Build</p>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Enhanced Register Form --- */}
                <div className="flex flex-col w-full h-full bg-background backdrop-blur-md overflow-y-auto">
                    <div className="w-full max-w-lg mx-auto animate-fade-in py-8">
                        
                        {/* Header */}
                        <div className="text-left mb-8">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">Create Account</h2>
                            <p className="mt-2 text-foreground/60 font-medium italic">Join thousands of users prioritizing their health.</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleRegister}>
                            {/* Name Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">First Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className={`w-full px-3 py-2 rounded-xl border ${emailError ? 'border-red-500' : 'border-slate-200'} bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Create your password"
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password Strength & Requirements UX */}
                                {password.length > 0 && (
                                    <div className="mt-3 px-1 animate-pop-up space-y-3">
                                        {/* Strength Bar */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                                    Security Level: <span className={passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-green-600'}>{passwordStrength}</span>
                                                </span>
                                            </div>
                                            <div className="flex gap-1.5 h-1.5">
                                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength ? (passwordStrength === 'Weak' ? 'bg-red-400' : (passwordStrength === 'Medium' ? 'bg-yellow-400' : 'bg-green-500')) : 'bg-slate-200'}`} />
                                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Medium' || passwordStrength === 'Strong' ? (passwordStrength === 'Medium' ? 'bg-yellow-400' : 'bg-green-500') : 'bg-slate-200'}`} />
                                                <div className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-slate-200'}`} />
                                            </div>
                                        </div>

                                        {/* --- Password Requirements Checklist --- */}
                                        <div className="grid grid-cols-2 gap-y-2 pb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-medium ${password.length >= 8 ? 'text-foreground' : 'text-slate-400'}`}>8+ Characters</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-medium ${/[A-Z]/.test(password) ? 'text-foreground' : 'text-slate-400'}`}>Uppercase Letter</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-medium ${/[0-9]/.test(password) ? 'text-foreground' : 'text-slate-400'}`}>Number Included</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-medium ${/[!@#$%^&*]/.test(password) ? 'text-foreground' : 'text-slate-400'}`}>Special Character</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                                {!isLoading && <ArrowRight size={18} />}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            {/* Google Button */}
                            <button className="w-full border-2 border-slate-100 bg-white py-3.5 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer font-bold text-slate-700 shadow-sm">
                                <img src={buttonlogo} alt="Google" className="w-5 h-5 mr-3" />
                                Sign up with Google
                            </button>

                            {/* Footer Links */}
                            <div className="pt-2 space-y-4">
                                <p className="text-[11px] text-center text-foreground/50 leading-relaxed max-w-xs mx-auto">
                                    By registering, you agree to our 
                                    <a href="/terms" className="text-primary font-bold hover:underline mx-1">Terms</a> 
                                    and 
                                    <a href="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</a>.
                                </p>
                                <div className="text-sm font-bold text-foreground/80">
                                    Already have an account? 
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="ml-2 text-primary hover:underline underline-offset-4 decoration-2"
                                    >
                                        Login here
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;