import React from 'react';
import { motion } from 'framer-motion';
import { 
    Heart, ShieldCheck, Brain, Target, Milestone, GraduationCap, ArrowRight 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const About = () => {
    const navigate = useNavigate();
    useDocumentTitle('About Us');

    // Minimalist Metric Rows
    const metrics = [
        { value: "99%", label: "Accuracy Simulation", icon: Brain },
        { value: "24/7", label: "Accessible Insights", icon: ShieldCheck },
        { value: "Instant", label: "Voice Processing", icon: Heart },
    ];

    // Core Principles Data (English & Streamlined)
    const coreValues = [
        {
            title: "Accessibility First",
            desc: "Breaking healthcare information barriers by allowing users to communicate naturally through voice interactions.",
            icon: Heart
        },
        {
            title: "Data Integrity",
            desc: "Providing clearly articulated, peer-reviewed medical data layout structures simulated to aid baseline knowledge discovery.",
            icon: ShieldCheck
        },
        {
            title: "Academic Excellence",
            desc: "Designed and prototyped with standard user-experience workflows as an official research contribution from CvSU Imus.",
            icon: GraduationCap
        }
    ];

    // Innovators Array
    const team = [
        { name: "Lead Researcher", role: "Full-Stack System Architect", initial: "LR" },
        { name: "UI/UX Specialist", role: "Interface & Animation Designer", initial: "US" },
        { name: "NLP Data Modeler", role: "Speech Synthesis Logician", initial: "ND" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col antialiased">
            <Navbar />

            {/* Adjusted from max-w-5xl to max-w-7xl for a wider grid distribution */}
            <main className="flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full space-y-16 sm:space-y-24 md:space-y-28">
                
                {/* HERO SECTION - Now scales beautifully in a wider 12-column template layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                        <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary">
                            Our Mission
                        </div>
                        
                        <h1 
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground uppercase leading-tight lg:leading-none"
                            style={{ fontFamily: "'Unesa', sans-serif" }}
                        >
                            Empowering Communities Through <span className="font-bold text-primary">Voice AI</span> Health
                        </h1>
                        
                        <p className="text-foreground/60 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
                            MediHelp was developed to accelerate and simplify the extraction of accurate healthcare updates. By utilizing advanced voice-interface simulation pipelines, it eliminates complex navigation schemas so vital foundational health literacy remains intuitive, immediate, and within reach for everyone.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                            <Button 
                                variant="primary" 
                                type="pill" 
                                size="md" 
                                trailingIcon={ArrowRight}
                                onClick={() => navigate('/how-it-works')}
                                className="w-full sm:w-auto"
                            >
                                How It Works
                            </Button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors cursor-pointer w-full sm:w-auto text-center py-2 sm:py-0"
                            >
                                Access Platform
                            </button>
                        </div>
                    </div>

                    {/* MINIMALIST METRICS MATRIX */}
                    <div className="lg:col-span-5 border border-border rounded-xl p-5 sm:p-6 bg-card/30 w-full">
                        <div className="border-b border-border pb-4 mb-4 sm:mb-6">
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-foreground/40 mb-1">Project Paradigm</h3>
                            <p className="text-xs sm:text-sm font-bold text-foreground">Cavite State University — Imus</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:gap-5">
                            {metrics.map((m, idx) => {
                                const MetricIcon = m.icon;
                                return (
                                    <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 gap-4">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <MetricIcon size={14} className="text-foreground/40 shrink-0" />
                                            <span className="text-xs font-semibold text-foreground/60 truncate">{m.label}</span>
                                        </div>
                                        <span className="text-sm sm:text-lg font-bold tracking-tight text-primary font-mono shrink-0">{m.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VISION & MISSION SPLIT ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 border-t border-border pt-12 sm:pt-16">
                    <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <Target size={16} className="shrink-0" />
                            <h3 className="text-xs font-bold tracking-widest uppercase">Our Vision</h3>
                        </div>
                        <p className="text-foreground/50 text-xs leading-relaxed font-medium max-w-xl">
                            To become a benchmark academic framework for voice-driven healthcare technologies, establishing inclusive digital bridges where language barriers and text navigation complexities no longer separate citizens from crucial foundational wellness insights.
                        </p>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <Milestone size={16} className="shrink-0" />
                            <h3 className="text-xs font-bold tracking-widest uppercase">Our Mission</h3>
                        </div>
                        <p className="text-foreground/50 text-xs leading-relaxed font-medium max-w-xl">
                            To equip ordinary users with standard interactive mock sandboxes and clear, immediate drug/symptom summary extraction tools. We aim to continually optimize human-centric UX rules within standard consumer health informatics.
                        </p>
                    </div>
                </div>

                {/* THE CORE PRINCIPLES GRID */}
                <div className="space-y-8 sm:space-y-12 border-t border-border pt-12 sm:pt-16">
                    <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase">Core Framework Principles</h2>
                        <p className="text-foreground/40 text-xs font-medium">The values driving the engineering behind the MediHelp dashboard architecture.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {coreValues.map((val, idx) => {
                            return (
                                <div key={idx} className="border border-border rounded-lg p-5 bg-card/10 space-y-3 sm:space-y-4">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                                        {val.title}
                                    </h4>
                                    <p className="text-foreground/50 text-xs leading-relaxed font-medium">
                                        {val.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MINIMAL TEAM COMPONENT */}
                <div className="border-t border-border pt-12 sm:pt-16 space-y-8 sm:space-y-10">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 sm:gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-primary">Behind The Code</p>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase">The Innovation Team</h2>
                        </div>
                        <p className="text-xs font-medium text-foreground/40 max-w-sm">
                            A dedicated research cohort working collaboratively to deliver seamless voice simulation experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {team.map((member, idx) => (
                            <div key={idx} className="border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors bg-card/20 group gap-3">
                                <div className="space-y-1 min-w-0">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors truncate">
                                        {member.name}
                                    </h4>
                                    <p className="text-[10px] font-semibold text-foreground/40 font-mono truncate">
                                        {member.role}
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono text-foreground/30 font-bold border border-border rounded px-1.5 py-0.5 shrink-0">
                                    {member.initial}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default About;