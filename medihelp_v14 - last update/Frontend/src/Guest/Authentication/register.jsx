import React, { useState, useEffect } from 'react';
import heroimg2 from "../../assets/unnamed.jpg";
import buttonlogo from "../../assets/google.png";
import { Stethoscope, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from "axios"; // Import axios for API requests
import ToastMessage, { showToast } from "../../components/ToastMessage";
import BackgroundLoadingState from "../../components/BackgroundLoadingState";
import { useNavigate } from "react-router-dom";
import "./register.css";

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
                            “Engaging Healthcare with trust and compassion.”
                        </blockquote>
                        <p className="mt-2 text-md text-foreground/80">
                            Join our mission to make healthcare accessible, transparent, and meaningful 
                            for everyone, everywhere.
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-center px-8 py-8 relative">
                    {/* Form content */}
                    <div className="w-full max-w-md items-center mx-auto mt-auto mb-auto">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-foreground">Create an Account</h2>
                            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                                Join now and start your journey towards better health with tools designed to empower you every step of the way.
                            </p>
                        </div>

                        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                            {/* First + Last Name */}
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">
                                        First Name<span className="text-foreground"> *</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your first name" 
                                        className="border px-4 py-2 rounded-md" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">
                                        Last Name<span className="text-foreground"> *</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your last name" 
                                        className="border px-4 py-2 rounded-md" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div className="flex flex-col text-left">
                                <label className="text-sm font-medium text-foreground mb-1">
                                    Email<span className="text-foreground"> *</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`border px-4 py-2 rounded-md transition duration-200 focus:outline-none ${
                                    emailError
                                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-2"
                                    }`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="mt-1 text-sm text-red-500">{emailError}</p>
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
                                        onChange={handlePasswordChange}
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
                                                    rounded-r-md text-gray-600 flex items-center justify-center cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} aria-hidden="true" />
                                        ) : (
                                            <Eye size={18} aria-hidden="true" />
                                        )}
                                    </button>
                                </div>

                                {/* Conditional Helper Text */}
                                {password.length === 0 ? (
                                    <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
                                        Password must be at least <span className="font-medium">14 characters</span>, 
                                        or at least <span className="font-medium">8 characters</span> long including 
                                        <span className="font-medium"> one number</span> and 
                                        <span className="font-medium"> one lowercase letter</span>.
                                    </p>
                                ) : (
                                    <div className="mt-2">
                                        <p
                                            className={`text-xs font-medium ${
                                            passwordStrength === "Weak"
                                                ? "text-red-500"
                                                : passwordStrength === "Medium"
                                                ? "text-yellow-500"
                                                : "text-green-600"
                                            }`}
                                        >
                                            Password strength: {passwordStrength}
                                        </p>
                                        {/* Progress bar */}
                                        <div className="w-full h-2 bg-gray-200 rounded mt-1">
                                            <div
                                                className={`h-2 rounded ${
                                                    passwordStrength === "Weak"
                                                    ? "bg-red-500 w-1/3"
                                                    : passwordStrength === "Medium"
                                                    ? "bg-yellow-500 w-2/3"
                                                    : "bg-green-600 w-full"
                                            }`}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Register button */}
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition font-medium cursor-pointer"
                                disabled={isLoading} // Disable button while loading
                                onClick={() => console.log("Register button clicked")}
                            >
                                Register
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
                            {/* Terms and conditions */}
                            <p className="mt-4 text-xs text-left text-center text-foreground/70 leading-relaxed">
                                By creating an account, you agree to our
                                <a href="/terms" className="text-primary font-semibold hover:underline ml-1 mr-2">
                                    Terms & Conditions
                                </a> 
                                and 
                                <a href="/privacy" className="text-primary font-semibold hover:underline ml-1">
                                    Privacy Policy
                                </a>. 
                                You acknowledge that your information may be used to personalize your experience, 
                                provide secure access to our services, and communicate important updates. 
                                Please review these policies carefully to understand your rights and responsibilities.
                            </p>
                            {/* Bottom link */}
                            <div className="flex items-center justify-center text-sm text-foreground/80 font-semibold">
                                Already have an account? 
                                <a href="/login" className="inline-flex items-center text-foreground font-semibold border-b-2 border-transparent hover:text-primary hover:border-primary ml-1">
                                    Login here
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

export default Register;