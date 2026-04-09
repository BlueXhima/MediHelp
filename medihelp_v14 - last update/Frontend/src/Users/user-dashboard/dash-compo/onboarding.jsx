import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Stethoscope } from "lucide-react";

// StepDots Component
const StepDots = ({ step }) => {
    return (
        <div className="flex space-x-3">
            {[1, 2, 3, 4, 5, 6].map((s) => (
                <span
                    key={s}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        step === s ? "bg-primary" : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
    );
};

const OnboardingModal = () => {
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false); // State to control modal visibility

    useEffect(() => {
        const isFirstLogin = localStorage.getItem("isFirstLogin");

        if (isFirstLogin === "true") {
            setIsVisible(true);
            localStorage.setItem("isFirstLogin", "false"); // Set to false after showing the modal
        }
    }, []);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const closeOnboarding = () => setIsVisible(false); // Function to close modal

    if (!isVisible) return null; // Hide modal when not visible

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-auto animate-pop-up">
                {/* Content per step */}
                <div className="space-y-4">
                    {step === 1 && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full">
                                <Stethoscope size={56} className="text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Welcome to MediHelp!</h2>
                            <p className="text-base text-gray-600 max-w-md leading-relaxed">
                                We’re excited to have you onboard. MediHelp is here to empower your healthcare journey.
                            </p>
                            {/* Step dots */}
                            <StepDots step={step} />
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 font-medium cursor-pointer"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
                            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                                Here’s how MediHelp will guide you through your healthcare journey.
                            </p>
                            <div className="grid grid-cols-1 gap-4 w-full">
                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <Stethoscope className="text-primary mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">Quick Profile Setup</h3>
                                        <p className="text-sm text-gray-600">Easily create your MediHelp profile.</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <CheckCircle className="text-green-600 mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">Secure Verification</h3>
                                        <p className="text-sm text-gray-600">Verify your account with confidence.</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <ArrowRight className="text-primary mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">Personalized Dashboard</h3>
                                        <p className="text-sm text-gray-600">Explore tools tailored to your needs.</p>
                                    </div>
                                </div>
                            </div>
                            {/* Step dots */}
                            <StepDots step={step} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Important Medical Disclaimer</h2>
                            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                                MediHelp is a healthcare information platform, not a diagnostic tool.
                            </p>
                            {/* Disclaimer Cards */}
                            <div className="grid grid-cols-1 gap-4 w-full">
                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <Stethoscope className="text-primary mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">No Diagnosis</h3>
                                        <p className="text-sm text-gray-600">
                                            MediHelp does not diagnose medical conditions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <CheckCircle className="text-green-600 mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">Definitions & Recommendations</h3>
                                        <p className="text-sm text-gray-600">
                                            We provide general health definitions and lifestyle recommendations.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                                    <ArrowRight className="text-primary mr-3" size={24} />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">No Appointments</h3>
                                        <p className="text-sm text-gray-600">
                                            MediHelp does not offer scheduling with doctors; it is purely informational.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Step dots */}
                            <StepDots step={step} />
                        </div>
                    )}

                    {step === 4 && (
                        <div className='flex flex-col items-center space-y-2'>
                            <div className="w-full text-left">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Setup your Personal Information
                                </h2>
                                <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                                    To provide you with personalized health insights, please take a moment to fill out your profile information.
                                </p>
                            </div>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4 border-r md:pr-6">
                                    <div className="grid grid-cols-2-span gap-4">
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gender
                                            </label>
                                            <select className="w-full border px-4 py-2 rounded-md focus:ring-primary">
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="text-left">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Height
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Height"
                                                className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weight
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Weight"
                                                className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Phone Number"
                                            className="w-full border px-4 py-2 rounded-md focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full text-left col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="w-full border px-4 py-3 rounded-md focus:ring-primary mb-2"
                                />
                            </div>
                            <StepDots step={step} />
                        </div>
                    )}

                    {step === 5 && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h2 className="text-3xl font-bold mb-4">Finalizing Your Setup</h2>
                            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                                You’re almost done! Review your information and make sure everything is correct before proceeding.
                            </p>
                            <div className="w-full grid grid-cols-1 gap-4">
                                <div className="p-4 border rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-gray-800">Profile Summary</h3>
                                    <p className="text-sm text-gray-600">Ensure your name, email, and other details are accurate.</p>
                                </div>
                                <div className="p-4 border rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-gray-800">Preferences</h3>
                                    <p className="text-sm text-gray-600">Double-check your selected preferences and settings.</p>
                                </div>
                            </div>
                            <StepDots step={step} />
                        </div>
                    )}

                    {step === 6 && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-22 h-22 flex items-center justify-center bg-green-100 rounded-full">
                                <CheckCircle size={46} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">All Set!</h2>
                            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                                Your MediHelp profile is now ready. Click Finish to explore your personalized dashboard and start your healthcare journey with us!
                            </p>
                            <StepDots step={step} />
                        </div>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-4 mb-4">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back
                        </button>
                    ) : (
                        <div />
                    )}
                    <div className="flex space-x-2">
                        {/* Step 2 → Next + Skip */}
                        {step === 2 && (
                            <>
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setStep(6)}
                                >
                                    Skip
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                                >
                                    Next <ArrowRight size={18} className="ml-1" />
                                </button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setStep(6)}
                                >
                                    Skip
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                                >
                                    Next <ArrowRight size={18} className="ml-1" />
                                </button>
                            </>
                        )}
                        {step === 4 && (
                            <>
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setStep(6)}
                                >
                                    Skip
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                                >
                                    Next <ArrowRight size={18} className="ml-1" />
                                </button>
                            </>
                        )}
                        {step === 5 && (
                            <>
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setStep(6)}
                                >
                                    Skip
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                                >
                                    Next <ArrowRight size={18} className="ml-1" />
                                </button>
                            </>
                        )}
                        {/* Step 6 → Finish */}
                        {step === 6 && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                                onClick={closeOnboarding} // Close modal on finish
                            >
                                Finish
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer links */}
                <p className="text-xs text-gray-500 text-center">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">
                        Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default OnboardingModal;