import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Stethoscope } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center space-y-8">
                
                {/* Visual Illustration */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="text-[12rem] font-black text-primary/5 select-none leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
                            <Stethoscope size={48} className="text-white" />
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
                        Oops! Page not found.
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        We can't seem to find the page you're looking for. It may have been moved or the link is broken.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-8 py-3 rounded-2xl border border-border bg-card hover:bg-muted transition-all font-bold text-sm active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    
                    <Link
                        to="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-primary text-white hover:opacity-90 transition-all font-bold text-sm shadow-lg shadow-primary/25 active:scale-95"
                    >
                        <Home size={18} />
                        Return Home
                    </Link>
                </motion.div>

                {/* Helpful Links */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border/50"
                >
                    {[
                        { label: "Need Help?", path: "/dashboard/help-support" },
                        { label: "Health Library", path: "/dashboard/guidance-library" },
                        { label: "Community", path: "/community" }
                    ].map((link, i) => (
                        <Link 
                            key={i} 
                            to={link.path} 
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;