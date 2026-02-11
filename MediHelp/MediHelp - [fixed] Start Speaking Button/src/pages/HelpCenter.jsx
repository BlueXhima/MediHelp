import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useState } from "react";
import { cn } from "../lib/utils";

export const HelpCenter = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
        {
            q: "How do I use voice commands?",
            a: "Tap the microphone icon, wait for the beep, then speak clearly using phrases like “fever symptoms” or “nearest hospital”."
        },
        {
            q: "Is MediHelp medical advice?",
            a: "MediHelp provides guidance and resources but is not a substitute for professional medical care. For emergencies, call your local emergency number."
        },
        {
            q: "How do I report an issue or bug?",
            a: "Use the Feedback section in Settings or email support@medihelp.example with a description and screenshots."
        },
        {
            q: "Where can I find the privacy policy?",
            a: "The privacy policy is available at the bottom of our homepage or directly at medihelp.example/privacy."
        },
        {
            q: "Can I use MediHelp offline?",
            a: "Some features are available offline, but voice recognition and data updates require an internet connection."
        }
    ];

    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-12 pt-24 md:pt-28">
                {/* Hero */}
                <section className="relative bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-xl p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Help Center</h1>
                            <p className="text-slate-600">Find quick guides, FAQs, and resources to get the most out of MediHelp.</p>
                        </div>
                        <div className="flex gap-3">
                            <a href="#quick-links" className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700">Quick Links</a>
                            <a href="#contact" className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900">Contact Support</a>
                        </div>
                    </div>
                </section>

                {/* Quick Links */}
                <section id="quick-links" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <article className="p-4 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
                        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
                        <p className="text-sm text-slate-600 mb-3">How to use and examples.</p>
                        <a className="text-sky-600 text-sm font-medium" href="#">Learn more →</a>
                    </article>

                    <article className="p-4 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
                        <h3 className="text-lg font-semibold mb-2">Safety & Emergencies</h3>
                        <p className="text-sm text-slate-600 mb-3">What to do in urgent situations.</p>
                        <a className="text-sky-600 text-sm font-medium" href="#">Read guidance →</a>
                    </article>

                    <article className="p-4 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
                        <h3 className="text-lg font-semibold mb-2">Glossary</h3>
                        <p className="text-sm text-slate-600 mb-3">Common medical terms explained simply.</p>
                        <a className="text-sky-600 text-sm font-medium" href="#">Browse glossary →</a>
                    </article>
                </section>

                {/* FAQ */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((item, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 bg-card dark:bg-card border-t border-b", 
                                        "border-border/50 dark:border-border/30 flex items-center justify-between", 
                                        "cursor-pointer")}
                                    aria-expanded={openIndex === idx}
                                >
                                    <span className="font-medium text-foreground">{item.q}</span>
                                    <span className="text-foreground-500">{openIndex === idx ? "−" : "+"}</span>
                                </button>
                                {openIndex === idx && (
                                    <div className="px-4 py-3 bg-slate-50 text-slate-700 text-sm">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact / Support */}
                <section id="contact" className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="p-6 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
                        <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
                        <p className="text-sm text-slate-600 mb-4">Need more help? Our team is here to assist.</p>
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                            <a href="mailto:support@medihelp.example" className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-lg">Email Support</a>
                            <a href="tel:+1234567890" className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg">Call Us</a>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">For emergencies, call your local emergency number immediately.</p>
                    </div>

                    <div className="p-6 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
                        <h4 className="text-lg font-medium mb-2">Resources</h4>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li><a className="text-sky-600" href="#">Privacy & Safety</a></li>
                            <li><a className="text-sky-600" href="#">Terms of Service</a></li>
                            <li><a className="text-sky-600" href="#">Voice Command Tips</a></li>
                        </ul>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};