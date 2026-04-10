import React from 'react';
import { Bell, Search, ChevronRight, SlidersHorizontal, Mail, Calendar } from 'lucide-react';
import { ThemeToggle } from '../../ThemeToggle/themetoggle';
import UserProfile from '../../assets/pfp.jpg';

const Header = () => {
    // Get today's date
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    return (
        <header className="w-full h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                {/* Left side: Page title or search */}
                <div className="flex items-center bg-background border rounded-md px-3 py-2 w-80">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="flex-grow bg-transparent text-sm outline-none text-foreground" 
                    />
                    <button className="ml-2 text-gray-500 hover:text-primary">
                        <SlidersHorizontal size={16} aria-hidden="true" />
                    </button>
                </div>

                {/* Calendar with date */}
                <div className="flex items-center space-x-2 text-sm text-foreground">
                    <Calendar size={18} className="text-gray-600" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            

            {/* Right side: Actions */}
            <div className="flex items-center space-x-4">
                {/* Email */}
                <button className="relative p-2 rounded-md hover:bg-gray-100">
                    <Mail size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-md hover:bg-gray-100">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme toggle */}
                <ThemeToggle inline />

                {/* User profile */}
                <button
                    className="w-full flex items-center justify-between px-4 py-2 
                                rounded-md bg-transparent hover:bg-primary border 
                                hover:text-primary-foreground transition-colors cursor-pointer"
                >
                    {/* Left side: Profile */}
                    <div className="flex items-center space-x-2">
                        <img
                            src={UserProfile}
                            alt="User Profile"
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-bold">Justine Avio Valdez</span>
                    </div>
                    {/* Right side: Chevron */}
                    <ChevronRight
                        size={18}
                        aria-hidden="true"
                        className="ml-2"
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;