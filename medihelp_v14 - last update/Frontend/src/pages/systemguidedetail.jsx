import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, CheckCircle2, PlayCircle, 
    Lightbulb, Info, ArrowRight, MousePointer2 
} from 'lucide-react';
import Navbar from '../components/navbar';

// Static Data Store
const FEATURE_GUIDES = {
    'explore-dashboard': {
        title: "Explore Dashboard",
        tagline: "Your Health Command Center",
        videoUrl: "https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=1000",
        accent: "text-orange-500",
        bgAccent: "bg-orange-500/10",
        overview: "The Dashboard is your personalized healthcare hub. It synchronizes your medical data, provides daily wellness tips, and offers quick access to AI-powered health assistance.",
        steps: [
            { 
                title: "Personalized Greeting", 
                desc: "Start your day with a dynamic welcome message and a daily health tip (e.g., hydration or stress relief) found in the Welcome Section." 
            },
            { 
                title: "Monitor Quick Stats", 
                desc: "Use the Quick Stats Bar to get an immediate visual overview of your key health metrics and activity summaries." 
            },
            { 
                title: "Voice Assistant Widget", 
                desc: "Access the integrated Voice Assistant directly from the dashboard for hands-free queries about your symptoms or records." 
            },
            { 
                title: "Quick Action Panel", 
                desc: "Need something fast? The Quick Action Panel contains shortcuts to the most frequently used tools in the MediHelp system." 
            },
            { 
                title: "Recent Guidance & Hub", 
                desc: "Stay updated by checking the Recent Guidance Card for new articles and the Health Hub for your comprehensive medical records." 
            },
            { 
                title: "Trust & Compliance", 
                desc: "Review the Trust Signals footer to verify our medical board certifications and AES-256 Encrypted status for your peace of mind." 
            }
        ],
        tips: [
            "The dashboard greeting changes based on the time of day—check in often for new health tips!",
            "Use the Quick Action Panel to skip long navigation menus."
        ]
    },
    'voice-assistant': {
        title: "Voice Assistant",
        tagline: "Hands-free health consultation",
        videoUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000",
        accent: "text-blue-500",
        bgAccent: "bg-blue-500/10",
        overview: "Our AI-powered voice assistant allows you to check symptoms and access medical records using natural language commands.",
        steps: [
            { title: "Enable Permissions", desc: "Click the microphone icon and allow browser access to your mic." },
            { title: "Wake Command", desc: "Simply say 'Hey MediHelp' or click the pulsating blue button to start." },
            { title: "Ask Questions", desc: "Try asking 'What are the symptoms of flu?' or 'Show my last medical record'." }
        ],
        tips: ["Speak clearly in a quiet environment.", "Use short, direct commands for better accuracy."]
    },
    'manage-records': {
        title: "Medical Records",
        tagline: "Secure health data management",
        videoUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000",
        accent: "text-emerald-500",
        bgAccent: "bg-emerald-500/10",
        overview: "Keep track of your medical history, prescriptions, and lab results in one encrypted and organized location.",
        steps: [
            { title: "Access Profile", desc: "Navigate to the 'Health Profile' tab from your dashboard to see your data." },
            { title: "View Timeline", desc: "Scroll through your chronological health entries, consultations, and updates." },
            { title: "Export Data", desc: "Generate a secure PDF summary of your records to share with your doctor." }
        ],
        tips: ["Update your records after every check-up.", "Check the 'Archived' section for older history data."]
    },
    'privacy-&-safety': {
        title: "Privacy & Safety",
        tagline: "Your data, your control",
        videoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000",
        accent: "text-purple-500",
        bgAccent: "bg-purple-500/10",
        overview: "We prioritize your security. MediHelp uses end-to-end encryption to ensure that only you and your authorized providers can see your health data.",
        steps: [
            { title: "Data Encryption", desc: "All medical records are encrypted before they are saved to our secure database." },
            { title: "Purge History", desc: "You have the right to be forgotten. Use the 'Purge' button to clear your search history anytime." },
            { title: "Access Logs", desc: "Monitor who accessed your records and when through our transparent security logs." }
        ],
        tips: ["Always log out when using a public computer.", "Enable Two-Factor Authentication for maximum security."]
    },
    'nearby-hospitals': {
        title: "Nearby Hospital",
        tagline: "Emergency Geolocation Service",
        videoUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1000",
        accent: "text-red-500",
        bgAccent: "bg-red-500/10",
        overview: "In critical moments, every second counts. MediHelp uses your device's GPS to instantly map out the nearest medical centers and provide the fastest routes to care.",
        steps: [
            { 
                title: "Access Emergency Map", 
                desc: "Click the 'Nearby Hospital' card on your dashboard to load the interactive medical facility map." 
            },
            { 
                title: "Enable Device GPS (Desktop)", 
                desc: "Open Settings > Privacy & Security > App Permissions > Location > Toggle Location Services to ON." 
            },
            { 
                title: "Enable Device GPS (Mobile)", 
                desc: "Go to Settings > Privacy > Location Services. Toggle the switch to ON and ensure your browser has permission." 
            },
            { 
                title: "Grant Browser Permission", 
                desc: "Look for the Lock Icon (🔒) on your browser's URL bar. Click it, find 'Location', and set it to 'Allow' then refresh the page." 
            },
            { 
                title: "Select & Navigate", 
                desc: "Tap on any red hospital marker to see the name. Click 'Get Directions' to launch Google Maps for real-time navigation." 
            }
        ],
        tips: [
            "Enable 'High Accuracy' mode in your mobile settings for better precision.",
            "Make sure your internet connection is stable to load real-time map markers."
        ]
    }
};

