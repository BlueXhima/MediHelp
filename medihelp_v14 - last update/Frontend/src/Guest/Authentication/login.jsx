import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import heroimg2 from "../../assets/login-photo.webp";
import buttonlogo from "../../assets/google.png";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ToastMessage, { showToast } from "../../components/ToastMessage";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for background loading

    // Static admin credentials
    const adminCredentials = {
        email: "admin@medihelp.com",
        password: "admin123"
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true); // Show loading state

        try {
            console.log("Sending login request...");
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            console.log("Response received:", response);
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok && data.success) {
                setEmail("");
                setPassword("");
                setError("");

                // Normalize role to lowercase for consistency
                const normalizedRole = data.role.toLowerCase();
                localStorage.setItem("userRole", normalizedRole);
                localStorage.setItem("email", email);

                // Show success toast message
                showToast("Login successful! Redirecting to your dashboard...", "success");

                // Extend delay to close loading state
                setTimeout(() => {
                    setTimeout(() => {
                        const redirectPath = normalizedRole === "admin" ? "/admin" : "/dashboard";
                        console.log(`Navigating to ${redirectPath}`);
                        navigate(redirectPath);
                    }, 500); // Additional delay before navigation
                }, 1000); // 1-second delay to close loading state
            } else {
                // Handle login failure
                console.error("Login failed:", data.error);
                setError(data.error || "Invalid email or password.");
                showToast(data.error || "Invalid email or password.", "error");
                setIsLoading(false); // Hide loading state
            }
        } catch (err) {
            // Handle network or unexpected errors
            console.error("Error during login:", err);
            setError("An error occurred. Please try again later.");
            showToast("An error occurred. Please try again later.", "error");
        } finally {
            // Ensure loading state is cleared
            setIsLoading(false);
            console.log("Login process completed.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

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
                        <p className="text-xs italic text-white/40">v2.0 Stable Build</p>
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
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2"
                            >
                                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                                {!isLoading && <ArrowRight size={18} />}
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