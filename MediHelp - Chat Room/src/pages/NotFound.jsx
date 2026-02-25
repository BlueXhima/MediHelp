import { Link } from 'react-router-dom';
import { AlertCircle, Home, BookOpen, Mail } from 'lucide-react';

export const NotFound = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900 dark:to-primary-900 px-4">
            <div className="max-w-3xl w-full bg-card/70 dark:bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-10 text-center shadow-lg">
                <div className="flex items-center justify-center mb-6">
                    <AlertCircle className="w-14 h-14 text-warning-600 dark:text-warning-400" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">404 — Page not found</h1>
                <p className="text-foreground/75 mb-6 leading-relaxed">
                    The page you’re looking for doesn’t exist or has been moved. Try returning home or explore our resources to find what you need.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-foreground rounded-lg text-sm font-medium shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/40"
                    >
                        <Home className="w-4 h-4" /> Go to Home
                    </Link>

                    <a
                        href="#resources"
                        className="inline-flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/30"
                    >
                        <BookOpen className="w-4 h-4" /> Explore Resources
                    </a>

                    <a
                        href="mailto:support@medihelp.com"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-foreground/5 dark:bg-foreground/10 text-foreground hover:underline transition"
                    >
                        <Mail className="w-4 h-4" /> Contact Support
                    </a>
                </div>

                <p className="text-xs text-foreground/60">
                    If you believe this is an error, please <a href="mailto:support@medihelp.com" className="underline">contact support</a>.
                </p>
            </div>
        </main>
    );
};