import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
                <div className="relative w-full min-h-[100vh] bg-gradient-to-br from-[#1e3a8a] via-[#6d28d9] to-[#4c1d95] overflow-hidden">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute top-6 left-6 text-card flex items-center space-x-2">
                        <Stethoscope size={24} className="text-card" aria-hidden="true" />
                        <h2 className="text-3xl font-bold">MediHelp</h2>
                    </div>
                    <div className="absolute bottom-6 left-6 text-card text-left max-w-lg">
                        <blockquote className="text-4xl font-bold leading-tight">
                            “Empowering Healthcare with Trust and Compassion.”
                        </blockquote>
                        <p className="mt-2 text-md text-foreground/80">
                            Join our mission to make healthcare accessible, transparent, and meaningful 
                            for everyone, everywhere.
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-center px-8 py-12 relative">
                    {/* Form content */}
                    <div className="w-full max-w-md items-center mx-auto mt-auto mb-auto">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-foreground">Login to Your Account</h2>
                            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                                Welcome back! Please enter your credentials to continue your healthcare journey.
                            </p>
                        </div>
                        <form onSubmit={handleLogin} className="mt-6 space-y-4">
                            {/* Email */}
                            <div className="flex flex-col text-left">
                                <label className="text-sm font-medium text-foreground mb-1">
                                    Email<span className="text-foreground"> *</span>
                                </label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    required
                                    className="w-full border px-4 py-2 rounded-md" 
                                />
                            </div>
                            {/* Password */}
                            <div className="flex flex-col text-left">
                                <label className="text-sm font-medium text-foreground mb-1">
                                    Password<span className="text-foreground"> *</span>
                                </label>
                                <div className="flex w-full">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password" 
                                        required
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        className="flex-grow border border-r-0 px-4 py-2 rounded-l-md" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="border border-l-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 
                                                rounded-r-md text-gray-600 flex items-center justify-center
                                                cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} aria-hidden="true" />
                                        ) : (
                                            <Eye size={18} aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Remember me + Forgot password */}
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    Remember me
                                </label>
                                <a 
                                    href="/forgot-password" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/forgot-password');
                                    }} 
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login button */}
                            <button 
                                type="submit" 
                                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90
                                                transition font-medium cursor-pointer"
                                onClick={isLoading ? undefined : handleLogin} // Fix onClick listener
                            >
                                Login
                            </button>
                            {/* Divider */}
                            <div className="flex items-center">
                                <hr className="flex-grow border-gray-300" />
                                <span className="px-2 text-sm text-gray-500">OR</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            {/* Google button */}
                            <button className="w-full border py-2 rounded-md flex items-center justify-center 
                                            hover:bg-gray-100 transition cursor-pointer">
                                <img src={buttonlogo} alt="Google" className="w-5 h-5 mr-2" />
                                Continue with Google
                            </button>
                            {/* Disclaimer */}
                            <p className="mt-2 text-xs text-center text-foreground/70 leading-relaxed">
                                By logging in, you agree to our 
                                <a href="/terms" className="text-primary font-medium underline-offset-2 hover:underline ml-1 mr-1">
                                    Terms & Conditions
                                </a> 
                                and 
                                <a href="/privacy" className="text-primary font-medium underline-offset-2 hover:underline ml-1">
                                    Privacy Policy
                                </a>.
                            </p>
                            {/* Top-right link */}
                            <div className="flex items-center justify-center text-sm text-foreground/80 font-semibold">
                                Don't have an account? 
                                <a href="/register" className="inline-flex items-center text-foreground font-semibold border-b-2 border-transparent hover:text-primary hover:border-primary ml-1">
                                    Register here
                                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;