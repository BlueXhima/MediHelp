import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import axios from 'axios';

const WelcomeSection = ({ getGreeting }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
            console.log('Retrieved email from localStorage:', email); // Debugging log

            if (email) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        params: { email },
                    });
                    const { firstName, lastName } = response.data;
                    const fullName = `${firstName} ${lastName}`;
                    console.log('Fetched user details:', fullName); // Debugging log
                    setUserName(fullName);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                console.warn('No email found in localStorage.');
            }
        };

        fetchDetails();
    }, []);

    useEffect(() => {
        console.log('Updated userName state:', userName); // Debugging log
    }, [userName]);

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
                <h1 className="text-2xl text-left font-semibold text-primary mb-2">
                    Hi, {userName}!
                </h1>
                <h2 className="text-5xl text-left font-bold text-primary mb-2">
                    {getGreeting()}
                </h2>
                <p className="text-text-secondary text-left text-lg">
                    How can I help you with your health questions today?
                </p>
            </div>
            <div className="hidden md:block">
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full p-4 border border-secondary/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Sparkles size={24} color="white" />
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