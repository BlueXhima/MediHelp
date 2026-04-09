import React from 'react'

import Navbar from '../../components/navbar';
import WelcomeSection from './dash-compo/welcome';
import OnboardingModal from './dash-compo/onboarding';
import QuickStatsBar from './dash-compo/statsbar';
import VoiceAssistantWidget from './dash-compo/voicewidget';
import RecentGuidanceCard from './dash-compo/guidance';
import HealthHubCard from './dash-compo/health';

const Dashboard = () => {

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return "Good Morning";
        if (currentHour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const getHealthTip = () => {
        const tips = [
            "Remember to stay hydrated throughout the day!",
            "Take a few deep breaths to reduce stress.",
            "A short walk can boost your energy and mood.",
            "Don't forget to take breaks from screen time.",
            "Proper posture helps prevent back pain."
        ];
        return tips?.[Math.floor(Math.random() * tips?.length)];
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <OnboardingModal />
            
            {/* Main Content */}
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <WelcomeSection getGreeting={getGreeting} getHealthTip={getHealthTip} />
                    
                    {/* Quick Stats Bar */}
                    <QuickStatsBar />
                    
                    {/* Voice Assistant Widget */}
                    <VoiceAssistantWidget />
                    
                    {/* Dashboard Cards Grid */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Recent Guidance */}
                        <RecentGuidanceCard />
                        
                        {/* Health Hub */}
                        <HealthHubCard />
                    </div>

                    {/* Trust Signals Footer */}
                    <div className="mt-12 bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-6">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-primary mb-4">Trusted Healthcare Guidance</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center space-y-2 trust-signal">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🏥</span>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary">Medical Board</p>
                                    <p className="text-xs text-text-secondary">Certified</p>
                                </div>
                                <div className="flex flex-col items-center space-y-2 trust-signal">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🔒</span>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary">HIPAA</p>
                                    <p className="text-xs text-text-secondary">Compliant</p>
                                </div>
                                <div className="flex flex-col items-center space-y-2 trust-signal">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">⭐</span>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary">4.9/5 Rating</p>
                                    <p className="text-xs text-text-secondary">User Satisfaction</p>
                                </div>
                                <div className="flex flex-col items-center space-y-2 trust-signal">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary">2,847 Questions</p>
                                    <p className="text-xs text-text-secondary">Answered Today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;