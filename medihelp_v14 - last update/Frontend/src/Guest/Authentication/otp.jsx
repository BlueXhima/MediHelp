import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import { ArrowLeft, Stethoscope, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import ChangeEmailModal from "./ChangeEmailModal";

const OTPVerification = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");

    // Logic remains exactly the same as your original file
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        showToast("Verifying OTP, please wait...", "info");

        const email = localStorage.getItem("email");

        try {
            await delay(1000);
            // TANDAAN: Siguraduhin na ang axios ay may { withCredentials: true } 
            // kung ang frontend at backend ay magkaiba ng domain
            const response = await axios.post("http://localhost:5000/api/verify-otp", {
                email,
                otp,
            }, { withCredentials: true }); // Mahalaga ito para sa Cookies

            if (response.status === 200) {
                showToast("Success! Account verified. Redirecting...", "success");

                // I-save sa localStorage para mabasa ng Dashboard
                localStorage.setItem("userRole", "user");
                localStorage.setItem("isFirstLogin", "true");
                localStorage.setItem("email", email);
                if (response.data.user) {
                    // Ito ang babasahin ng iyong Welcome.jsx o Navbar.jsx
                    localStorage.setItem("user", JSON.stringify(response.data.user)); 
                }
                
                // HABAAN ang timeout sa 2500ms para malasap ng user ang Success Toast
                setTimeout(() => {
                    setIsLoading(false); // Dito lang natin papatayin ang loading
                    navigate("/dashboard");
                }, 2500);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Invalid OTP.", "error");
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        const email = localStorage.getItem("email");
        if (!email) {
            showToast("Email not found.", "error");
            return;
        }
        
        setIsLoading(true); // Idagdag ito para gumana ang "Sending..." state sa button

        try {
            const response = await axios.post("http://localhost:5000/api/send-otp", {
                email,
            });

            if (response.status === 200) {
                showToast("OTP resent successfully!", "success");
                setTimeLeft(60); // I-reset sa 1 minute (60 seconds)
            } else {
                showToast(response.data.message || "Failed to resend OTP.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Error occurred.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Buksan lang ang modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Ito ang tatakbo kapag successful ang update sa modal
    const handleEmailUpdated = (updatedEmail) => {
        setEmail(updatedEmail);
        localStorage.setItem("email", updatedEmail);
        setTimeLeft(60); // Reset timer para sa bagong OTP
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            setOtp(""); // Buburahin ang lahat ng input sa OTP boxes
            showToast("Verification code expired. Please resend a new one.", "error"); // Notification para sa user
            return;
    }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary/10 relative text-left">
            <BackgroundLoadingState isLoading={isLoading} />
            <ToastMessage />

            <ChangeEmailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentEmail={email} 
                onEmailUpdated={handleEmailUpdated} 
            />

            {/* Back Button - Top Left */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[480px] bg-card rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-border overflow-hidden animate-fade-in">
                <form onSubmit={handleOTPSubmit} className="p-10 md:p-12">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                            <ShieldCheck size={28} className="text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">Verify Your Email</h1>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-4">
                            We've sent a 6-digit code to your email. Enter it below to secure your account.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* OTP Input Field - 6 Digit Style */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-black tracking-[0.1em] text-slate-400">
                                    Verification Code
                                </label>
                                
                                {/* Timer sa Right Side ng Label */}
                                <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                    <span className="text-xs font-black text-red-400 tracking-tighter">Expires in:</span>
                                    <span className="text-sm font-black text-red-500 tabular-nums">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                            </div>
                            <div 
                                className="flex justify-between gap-2 md:gap-3"
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const pasteData = e.clipboardData.getData('text').slice(0, 6); // Kunin ang first 6 chars
                                    if (/^\d+$/.test(pasteData)) { // Siguraduhin na numbers lang
                                        setOtp(pasteData);
                                        // I-focus ang huling box na may laman o ang huling box talaga
                                        const lastIndex = Math.min(pasteData.length, 5);
                                        document.getElementById(`otp-${lastIndex}`).focus();
                                    }
                                }}
                            >
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={otp[index] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[0-9]$/.test(value) || value === "") {
                                                const newOtp = otp.split("");
                                                newOtp[index] = value;
                                                setOtp(newOtp.join(""));
                                                
                                                // Auto-focus sa susunod na box
                                                if (value !== "" && index < 5) {
                                                    document.getElementById(`otp-${index + 1}`).focus();
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !otp[index] && index > 0) {
                                                document.getElementById(`otp-${index - 1}`).focus();
                                            }
                                        }}
                                        className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-black rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-slate-400 shadow-sm"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] shadow-sm shadow-slate-200 hover:bg-indigo-700 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
                                {!isLoading && <ArrowRight size={16} />}
                            </button>

                            <div className="pt-2 flex flex-col items-center gap-5">
                                <div className="text-center">
                                    <p className="text-[12px] font-bold uppercase text-slate-400 mb-4">Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoading || timeLeft > 0}
                                        className={`
                                            px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300
                                            ${timeLeft > 0 || isLoading 
                                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70' 
                                                : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white hover:-translate-y-0.5 cursor-pointer shadow-sm active:scale-[0.98]'}
                                        `}
                                    >
                                        {isLoading ? "Sending..." : "Resend Code"}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleOpenModal}
                                    className="w-full border-2 border-border bg-card cursor-pointer py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    Change Email Address
                                </button>
                            </div>
                        </div>

                        {/* Footer Policy */}
                        <div className="border-t border-slate-50">
                            <p className="text-[12px] text-center text-slate-400 leading-relaxed max-w-xs mx-auto font-medium tracking-tighter">
                                By verifying, you agree to our 
                                <a href="/terms" className="text-foreground hover:text-primary font-black hover:underline mx-1">Terms</a> 
                                and 
                                <a href="/privacy" className="text-foreground hover:text-primary font-black hover:underline mx-1">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;