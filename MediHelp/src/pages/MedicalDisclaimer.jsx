import { Navbar } from '../components/Navbar';
import { Banner } from '../components/Banner';
import { Footer } from '../components/Footer';
import { AlertTriangle, FileText, Heart, PhoneIncoming } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MedicalDisclaimer = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="bg-gradient-to-b from-accent-50 to-transparent dark:from-accent-900 mt-24">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7 text-left">
                                <div className="inline-flex items-center gap-3 mb-4 justify-start justify-self-start">
                                    <div className="bg-warning-50 text-icon rounded-full p-3 shadow-sm">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground/70">Important</span>
                                </div>

                                <h1 className="text-3xl text-left sm:text-4xl font-extrabold leading-tight mb-4">Medical Disclaimer</h1>
                                <p className="text-lg text-left text-foreground/85 mb-6">MediHelp provides general health information and guidance. This content is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider regarding any medical concerns.</p>

                                <div className="flex flex-wrap gap-3">
                                    <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow hover:opacity-95">
                                        <PhoneIncoming className="w-4 h-4" /> Contact Support
                                    </Link>
                                    <a href="#details" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground/90 hover:bg-muted/50">Read details</a>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="bg-card/80 dark:bg-card p-6 rounded-xl shadow-md border border-border">
                                    <h3 className="text-lg font-semibold mb-3">Quick Guidance</h3>
                                    <ul className="space-y-3 text-sm text-foreground/85">
                                        <li className="flex items-start gap-3">
                                            <div className="p-2 rounded-md bg-muted/40"><FileText className="w-5 h-5" /></div>
                                            <div>
                                                <strong className="block">Informational Only</strong>
                                                <span className="block">Content is for education — not medical advice.</span>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <div className="p-2 rounded-md bg-muted/40"><Heart className="w-5 h-5" /></div>
                                            <div>
                                                <strong className="block">No Patient-Provider Relationship</strong>
                                                <span className="block">Using this site doesn't create a professional relationship.</span>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <div className="p-2 rounded-md bg-muted/40"><AlertTriangle className="w-5 h-5" /></div>
                                            <div>
                                                <strong className="block">Emergency Situations</strong>
                                                <span className="block">If you have life-threatening symptoms, call your local emergency number immediately.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-4">
                    <Banner />
                </div>

                <section id="details" className="container max-w-5xl mx-auto mt-2 px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <div className="space-y-10">
                                {/* Card Wrapper */}
                                <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm rounded-xl p-8">
                                    <article className="prose max-w-none text-text-foreground-700 dark:text-foreground-300">
                                        <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2 mb-2">
                                            <span>📘</span> Scope & Purpose
                                        </h2>
                                        <p className="text-left leading-relaxed">
                                            MediHelp aims to provide reliable, evidence-informed information to help you learn about health topics. 
                                            This website is not tailored medical advice and should not replace a consultation with a qualified clinician.
                                        </p>
                                    </article>
                                </div>

                                <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm rounded-xl p-8">
                                    <article className="prose max-w-none text-foreground-700 dark:text-foreground-300">
                                        <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2 mb-2">
                                            <span>✅</span> Accuracy & Limitations
                                        </h2>
                                        <p className="text-left leading-relaxed">
                                            We work to keep content accurate and up-to-date, but medical knowledge evolves. 
                                            We make no guarantees about the completeness or suitability of information. 
                                            Always verify with professional sources.
                                        </p>
                                    </article>
                                </div>

                                <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm rounded-xl p-8">
                                    <article className="prose max-w-none text-foreground-700 dark:text-foreground-300">
                                        <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2 mb-2">
                                            <span>🔗</span> Third-Party Content
                                        </h2>
                                        <p className="text-left leading-relaxed">
                                            Links to external resources are provided for convenience and do not imply endorsement. 
                                            We are not responsible for external content.
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <aside className="p-8 h-90 rounded-xl bg-muted/30 border border-border">
                            <h3 className="font-semibold mb-3">When to Seek Care</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm text-foreground/85">
                                <li>Severe chest pain or tightness</li>
                                <li>Difficulty breathing</li>
                                <li>Sudden weakness or difficulty speaking</li>
                                <li>Profuse bleeding or severe head injury</li>
                                <li>Any life-threatening condition — call emergency services</li>
                            </ul>

                            <div className="mt-6">
                                <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md">Contact Support</Link>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
