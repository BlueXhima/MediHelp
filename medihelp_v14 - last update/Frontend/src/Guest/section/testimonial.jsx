import React from 'react';
import { Star, CheckCircle2 } from "lucide-react";

const testimonials = [
    {
        name: "Maria Santos",
        role: "Verified User",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        content: "So fast! It's much easier to speak how I feel than to type while I'm not feeling well. Very accurate guidance.",
        rating: 5
    },
    {
        name: "David Chen",
        role: "Beta Tester",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        content: "The voice recognition is top-notch. It understood my symptoms even with my raspy voice due to a sore throat.",
        rating: 5
    },
    {
        name: "Liza Ramos",
        role: "Mother of Two",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liza",
        content: "This answers my 'what-to-do' questions at night when I can't call a pediatrician. Huge relief!",
        rating: 5
    },
    {
        name: "James Wilson",
        role: "Healthcare Researcher",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        content: "Impressive triage logic. It clearly differentiates between minor symptoms and urgent warning signs.",
        rating: 5
    },
    {
        name: "Sarah Abad",
        role: "Verified User",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content: "I love the privacy focus. Knowing my health data is encrypted gives me peace of mind while using the AI.",
        rating: 5
    }
];

const TestimonialCard = ({ name, role, content, rating, image }) => (
    <div className="flex-shrink-0 w-[350px] mx-3 p-6 rounded-xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-md group">
        {/* Profile Header based on screenshot */}
        <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-muted bg-muted flex-shrink-0">
                <img src={image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
            </div>
            <div className="flex flex-col pt-1">
                <div className="flex items-center gap-1">
                    <h5 className="font-bold text-foreground text-[15px] leading-tight">{name}</h5>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mb-2">{role}</p>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < rating ? "fill-orange-400 text-orange-400" : "text-muted"} />
                    ))}
                </div>
            </div>
        </div>
        
        {/* Content */}
        <p className="text-muted-foreground text-left text-sm leading-relaxed whitespace-normal">
            {content}
        </p>
    </div>
);

const Testimonials = () => {
    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-card overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="text-center">
                    <h3 className="text-4xl md:text-5xl text-foreground font-bold mb-3">Testimonial</h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        See what our early users have to say about their experience with our health assistant.
                    </p>
                </div>
            </div>

            {/* Infinite Marquee Container */}
            <div className="relative flex overflow-hidden py-8">
                <div className="flex flex-nowrap animate-marquee w-max group-hover:[animation-play-state:paused]">
                    {doubledTestimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </div>

                {/* Fade Gradients for smooth edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default Testimonials;