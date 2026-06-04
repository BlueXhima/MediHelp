import React from 'react';
import * as Icons from 'lucide-react';
import { SocialIcon } from 'react-social-icons';
import MediHelpLogo from '/MediHelpLogo.png'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: [
                { name: "Features", href: "/features" },
                { name: "Testimonials", href: "/reviews" }
                // { name: "FAQ", href: "/help-support/all-faqs" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Documentation", href: "/documentation" },
                { name: "Health Library", href: "/learn" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about-us" },
                { name: "Contact", href: "/contact-support" },
                { name: "Partners", href: "/partners" }
            ]
        }
    ];

    const socialLinks = [
        { url: 'https://facebook.com/medihelp' },
        { url: 'https://instagram.com/medihelp' },
        { url: 'https://x.com/medihelp' },
        { url: 'https://linkedin.com/company/medihelp' }
    ];

    return (
        <footer className="w-full bg-card border-t border-border transition-colors duration-500 pt-24 pb-12 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
                    
                    {/* Brand Identity - Focused on Premium Purple */}
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="w-12 h-12 flex items-center justify-center transition-transform hover:rotate-6 duration-300">
                                <img 
                                    src={MediHelpLogo} 
                                    alt="MediHelp Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-4xl font-black tracking-tighter text-primary" 
                                style={{ fontFamily: "'Unesa', sans-serif" }}>
                                MEDIHELP
                            </span>
                        </div>
                        <p className="text-foreground/50 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            Empowering Filipinos with accessible, AI-driven health literacy. 
                            Your journey to a healthier life starts with understanding.
                        </p>
                        
                        {/* Glassmorphism Socials */}
                        <div className="flex justify-center md:justify-start gap-3">
                            {socialLinks.map((social, i) => (
                                <div key={i} className="hover:-translate-y-1 transition-transform duration-300">
                                    <SocialIcon 
                                        url={social.url} 
                                        style={{ height: 35, width: 35 }}
                                        bgColor="transparent" 
                                        fgColor="currentColor"
                                        className="text-foreground/40 hover:text-primary border border-border hover:border-primary/20 rounded-xl bg-card transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Grid - Improved Spacing */}
                    <div className="flex-2 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-10">
                        {footerSections.map((section) => (
                            <div key={section.title} className="space-y-7 text-center md:text-left">
                                <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link.name} className="group flex items-center gap-2 justify-center md:justify-start">
                                            <span className="text-primary w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300">→</span>
                                            <a href={link.href} className="text-sm font-medium text-foreground/50 hover:text-primary transition-colors duration-200">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section - Balanced and Clean */}
                <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[11px] font-medium text-foreground/40 tracking-widest text-center md:text-left">
                        © {currentYear} MediHelp • AI Healthcare Guidance • CvSU Imus Project
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-4 text-[11px] font-bold text-foreground/40 uppercase tracking-tighter">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        </div>
                        <div className="hidden md:block h-4 w-px bg-border"></div>
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                            <span>Crafted with</span>
                            <Icons.Heart size={18} className="text-rose-800 animate-pulse" />
                            <span className="font-semibold text-foreground">by Team MediHelp</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
