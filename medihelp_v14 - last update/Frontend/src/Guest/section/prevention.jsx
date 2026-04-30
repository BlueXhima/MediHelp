import React from 'react';
import { UtensilsCrossed, Dumbbell, AlarmClock, Leaf } from "lucide-react";

const Prevention = () => {
    return (
        <section className="py-20 bg-background/50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                    <div className="text-left max-w-xl">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Prevention First</span>
                        <h3 className="text-4xl font-extrabold text-foreground mt-2">Stay Informed, Stay Healthy</h3>
                        <p className="mt-4 text-foreground/70">
                            Practical habits to prevent health issues before they arise.
                        </p>
                    </div>
                    <button className="mt-6 md:mt-0 px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-all font-medium cursor-pointer">
                        View All Tips
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nutrition - Wide Card */}
                    <div className="group p-8 rounded-3xl bg-green-50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                        <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-green-900 text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                            <UtensilsCrossed size={28} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-bold text-foreground">Nutrition & Diet</h4>
                            <p className="text-sm text-foreground/70 mt-1">Eat balanced meals rich in fiber and vitamins to fuel your recovery.</p>
                        </div>
                    </div>

                    {/* Exercise - Wide Card */}
                    <div className="group p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                        <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-blue-900 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                            <Dumbbell size={28} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-bold text-foreground">Active Movement</h4>
                            <p className="text-sm text-foreground/70 mt-1">Stay active with at least 30 minutes of intentional movement daily.</p>
                        </div>
                    </div>

                    {/* Sleep - Wide Card */}
                    <div className="group p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                        <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-purple-900 text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                            <AlarmClock size={28} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-bold text-foreground">Restful Sleep</h4>
                            <p className="text-sm text-foreground/70 mt-1">Maintain 7–8 hours of restful sleep to support cognitive health.</p>
                        </div>
                    </div>

                    {/* Lifestyle - Wide Card */}
                    <div className="group p-8 rounded-3xl bg-orange-50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/20 flex gap-6 items-center hover:shadow-md transition-all">
                        <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-orange-900 text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                            <Leaf size={28} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-bold text-foreground">Mindful Lifestyle</h4>
                            <p className="text-sm text-foreground/70 mt-1">Avoid habits like smoking and limit alcohol for long-term wellness.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Prevention;