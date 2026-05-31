import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; // Siguraduhin ang tamang path

// Mock Data for Search Bar
const searchData = [
    // Resources Library
    { title: "Introduction to SOPs", category: "Resources", type: "SOP" },
    { title: "Design Principles Infographic", category: "Resources", type: "Infographics" },
    { title: "Cloud Computing Glossary", category: "Resources", type: "Glossary" },
    
    // System & Settings
    { title: "Account Settings", category: "System", type: "Settings" },
    { title: "Security & Privacy", category: "System", type: "Settings" },
    { title: "User Management", category: "System", type: "Admin" },
    
    // Other
    { title: "Company Holiday Schedule", category: "General", type: "Other" }
];

// Mock Data para sa Notifications
const initialNotifications = [
    { id: 1, title: "System Update", type: "System", message: "New version v2.0 is live!" },
    { id: 2, title: "Feedback Received", type: "Feedback", message: "User John commented on your post." },
    { id: 3, title: "Server Alert", type: "System", message: "High latency detected." },
    { id: 4, title: "New Review", type: "Feedback", message: "Feedback submitted for SOP #101." },
];

const Header = ({ title, searchTerm, setSearchTerm }) => {
    // States para sa Search at Notif
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState("All");

    // Refs para sa click-outside detection
    const notifRef = useRef(null);

    // Close dropdown kapag nag-click sa labas
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredResults = useMemo(() => {
        if (!searchTerm) return [];
        return searchData.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const filteredNotifications = useMemo(() => {
        if (activeTab === "All") return notifications;
        return notifications.filter(n => n.type === activeTab);
    }, [activeTab, notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            {/* Title - Left */}
            <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
            </div>

            {/* Search Bar - Center */}
            <div className="flex-none md:flex-1 max-w-md mx-4 relative">
                <div className="relative group">
                    <Search size={16} className="absolute left-3 top-2.5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                    <input 
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/20" 
                        placeholder="Search resources..." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)} // Delay to allow click
                    />
                </div>

                {/* Dropdown Menu */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, index) => (
                                <div key={index} className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium">{item.title}</p>
                                        <p className="text-[10px] text-foreground/50 uppercase">{item.category} • {item.type}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Dito papasok ang Empty State
                            <div className="px-4 py-6 text-center">
                                <p className="text-sm text-foreground/40 italic">No results found for "{searchTerm}"</p>
                                <p className="text-xs text-foreground/30 mt-1">Try searching for something else.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions - Right */}
            <div className="flex-1 flex justify-end items-center gap-3">
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 text-foreground/60 hover:text-primary rounded-lg cursor-pointer"
                    >
                        <Bell size={18} />
                    </button>

                    {isNotifOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-50">
                            <div className="p-4 border-b border-border">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm">Notifications</span>
                                    <button onClick={() => setNotifications([])} className="text-xs text-primary hover:underline cursor-pointer">Clear All</button>
                                </div>
                                <p className="text-[10px] text-foreground/50 mt-1">
                                    {unreadCount} unread • {notifications.length} total
                                </p>
                            </div>
                            
                            <div className="flex border-b border-border">
                                {["All", "System", "Feedback"].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-xs font-medium cursor-pointer ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-foreground/50"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="max-h-60 overflow-y-auto">
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            className={`p-4 border-b border-border/50 cursor-pointer transition-colors 
                                                ${!n.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/50'}`}
                                        >
                                            <p className="text-sm font-medium">{n.title}</p>
                                            <p className="text-xs text-foreground/60">{n.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    // Dito ang Empty State
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
                                            <Bell size={18} className="text-foreground/20" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/60">No notifications yet</p>
                                        <p className="text-xs text-foreground/40 mt-1">
                                            {activeTab === "All" 
                                                ? "You're all caught up!" 
                                                : `No ${activeTab.toLowerCase()} notifications found.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-border mx-1" /> {/* Divider */}
                <ThemeToggle inline={true} />
            </div>
        </header>
    );
};

export default Header;