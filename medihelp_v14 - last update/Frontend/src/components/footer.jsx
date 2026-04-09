import React from 'react';
import { Mail, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-card md:py-0">
            <div className="max-w-7xl mx-auto px-6 space-y-14">
                {/* MediHelp + Newsletter - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8">
                    {/* Left Side */}
                    <div className="text-center md:text-left flex flex-col justify-start">
                        <h3 className="text-6xl font-bold text-primary">MediHelp</h3>
                        <p className="mt-2 text-sm text-foreground/80 max-w-md">
                            Empowering healthcare through innovation and trusted guidance.
                        </p>
                    </div>
                    {/* Right Side - Newsletter */}
                    <div className="flex justify-end md:pb-0">
                        <div className="text-left w-full max-w-sm flex flex-col justify-start">
                        <h4 className="font-semibold text-foreground mb-3">
                            Subscribe to our Newsletter
                        </h4>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow px-4 py-2 text-sm text-foreground 
                                        placeholder-gray-400 focus:outline-none"
                            />
                            <button className="px-4 py-3 bg-primary text-white 
                                            hover:bg-primary/90 transition cursor-pointer">
                            <Mail className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-foreground/80 leading-relaxed">
                            By submitting this form, I agree to receive logistics news and marketing updates
                            from MediHelp via email. I understand I can unsubscribe at any time by clicking
                            the unsubscribe link in the email. For more information on how we handle your data, 
                            please see our <a href="#" className="text-primary font-semibold hover:font-bold hover:underline">Privacy Policy</a>.
                        </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links - 5 Columns */}
                <div className="pt-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-sm text-foreground/80 border-t border-gray-200">
                    <div className="text-left">
                        <h4 className="font-semibold text-foreground mb-3">About</h4>
                        <ul className="space-y-2">
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Our Mission</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Programs</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Community</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Careers</a></li>
                        </ul>
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-foreground mb-3">Resources</h4>
                        <ul className="space-y-2">
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Articles</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Brochures</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">FAQs</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Guides</a></li>
                        </ul>
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-foreground mb-3">Support</h4>
                        <ul className="space-y-2">
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Help Center</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Contact Us</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Feedback</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Accessibility</a></li>
                        </ul>
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-foreground mb-3">Legal</h4>
                        <ul className="space-y-2">
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Privacy Policy</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Terms & Conditions</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Disclaimer</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                    <div className='text-left'>
                        <h4 className="font-semibold text-foreground mb-3">Services</h4>
                        <ul className="space-y-2">
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Symptom Checker</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Health Tips</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Medication Guide</a></li>
                            <li className='text-gray-500 hover:text-primary hover:font-semibold'><a href="#">Emergency Resources</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - 2 Columns */}
                <div className="border-t border-gray-200 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/80">
                    {/* Left Side */}
                    <p className="mt-2 md:mt-0">
                        &copy; {new Date().getFullYear()} MediHelp. All rights reserved.
                    </p>
                    {/* Right Side - Social Links */}
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-transparent border-2 hover:bg-primary hover:text-white rounded-lg">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-transparent border-2 hover:bg-primary hover:text-white rounded-lg">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-transparent border-2 hover:bg-primary hover:text-white rounded-lg">
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-transparent border-2 hover:bg-primary hover:text-white rounded-lg">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;