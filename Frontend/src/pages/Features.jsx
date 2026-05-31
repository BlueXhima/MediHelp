import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Features = () => {
    useDocumentTitle('Features');

    const features = [
        { 
            title: "Clinical-Grade Accuracy", 
            description: "Access a repository of peer-reviewed medical data. We filter through complex literature to provide you with the most reliable health insights available today.",
            benefit: "Eliminate medical anxiety with verified facts." 
        },
        { 
            title: "Adaptive Translation", 
            description: "Our engine deconstructs dense medical terminology into intuitive, everyday language tailored to your level of health literacy.",
            benefit: "Understand your health reports without needing a medical degree." 
        },
        { 
            title: "Personalized Action Plans", 
            description: "Receive step-by-step guidance curated based on your symptoms or health goals, moving you from observation to action seamlessly.",
            benefit: "Know exactly what to do next, every single time." 
        },
        { 
            title: "Hands-Free Health Assistant", 
            description: "Leverage our voice-first interface to get immediate answers while you're busy or caring for a loved one.",
            benefit: "Get critical information when your hands are full." 
        },
        { 
            title: "Unified Health Records", 
            description: "Centralize your health journey. Track trends, log symptoms, and visualize your progress over time in a secure, encrypted space.",
            benefit: "See the big picture of your health evolution." 
        },
        { 
            title: "Data Sovereignty", 
            description: "Your health history is your private property. We use end-to-end encryption to ensure your data is never accessible to unauthorized third parties.",
            benefit: "Total peace of mind with enterprise-grade privacy." 
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto pt-28 px-6 py-24">
                {/* Header Section */}
                <header className="mb-24">
                    <h2 className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">Our Core Pillars</h2>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.95]">
                        Health clarity <br/>for everyone.
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-lg leading-relaxed">
                        We don't just provide data; we provide pathways. Here is how we redefine your relationship with medical information.
                    </p>
                </header>

                {/* Features Grid */}
                <section className="grid md:grid-cols-2 gap-x-16 gap-y-20 mb-32">
                    {features.map((f, i) => (
                        <div key={i} className="group border-t border-border pt-8 hover:border-primary/50 transition-colors duration-500">
                            <h3 className="text-2xl font-semibold mb-3 tracking-tight">{f.title}</h3>
                            <p className="text-foreground/50 leading-relaxed mb-4">{f.description}</p>
                            <div className="inline-block px-3 py-2 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                {f.benefit}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Deep Dive Section */}
                <section className="bg-card border border-border/50 p-12 md:p-20 rounded-3xl shadow-sm">
                    <h2 className="text-4xl font-bold mb-6 text-foreground tracking-tight">Designed for real-world impact.</h2>
                    <p className="text-foreground/70 mb-10 max-w-2xl text-lg leading-relaxed">
                        Traditional medical portals are built for doctors. We are built for humans. Whether you're managing a chronic condition or just staying informed, we provide the tools to keep you in control.
                    </p>
                    <Link to="/about-us" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all">
                        Discover our mission
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Features;