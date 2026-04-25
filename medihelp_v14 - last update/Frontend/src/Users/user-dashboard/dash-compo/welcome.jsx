import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Sun, Sunrise, Moon } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const WelcomeSection = ({ getGreeting }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        params: { email },
                    });
                    const { firstName, lastName } = response.data;
                    const fullName = `${firstName} ${lastName}`;
                    setUserName(fullName);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchDetails();
    }, []);

    const tips = [
        "Remember to stay hydrated throughout the day!",
        "Take a few deep breaths to reduce stress.",
        "A short walk can boost your energy and mood.",
        "Don't forget to take breaks from screen time.",
        "Proper posture helps prevent back pain."
    ];

    const [healthTip, setHealthTip] = useState(tips[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Helper para sa dynamic icons base sa greeting
    const getGreetingDetails = () => {
        const greeting = getGreeting().toLowerCase();
        
        if (greeting.includes("morning")) {
            return {
                icon: <Sunrise className="text-amber-600" size={32} />,
                bgColor: "bg-amber-100" // Background para sa umaga
            };
        }
        if (greeting.includes("afternoon")) {
            return {
                icon: <Sun className="text-orange-600" size={32} />,
                bgColor: "bg-orange-100" // Background para sa hapon
            };
        }
        return {
            icon: <Moon className="text-indigo-600" size={32} />,
            bgColor: "bg-indigo-100" // Background para sa gabi
        };
    };

    const { icon, bgColor } = getGreetingDetails();

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6"
        >
            {/* Left Side: Greeting & Identity */}
            <div className="space-y-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${bgColor} rounded-xl transition-colors duration-500`}>
                        {icon}
                    </div>
                    <span className="text-[14px] font-black uppercase tracking-[0.4em] text-primary/60 italic">
                        {getGreeting()}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                    Hi, <span className="text-primary">{userName || 'User'}</span>!
                </h1>
                
                <p className="text-muted-foreground font-medium text-sm md:text-base max-w-md">
                    Welcome back to your <span className="font-bold text-foreground">MediHelp</span> command center. What’s on your mind today?
                </p>
            </div>

            {/* Right Side: Animated Health Tip Card */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full md:w-auto relative"
            >
                {/* Decorative Background Glow */}
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
                
                <div className="relative flex items-center gap-4 p-5 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[30px] shadow-2xl shadow-primary/5 min-w-[320px]">
                    <div className="relative">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform">
                            <Sparkles size={24} className="text-white animate-pulse" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={12} className="text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Health Tip</p>
                        </div>
                        <motion.p 
                            key={healthTip}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[12px] text-left font-bold text-foreground leading-relaxed max-w-[200px]"
                        >
                            "{healthTip}"
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeSection;