import { cn } from '../lib/utils';
import { Mic } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const FeatureSection = () => {
    const features = [
        {
            title: 'Voice & Text Interaction',
            desc: 'Users can ask questions naturally—by speaking or typing—and receive instant, informative answers.',
        },
        {
            title: 'Health Information Access',
            desc: 'Offers explanations of illnesses, symptoms, medications, and preventive care tips.',
        },
        {
            title: 'Educational Focus',
            desc: 'MediHelp is designed to inform, not diagnose. It encourages users to seek professional care for medical decisions.',
        },
        {
            title: 'User-Friendly Interface',
            desc: 'Built for ease of use, with intuitive navigation and responsive design for all devices.',
        },
        {
            title: 'Guidance Library & Blog',
            desc: 'Includes a curated Guidance Library and blog-style articles with trusted medical documents, seasonal tips, and patient education guides.',
        },
    ];

    const markersRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        el.classList.add(
                            'scale-110',
                            'ring-4',
                            'ring-primary-300/60',
                            'bg-primary-600',
                            'text-white',
                            'shadow-lg'
                        );
                        el.classList.remove('bg-white', 'text-primary-600', 'shadow-none');
                    } else {
                        el.classList.remove(
                            'scale-110',
                            'ring-4',
                            'ring-primary-300/60',
                            'bg-primary-600',
                            'text-white',
                            'shadow-lg'
                        );
                        el.classList.add('bg-white', 'text-primary-600');
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -30% 0px',
                threshold: 0.45,
            }
        );

        markersRef.current.forEach((m) => {
            if (m) observer.observe(m);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section id="features" className="py-20 bg-gradient-to-br from-primary-50/40 to-accent-50/40 dark:from-primary-900/30 dark:to-accent-900/30">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                        Key Features
                    </h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Core capabilities that make MediHelp a fast, friendly, and reliable health information companion.
                    </p>
                </div>

                <div className="relative">
                    {/* center line */}
                    <div className="hidden md:block absolute left-1/2 top-8 bottom-0 w-[2px] bg-border/40 -translate-x-1/2" />

                    <div className="space-y-12">
                        {features.map((f, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                                <div
                                    key={f.title}
                                    className={cn(
                                        'md:flex md:items-center md:justify-between',
                                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                                    )}
                                >
                                    {/* card */}
                                    <div className="md:w-5/12">
                                        <div className="p-6 rounded-2xl bg-card/80 dark:bg-card/70 border border-border/30 shadow-subtle">
                                            <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                                            <p className="text-foreground/75 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>

                                    {/* connector + dot */}
                                    <div className="flex items-center justify-center md:w-2/12 relative">
                                        <div
                                            ref={(el) => (markersRef.current[idx] = el)}
                                            className="z-10 flex items-center justify-center w-12 h-12 bg-white text-primary-600 rounded-full shadow-none border-4 border-card transition-all duration-500"
                                            aria-hidden="true"
                                        >
                                            <span className="sr-only">{f.title} marker</span>
                                            <svg className="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </div>
                                        {/* small horizontal connector for small screens */}
                                        <div className="absolute left-0 right-0 h-px bg-border/20 md:hidden" />
                                    </div>

                                    {/* spacer for symmetry on md */}
                                    <div className="md:w-5/12 hidden md:block" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};