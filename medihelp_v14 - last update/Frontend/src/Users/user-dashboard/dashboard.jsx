import React from 'react'

import Navbar from '../../components/navbar';
import WelcomeSection from './dash-compo/welcome';
import OnboardingModal from './dash-compo/onboarding';
import QuickStatsBar from './dash-compo/statsbar';
import VoiceAssistantWidget from './dash-compo/voicewidget';
import RecentGuidanceCard from './dash-compo/guidance';
import HealthHubCard from './dash-compo/health';
import QuickActionPanel from './dash-compo/quickaction';
import TrustSignals from './dash-compo/trustcard';

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Section */}
                    <WelcomeSection getGreeting={getGreeting} getHealthTip={getHealthTip} />
                    
                    {/* Quick Stats Bar */}
                    <QuickStatsBar />
                    
                    {/* Voice Assistant Widget */}
                    <VoiceAssistantWidget />

                    {/* Quick Action Panel */}
                    <QuickActionPanel />
                    
                    {/* Dashboard Cards Grid */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Recent Guidance */}
                        <RecentGuidanceCard />
                        
                        {/* Health Hub */}
                        <HealthHubCard />
                    </div>

                    {/* Trust Signals Footer */}
                    <div className="mt-12">
                        <TrustSignals />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;