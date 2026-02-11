import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, User, BookOpen, Phone, Calendar, FileText, MapPin, Settings } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';

const QuickActionsPanel = () => {
    const quickActions = [
        {
            id: 1,
            title: "Voice Assistant",
            description: "Ask health questions instantly",
            icon: <Mic size={24} color="white" />,
            color: "accent",
            path: "/voice-interaction-interface",
            gradient: "from-accent to-accent/80"
        },
        {
            id: 2,
            title: "Health Profile",
            description: "Update your health information",
            icon: <User size={24} color="white" />,
            color: "secondary",
            path: "/health-profile",
            gradient: "from-secondary to-secondary/80"
        },
        {
            id: 3,
            title: "Guidance Library",
            description: "Browse health resources",
            icon: <BookOpen size={24} color="white" />,
            color: "primary",
            path: "/guidance-library",
            gradient: "from-primary to-primary/80"
        },
        {
            id: 4,
            title: "Emergency Contact",
            description: "Quick access to help",
            icon: <Phone size={24} color="white" />,
            color: "destructive",
            path: "#emergency",
            gradient: "from-destructive to-destructive/80"
        }
    ];

    const handleEmergencyClick = () => {
        // Mock emergency action
        alert("Emergency services: 911\nPoison Control: 1-800-222-1222\nMental Health Crisis: 988");
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center">
                    <Icon name="Zap" size={24} color="var(--color-accent)" className="mr-3" />
                    Quick Actions
                </h3>
                <span className="text-sm text-text-secondary">Get help fast</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    action.path === "#emergency" ? (
                        <button
                            key={action.id}
                            onClick={handleEmergencyClick}
                            className={`group p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white hover:shadow-medical-hover transition-all duration-200 medical-card`}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                                    <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                            </div>
                        </button>
                    ) : (
                        <Link
                            key={action.id}
                            to={action.path}
                            className={`group p-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white hover:shadow-medical-hover transition-all duration-200 medical-card`}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                                    <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="ghost" size="sm" className="text-xs">
                        <MapPin size={14} className="mr-1" />
                        Nearby Hospital
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                        <FileText size={14} className="mr-1" />
                        Medical Records
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                        <MapPin size={14} className="mr-1" />
                        Find Doctors
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                        <Settings size={14} className="mr-1" />
                        Preferences
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsPanel;
