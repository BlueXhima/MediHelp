import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage, { showToast } from "../../components/ToastMessage";
import { ArrowLeft, Stethoscope } from "lucide-react";
import axios from "axios";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";

const OTPVerification = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Helper function para sa delay
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
        setIsLoading(true);

        const email = localStorage.getItem("email"); // Retrieve email from local storage

        if (!email) {
            showToast("Email is required. Please register again.", "error");
            setIsLoading(false);
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
        navigate("/register?changeEmail=true"); // Redirect to Register page with query parameter
    };

    return (
        <div className="flex flex-col justify-between min-h-screen bg-gray-100">
            <ToastMessage />
            <BackgroundLoadingState isLoading={isLoading} />

            {/* Top Icon and Title */}
            <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-2">
                    <Stethoscope size={32} className="text-foreground" aria-hidden="true" />
                    <h1 className="text-3xl font-bold text-foreground">MediHelp</h1>
                </div>
            </div>

            {/* OTP Verification Card */}
            <div className="flex items-center justify-center flex-grow">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-center justify-start justify-between mb-4">
                        <button
                            type="button"
                            className="flex items-center text-sm text-foreground bg-transparent 
                                border border-border hover:text-white px-2 py-1 rounded-md 
                                hover:bg-gray-600 transition cursor-pointer"
                            onClick={() => navigate("/register")}
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2">OTP Verification</h2>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        Please enter the OTP sent to your registered email address.
                    </p>
                    {/* OTP input boxes */}
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    id={`otp-${i}`}
                                    maxLength="1"
                                    className="w-14 h-14 text-center border rounded-md text-2xl font-semibold mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Mag-focus sa susunod na box kung may laman at hindi pa dulo
                                        if (value.length === 1 && i < 5) {
                                            const nextInput = document.getElementById(`otp-${i + 1}`);
                                            if (nextInput) nextInput.focus();
                                        }
                                        const otpArray = otp.split("");
                                        otpArray[i] = value;
                                        setOtp(otpArray.join(""));
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && e.target.value === "" && i > 0) {
                                            const prevInput = document.getElementById(`otp-${i - 1}`);
                                            if (prevInput) prevInput.focus();
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const pasteData = e.clipboardData.getData("text").slice(0, 6);
                                        const otpArray = pasteData.split("");
                                        otpArray.forEach((char, index) => {
                                            const input = document.getElementById(`otp-${index}`);
                                            if (input) {
                                                input.value = char;
                                            }
                                        });
                                        setOtp(pasteData);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 
                                transition font-medium cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    {/* Resend link */}
                    <p className="text-sm text-center text-gray-600 mt-4">
                        Didn’t receive the email?{" "}
                        <button 
                            type="button" 
                            className="text-primary font-medium hover:underline cursor-pointer"
                            onClick={handleResendOTP}
                            disabled={isLoading}
                        >
                            Resend
                        </button>
                    </p>

                    {/* Change email button */}
                    <div className="mt-4">
                        <button
                            type="button"
                            className="w-full border py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={handleChangeEmail}
                        >
                            Change Email
                        </button>
                    </div>

                    {/* Terms and Privacy */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        By verifying, you agree to our{" "}
                        <a href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;