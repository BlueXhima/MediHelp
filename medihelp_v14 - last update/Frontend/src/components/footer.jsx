import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Send, Stethoscope, Mail } from 'lucide-react';

const Footer = () => {
    return (
        // bg-card and border-border are used for Semantic Theme support
        <footer className="bg-card border-t border-border transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Brand & Main CTA Column (Inspire by Left side of image) */}
                    <div className="md:col-span-1 lg:col-span-6 space-y-7 md:space-y-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2.5 text-primary">
                            <Stethoscope size={28} strokeWidth={2.5} className="md:scale-125" />
                            <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                                MediHelp
                            </h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-foreground tracking-tight max-w-sm mx-auto md:mx-0">
                            Empowering Your <br className='hidden md:block'/> Health Decisions.
                        </h2>
                        <div className="pt-2">
                            <button className="group relative px-7 py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 overflow-hidden mx-auto md:mx-0">
                                <Mail size={16} className="relative z-10" />
                                <span className="relative z-10">Contact Support</span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Columns (Inspire by Right side of image) */}
                    <div className="md:col-span-1 lg:col-span-6 grid grid-cols-2 gap-x-8 gap-y-10 text-center md:text-left lg:pt-0 lg:pl-10">
                        {/* Column 1 */}
                        <div>
                            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-[0.2em] mb-7">Platform</h4>
                            <ul className="space-y-5 text-md text-foreground/70 font-medium leading-relaxed">
                                {['Symptom Checker', 'Health Resources', 'Community Forum'].map((item) => (
                                    <li key={item} className="group flex items-center gap-2 justify-center md:justify-start">
                                        {/* Subtle Arrow on hover */}
                                        <span className="text-primary w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300">→</span>
                                        <a href="#" className="hover:text-primary transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Column 2 */}
                        <div>
                            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-[0.2em] mb-7">Information</h4>
                            <ul className="space-y-5 text-md text-foreground/70 font-medium leading-relaxed">
                                {[
                                    { name: 'Help Center', path: '/help-support' },
                                    { name: 'About Us', path: '/about-us' },
                                    { name: 'Privacy Policy', path: '/privacy' },
                                    { name: 'Medical Disclaimer', path: '/disclaimer' },
                                    { name: 'Terms of Service', path: '/terms' },
                                    { name: 'Security', path: '/security' }
                                ].map((item) => (
                                    <li key={item.name} className="group flex items-center gap-2 justify-center md:justify-start">
                                        <span className="text-primary w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300">→</span>
                                        {/* Use 'Link' from react-router-dom if you are using it for navigation */}
                                        <a href={item.path} className="hover:text-primary transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Clean and Balanced */}
                <div className="mt-10 py-6 border-t border-border flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    <p className="text-xs md:text-sm text-foreground/50 font-medium">
                        &copy; {new Date().getFullYear()} MediHelp. AI Healthcare Guidance Tool.
                    </p>
                    
                    {/* Social Icons - Balanced with Glassmorphism effect */}
                    <div className="flex items-center gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                            <a 
                                key={idx} 
                                href="#" 
                                aria-label={`Follow us on ${Icon.name}`}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border text-foreground/40 hover:bg-primary/5 hover:border-primary/20 hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
                            >
                                <Icon size={19} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;