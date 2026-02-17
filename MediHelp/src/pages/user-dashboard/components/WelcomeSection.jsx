import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const WelcomeSection = ({ userName, getGreeting }) => {
    const tips = [
        "Remember to stay hydrated throughout the day!",
        "Take a few deep breaths to reduce stress.",
        "A short walk can boost your energy and mood.",
        "Don't forget to take breaks from screen time.",
        "Proper posture helps prevent back pain."
    ];

    const getHealthTip = () => tips[Math.floor(Math.random() * tips.length)];

    const [healthTip, setHealthTip] = useState(getHealthTip());

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthTip(getHealthTip());
        }, 1000); // Change tip every 5 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-4xl text-left font-bold text-primary mb-2">
                    {getGreeting()},<br></br> {userName?.split(' ')?.[0]}!
                </h1>
                <p className="text-text-secondary text-left text-lg">
                    How can I help you with your health questions today?
                </p>
            </div>
            <div className="hidden md:block">
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-3xl p-4 border border-secondary/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-voice-gradient rounded-full flex items-center justify-center">
                            <Icon name="Sparkles" size={24} color="white" />
                        </div>
                        <div>
                            <p className="text-sm text-left font-medium text-primary">Health Tip</p>
                            <p className="text-xs text-text-secondary max-w-xs transition-opacity duration-500 ease-in-out">
                                {healthTip}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;
