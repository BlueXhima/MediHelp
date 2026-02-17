import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { cn } from "../lib/utils";

export const StatusPage = () => {
    const [incidents, setIncidents] = useState([
        {
            id: 1,
            title: "Voice recognition latency",
            status: "Investigating", // Investigating, Identified, Monitoring, Resolved
            severity: "major", // minor, major, critical
            time: "2025-12-30T14:22:00Z",
            details:
                "Users may experience higher latency when using voice recognition in certain regions. Engineers are investigating routing and model infra.",
            updates: [
                { t: "2025-12-30T14:30:00Z", note: "Investigation started" },
                { t: "2025-12-30T15:10:00Z", note: "Traffic reroute in progress" },
            ],
            },
        {
            id: 2,
            title: "Scheduled database maintenance",
            status: "Scheduled",
            severity: "minor",
            time: "2026-01-05T02:00:00Z",
            details:
                "Planned maintenance to upgrade DB replicas. Short interruptions (<2m) possible for non-critical operations.",
            updates: [],
        },
    ]);

    const components = [
        { id: "api", name: "API", status: "operational", uptime: 99.99 },
        { id: "voice", name: "Voice Engine", status: "degraded", uptime: 99.45 },
        { id: "web", name: "Website", status: "operational", uptime: 99.999 },
        { id: "db", name: "Database", status: "maintenance", uptime: 99.85 },
        { id: "auth", name: "Authentication", status: "operational", uptime: 99.98 },
    ];

    const statusColor = (s) =>
        s === "operational"
            ? "bg-emerald-100 text-emerald-700"
            : s === "degraded"
            ? "bg-amber-100 text-amber-700"
            : s === "maintenance"
            ? "bg-sky-100 text-sky-700"
            : "bg-red-100 text-red-700";

    const severityLabel = (sev) =>
        sev === "minor" ? "info" : sev === "major" ? "major" : "critical";

    useEffect(() => {
        // simulate polling for updates every 60s (placeholder)
        const id = setInterval(() => {
        // fetch status from API here and update state
        }, 60000);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-12">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* Hero */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-3xl font-bold text-foreground">
                            System Status
                        </h1>
                        <p className="mt-2 text-foreground-600 dark:text-foreground-300">
                            Live status of MediHelp services, uptime metrics, and recent incidents. Subscribe for updates.
                        </p>
                    </header>

                    {/* Summary Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground dark:text-foreground-400">Overall Uptime (30d)</p>
                                    <p className="text-2xl font-semibold text-foreground-900 dark:text-foreground-100">99.95%</p>
                                </div>
                                <div className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">Good</div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm">
                            <div>
                                <p className="text-sm text-foreground dark:text-foreground-400">Active Incidents</p>
                                <p className="text-2xl font-semibold text-foreground-900 dark:text-foreground-100">{incidents.length}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm">
                            <div>
                                <p className="text-sm text-foreground dark:text-foreground-400">Last Updated</p>
                                <p className="text-2xl font-semibold text-foreground-900 dark:text-foreground-100">
                                    {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Components list + incidents */}
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Components */}
                        <aside className="lg:col-span-1 mb-6 lg:mb-0">
                            <div className="sticky top-[96px] space-y-4">
                                <h3 className="text-sm font-semibold text-foreground-700 dark:text-foreground-200">Components</h3>
                                <div className="space-y-3">
                                    {components.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between p-4 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg shadow-sm">
                                            <div>
                                                <p className="font-medium text-foreground-800 dark:text-foreground-100">{c.name}</p>
                                                <p className="text-xs text-foreground-500 dark:text-foreground-400">Uptime: {c.uptime}%</p>
                                            </div>
                                            <div className={cn("px-3 py-1 rounded-full text-xs font-medium", statusColor(c.status))}>
                                                {c.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg">
                                    <p className="text-sm text-foreground-500 dark:text-foreground-400">Subscribe to updates</p>
                                    <form
                                        onSubmit={(e) => {
                                        e.preventDefault();
                                        // wire up subscription endpoint
                                        alert("Subscribed (demo)");
                                        }}
                                        className="mt-3 flex gap-2"
                                    >
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@company.com"
                                            className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-card dark:bg-card-900 text-sm text-foreground hover:text-foreground-900"
                                        />
                                        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Subscribe</button>
                                    </form>
                                </div>
                            </div>
                        </aside>

                        {/* Incidents / Timeline */}
                        <section className="lg:col-span-2">
                            <h3 className="text-xl font-semibold text-foreground-900 dark:text-foreground-100 mb-4">Active & Recent Incidents</h3>

                            <div className="space-y-4">
                                {incidents.map((inc) => (
                                    <details key={inc.id} className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-4 shadow-sm">
                                        <summary className="cursor-pointer flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", inc.severity === "critical" ? "bg-red-100 text-red-800" : inc.severity === "major" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800")}>
                                                        {severityLabel(inc.severity)}
                                                    </span>
                                                    <h4 className="font-semibold text-foreground-900 dark:text-foreground-100">{inc.title}</h4>
                                                </div>
                                                <p className="text-xs text-foreground-500 dark:text-foreground-400 mt-1">
                                                    {new Date(inc.time).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-sm text-foreground-500 dark:text-foreground-400">{inc.status}</div>
                                        </summary>

                                        <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                                            <p>{inc.details}</p>

                                            {inc.updates.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {inc.updates.map((u, i) => (
                                                        <div key={i} className="text-xs text-slate-500 dark:text-slate-400">
                                                            <span className="font-medium text-slate-700 dark:text-slate-200">{new Date(u.t).toLocaleString()}</span>{" "}
                                                                — {u.note}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                ))}

                                {incidents.length === 0 && (
                                    <div className="p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        No incidents to report. All systems operational.
                                    </div>
                                )}
                            </div>

                            {/* Historical summary / uptime chart placeholder */}
                            <div className="mt-8 p-4 rounded-lg bbg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-sm">
                                <h4 className="font-medium text-foreground-900 dark:text-foreground-100 mt-2 mb-3">30-day uptime summary</h4>
                                <div className="h-36 flex items-center justify-center text-sm text-foreground-500 dark:text-foreground-400">
                                    {/* Replace with real chart component later */}
                                    Uptime chart (placeholder)
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};