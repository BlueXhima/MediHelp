import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, Terminal } from 'lucide-react';
import BackgroundLoadingState from "../components/BackgroundLoadingState";
import { showToast } from "../components/ToastMessage";
import Button from "../components/ui/Button";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const AdminLogin = () => {
    useDocumentTitle("Admin Gateway"); //
    const navigate = useNavigate(); //
    
    const [email, setEmail] = useState(""); //
    const [password, setPassword] = useState(""); //
    const [showPassword, setShowPassword] = useState(false); //
    const [isLoading, setIsLoading] = useState(false); //
    const [captchaToken, setCaptchaToken] = useState(null); //
    const recaptchaRef = useRef(null); //

    const handleAdminLogin = async (e) => { //
        e.preventDefault(); //
        if (!email || !password || !captchaToken) { //
            showToast("Required fields missing for security clearance.", "error"); //
            return; //
        }

        setIsLoading(true); //
        try { //
            const response = await axios.post("http://localhost:5000/api/login", { //
                email, //
                password, //
                captchaToken //
            }, { withCredentials: true }); //

            if (response.data.success && response.data.role === 'admin') { //
                showToast("Administrative access granted.", "success"); //
                sessionStorage.setItem("userRole", "admin"); //
                setTimeout(() => navigate("/admin"), 1500); //
            } else { //
                showToast("Unauthorized Access Detected.", "error"); //
            }
        } catch (err) { //
            setCaptchaToken(null); //
            if (recaptchaRef.current) recaptchaRef.current.reset(); //
            showToast(err.response?.data?.error || "Credentials rejected.", "error"); //
        } finally { //
            setIsLoading(false); //
        }
    };

    return (
        <div className="h-screen w-full bg-[#0a0510] flex items-center justify-center p-4 selection:bg-primary/30 relative overflow-hidden">
            {/* Background Decorative Elements para sa Admin look */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" /> 
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" /> 
            
            <BackgroundLoadingState isLoading={isLoading} /> 

            {/* Back to Site Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.3em] z-50"
            >
                <ArrowLeft size={14} /> Back to Public Site
            </button>

            {/* Main Admin Card Container */}
            <div className="w-full max-w-110 bg-[#120a1d]/80 backdrop-blur-xl rounded-3xl sm:rounded-4xl shadow-2xl border border-white/5 overflow-hidden animate-fade-in relative z-10">
                
                {/* Header Section */}
                <div className="bg-linear-to-b from-white/5 to-transparent p-6 sm:p-10 pb-4 sm:pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-2xl mb-4 sm:mb-6 border border-primary/30">
                        <ShieldCheck size={28} className="text-primary animate-pulse" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase mb-1">Admin Portal</h2> 
                    <p className="text-[10px] sm:text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p> 
                </div>

                {/* Form Wrapper */}
                {/* PAGBABAGO: Dynamic padding din (px-6/pb-6 sa mobile, px-10/pb-10 sa desktop) upang hindi masakal ang reCAPTCHA */}
                <form onSubmit={handleAdminLogin} className="px-6 pb-6 sm:px-10 sm:pb-10 space-y-5 sm:space-y-6">
                    <div className="space-y-4">
                        {/* Admin Email */}
                        <div className="relative">
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin Identifier"
                                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all font-medium text-sm placeholder:text-white/20"
                                required
                            />
                        </div>

                        {/* Admin Password */}
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Security Key"
                                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all font-medium text-sm placeholder:text-white/20"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary p-2"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
                            </button>
                        </div>
                    </div>

                    {/* Security Verification (reCAPTCHA) */}
                    {/* PAGBABAGO: Gumamit ng overflow-x-auto at dynamic scaling para siguradong kasya kahit sa maliliit na screen gaya ng iPhone SE */}
                    <div className="flex justify-center py-1 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform scale-85 sm:scale-90 origin-center max-w-full overflow-hidden">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            theme="dark"
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={setCaptchaToken}
                        />
                    </div>

                    {/* Auth Button */}
                    <Button 
                        buttonType="submit"
                        variant="primary"
                        className="w-full py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-[11px] font-black tracking-[0.2em] shadow-primary/20 shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Initialize Login"} 
                        <Lock size={14} className="ml-2" /> 
                    </Button>

                    <div className="pt-2 sm:pt-4 flex items-center justify-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        <Terminal size={12} /> 
                        System v2.0.4.8 
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;