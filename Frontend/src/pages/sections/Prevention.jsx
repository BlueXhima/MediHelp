import React from 'react';
import { Shield, Apple, Moon, Timer } from 'lucide-react';

const Prevention = () => {
    const tips = [
        {
            icon: <Apple className="text-primary" />,
            title: "Balanced Nutrition",
            desc: "Focus on nutrient-dense foods to fuel your body and boost your immune system."
        },
        {
            icon: <Moon className="text-primary" />,
            title: "Quality Sleep",
            desc: "Aim for 7-9 hours of restorative sleep to enhance cognitive function and recovery."
        },
        {
            icon: <Timer className="text-primary" />,
            title: "Regular Activity",
            desc: "Stay active with daily movement to maintain cardiovascular health and energy levels."
        }
    ];

    return (
        <section className="container py-14 relative overflow-hidden">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-4">
                    <Shield size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Wellness First</span>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4">Prevention is Better <br /> Than Cure.</h2>
                <p className="text-foreground/60 max-w-2xl mx-auto">
                    Take proactive steps today to ensure a healthier tomorrow. Explore our AI-guided prevention strategies tailored for you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tips.map((tip, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-card border border-border card-hover group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                            {tip.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{tip.title}</h3>
                        <p className="text-sm text-foreground/50 leading-relaxed">
                            {tip.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Prevention;