const SystemGuideDetail = () => {
    const { featureId } = useParams();
    const navigate = useNavigate();
    const guide = FEATURE_GUIDES[featureId];

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-black uppercase italic text-slate-400">Guide not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-28">
                {/* Back Button - Flex items-start ensures it stays left */}
                <div className="flex justify-start">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-10"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Guides</span>
                    </button>
                </div>

                {/* Content Wrapper - items-start para sa badges, text-left para sa typography */}
                <div className="flex flex-col items-start space-y-6 mb-16">
                    
                    {/* Feature Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${guide.bgAccent} ${guide.accent} rounded-full border border-current/10`}>
                        <Info size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-none">
                            Feature Walkthrough
                        </span>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-3 text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase italic tracking-tighter leading-[0.9]">
                            {guide.title}<span className="text-primary">.</span>
                        </h1>
                        <p className="text-primary/60 text-xs font-black uppercase tracking-[0.3em]">
                            {guide.tagline}
                        </p>
                    </div>

                    {/* Overview Text */}
                    <p className="text-muted-foreground text-left font-medium max-w-2xl text-lg md:text-xl leading-relaxed">
                        {guide.overview}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Side: Step by Step */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                        How it works <ArrowRight size={20} className="text-primary" />
                    </h2>
                    
                    <div className="space-y-4">
                        {guide.steps.map((step, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                className="flex gap-6 p-6 bg-card border border-border rounded-[24px] relative overflow-hidden group hover:border-primary/30 transition-all"
                            >
                                <div className="text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                                    0{idx + 1}
                                </div>
                                <div className="space-y-1 text-left">
                                    <h4 className="font-black uppercase italic tracking-tight text-foreground">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                                </div>
                                <CheckCircle2 className="absolute top-6 right-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Media & Tips */}
                <div className="space-y-8">
                    {/* Video Placeholder */}
                    <div className="space-y-4 group/video">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[12px] font-extrabold tracking-[0.2em] text-foreground flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                System Walkthrough
                            </h2>
                            {/* Aspect Ratio Badge */}
                            <span className="text-[10px] font-black px-2 py-0.5 bg-secondary text-muted-foreground rounded-md">
                                4K UHD
                            </span>
                        </div>
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="relative aspect-[4/5] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/5"
                        >
                            {/* Background Image with Blur Effect on Hover */}
                            <img 
                                src={guide.videoUrl} 
                                className="w-full h-full object-cover opacity-60 group-hover/video:scale-110 group-hover/video:opacity-40 transition-all duration-700 ease-out" 
                                alt="Tutorial Preview" 
                            />
                            {/* Dynamic Glassmorphism Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/video:opacity-40 transition-opacity" />
                            {/* Play Button - Floating & Pulsating */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse" />
                                    <button className="relative w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 group-hover/video:bg-primary group-hover/video:text-white">
                                        <PlayCircle size={36} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                            {/* Bottom Label Overlay */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transform translate-y-4 opacity-0 group-hover/video:translate-y-0 group-hover/video:opacity-100 transition-all duration-500">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                                        Now Playing: {guide.title} Demo
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pro Tips Box */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative p-8 bg-primary text-white rounded-[40px] space-y-6 shadow-2xl shadow-primary/30 overflow-hidden group"
                    >
                        {/* Decorative Background Pattern */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                        {/* Header with Animated Icon */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <Lightbulb size={20} className="text-white animate-pulse" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-black uppercase text-[10px] tracking-[0.3em] leading-none opacity-80">
                                    Optimization
                                </span>
                                <h3 className="font-black uppercase italic text-lg tracking-tighter">
                                    Pro Tips<span className="text-white/50">.</span>
                                </h3>
                            </div>
                        </div>
                        {/* Improved List with Glass effect separators */}
                        <ul className="space-y-4 relative z-10">
                            {guide.tips.map((tip, i) => (
                                <motion.li 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-[13px] text-left font-bold leading-relaxed flex items-start gap-4 p-3 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black">
                                        {i + 1}
                                    </div>
                                    <span className="opacity-90">{tip}</span>
                                </motion.li>
                            ))}
                        </ul>
                        {/* Subtle Footer for the card */}
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-50">
                                MediHelp Expert Advice
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Link to Dashboard */}
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full p-6 bg-card border border-border rounded-[32px] hover:bg-secondary/50 transition-all flex items-center justify-between group"
                    >
                        <span className="font-black uppercase italic tracking-tight text-sm text-left">Try this <br /> feature now</span>
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <MousePointer2 size={18} />
                        </div>
                    </button>
                </div>
            </main>

            <div className="max-w-7xl mx-auto px-6 mt-20 border-t border-border pt-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="space-y-1 text-left">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Next Walkthroughs</h3>
                        <p className="text-muted-foreground text-sm font-medium">Continue learning about the MediHelp system.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.keys(FEATURE_GUIDES)
                        .filter(key => key !== featureId) // Huwag ipakita yung current page
                        .slice(0, 4) // Pakita lang ang next 3
                        .map((key) => (
                            <button
                                key={key}
                                onClick={() => navigate(`/learn-how/system-guide-detail/${key}`)}
                                className="p-6 bg-card/40 border border-border rounded-[24px] text-left hover:border-primary/50 hover:bg-card transition-all group"
                            >
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${FEATURE_GUIDES[key].accent}`}>
                                    Learn Next
                                </span>
                                <h4 className="text-lg font-black uppercase italic tracking-tight mt-1 group-hover:text-primary transition-colors">
                                    {FEATURE_GUIDES[key].title}
                                </h4>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    View Guide <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default SystemGuideDetail;