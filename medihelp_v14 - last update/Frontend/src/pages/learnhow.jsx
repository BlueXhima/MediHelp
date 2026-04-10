import React, { useState } from "react";
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { Book, Dumbbell, Smile, Pill } from 'lucide-react';

const LearnHow = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleSetupInfo = () => {
        console.log("Redirecting to personal information setup page...");
        // Add navigation logic here, e.g.,
        // navigate("/setup-personal-info");
        setIsOpen(false);
    };

    return (
        <>
            <Navbar />
            <div className="learn-how-page pt-20">
                {/* Hero Banner / Intro */}
                <section className="hero-banner bg-gradient-to-r from-indigo-500 to-teal-600 text-white text-center py-16">
                    <h1 className="text-5xl font-extrabold tracking-tight">Take Charge of Your Health</h1>
                    <p className="mt-6 text-xl font-light">Discover actionable guides to improve your well-being.</p>
                    <div className="mt-8 flex justify-center items-center">
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className="p-4 rounded-l-md w-1/2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button className="px-6 py-4 bg-teal-700 text-white rounded-r-md hover:bg-teal-800 transition-all">Search</button>
                    </div>
                </section>

                {/* Sidebar Navigation and Main Content */}
                <div className="flex">
                    {/* Sidebar Navigation */}
                    <aside className="w-1/4 bg-gray-50 p-6 shadow-sm sticky top-20 h-80">
                        <h2 className="text-2xl text-left font-semibold mb-6">Categories</h2>
                        <div className="space-y-4">
                            <button onClick={() => document.getElementById('nutrition').scrollIntoView({ behavior: 'smooth' })} className="flex items-center w-full text-left text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md px-4 py-2 transition-all">
                                <Book className="w-5 h-5 mr-2" /> Nutrition
                            </button>
                            <button onClick={() => document.getElementById('fitness').scrollIntoView({ behavior: 'smooth' })} className="flex items-center w-full text-left text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md px-4 py-2 transition-all">
                                <Dumbbell className="w-5 h-5 mr-2" /> Fitness
                            </button>
                            <button onClick={() => document.getElementById('mental-health').scrollIntoView({ behavior: 'smooth' })} className="flex items-center w-full text-left text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md px-4 py-2 transition-all">
                                <Smile className="w-5 h-5 mr-2" /> Mental Health
                            </button>
                            <button onClick={() => document.getElementById('medication-guides').scrollIntoView({ behavior: 'smooth' })} className="flex items-center w-full text-left text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md px-4 py-2 transition-all">
                                <Pill className="w-5 h-5 mr-2" /> Medication Guides
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-3/4 p-8">
                        {/* Card-based Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div id="nutrition" className="card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold mb-4">Nutrition</h3>
                                <p className="text-gray-600">Learn about balanced diets and healthy eating habits.</p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">Learn More</button>
                            </div>
                            <div id="fitness" className="card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold mb-4">Fitness</h3>
                                <p className="text-gray-600">Discover exercises and routines to stay fit.</p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">Learn More</button>
                            </div>
                            <div id="mental-health" className="card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold mb-4">Mental Health</h3>
                                <p className="text-gray-600">Tips and resources for mental well-being.</p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">Learn More</button>
                            </div>
                            <div id="medication-guides" className="card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold mb-4">Medication Guides</h3>
                                <p className="text-gray-600">Step-by-step guides for managing your medications.</p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">Learn More</button>
                            </div>
                        </section>

                        {/* Visual Aids */}
                        <section className="mt-12">
                            <h2 className="text-3xl font-bold mb-6">Visual Aids</h2>
                            <p className="text-gray-600 mb-8">Explore infographics, icons, and video tutorials to make learning easier.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="video-tutorial bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <h3 className="text-xl font-bold mb-4">How to Use the App</h3>
                                    <video controls className="w-full h-48 rounded-md">
                                        <source src="/videos/how-to-use.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="infographic bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <h3 className="text-xl font-bold mb-4">Healthy Eating Tips</h3>
                                    <video controls className="w-full h-48 rounded-md">
                                        <source src="/videos/healthy-eating-tips.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>

                {/* Call-to-action Footer */}
                <footer className="text-center py-8">
                    <div className="flex justify-center space-x-4">
                        <p className="text-gray-600">Need more help? <Link to="/support" className="text-indigo-600 hover:underline">Contact Support</Link></p>
                        <p className="text-gray-600">Explore more guides in our <Link to="/guides" className="text-indigo-600 hover:underline">Guidance Library</Link>.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default LearnHow;