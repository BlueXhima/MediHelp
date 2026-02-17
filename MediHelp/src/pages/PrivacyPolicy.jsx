import React from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';

export const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />

            <main className="pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center mb-10 border-b pb-6">
                        <div className="space-y-3 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                Privacy Policy
                            </h1>
                            <p className="text-base text-foreground-600 dark:text-foreground-400 max-w-2xl mx-auto">
                                This page explains how MediHelp collects, uses, and protects your personal information.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Last updated: January 1, 2026
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <nav className="order-2 lg:order-1 lg:col-span-1">
                            <div className="sticky top-24 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm p-5">
                                <h2 className="text-lg font-semibold text-foreground-900 dark:text-foreground-100 mb-4">
                                    On this page
                                </h2>
                                <ul className="space-y-2 text-sm">
                                    {[ 
                                        { id: "summary", label: "Summary" },
                                        { id: "collect", label: "Information We Collect" },
                                        { id: "use", label: "How We Use Information" },
                                        { id: "share", label: "Sharing & Disclosure" },
                                        { id: "security", label: "Security" },
                                        { id: "choices", label: "Your Choices" },
                                        { id: "contact", label: "Contact" },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="flex items-center gap-2 px-2 py-1.5 rounded-md 
                                                        text-foreground-700 dark:text-foreground-300 
                                                        hover:bg-primary dark:hover:bg-primary-800 
                                                        hover:text-white dark:hover:text-white-400 
                                                        transition-colors duration-200"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>

                        <article className="order-1 lg:order-2 lg:col-span-3 prose max-w-none">
                            <section id="summary" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-4">
                                    Summary
                                </h3>
                                {/* Card */}
                                <div className="rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 p-6 shadow-sm">
                                    <p className="mb-3 text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                        We collect information to provide, maintain, and improve our services. We do not sell your personal information. You control your data and can request corrections or deletions.
                                    </p>
                                    <p className="text-sm text-foreground-500 dark:text-foreground-400 italic">
                                        For details, read the sections below or contact our privacy team.
                                    </p>
                                </div>
                            </section>

                            <section id="collect" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    Information We Collect
                                </h3>

                                {/* Intro Text */}
                                <p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                    We collect information you provide directly and data collected automatically when you use our services. This helps us deliver, improve, and personalize your experience while keeping your data secure.
                                </p>

                                {/* Expandable Details */}
                                <details className="mt-4 group">
                                    <summary
                                        className="cursor-pointer flex items-center justify-between 
                                                    font-medium text-indigo-600 dark:text-indigo-400 
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
                                                    transition-colors duration-200 px-4 py-3"
                                    >
                                        <span>Examples of information we collect</span>
                                        <ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
                                    </summary>
                                    <ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
                                                    px-6 py-5 text-left leading-relaxed">
                                        <li>
                                            <span className="font-medium">Account Information: </span>  
                                            Name, email address, profile details, login credentials, and preferences you set in your account.
                                        </li>
                                        <li>
                                            <span className="font-medium">Communications: </span>  
                                            Support requests, feedback messages, survey responses, and interactions with our help team.
                                        </li>
                                        <li>
                                            <span className="font-medium">Usage Data: </span>  
                                            Pages viewed, actions performed, search queries, timestamps, and navigation patterns within MediHelp.
                                        </li>
                                        <li>
                                            <span className="font-medium">Device & Technical Data: </span>  
                                            IP address, browser type, operating system, device identifiers, app version, and error logs.
                                        </li>
                                        <li>
                                            <span className="font-medium">Location Data: </span>  
                                            Approximate location derived from IP address or device settings, used to provide region-specific content.
                                        </li>
                                        <li>
                                            <span className="font-medium">Cookies & Tracking Technologies: </span>  
                                            Session cookies, analytics tags, and preferences stored to improve usability and remember your settings.
                                        </li>
                                        <li>
                                            <span className="font-medium">Optional Health-Related Inputs: </span>  
                                            If you choose to share, basic wellness information (e.g., sleep habits, exercise routines) for educational purposes only — never sold or shared without consent.
                                        </li>
                                    </ul>
                                </details>
                            </section>

                            <section id="use" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    How We Use Information
                                </h3>

                                {/* Expandable Details */}
                                <details className="group mt-4">
                                    <summary
                                        className="cursor-pointer flex items-center justify-between 
                                                    font-medium text-indigo-600 dark:text-indigo-400 
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
                                                    transition-colors duration-200 px-4 py-3"
                                    >
                                        <span>Purposes</span>
                                        <ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
                                    </summary>

                                    <ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
                                                    px-6 py-5 text-left leading-relaxed">
                                        <li>
                                            <span className="font-medium">Provide and maintain our services:</span>  
                                            We use your information to deliver core features, ensure system reliability, and keep MediHelp running smoothly across devices.
                                        </li>
                                        <li>
                                            <span className="font-medium">Improve and personalize user experience:</span>  
                                            Data helps us understand how you interact with MediHelp, allowing us to refine layouts, recommend relevant resources, and adapt features to your preferences.
                                        </li>
                                        <li>
                                            <span className="font-medium">Security and fraud prevention:</span>  
                                            Information is analyzed to detect suspicious activity, prevent unauthorized access, and safeguard both your account and our platform.
                                        </li>
                                        <li>
                                            <span className="font-medium">Communicate updates and marketing (with consent):</span>  
                                            We may send service announcements, feature updates, or educational content. Marketing messages are only sent if you’ve opted in.
                                        </li>
                                        <li>
                                            <span className="font-medium">Compliance with legal obligations:</span>  
                                            Certain data may be retained or shared when required by law, regulatory processes, or to respond to valid government requests.
                                        </li>
                                        <li>
                                            <span className="font-medium">Research and analytics:</span>  
                                            Aggregated, anonymized data is used to study trends, measure performance, and guide future improvements without identifying individual users.
                                        </li>
                                        <li>
                                            <span className="font-medium">Support and troubleshooting:</span>  
                                            When you contact us, your information helps us resolve issues faster and provide accurate assistance tailored to your situation.
                                        </li>
                                    </ul>
                                </details>
                            </section>

                            <section id="share" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    Sharing &amp; Disclosure
                                </h3>

                                {/* Intro Text */}
                                <p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                    We value your trust and are committed to transparency. While we do not sell personal information for money, there are limited circumstances where your data may be shared.
                                </p>

                                {/* Expandable Details */}
                                <details className="group mt-4">
                                    <summary
                                        className="cursor-pointer flex items-center justify-between 
                                                    font-medium text-indigo-600 dark:text-indigo-400 
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
                                                    transition-colors duration-200 px-4 py-3"
                                    >
                                        <span>When we share information</span>
                                        <ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
                                    </summary>

                                    <ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
                                                    px-6 py-5 text-left leading-relaxed">
                                        <li>
                                            <span className="font-medium">Service Providers:</span>  
                                            Trusted third-party vendors who help us operate MediHelp, such as hosting providers, analytics tools, and customer support platforms. These partners are bound by strict confidentiality agreements.
                                        </li>
                                        <li>
                                            <span className="font-medium">Legal Requirements:</span>  
                                            We may disclose information if required by law, regulation, legal process, or to respond to valid government requests.
                                        </li>
                                        <li>
                                            <span className="font-medium">Security & Protection:</span>  
                                            Data may be shared to investigate, prevent, or take action against fraud, unauthorized access, or potential threats to safety.
                                        </li>
                                        <li>
                                            <span className="font-medium">Business Transfers:</span>  
                                            In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction, with safeguards to protect your rights.
                                        </li>
                                        <li>
                                            <span className="font-medium">With Your Consent:</span>  
                                            Any optional sharing (such as participating in research studies or community features) will only occur if you explicitly agree.
                                        </li>
                                    </ul>
                                </details>
                            </section>

                            <section id="security" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    Security
                                </h3>

                                {/* Intro Text */}
                                <p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                    We implement industry‑standard safeguards to protect your data. While no system can be 100% secure, we take multiple measures to reduce risks and encourage you to practice safe habits such as using strong, unique passwords and keeping them private.
                                </p>

                                {/* Expandable Details */}
                                <details className="group mt-4">
                                    <summary
                                        className="cursor-pointer flex items-center justify-between 
                                                    font-medium text-indigo-600 dark:text-indigo-400 
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
                                                    transition-colors duration-200 px-4 py-3"
                                    >
                                        <span>Our security practices</span>
                                        <ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
                                    </summary>

                                    <ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
                                                    px-6 py-5 text-left leading-relaxed">
                                        <li>
                                            <span className="font-medium">Encryption:</span>  
                                            Data is encrypted both in transit (when sent between your device and our servers) and at rest (when stored), ensuring confidentiality.
                                        </li>
                                        <li>
                                            <span className="font-medium">Access Controls:</span>  
                                            Only authorized personnel can access sensitive information, with strict authentication and monitoring in place.
                                        </li>
                                        <li>
                                            <span className="font-medium">Regular Security Audits:</span>  
                                            We conduct routine checks, vulnerability scans, and penetration testing to identify and fix potential weaknesses.
                                        </li>
                                        <li>
                                            <span className="font-medium">Monitoring & Alerts:</span>  
                                            Systems are monitored for unusual activity, and alerts are triggered to respond quickly to potential threats.
                                        </li>
                                        <li>
                                            <span className="font-medium">Data Minimization:</span>  
                                            We collect only the information necessary to provide services, reducing exposure of sensitive data.
                                        </li>
                                        <li>
                                            <span className="font-medium">User Responsibilities:</span>  
                                            You play a key role in security by safeguarding your login credentials, enabling two‑factor authentication (if available), and keeping your devices updated.
                                        </li>
                                        <li>
                                            <span className="font-medium">Incident Response:</span>  
                                            In the event of a breach, we follow a structured response plan to contain the issue, notify affected users, and comply with legal obligations.
                                        </li>
                                    </ul>
                                </details>
                            </section>

                            <section id="choices" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    Your Choices
                                </h3>

                                {/* Intro Text */}
                                <p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                    You have control over how your information is used. MediHelp provides several options to help you manage your privacy and preferences.
                                </p>

                                {/* Expandable Details */}
                                <details className="group mt-4">
                                    <summary
                                        className="cursor-pointer flex items-center justify-between 
                                                    font-medium text-indigo-600 dark:text-indigo-400 
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
                                                    transition-colors duration-200 px-4 py-3"
                                    >
                                        <span>Ways you can manage your data</span>
                                        <ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
                                    </summary>

                                    <ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
                                                    bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
                                                    px-6 py-5 text-left leading-relaxed">
                                        <li>
                                            <span className="font-medium">Access & Update:</span>  
                                            Review and edit your account information at any time through your profile settings.
                                        </li>
                                        <li>
                                            <span className="font-medium">Marketing Preferences:</span>  
                                            Opt out of promotional emails or newsletters by adjusting your communication settings or using the unsubscribe link.
                                        </li>
                                        <li>
                                            <span className="font-medium">Cookie Controls:</span>  
                                            Manage cookies directly through your browser settings, including blocking, clearing, or limiting tracking technologies.
                                        </li>
                                        <li>
                                            <span className="font-medium">Data Deletion:</span>  
                                            Request permanent deletion of your account and associated data by contacting our privacy team.
                                        </li>
                                        <li>
                                            <span className="font-medium">Data Export:</span>  
                                            Ask for a copy of your personal data in a portable format to review or transfer elsewhere.
                                        </li>
                                        <li>
                                            <span className="font-medium">Consent Withdrawal:</span>  
                                            If you previously agreed to optional data sharing or research participation, you may withdraw consent at any time.
                                        </li>
                                    </ul>
                                </details>
                            </section>

                            <section id="contact" className="mb-10">
                                {/* Section Title */}
                                <h3 className="text-2xl text-left font-semibold text-foreground mb-3">
                                    Contact Us
                                </h3>

                                {/* Intro Text */}
                                <p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
                                    If you have questions, concerns, or requests regarding this Privacy Policy, we encourage you to reach out. Our team is here to help ensure your data rights are respected.
                                </p>

                                {/* Contact Card */}
                                <div className="mt-4 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 p-6 shadow-sm">
                                    <p className="text-foreground-700 dark:text-foreground-300 flex items-center">
                                        <Mail className="mr-2 text-indigo-600" size={16} />
                                        <a href="mailto:support@medihelp.com" className="text-foreground-600 hover:underline">
                                            support@medihelp.com
                                        </a>
                                    </p>
                                    <p className="text-foreground-700 dark:text-foreground-300 mt-2 flex items-center">
                                        <Phone className="mr-2 text-indigo-600" size={16} />
                                        Phone: 1-800-MEDIHELP
                                    </p>
                                    <p className="text-foreground-700 dark:text-foreground-300 mt-2 flex items-center">
                                        <MapPin className="mr-2 text-indigo-600" size={16} />
                                        Address: City of Bacoor • Cavite, Philippines
                                    </p>
                                </div>
                            </section>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};