import React from 'react';
import ImageBanner from '../assets/hero-banner.avif';

const HeroBanner = () => {
    return (
        <section className="bg-blue py-14">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Image */}
                <div className="flex justify-center md:justify-start"> 
                    {/* Placeholder for image/illustration */}
                    <img src={ImageBanner} alt="MediHelp Hero Banner" className="rounded-full shadow-md" />
                </div>

                {/* Right Side: Content */}
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-blue-foreground leading-relaxed">
                        Empowering You to Stay <br /> Informed
                    </h2>
                    <p className="mt-2 text-blue-foreground/80 max-w-md">
                        Ask MediHelp about symptoms, receive practical health tips, and explore trusted resources — 
                        empowering you to stay informed and make better health decisions.
                    </p>
                    {/* CTA Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-start gap-4">
                        <button className="px-4 py-3 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-900 transition cursor-pointer">
                            Start Asking Now
                        </button>
                        <button className="px-4 py-3 bg-teal-500 text-white text-sm rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer">
                            Explore Health Resources
                        </button>
                        <button className="px-4 py-3 bg-indigo-500 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer">
                            Get Trusted Health Tips
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;