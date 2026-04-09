import React, { useState } from 'react';
import { ArrowRight, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState("email");
    const navigate = useNavigate();

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (step === "email") {
            // Simulate verifying email and moving to password reset step
            setStep("reset");
        } else if (step === "reset") {
            if (newPassword === confirmPassword) {
                setMessage("Your password has been successfully updated. You can now log in with your new password.");
                setStep("success");
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 1 second
            } else {
                setMessage("Passwords do not match. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md p-6">
                <Stethoscope size={48} className="mx-auto mb-4 text-primary" aria-hidden="true" />
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    {step === "email" ? "Forgot Password" : step === "reset" ? "Reset Password" : "Success"}
                </h2>

                {/* Instructional text only for email/reset steps */}
                {step !== "success" && (
                    <p className="text-sm text-gray-600 text-center mb-4">
                        {step === "email"
                            ? "Enter your email address below to verify your account and proceed to reset your password."
                            : "Enter your new password below to reset it."}
                    </p>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
                    {step === "email" && (
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                            />
                        </div>
                    )}
                    {step === "reset" && (
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                                />
                            </div>
                        </>
                    )}
                    {step !== "success" && (
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition font-medium cursor-pointer flex items-center justify-center">
                            {step === "email" ? "Verify Email" : "Create New Password"}
                        </button>
                    )}
                </form>

                {message && (
                    <p className={`mt-4 text-sm text-center ${step === "success" ? "text-black" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                {/* Links */}
                {step !== "success" && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Remembered your password?
                        <a href="/login" className="text-primary font-semibold hover:underline ml-1">
                            Login here
                            <ArrowRight className="ml-1 h-4 w-4 inline" aria-hidden="true" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;