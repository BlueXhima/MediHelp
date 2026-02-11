import React, { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';

export const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus('');

        // Simulate sending the message. Replace with real API call as needed.
        try {
            await new Promise((res) => setTimeout(res, 800));
            setStatus('Message sent successfully.');
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-8">
                <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Left column: Information */}
                        <aside className="space-y-6 p-4">
                            {/* Title */}
                            <h2 className="text-4xl font-semibold text-foreground mb-2 text-left">Get In Touch</h2>

                            {/* Contact Info */}
                            <div className="text-sm text-gray-700 mt-4 space-y-4 text-left">
                                <div>
                                    <h5 className="font-medium text-foreground">Email:</h5>
                                    <p className="text-foreground-600">support@medihelp.com</p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-foreground">Phone:</h5>
                                    <p className="text-foreground-600">1-800-MEDIHELP</p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-foreground">Address:</h5>
                                    <p className="text-foreground-600">City of Bacoor • Cavite, Philippines</p>
                                </div>
                            </div>

                            {/* Socials */}
                            <div>
                                <h5 className="text-md text-foreground font-medium mt-4 mb-2 text-left">Follow Us</h5>
                                <div className="flex space-x-4">
                                    <a href="#" aria-label="Facebook" className="text-indigo-600">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="#" aria-label="Instagram" className="text-indigo-600">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" aria-label="LinkedIn" className="text-indigo-600">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* Right column: Contact form (inputs) */}
                        <section aria-labelledby="contact-form" className="p-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm text-left font-medium text-gray-700">Your Name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder='Enter your name'
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            className={cn(
                                                    "mt-2 block h-8 w-full px-3 py-2 text-sm rounded-md shadow-sm",
                                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                                                    "border border-gray-300 bg-gray-100 text-gray-900",
                                                    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                                                    )}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm text-left font-medium text-gray-700">Email Address</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder='example@gmaill.com'
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            className={cn(
                                                    "mt-2 block h-8 w-full px-3 py-2 text-sm rounded-md shadow-sm",
                                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                                                    "border border-gray-300 bg-gray-100 text-gray-900",
                                                    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                                                    )}                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm text-left font-medium text-gray-700">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        placeholder='Type your message here...'
                                        required
                                        value={form.message}
                                        onChange={handleChange}
                                        className={cn(
                                                    "mt-2 block w-full px-3 py-2 text-sm rounded-md shadow-sm",
                                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                                                    "border border-gray-300 bg-gray-100 text-gray-900",
                                                    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                                                    )}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={cn(
                                                    "inline-flex items-center justify-center w-full px-4 py-2", 
                                                    "rounded-full bg-primary text-primary-foreground text-sm md:text-base", 
                                                    "font-medium shadow-sm transform-gpu transition duration-200 hover:scale-105", 
                                                    "active:scale-95 hover:shadow-md focus:outline-none focus:ring-2", 
                                                    "focus:ring-primary/30 dark:bg-primary/80 dark:text-primary-foreground cursor-pointer"
                                                    )}
                                    >
                                        {submitting ? 'Sending...' : 'Send'}
                                    </button>
                                    <p aria-live="polite" className="text-sm text-gray-600">{status}</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}