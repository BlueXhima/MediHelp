import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = ({ progress }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const toggleVisibility = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(currentScroll > 300);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[999] cursor-pointer w-14 h-14 flex items-center justify-center bg-card backdrop-blur-xl border border-border/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] group"
                >
                    {/* Dynamic Progress Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                        <circle
                            cx="24" cy="24" r="21"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="24" cy="24" r="21"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ 
                                pathLength: (progress || 0) / 100,
                                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                            }}
                            className="text-primary"
                        />
                    </svg>

                    {/* Icon with Hover Animation */}
                    <div className="relative z-10 flex flex-col items-center">
                        <ChevronUp 
                            size={22} 
                            className="text-primary transition-transform duration-300 group-hover:-translate-y-1" 
                        />
                        <div className="h-0.5 w-0 group-hover:w-3 bg-primary rounded-full transition-all duration-300" />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;