import { cn } from '../lib/utils';
import { Mic, Lock, BookOpen, TrendingUp } from 'lucide-react';

export const ResourcesSection = () => {
    const featured = [
        {
            title: 'What is Dengue?',
            summary:
            'A short guide about its causes, symptoms, and how it can be prevented. Learn the key steps to protect your family.',
        },
        {
            title: 'Healthy Eating Basics',
            summary:
            'The main principles of balanced eating, sample meal tips, and simple steps to start a healthier lifestyle.',
        },
        {
            title: 'Stress Management Tips',
            summary:
            'Quick techniques to relieve daily stress: breathing exercises, micro-breaks, and simple routine changes.',
        },
    ];

    const trending = [
        { title: 'Flu season preparedness — vaccine reminders & hygiene tips', icon: "💉" },
        { title: 'Dengue awareness month — prevention at community actions', icon: "🩸" },
        { title: 'Holiday mental health — coping strategies for busy seasons', icon: "🧘" },
    ];

    const voiceExamples = [
        'Ask MediHelp: What are dengue symptoms?',
        'Ask MediHelp: How to manage stress?',
        'Ask MediHelp: What foods help lower blood pressure?',
    ];

    const glossary = [
        { term: 'Hypertension', def: 'A condition of abnormally high blood pressure.' },
        { term: 'Dehydration', def: 'Lack of sufficient water in the body.' },
        { term: 'Antipyretic', def: 'Medicine that reduces fever.' },
        { term: 'Immunization', def: 'Process of becoming immune to a disease.' },
        { term: 'Pathogen', def: 'A microorganism that causes disease.' },
        { term: 'Symptom', def: 'A noticeable sign of a disease or condition.' },
    ];

    const categories = [
        { name: 'Nutrition', sample: 'Healthy Eating Basics' },
        { name: 'Mental Health', sample: 'Stress Management Tips' },
        { name: 'First Aid', sample: 'Basic Wound Care' },
        { name: 'Child Care', sample: 'Immunization Schedule' },
    ];

    return (
        <section id="resources" className="py-20 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900 dark:to-primary-900">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <h2 className="text-4xl font-bold text-foreground">Resources</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: Featured Articles */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Featured Articles (Preview Only)</h3>
                                <BookOpen className="w-5 h-5 text-primary-600" />
                            </div>

                            <div className="space-y-4">
                                {featured.map((f) => (
                                    <article key={f.title} className="p-4 bg-background/50 rounded-md border border-border/20">
                                        <h4 className="font-medium text-foreground">{f.title}</h4>
                                        <p className="text-sm text-foreground/75 mt-1">{f.summary}</p>
                                        <div className="mt-4">
                                            <button
                                                className={cn(
                                                "inline-block px-4 py-2 rounded-lg text-sm font-semibold",
                                                "bg-primary-50 text-primary dark:bg-primary-800 dark:text-primary-300",
                                                "border border-primary-200/50 dark:border-primary-700/40",
                                                "transition-all duration-200 transform",
                                                "hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-md",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/40",
                                                "disabled:opacity-100 disabled:cursor-not-allowed"
                                                )}
                                                aria-disabled="true"
                                            >
                                                Read more after login
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Trending Topics</h3>
                                <TrendingUp className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                            </div>

                            {/* List */}
                            <ul className="space-y-3 text-sm text-foreground/80">
                                {trending.map((t) => (
                                    <li
                                        key={t.title}
                                        className="flex items-center justify-between p-3 rounded-md 
                                                    bg-muted/30 dark:bg-muted/40 
                                                    hover:bg-muted/50 dark:hover:bg-muted/60 
                                                    transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-primary-600/80 transition-colors group-hover:bg-accent-500" />
                                            <span className="text-foreground font-medium">
                                                {t.icon} {t.title}
                                            </span>
                                        </div>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full 
                                                        bg-muted/40 text-foreground/70 
                                                        dark:bg-muted/60 dark:text-foreground/50 
                                                        border border-border/30">
                                            Login to read more
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Middle column: Voice Command Examples & Glossary */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle">
                            {/* Section Header */}
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Voice Command Examples</h3>

                            {/* Voice Command List */}
                            <div className="space-y-3">
                                {voiceExamples.map((v) => (
                                    <div
                                        key={v}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-border/20 
                                                bg-muted/30 dark:bg-muted/40 
                                                hover:bg-muted/50 dark:hover:bg-muted/60 
                                                transition-colors duration-200"
                                    >
                                        {/* Mic Icon */}
                                        <span className="inline-flex items-center justify-center w-10 h-10 
                                                        bg-primary-100 dark:bg-primary-800 
                                                        rounded-lg"
                                        >
                                            <Mic className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                        </span>

                                        {/* Voice Command Text */}
                                        <code className="text-sm text-foreground/90 leading-snug break-words">
                                            {v}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Glossary Teasers</h3>
                                <Lock className="w-5 h-5 text-foreground/50" />
                            </div>

                            {/* Glossary List */}
                            <ul className="space-y-4 text-sm">
                                {glossary.map((g) => (
                                    <li
                                        key={g.term}
                                        className="flex items-start justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                                    >
                                        <div className="pr-3">
                                            <strong className="block text-foreground font-medium">{g.term}</strong>
                                            <span className="text-foreground/70 text-sm leading-snug">{g.def}</span>
                                        </div>

                                        {/* Locked Button */}
                                        <button
                                            className="text-xs px-3 py-1.5 rounded-md border border-primary-200/50 
                                                        bg-transparent text-primary-300 
                                                        dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-700/40
                                                        transition-colors duration-200
                                                        hover:bg-primary-600 
                                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/40"
                                            aria-disabled="true"
                                            >
                                            Unlock full glossary
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right column: Categories (Locked Preview) + CTA */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle">
                            <h3 className="text-lg font-semibold mb-4">Resource Categories (Locked Preview)</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {categories.map((c) => (
                                    <div
                                        key={c.name}
                                        className="relative p-5 rounded-lg bg-muted/20 dark:bg-muted/30 
                                                    border border-border/20 shadow-sm hover:shadow-md 
                                                    transition-all duration-200 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <strong className="text-foreground font-semibold">{c.name}</strong>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 
                                                            dark:bg-primary-900 dark:text-primary-300 border border-primary-200/40">
                                            1 sample
                                            </span>
                                        </div>

                                        {/* Sample text */}
                                        <div className="text-sm text-foreground/80 leading-snug">{c.sample}</div>

                                        {/* Blurred locked overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center 
                                                        bg-white/70 dark:bg-black/60 backdrop-blur-sm"
                                        >
                                            <div className="text-center">
                                                <Lock className="mx-auto mb-2 w-7 h-7 text-foreground/80" />
                                                <div className="text-sm font-medium text-foreground/90">
                                                    Locked — Register to view
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-subtle flex items-center justify-center flex-col gap-3">
                            <h3 className="text-lg font-semibold">Get full access</h3>
                            <p className="text-foreground/75 text-sm">Register or login to unlock the full Guidance Library, save resources, and access the glossary.</p>
                            <div className="flex gap-3 mt-2">
                                <a
                                    href="/register"
                                    className="
                                        inline-block px-4 py-2 rounded-md
                                        bg-primary text-primary-foreground text-xs
                                        font-medium shadow-sm transform-gpu transition duration-200 hover:scale-105 
                                        active:scale-95 hover:shadow-md focus:outline-none focus:ring-2
                                        focus:ring-primary/30 dark:bg-primary/80 dark:text-primary-foreground cursor-pointer
                                    "
                                >
                                    Register to access full library
                                </a>
                                <a
                                    href="/login"
                                    className="inline-block px-4 py-2 outlined border border-primary text-primary rounded-md text-xs
                                        font-medium transition transform duration-200 
                                        hover:bg-primary/10
                                        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/40
                                    "
                                >
                                    Login to save resources
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};