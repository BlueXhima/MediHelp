import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const CookiePolicy = () => {
	return (
		<>
			<Navbar />

			<main className="py-24">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
					{/* Hero */}
					<div className="rounded-2xl p-10 text-center bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30">
						<h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-600">
							Cookie Policy
						</h1>
						<p className="mt-3 text-base sm:text-lg text-foreground/70 max-w-3xl mx-auto">
							At MediHelp we use cookies and similar technologies to improve your
							experience, personalise content, and analyse traffic. This policy
							explains what cookies are, how we use them, and how you can manage
							your choices.
						</p>
					</div>

					{/* Content */}
					<div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Main column */}
						<div className="lg:col-span-3 space-y-6">
							<section className="p-6 rounded-2xl bg-card/80 dark:bg-card shadow">
								<h2 className="text-xl font-semibold mb-2">Overview</h2>
								<p className="text-sm text-foreground/70">
									Cookies are small text files placed on your device when you visit
									websites. They help the site remember your actions and preferences
									(such as login and language) so you don’t have to re-enter them
									when you come back.
								</p>
							</section>

							<section className="p-6 rounded-2xl bg-card/80 dark:bg-card shadow">
								<h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
								<p className="text-sm text-foreground/70">
									We use cookies to provide essential site functionality, remember
									preferences, and gather anonymous analytics to improve our
									services. Some cookies are placed by third parties (for example
									analytics providers) when you interact with features they
									provide.
								</p>
							</section>

							<section className="p-6 rounded-2xl bg-card/80 dark:bg-card shadow">
								<h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="p-4 rounded-xl bg-white/60 dark:bg-card border border-border/20">
										<h3 className="font-medium mb-1">Necessary</h3>
										<p className="text-sm text-foreground/70">These enable core functionality and cannot be disabled.</p>
									</div>

									<div className="p-4 rounded-xl bg-white/60 dark:bg-card border border-border/20">
										<h3 className="font-medium mb-1">Preferences</h3>
										<p className="text-sm text-foreground/70">Remember choices you make to improve your experience.</p>
									</div>

									<div className="p-4 rounded-xl bg-white/60 dark:bg-card border border-border/20">
										<h3 className="font-medium mb-1">Analytics</h3>
										<p className="text-sm text-foreground/70">Help us understand how the site is used and improve it.</p>
									</div>

									<div className="p-4 rounded-xl bg-white/60 dark:bg-card border border-border/20">
										<h3 className="font-medium mb-1">Marketing</h3>
										<p className="text-sm text-foreground/70">Used to deliver relevant advertisements where applicable.</p>
									</div>
								</div>
							</section>

							<section className="p-6 rounded-2xl bg-card/80 dark:bg-card shadow">
								<h2 className="text-xl font-semibold mb-2">Managing Your Cookies</h2>
								<p className="text-sm text-foreground/70">
									You can control and/or delete cookies as you wish — for details,
									see aboutcookies.org. You can delete all cookies that are on your
									computer and you can set most browsers to prevent them from being
									placed. Blocking all cookies may have a negative impact on the
									usability of many websites.
								</p>

								<div className="mt-4 flex items-center justify-center gap-4">
									<button className="inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-indigo-600 text-white shadow-md">
										Cookie Settings
									</button>
									<Link to="/privacy-policy" className="inline-flex px-4 py-2 rounded-lg border border-border/30 text-foreground/80 hover:bg-muted/5">
										Privacy Policy
									</Link>
								</div>
							</section>

							<section className="p-6 rounded-2xl bg-card/80 dark:bg-card shadow">
								<h2 className="text-xl font-semibold mb-2">Contact & Updates</h2>
								<p className="text-sm text-foreground/70">
									Questions about this policy can be sent to our support team via
									the Contact page. We may update this policy periodically — the
									"Last updated" date below shows when changes were last made.
								</p>

								<p className="text-sm text-foreground/70 mt-3">
									<span className="font-semibold">Last updated:</span> January 3, 2026
								</p>
							</section>
						</div>

						{/* Aside */}
						<aside className="lg:col-span-1">
							<div className="sticky top-24 space-y-4">
								<div className="p-4 rounded-xl bg-card/80 dark:bg-card shadow">
									<h4 className="font-semibold mb-2">Quick Links</h4>
									<Link className="block text-foreground/80 py-1 hover:text-primary" to="/privacy-policy">Privacy Policy</Link>
									<Link className="block text-foreground/80 py-1 hover:text-primary" to="/terms">Terms of Service</Link>
									<Link className="block text-foreground/80 py-1 hover:text-primary" to="/contact">Contact Support</Link>
								</div>

								<div className="p-4 rounded-xl bg-card/80 dark:bg-card shadow">
									<h4 className="font-semibold mb-2">Why cookies?</h4>
									<p className="text-sm text-foreground/70">Cookies let us deliver a fast, functional, and personalised experience.</p>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</main>

			<footer>
				<Footer />
			</footer>
		</>
	);
}
