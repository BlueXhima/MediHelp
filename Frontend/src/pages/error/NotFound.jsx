import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    // I-check kung logged in ang user para sa tamang redirect fallback
    const handleGoBack = () => {
        const userRole = localStorage.getItem('userRole');
        if (userRole) {
            navigate('/dashboard/overview');
        } else {
            navigate('/landingpage');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground selection:bg-primary/20">
            <div className="w-full max-w-md flex flex-col items-center text-center">
                
                {/* 🎭 Animated Icon Wrapper */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="mb-8 p-6 rounded-full border border-border bg-card shadow-sm text-primary/80"
                >
                    <HelpCircle size={48} strokeWidth={1.5} className="animate-pulse" />
                </motion.div>

                {/* Typography Block */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-3"
                >
                    <h1 className="text-7xl font-black tracking-tighter text-primary">404</h1>
                    <h2 className="text-xl font-bold tracking-tight">Page Not Found</h2>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        Sorry, the medical info portal or page you are looking for doesn't exist or has been moved.
                    </p>
                </motion.div>

                {/* 🎯 Interactive Navigation Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3 mt-10 w-full justify-center"
                >
                    {/* Go back dynamic handler */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border bg-card text-xs font-bold uppercase tracking-wider text-foreground/80 hover:bg-accent hover:text-foreground transition-all cursor-pointer active:scale-98"
                    >
                        <Home size={14} />
                        Return Home
                    </button>

                    {/* Simple browser navigation history back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </button>
                </motion.div>
                
            </div>
        </div>
    );
};

export default NotFound;