import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { cn } from "../lib/utils";

export const Documentation = () => {
    const [tocOpen, setTocOpen] = useState(false);

    const sections = [
        { id: "getting-started", title: "Getting Started" },
        { id: "voice-commands", title: "Voice Commands" },
        { id: "safety", title: "Safety & Emergencies" },
        { id: "faq", title: "FAQ" },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto px-4 py-12 pt-24 md:pt-16">
                    {/* Hero
                    <div className="mb-8 items-center justify-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
                            Documentation
                        </h1>
                    </div> */}

                    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
                        {/* TOC (sidebar) */}
                        <aside className="hidden lg:block sticky top-[96px] self-start">
                            <nav className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-8 shadow-sm">
                                <h3 className="text-md font-bold text-foreground dark:text-foreground-200 mb-3">On this page</h3>
                                <ul className="space-y-2 text-sm">
                                    {sections.map((s) => (
                                        <li key={s.id}>
                                        <a
                                            href={`/#${s.id}`}
                                            className="block text-xs text-foreground-300 hover:text-sky-600 dark:text-foreground-300 dark:hover:text-sky-400 transition-colors"
                                        >
                                            {s.title}
                                        </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>

                        {/* Content */}
                        <div>
                            {/* Mobile TOC toggle */}
                            <div className="lg:hidden mb-6">
                                <button
                                    onClick={() => setTocOpen((v) => !v)}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md shadow-sm text-sm"
                                >
                                    {tocOpen ? "Hide contents" : "Show contents"}
                                </button>

                                {tocOpen && (
                                    <nav className="mt-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md p-3">
                                        <ul className="space-y-2 text-sm">
                                            {sections.map((s) => (
                                                <li key={s.id}>
                                                    <a
                                                        href={`/#${s.id}`}
                                                        onClick={() => setTocOpen(false)}
                                                        className="block text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 transition-colors"
                                                    >
                                                        {s.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                )}
                            </div>

                            {/* Sections */}
                            <article className="space-y-8">
                                <section id="getting-started" className="scroll-mt-24">
                                    <h2 className="text-3xl font-bold text-foreground mb-3">Documentation</h2>
                                    <p className="text-foreground-700 dark:text-foreground-300">
                                        MediHelp provides voice and text interfaces to quickly access health
                                        information. This guide covers installation, basic usage, and navigation.
                                    </p>

                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div className="p-4 rounded-lg bg-card dark:bg-card-800 border border-card-100 dark:border-card-700">
                                            <h4 className="font-medium text-foreground-800 dark:text-foreground-100">Quick start</h4>
                                            <ol className="mt-2 text-sm text-foreground-600 dark:text-foreground-300 space-y-1">
                                                <li>1. Create an account and verify email</li>
                                                <li>2. Open the app and allow microphone access</li>
                                                <li>3. Tap the microphone and ask a question</li>
                                            </ol>
                                        </div>

                                        <div className="p-4 rounded-lg bg-transparent border-l-4 border-green-400 dark:border-green-600">
                                            <h4 className="font-medium text-foreground-800 dark:text-foreground-100">Important</h4>
                                            <p className="mt-2 text-sm text-foreground-700 dark:text-foreground-300">
                                                MediHelp is informational only. For emergencies call your local emergency number.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section id="voice-commands" className="scroll-mt-24">
                                    <h2 className="text-2xl font-semibold text-foreground mb-3">Voice Commands</h2>
                                    <p className="text-foreground-700 dark:text-foreground-300">
                                        Use natural language. Examples:
                                    </p>
                                    <ul className=" mt-4 text-foreground-600 dark:text-foreground-300 space-y-1">
                                        <li>1. "What are the symptoms of flu?"</li>
                                        <li>2. "Nearest emergency room"</li>
                                        <li>3. "How to treat a minor burn"</li>
                                    </ul>
                                </section>

                                <section id="safety" className="scroll-mt-24">
                                    <h2 className="text-2xl font-semibold text-foreground-900 dark:text-foreground-100 mb-3">Safety & Emergencies</h2>
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600">
                                        <p className="text-sm text-foreground">
                                            If you are experiencing a life-threatening emergency, call your local emergency number immediately.
                                        </p>
                                    </div>

                                    <p className="mt-4 text-foreground-700 dark:text-foreground-300">Guidance, not diagnosis. Encourage users to seek professional care when appropriate.</p>
                                </section>

                                <section id="faq" className="scroll-mt-24">
                                    <h2 className="text-2xl font-semibold text-foreground-900 dark:text-foreground-100 mb-3">FAQ</h2>
                                    <div className="space-y-3">
                                        <details className="bg-card border border-foreground-100 dark:foreground-slate-700 rounded-md p-3">
                                            <summary className="cursor-pointer font-medium text-foreground-800 dark:text-foreground-100">Is MediHelp medical advice?</summary>
                                            <p className="mt-2 text-foreground-700 dark:text-foreground-300 text-sm">No — MediHelp provides information and guidance. Not a substitute for professional medical care.</p>
                                        </details>

                                        <details className="bg-card border border-foreground-100 dark:foreground-slate-700 rounded-md p-3">
                                            <summary className="cursor-pointer font-medium text-foreground-800 dark:text-foreground-100">How do I report bugs?</summary>
                                            <p className="mt-2 text-foreground-700 dark:text-foreground-300 text-sm">Use the Feedback option in Settings or email support@medihelp.example.</p>
                                        </details>

                                        <details className="bg-card border border-foreground-100 dark:foreground-slate-700 rounded-md p-3">
                                            <summary className="cursor-pointer font-medium text-foreground-800 dark:text-foreground-100">Where can I find the privacy policy?</summary>
                                            <p className="mt-2 text-foreground-700 dark:text-foreground-300 text-sm">The privacy policy is available at the bottom of our homepage or directly at medihelp.example/privacy.</p>
                                        </details>
                                    </div>
                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};