import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/ToastMessage";
import { ArrowLeft, Stethoscope, ShieldCheck, ArrowRight } from "lucide-react";
import api from "../api/axios";
import BackgroundLoadingState from "../components/BackgroundLoadingState";
import ChangeEmailModal from "../components/modals/ChangeEmailModal";
import Button from "../components/ui/Button";
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const OTPVerification = () => {
    useDocumentTitle("OTP");

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
    const [isInitialMount, setIsInitialMount] = useState(true);
    const inputRefs = React.useRef([]);

    // Logic remains exactly the same as your original file
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        showToast("Verifying OTP, please wait...", "info");

        const email = sessionStorage.getItem("email");

        try {
            await delay(1000);
            const response = await api.post("/verify-otp", {
                email,
                otp,
            });

            if (response.status === 200) {
                showToast("Success! Account verified. Redirecting...", "success");

                sessionStorage.setItem("userRole", "user");
                sessionStorage.setItem("isFirstLogin", "true");
                // Siguraduhing malinis ang email sa localStorage
                sessionStorage.removeItem("email"); 
                sessionStorage.removeItem("otpExpiry");
                if (response.data.user) {
                    sessionStorage.setItem("user", JSON.stringify(response.data.user)); 
                }
                
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/dashboard/overview");
                }, 2500);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Invalid OTP.", "error");
            setIsLoading(false);
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        
        // 1. Siguraduhin na numero lang ang tinatanggap
        if (!/^\d*$/.test(value)) return;

        // 2. Kunin ang current OTP array (gawin nating array para madaling i-manipulate)
        const otpArray = otp.split("");
        
        // 3. I-update ang specific index (kunin lang ang huling character)
        otpArray[index] = value.substring(value.length - 1);
        
        const newOtpValue = otpArray.join("");
        setOtp(newOtpValue);

        // 4. AUTO-FOCUS NEXT: Kung may nilagay na value, lipat sa susunod na box
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // BACKSPACE LOGIC
        if (e.key === "Backspace") {
            // Kung ang current box ay walang laman, i-focus ang previous box
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6); // Kunin ang unang 6 chars
        
        if (!/^\d+$/.test(pasteData)) return; // Siguraduhing numbers lang

        const newOtp = pasteData.padEnd(6, "").split(""); // Gawing array
        setOtp(pasteData); // I-update ang state

        // I-focus ang huling box na may laman o ang huling box mismo
        const lastIndex = Math.min(pasteData.length, 5);
        inputRefs.current[lastIndex].focus();
    };

    const handleResendOTP = async () => {
        const email = sessionStorage.getItem("email");
        if (!email) {
            showToast("Email not found.", "error");
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await api.post("/send-otp", {
                email,
            });

            if (response.status === 200) {
                showToast("OTP resent successfully!", "success");

                // I-set ang expiration time (kasalukuyang oras + 60,000ms)
                const expiryTime = Date.now() + 5 * 60 * 1000;
                sessionStorage.setItem("otpExpiry", expiryTime.toString());
                setTimeLeft(300); 
            } else {
                showToast(response.data.message || "Failed to resend OTP.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Error occurred.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEmailUpdated = (updatedEmail) => {
        setEmail(updatedEmail);
        sessionStorage.setItem("email", updatedEmail);
        setTimeLeft(60);
    };

    const [timeLeft, setTimeLeft] = useState(() => {
        const expiry = sessionStorage.getItem("otpExpiry");
        if (!expiry) return 0;
    
        const diff = Math.floor((parseInt(expiry) - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    });

    useEffect(() => {
        const syncTimer = () => {
            const expiry = sessionStorage.getItem("otpExpiry");
            if (!expiry) {
                setTimeLeft(0);
                return;
            }
    
            const remaining = Math.max(0, Math.floor((parseInt(expiry) - Date.now()) / 1000));
            setTimeLeft(remaining);
    
            // Kapag eksaktong umabot sa zero ang timer habang nagbabasa ang user
            if (remaining === 0) {
                sessionStorage.removeItem("otpExpiry");
                showToast("OTP has expired. Please request a new one.", "error");
            }
        };
    
        // 1. I-sync kada segundo base sa totoong natitirang oras sa system clock
        const timer = setInterval(syncTimer, 1000);
    
        // 2. I-sync kapag lumipat ng browser tab ang user at bumalik ulit (iwas freeze ng timer)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                syncTimer();
            }
        };
    
        window.addEventListener("visibilitychange", handleVisibilityChange);
        
        // Initial load sync
        syncTimer();
    
        return () => {
            clearInterval(timer);
            window.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary/20 relative text-left transition-colors duration-300">
            <BackgroundLoadingState isLoading={isLoading} />

            <ChangeEmailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentEmail={email} 
                onEmailUpdated={handleEmailUpdated} 
            />

            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-primary cursor-pointer transition-all font-black text-[11px] uppercase tracking-[0.2em] group z-50"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[480px] bg-card rounded-[2.5rem] shadow-xl border border-border overflow-hidden animate-fade-in card-hover">
                <form onSubmit={handleOTPSubmit} className="p-10 md:p-12">
                    <fieldset disabled={isLoading} className="space-y-8">
                    
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
                                <ShieldCheck size={28} className="text-primary" />
                            </div>
                            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Verify Email</h1>
                            <p className="text-[13px] text-foreground/50 font-medium leading-relaxed px-4 mb-4">
                                We've sent a 6-digit code to your email. Enter it below to secure your account.
                            </p>

                            {timeLeft === 0 ? (
                                <span className="text-[0.8rem] font-black text-red-500 tracking-widest animate-pulse">
                                    OTP Code Expired
                                </span>
                            ) : (
                                <span className="text-[0.8 rem] font-bold text-foreground/40 tracking-widest">
                                    Wait for {timeLeft}s to resend
                                </span>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* OTP Input Field */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                                        Verification Code
                                    </label>
                                    
                                    <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
                                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-tighter">Expires:</span>
                                        <span className="text-xs font-black text-primary tabular-nums">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-2 mb-8">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric" // Keyboard numeric para sa mobile
                                            maxLength={1}
                                            value={otp[index] || ""}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={handlePaste}
                                            className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons using your custom Button component */}
                            <div className="space-y-4 pt-2">
                                <Button
                                    buttonType="submit"
                                    variant="primary"
                                    type="rounded"
                                    disabled={isLoading}
                                    className="w-full py-4 text-[12px] tracking-[0.15em]"
                                >
                                    <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
                                    {!isLoading && <ArrowRight size={16} className="ml-2" />}
                                </Button>

                                <div className="pt-2 flex flex-col items-center gap-5">

                                    <div className="text-center w-full">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-4">Didn't receive the code?</p>
                                        <Button
                                            onClick={handleResendOTP}
                                            variant={timeLeft > 0 || isLoading ? "secondary" : "outline"}
                                            type="rounded"
                                            disabled={isLoading || timeLeft > 0}
                                            className="w-full py-3 text-[11px] tracking-widest border-border"
                                        >
                                            {isLoading ? "Sending..." : timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Code"}
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={handleOpenModal}
                                        variant="secondary"
                                        type="rounded"
                                        className="w-full py-3.5 text-[11px] tracking-widest border-none"
                                    >
                                        Change Email Address
                                    </Button>
                                </div>
                            </div>

                            {/* Footer Policy */}
                            <div className="border-t border-border pt-6">
                                <p className="text-[11px] text-center text-foreground/40 leading-relaxed max-w-xs mx-auto font-medium tracking-tight">
                                    By verifying, you agree to our 
                                    <a href="/terms" className="text-primary font-bold hover:underline mx-1">Terms</a> 
                                    and 
                                    <a href="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>

                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;
