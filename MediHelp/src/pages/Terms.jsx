import React from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';

export const Terms = () => {
	return (
		<>
			<Navbar />

			<main className="pt-28 pb-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center mb-10 border-b pb-6">
						<div className="space-y-3 text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
								Terms of Service
							</h1>
							<p className="text-base text-foreground-600 dark:text-foreground-400 max-w-2xl mx-auto">
								These Terms govern your access to and use of MediHelp. Please read them carefully.
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
										{ id: 'summary', label: 'Summary' },
										{ id: 'acceptance', label: 'Acceptance' },
										{ id: 'use', label: 'Use of Service' },
										{ id: 'responsibilities', label: 'Your Responsibilities' },
										{ id: 'prohibited', label: 'Prohibited Conduct' },
										{ id: 'termination', label: 'Termination' },
										{ id: 'contact', label: 'Contact' },
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
								<h3 className="text-2xl text-left font-semibold text-foreground mb-4">Summary</h3>
								<div className="rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 p-6 shadow-sm">
									<p className="mb-3 text-foreground-700 dark:text-foreground-300 leading-relaxed">
										These Terms explain the rules for using MediHelp, your obligations, and our policies. By using or accessing our services you agree to these Terms.
									</p>
									<p className="text-sm text-foreground-500 dark:text-foreground-400 italic">
										If you disagree with any part of these Terms, do not use the service.
									</p>
								</div>
							</section>

							<section id="acceptance" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Acceptance of Terms</h3>
								<p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
									By creating an account or using MediHelp, you accept and agree to be bound by these Terms and our Privacy Policy. We may update the Terms from time to time; continued use after changes constitutes acceptance.
								</p>
							</section>

							<section id="use" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Use of Service</h3>
								<details className="mt-4 group">
									<summary
										className="cursor-pointer flex items-center justify-between 
													font-medium text-indigo-600 dark:text-indigo-400 
													bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
													transition-colors duration-200 px-4 py-3"
									>
										<span>Allowed uses</span>
										<ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
									</summary>
									<ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
													bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
													px-6 py-5 text-left leading-relaxed">
										<li>Use MediHelp for personal, non-commercial purposes unless you have a separate agreement.</li>
										<li>Follow any additional guidelines provided in the app or documentation.</li>
									</ul>
								</details>
							</section>

							<section id="responsibilities" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Your Responsibilities</h3>
								<p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
									You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.
								</p>
							</section>

							<section id="prohibited" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Prohibited Conduct</h3>
								<details className="mt-4 group">
									<summary
										className="cursor-pointer flex items-center justify-between 
													font-medium text-indigo-600 dark:text-indigo-400 
													bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 
													transition-colors duration-200 px-4 py-3"
									>
										<span>What is prohibited</span>
										<ChevronRight className="ml-2 text-gray-500 group-open:rotate-90 transition-transform" size={18} />
									</summary>

									<ul className="mt-3 space-y-3 pl-12 text-foreground-700 dark:text-foreground-300 list-disc
													bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30
													px-6 py-5 text-left leading-relaxed">
										<li>
											<span className="font-medium">Illegal Activity:</span> Do not use MediHelp to commit, facilitate, or promote unlawful acts, including fraud, trafficking, or other criminal conduct.
										</li>
										<li>
											<span className="font-medium">Harmful or Abusive Content:</span> Posting, sharing, or distributing content that promotes violence, self-harm, hate speech, or that targets protected groups is prohibited.
										</li>
										<li>
											<span className="font-medium">Harassment & Threats:</span> Threats, stalking, bullying, or targeted harassment of other users or staff will not be tolerated.
										</li>
										<li>
											<span className="font-medium">Privacy Violations:</span> Do not publish or distribute other people's private information (doxxing), including contact details or sensitive personal data, without consent.
										</li>
										<li>
											<span className="font-medium">Intellectual Property Infringement:</span> Uploading, sharing, or linking to content that infringes copyrights, trademarks, or other IP rights is prohibited.
										</li>
										<li>
											<span className="font-medium">Malicious Software & Security Abuse:</span> Do not introduce malware, phishing pages, or engage in activities that interfere with platform security (e.g., DDoS, unauthorized access attempts).
										</li>
										<li>
											<span className="font-medium">Automated Abuse & Scraping:</span> Automated bots, scraping, or mass-collection of data from MediHelp without explicit permission is not allowed.
										</li>
										<li>
											<span className="font-medium">Misrepresentation & Fraud:</span> Impersonating others, falsifying information, or using the service to mislead or defraud users is forbidden.
										</li>
										<li>
											<span className="font-medium">Service Interference:</span> Attempting to reverse-engineer, circumvent rate limits, or otherwise degrade the experience for others is prohibited.
										</li>
										<li>
											<span className="font-medium">Consequences:</span> Violations may result in content removal, account suspension or termination, and legal action where appropriate.
										</li>
									</ul>
								</details>
							</section>

							<section id="termination" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Termination</h3>
								<p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
									We may suspend or terminate access for users who violate these Terms or engage in harmful behavior. Upon termination some data may be retained as required by law or for legitimate business purposes.
								</p>
							</section>

							<section id="contact" className="mb-10">
								<h3 className="text-2xl text-left font-semibold text-foreground mb-3">Contact Us</h3>
								<p className="text-left text-foreground-700 dark:text-foreground-300 leading-relaxed">
									If you have questions about these Terms, please contact our team.
								</p>

								<div className="mt-4 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 p-6 shadow-sm">
									<p className="text-foreground-700 dark:text-foreground-300 flex items-center">
										<Mail className="mr-2 text-indigo-600" size={16} />
										<a href="mailto:support@medihelp.com" className="text-foreground-600 hover:underline">support@medihelp.com</a>
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