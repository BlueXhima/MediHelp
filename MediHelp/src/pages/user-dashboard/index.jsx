import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import WelcomeSection from './components/WelcomeSection.jsx';
import VoiceAssistantWidget from './components/VoiceAssistantWidget.jsx';
import QuickStatsBar from './components/QuickStatsBar.jsx';
import QuickActionsPanel from './components/QuickActionsPanel.jsx';
import RecentGuidanceCard from './components/RecentGuidanceCard.jsx';
import HealthHubCard from './components/HealthHubCard.jsx';

export const UserDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            // Restore the last visited page only if the user is authenticated
            const lastVisitedPage = localStorage.getItem('lastVisitedPage');
            if (lastVisitedPage && lastVisitedPage !== '/dashboard') {
                navigate(lastVisitedPage);
            }
        }
    }, [user, navigate]);

    const userName = user?.name || user?.email?.split('@')[0] || 'User';

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

    if (loading) {
        return <div>Loading...</div>; // Show a loading state while fetching user data
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            {/* Main Content */}
            <main className="pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <WelcomeSection userName={userName} getGreeting={getGreeting} getHealthTip={getHealthTip} />

                    {/* Quick Stats Bar */}
                    <QuickStatsBar />

                    {/* Voice Assistant Widget */}
                    <VoiceAssistantWidget />

                    {/* Quick Actions Panel */}
                    <QuickActionsPanel />

                    {/* Dashboard Cards Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">
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

export default UserDashboard;