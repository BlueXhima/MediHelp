import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Is MediHelp a replacement for a real doctor?",
            answer: "No. MediHelp is an AI-powered educational platform designed to provide instant health information and literacy. It should not be used for emergency medical diagnosis or treatment."
        },
        {
            question: "Does it support Tagalog and English?",
            answer: "Yes! Our AI is trained to understand and respond in both Tagalog (Filipino) and English, making it accessible for local users."
        },
        {
            question: "How accurate is the information provided?",
            answer: "We cross-reference our AI insights with verified medical databases. However, we always recommend consulting a licensed professional for specific medical concerns."
        },
        {
            question: "Is my voice data kept private?",
            answer: "Absolutely. Your privacy is our priority. We use encryption and do not store sensitive personal health conversations on our public servers."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="container py-14 relative max-w-4xl mx-auto px-6">
            {/* Header Area */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <HelpCircle size={12} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Support
                    </span>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4">Frequently Asked Questions.</h2>
                <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
                    Quick answers to the most common questions about our platform and AI capabilities.
                </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div 
                        key={i} 
                        className={`rounded-[24px] border transition-all duration-300 overflow-hidden ${
                            activeIndex === i 
                            ? "bg-card border-primary/30 shadow-lg shadow-primary/5" 
                            : "bg-transparent border-border hover:border-primary/20"
                        }`}
                    >
                        <button 
                            onClick={() => toggleAccordion(i)}
                            className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                        >
                            <span className={`font-bold text-lg md:text-xl transition-colors ${
                                activeIndex === i ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                            }`}>
                                {faq.question}
                            </span>
                            <div className={`p-2 rounded-full transition-transform duration-300 ${
                                activeIndex === i ? "bg-primary text-white rotate-180" : "bg-primary/5 text-primary rotate-0"
                            }`}>
                                <ChevronDown size={18} />
                            </div>
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out ${
                            activeIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}>
                            <div className="px-6 md:px-8 pb-8 text-foreground/60 leading-relaxed text-sm md:text-base border-t border-border/50 pt-4">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;