import { cn } from '../lib/utils';
import { AlertTriangle } from 'lucide-react';

export const Banner = () => {
    return (
        <section className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900 dark:to-primary-900 py-10">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                {/* Emergency Disclaimer */}
                <div 
                    className={cn(
                        "bg-transparent backdrop-blur-sm rounded-xl p-6", 
                        "border-2 border-warning-400/60 dark:border-warning-600/40 shadow-subtle")}
                >
                    <div className="flex flex-col items-center text-center gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-8 h-8 text-icon dark:text-icon-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 max-w-2xl">
                            <h2 className="text-2xl font-semibold text-foreground mb-3">
                                Important Medical Disclaimer
                            </h2>
                            <p className="text-sm text-foreground/85 dark:text-foreground/80 leading-relaxed">
                                MediHelp provides health information and guidance but is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. In case of emergency, <strong>call 911 immediately</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};