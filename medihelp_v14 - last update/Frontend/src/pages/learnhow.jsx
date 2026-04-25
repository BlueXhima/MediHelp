import React from "react";
import Navbar from '../components/navbar';
import { motion } from 'framer-motion';
import { 
    Mic, LayoutDashboard, HeartPulse, 
    Search, PlayCircle, ArrowRight, ArrowLeft,
    ShieldCheck, Smartphone, MousePointer2,
    LocateFixedIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LearnHow = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    };

    const steps = [
        { 
            icon: <LayoutDashboard />, 
            title: "Explore Dashboard", 
            desc: "Understand your health overview and navigation shortcuts.", 
        },
        { 
            icon: <Mic />, 
            title: "Voice Assistant", 
            desc: "Learn voice commands for hands-free health consultation." 
        },
        { 
            icon: <HeartPulse />, 
            title: "Manage Records", 
            desc: "How to securely access and update your medical history." 
        },
        { 
            icon: <ShieldCheck />, 
            title: "Privacy & Safety", 
            desc: "How we protect your data with end-to-end encryption." 
        },
        {
            icon: <LocateFixedIcon />,
            title: "Nearby Hospitals",
            desc: "Find the closest healthcare facilities in an emergency using real-time GPS tracking and navigation."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-24">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                    <div className="p-2 rounded-xl bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Go Back</span>
                </button>
            </div>
            
            {/* Hero Section - Compressed Padding */}
            <section className="relative pt-8 pb-10 px-6">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center space-y-4"
                >
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/20">
                        System Guide
                    </span>
                    <h1 className="text-4xl mt-4 md:text-5xl font-black text-foreground tracking-tighter leading-none uppercase italic">
                        Mastering <span className="text-primary">MediHelp.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-lg mx-auto font-medium">
                        New here? Let’s walk through the features designed to make your healthcare management seamless.
                    </p>
                </motion.div>
            </section>

            <main className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ x: 5 }}
                            onClick={() => {
                                const slug = step.title.toLowerCase().replace(/\s+/g, '-');
                                navigate(`/learn-how/system-guide-detail/${slug}`);
                            }}
                            className="flex items-start text-left gap-5 p-6 bg-card/50 border border-border rounded-[24px] hover:border-primary/30 transition-all group"
                        >
                            <div className="w-12 h-12 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                {React.cloneElement(step.icon, { size: 22 })}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black uppercase italic tracking-tight">{step.title}</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Video Resources Section - Tighter Headers */}
                <section className="space-y-6">
                    <div className="flex p-2 items-center justify-between border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500 rounded-lg text-white">
                                <PlayCircle size={20} />
                            </div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">Visual Guides</h2>
                        </div>
                        <Link to="/guides" className="text-[11px] font-black text-primary uppercase tracking-widest">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Mental Health Basics", tag: "Wellness" },
                            { title: "Healthy Eating Tips", tag: "Nutrition" }
                        ].map((video, idx) => (
                            <motion.div 
                                key={idx}
                                className="group relative bg-card rounded-[24px] overflow-hidden aspect-[16/9] shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                    <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-1">{video.tag}</span>
                                    <h3 className="text-white text-lg font-bold">{video.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Support CTA - Compact Banner */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-[40px] p-10 text-center overflow-hidden border border-border/50 shadow-2xl shadow-primary/5 group"
                >
                    {/* Animated Mesh Background */}
                    <div className="absolute inset-0 bg-card -z-10" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    {/* Floating Decorative Elements */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors duration-500" />
                    <div className="relative z-10 space-y-6">
                        {/* Subtle Badge */}
                        <div className="flex justify-center">
                            <span className="px-4 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                                Support Center
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tighter leading-none">
                                Still have <span className="text-primary">questions?</span>
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto font-medium leading-relaxed">
                                Our team is here to support your academic and health journey. Let’s make your well-being a priority.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link 
                                to="/support" 
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                            >
                                Contact Support
                            </Link>
                            <Link 
                                to="/dashboard/guidance-library" 
                                className="w-full sm:w-auto px-8 py-4 bg-secondary/50 text-foreground border border-border/50 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-secondary transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Open Library
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default LearnHow;