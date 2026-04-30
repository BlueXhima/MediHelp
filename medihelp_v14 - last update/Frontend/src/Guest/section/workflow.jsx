import React from 'react';
import { Mic, Brain, CheckCircle2 } from "lucide-react";

const Workflow = () => {
    const steps = [
        {
            id: "01",
            title: "Voice Activation",
            desc: "Simply tap and speak. No typing complex medical terms—just describe how you feel in your own words.",
            icon: <Mic className="text-white" size={24} />,
            color: "from-blue-500 to-cyan-400"
        },
        {
            id: "02",
            title: "Smart Analysis",
            desc: "Our system analyzes your intent and symptoms against trusted medical databases to provide instant context.",
            icon: <Brain className="text-white" size={24} />,
            color: "from-purple-500 to-pink-400"
        },
        {
            id: "03",
            title: "Actionable Guidance",
            desc: "Receive clear next steps—from immediate home care suggestions to identifying when it's time to seek professional medical attention.",
            icon: <CheckCircle2 className="text-white" size={24} />,
            color: "from-emerald-500 to-teal-400"
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">How it works</span>
                    <h3 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Three Steps to Peace of Mind</h3>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line for Desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="group relative flex flex-col items-center text-center">
                            {/* Step Circle */}
                            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-8 z-10 ring-8 ring-background`}>
                                {step.icon}
                            </div>
                            
                            {/* Badge ID */}
                            <span className="absolute top-0 right-1/4 bg-card border border-border text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                                STEP {step.id}
                            </span>

                            <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{step.title}</h4>
                            <p className="text-foreground/60 leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workflow;