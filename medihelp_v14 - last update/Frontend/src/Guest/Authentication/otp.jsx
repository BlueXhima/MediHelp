import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import { ArrowLeft, Stethoscope, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";

const OTPVerification = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Logic remains exactly the same as your original file
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Ipakita ang unang toast
        showToast("Verifying OTP, please wait...", "info");

        const email = localStorage.getItem("email"); // Retrieve email from local storage

        if (!email) {
            showToast("Email is required. Please register again.", "error");
            setIsLoading(false);
            return;
        }

        console.log("Request payload:", { email, otp });

        try {
            // 2. Magdagdag ng maliit na artificial delay (halimbawa: 800ms) 
            // para hindi biglaang maglaho ang "Verifying" toast
            await delay(800);

            // Make API call to verify OTP
            const response = await axios.post("http://localhost:5000/api/verify-otp", {
                email: localStorage.getItem("email"), // Ensure email is sent
                otp,
            });

            console.log("Backend response:", response);

            if (response.status === 200) {
                // 3. Ipakita ang success toast
                showToast("OTP verified successfully! Redirecting...", "success");

                localStorage.setItem("userRole", "user"); // Set the correct user role
                localStorage.setItem("isFirstLogin", "true"); // Set isFirstLogin for new users

                // Bigyan ng oras ang user na mabasa ang success toast bago mag-navigate
                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to dashboard
                }, 2000); // Add delay to show the loading state and toast
            } else {
                showToast(response.data.message || "Invalid OTP. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            showToast(
                error.response?.data?.message || "An error occurred. Please try again.",
                "error"
            );
        } finally {
            setTimeout(() => setIsLoading(false), 2000); // Ensure loading state is visible for at least 2 seconds
        }
    };

    const handleResendOTP = async () => {
        const email = localStorage.getItem("email");
        if (!email) {
            showToast("Email not found.", "error");
            return;
        }
        try {
            // Make API call to resend OTP
            const response = await axios.post("http://localhost:5000/api/send-otp", {
                email,
            });

            if (response.status === 200) {
                showToast("OTP resent successfully!", "success");
            } else {
                showToast(response.data.message || "Failed to resend OTP. Please try again.", "error");
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "An error occurred while resending OTP.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeEmail = () => {
        navigate("/register?changeEmail=true");
    };

    return (
        <>
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />
            
            <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-background overflow-hidden text-left">
                
                {/* --- LEFT SIDE: Sticky Security Branding --- */}
                <div className="relative hidden md:flex w-full h-full bg-[#0f172a] overflow-hidden items-center justify-center">
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:-translate-x-1 transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={18} className="group-hover:text-primary transition-colors" />
                        Back
                    </button>

                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-[#4c1d95]"></div>
                    <div 
                        className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }}
                    ></div>

                    {/* Meteor Animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute top-1/4 left-1/2 w-[2px] h-[50px] bg-gradient-to-b from-primary to-transparent animate-meteor opacity-0"></span>
                        <span className="absolute top-1/2 left-1/4 w-[2px] h-[80px] bg-gradient-to-b from-blue-400 to-transparent animate-meteor opacity-0 [animation-delay:2s]"></span>
                    </div>

                    {/* Content Card */}
                    <div className="relative z-10 px-12 py-10 mx-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in text-left">
                        <div className="flex items-center space-x-3 mb-8 text-white">
                            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight">Security</h2>
                        </div>
                        <div className="max-w-md space-y-6">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                Verify Your <br/>
                                <span className="text-primary-foreground drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">Identity.</span>
                            </h1>
                            <p className="text-lg text-slate-300/80 leading-relaxed">
                                We've sent a 6-digit code to your email. This ensures your medical records stay protected and only accessible by you.
                            </p>
                        </div>
                    </div>

                    {/* Version Label */}
                    <div className="absolute bottom-10 left-0 right-0 px-12 flex items-center justify-between opacity-50">
                        <p className="text-xs font-medium text-white/60 tracking-widest uppercase">© 2026 MediHelp Secure</p>
                        <div className="h-[1px] flex-grow mx-6 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <p className="text-xs italic text-white/40 font-semibold uppercase tracking-wider">v2.0 Stable Build</p>
                    </div>
                </div>

                {/* --- RIGHT SIDE: OTP Form --- */}
                <div className="flex flex-col w-full h-full bg-slate-50/40 backdrop-blur-md overflow-y-auto">
                    <div className="w-full max-w-lg mx-auto px-8 md:px-16 pt-24 pb-16 animate-fade-in">
                        
                        {/* Header */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">Enter OTP</h2>
                            <p className="mt-3 text-foreground/60 font-medium italic">
                                Please check your inbox for the verification code.
                            </p>
                        </div>

                        <form onSubmit={handleOTPSubmit} className="space-y-8">
                            {/* OTP Input Field */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength="6"
                                    className="w-full text-center text-3xl tracking-[0.5em] font-black py-5 rounded-2xl border-2 border-slate-200 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="flex-1 border-2 border-slate-200 bg-white py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                                    >
                                        Resend Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleChangeEmail}
                                        className="flex-1 border-2 border-slate-200 bg-white py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                                    >
                                        Change Email
                                    </button>
                                </div>
                            </div>

                            {/* Footer Policy */}
                            <div className="pt-10 border-t border-slate-200">
                                <p className="text-[11px] text-center text-foreground/50 leading-relaxed max-w-xs mx-auto font-medium">
                                    By verifying, you agree to our 
                                    <a href="/terms" className="text-primary font-bold hover:underline mx-1">Terms</a> 
                                    and 
                                    <a href="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</a>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTPVerification;