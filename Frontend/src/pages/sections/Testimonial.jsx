import React from 'react';
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
    const reviews = [
        {
            name: "Dr. Elena Rossi",
            role: "Medical Consultant",
            text: "MediHelp bridges the gap between complex medical jargon and patient understanding effortlessly."
        },
        {
            name: "Mark Jayson",
            role: "Senior Citizen Advocate",
            text: "The voice interface is a game-changer for the elderly who struggle with traditional smartphone typing."
        },
        {
            name: "Sarah Jenkins",
            role: "Health Educator",
            text: "Finally, a tool that provides verified information in seconds. The accuracy is truly impressive."
        },
        {
            name: "Michael Chen",
            role: "Software Engineer",
            text: "The UI is incredibly clean and the AI processing speed makes health education feel instantaneous."
        },
        {
            name: "Maria Santos",
            role: "Community Health Worker",
            text: "A vital tool for remote areas where medical professionals aren't always immediately available."
        }
    ];

    const infiniteReviews = [...reviews, ...reviews];

    return (
        <section className="container py-14 relative overflow-hidden">
            <div className="text-center max-w-3xl mx-auto mb-14 px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <Star size={12} className="text-primary fill-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        User Experiences
                    </span>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">Trusted by Many.</h2>
                <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
                    See how MediHelp is impacting lives and transforming healthcare accessibility through the eyes of our users.
                </p>
            </div>

            {/* Carousel Container */}
            <div className="relative flex overflow-hidden group">
                {/* Side Fades */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 animate-infinite-scroll py-8">
                    {infiniteReviews.map((review, i) => (
                        <div 
                            key={i} 
                            className="w-[320px] md:w-[380px] bg-card border border-border rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                                    <Quote className="text-primary" size={20} />
                                </div>
                                <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-8 italic font-medium">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 uppercase">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="font-bold text-sm text-foreground tracking-tight">{review.name}</h5>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none mt-1">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                    @keyframes infinite-scroll {
                        from { transform: translateX(0); }
                        to { transform: translateX(calc(-50% - 12px)); }
                    }
                    .animate-infinite-scroll {
                        animation: infinite-scroll 40s linear infinite;
                        display: flex;
                        width: max-content;
                    }
                    .animate-infinite-scroll:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
        </section>
    );
};

export default Testimonials;