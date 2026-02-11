import { cn } from '../lib/utils';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Features', href: '/#features' },
            { label: 'Resources', href: '/#resources' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Mobile App', href: '/mobile' },
        ],
        company: [
            { label: 'About Us', href: '/#about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Status Page', href: '/status' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Medical Disclaimer', href: '/disclaimer' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', href: '#' },
        { icon: Twitter, label: 'Twitter', href: '#' },
        { icon: Linkedin, label: 'LinkedIn', href: '#' },
        { icon: Instagram, label: 'Instagram', href: '#' },
    ];

    return (
        <footer id='contact' className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Stethoscope className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold text-primary">MediHelp</span>
                        </div>
                        <p className="text-sm text-left text-foreground/70 mb-4">
                            Your trusted AI-powered voice assistant for health information and guidance.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 text-foreground/60 hover:bg-primary hover:text-white transition-all duration-200"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    {link.href?.startsWith('/') ? (
                                        <Link to={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    {link.href?.startsWith('/') ? (
                                        <Link to={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    {link.href?.startsWith('/') ? (
                                        <Link to={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <a
                                    href="mailto:support@medihelp.com"
                                    className="text-sm text-foreground/70 hover:text-primary-600 transition-colors duration-200 break-all"
                                >
                                    support@medihelp.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <a
                                    href="tel:1-800-MEDIHELP"
                                    className="text-sm text-foreground/70 hover:text-primary-600 transition-colors duration-200"
                                >
                                    1-800-MEDIHELP
                                </a>
                            </li>
                            <li className="flex items-start text-left gap-3">
                                <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground/70 hover:text-primary-600 transition-colors duration-200">
                                    City of Bacoor • Cavite, Philippines
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/50 dark:bg-border/30 mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-foreground/70">
                        &copy; {currentYear} MediHelp. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        {footerLinks.legal.map((link) => (
                            link.href?.startsWith('/') ? (
                                <Link key={link.label} to={link.href} className="text-xs text-foreground/70 hover:text-primary transition-colors duration-300">
                                    {link.label}
                                </Link>
                            ) : (
                                <a key={link.label} href={link.href} className="text-xs text-foreground/70 hover:text-primary transition-colors duration-300">
                                    {link.label}
                                </a>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};