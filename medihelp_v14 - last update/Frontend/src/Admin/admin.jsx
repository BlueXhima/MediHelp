import React, { useState } from 'react';
import { Stethoscope, LayoutDashboard, HeartPulse, MapPin, User, FileText, BarChart, Settings, ChevronRight, UserCircle, Sidebar, Search, SlidersHorizontal } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle/themetoggle';
import Header from '../components/admin/header';
import Dashboard from '../components/admin/admindashboard';
import Footer from '../components/admin/footer';

const AdminDashboard = () => {
    const [activeLink, setActiveLink] = useState('Dashboard');

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-60 bg-card text-foreground flex flex-col h-screen sticky top-0">
                {/* Top Content (scrollable) */}
                <div className="flex-1">
                    {/* Brand Section */}
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Stethoscope size={22} className="text-foreground" />
                            <span className="text-lg font-bold">MediHelp</span>
                        </div>
                        <button className="p-2 hover:bg-gray-200 text-foreground rounded-md">
                            <Sidebar size={20} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="py-2">
                        {/* Menu Section */}
                        <div className="flex flex-col px-4 py-2 text-left">
                            <span className="text-xs font-semibold uppercase text-foreground mb-2">Menu</span>
                            <div className="flex flex-col space-y-1">
                                <a
                                    href="/dashboard"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Dashboard'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Dashboard')}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                </a>
                                <a
                                    href="/health-data"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Health Data'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Health Data')}
                                >
                                    <HeartPulse className="mr-2 h-4 w-4" /> Health Data
                                </a>
                                <a
                                    href="/voice-map"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Voice Map'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Voice Map')}
                                >
                                    <MapPin className="mr-2 h-4 w-4" /> Voice Map
                                </a>
                                <a
                                    href="/users"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Users'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Users')}
                                >
                                    <User className="mr-2 h-4 w-4" /> Users
                                </a>
                                <a
                                    href="/users"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Users'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Logs')}
                                >
                                    <FileText className="mr-2 h-4 w-4" /> Logs
                                </a>
                                <a
                                    href="/users"
                                    className={`flex flex-row items-center px-3 py-2 text-sm rounded-md ${
                                        activeLink === 'Users'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                    onClick={() => handleLinkClick('Insights')}
                                >
                                    <BarChart className="mr-2 h-4 w-4" /> Insights
                                </a>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="flex flex-col px-4 py-2 mt-2 text-left">
                            <span className="text-xs font-semibold uppercase text-foreground mb-2">Settings</span>
                            <div className="flex flex-col space-y-1">
                                <a href="/settings" className="flex flex-row items-center px-3 py-2 text-sm rounded-md hover:bg-primary hover:text-primary-foreground">
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <div className="flex bg-gradient-to-br from-primary-50 to-accent-50 
                                dark:from-primary-900 dark:to-accent-900 p-8 overflow-y-auto">
                    <Dashboard />
                </div>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default AdminDashboard;