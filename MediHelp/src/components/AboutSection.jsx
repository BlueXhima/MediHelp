import { cn } from '../lib/utils';
import { Mic } from 'lucide-react';

export const AboutSection = () => {
    return (
        <section 
            id="about" 
            className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900 dark:to-primary-900 py-20"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                        About MediHelp
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
                    {/* Mission Card */}
                    <div className="w-full max-w-md h-[340px] p-8 bg-card rounded-xl shadow-subtle border border-border/50 flex flex-col">
                        <h3 className="text-2xl font-semibold text-foreground text-center mb-6">
                            Mission
                        </h3>

                        <p className="text-foreground/80 text-justify leading-relaxed mb-4">
                            To empower individuals with accessible, reliable, and user-friendly health
                            information through voice and text interaction.
                        </p>

                        <p className="text-foreground/70 text-justify leading-relaxed">
                            MediHelp is committed to making healthcare knowledge simple, educational,
                            and supportive—helping users better understand their concerns and make
                            informed decisions about their well-being.
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="w-full max-w-md h-[340px] p-8 bg-card rounded-xl shadow-subtle border border-border/50 flex flex-col">
                        <h3 className="text-2xl font-semibold text-foreground text-center mb-6">
                            Vision
                        </h3>

                        <p className="text-foreground/80 text-justify leading-relaxed mb-4">
                            To become the leading voice-assisted healthcare information platform that
                            bridges technology and education, fostering a world where everyone can
                            confidently access health knowledge anytime, anywhere.
                        </p>

                        <p className="text-foreground/70 text-justify leading-relaxed">
                            MediHelp envisions a future where health literacy is universal, and people
                            feel supported in their journey toward healthier lives.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};