import React from 'react';
import { AlarmClock, TriangleAlert, Brain } from "lucide-react";

const Overview = () => {
    return (
        <section className="bg-card py-20 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl text-left">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">The Problem</span>
                        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            Healthcare shouldn't be <br/> 
                            <span className="text-primary/60 italic">this complicated.</span>
                        </h2>
                    </div>
                    <p className="text-foreground/70 text-lg max-w-sm pb-2">
                        We're bridging the gap between your symptoms and the clarity you deserve.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Pain Point - 7 Columns */}
                    <div className="md:col-span-7 bg-red-50 dark:bg-red-950/20 p-10 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col justify-between min-h-[320px] group hover:shadow-lg transition-all duration-300">
                        <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                            <AlarmClock size={30} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-3">The 3-Week Wait Gap</h3>
                            <p className="text-foreground/80 text-lg">
                                Traditional scheduling leaves you in a state of anxiety. MediHelp provides the "right now" answers you need while waiting for your specialist.
                            </p>
                        </div>
                    </div>

                    {/* Side Pain Points - 5 Columns */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-8 rounded-3xl border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-shadow">
                            <TriangleAlert className="text-yellow-600 mb-4" size={28} />
                            <h4 className="text-xl font-bold mb-2">Information Overload</h4>
                            <p className="text-sm text-foreground/80">
                                Stop "doom-scrolling" medical forums that only increase your stress levels.
                            </p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-shadow">
                            <Brain className="text-blue-600 mb-4" size={28} />
                            <h4 className="text-xl font-bold mb-2">24/7 Accessibility</h4>
                            <p className="text-sm text-foreground/80">
                                Health concerns don't follow a 9-to-5 schedule. Neither do we.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Overview;