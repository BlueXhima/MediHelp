import React from 'react';
import heroimg2 from "../../assets/register-photo.jpeg";
import buttonlogo from "../../assets/google.png";
import { Stethoscope, ArrowRight, Eye } from 'lucide-react';


const Register = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            {/* Left Side */}
            <div className="relative bg-cover bg-center h-screen sticky top-0" style={{backgroundImage: `url(${heroimg2})`}}>
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
            <div className="flex flex-col justify-center px-8 py-12 relative h-full overflow-y-auto">
                {/* Top-right link */}
                <div className="absolute top-6 right-8 pb-4 text-sm text-foreground/80 font-semibold">
                    Already have an account? 
                    <a href="/login" className="inline-flex items-center text-foreground font-semibold border-b-2 border-transparent hover:text-primary hover:border-primary ml-1">
                        Login here
                        <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </a>
                </div>

                {/* Form content */}
                <div className="w-full max-w-md items-center mx-auto mt-auto mb-auto">
                    <div className="text-center mt-6">
                        <h2 className="text-4xl font-bold text-foreground">Create an Account</h2>
                        <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                            Join now and start your journey towards better health with tools designed to empower you every step of the way.
                        </p>
                    </div>

                    <form className="mt-6 space-y-4">
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
                                className="border px-4 py-2 rounded-md" 
                            />
                        </div>
                        {/* Password */}
                        <div className="flex flex-col text-left">
                            <label className="text-sm font-medium text-foreground mb-1">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <div className="flex w-full">
                                {/* Input field */}
                                <input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    className="flex-grow border border-r-0 px-4 py-2 rounded-l-md" 
                                />
                                {/* Eye toggle button */}
                                <button 
                                    type="button" 
                                    className="border border-l-1 px-3 py-2 bg-transparent hover:bg-gray-200 
                                                rounded-r-md text-gray-600 flex items-center justify-center
                                                cursor-pointer"
                                >
                                    <Eye size={18} aria-hidden="true" />
                                </button>
                            </div>

                            {/* Helper text */}
                            <p className="mt-2 text-xs text-foreground/70 leading-relaxed">
                                Password must be at least <span className="font-medium">14 characters</span>, 
                                or at least <span className="font-medium">8 characters</span> long including 
                                <span className="font-medium"> one number</span> and 
                                <span className="font-medium"> one lowercase letter</span>.
                            </p>
                        </div>
                        {/* Register button */}
                        <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90
                                            transition font-medium cursor-pointer">
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
                            <a href="#" className="text-primary font-semibold underline-offset-2 hover:underline ml-1 mr-1">
                                Terms & Conditions
                            </a> 
                            and 
                            <a href="#" className="text-primary font-semibold underline-offset-2 hover:underline ml-1">
                                Privacy Policy
                            </a>. 
                            You acknowledge that your information may be used to personalize your experience, 
                            provide secure access to our services, and communicate important updates. 
                            Please review these policies carefully to understand your rights and responsibilities.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;