import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Is MediHelp a replacement for a real doctor?",
        answer: "No. MediHelp is an AI-powered triage tool designed to help you understand your symptoms and provide guidance. Always consult a healthcare professional for official diagnosis and treatment."
    },
    {
        question: "How accurate is the voice recognition?",
        answer: "Our AI is trained to understand various accents and even raspy voices caused by symptoms like sore throats, ensuring high accuracy in symptom logging."
    },
    {
        question: "Is my health data secure and private?",
        answer: "Absolutely. We use industry-standard encryption for all your data. Your health information is private and is never shared with third parties without your consent."
    },
    {
        question: "Can I use it for emergencies?",
        answer: "If you are experiencing a life-threatening emergency, please call your local emergency services (like 911) immediately. MediHelp is for non-emergency guidance only."
    }
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex justify-between items-center text-left hover:text-primary transition-colors group"
            >
                <span className="text-base font-bold text-foreground pr-8">
                    {question}
                </span>
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </div>
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-left text-sm text-muted-foreground leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-12 bg-background">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about MediHelp and how it works.
                    </p>
                </div>

                {/* FAQ List Container */}
                <div className="bg-card border border-border rounded-[2rem] p-4 md:p-8 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FaqItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

                {/* Under Development Note */}
                <div className="mt-8 text-center">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                        Under Development • v0.1.0 Alpha
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FAQ;