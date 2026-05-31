import React, { useState, useEffect } from 'react';
import { 
    Search, Bell, ChevronDown, User, LogOut, Settings, Mic, BookOpen, Menu,
    FileText, Bookmark, HelpCircle, BookMarked, HelpCircleIcon, Clock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultAvatar from '../assets/profile-default.svg';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button'
import { Link, useLocation } from 'react-router-dom';

const TopHeader = ({ title, user, onLogoutClick, onMenuClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentTime] = useState(new Date());
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const notifications = [
        { 
            id: 1, 
            type: 'article', 
            title: 'New Health Insight', 
            desc: 'Discover how 10 minutes of meditation changes your brain.', 
            time: '2 mins ago', 
            unread: true 
        },
        { 
            id: 2, 
            type: 'query', 
            title: 'Voice Query Ready', 
            desc: 'Your analysis for "Heart Rate Patterns" is complete.', 
            time: '1 hour ago', 
            unread: false 
        },
        { 
            id: 3, 
            type: 'security', 
            title: 'New Login Detected', 
            desc: 'Your account was accessed from a new Chrome browser.', 
            time: '5 hours ago', 
            unread: false 
        },
    ];

    // Mock Search Results Data
    const mockSearchResults = {
        recent: ['Blood test guidelines', 'Cardio workouts', 'Dr. Smith appointments'],
        articles: [
            { id: 1, title: 'Managing Hypertension Naturally', category: 'Articles' },
            { id: 2, title: 'Understanding REM Sleep Cycles', category: 'Sleep' }
        ],
        records: [
            { id: 1, title: 'Lab Results - Feb 2026.pdf', category: 'Documents' },
            { id: 2, title: 'Prescription Refill: Amoxicillin', category: 'Medications' }
        ]
    };

    return (
        /* Updated bg-card and border-border to use theme variables */
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
            <div className="flex items-center gap-4">
                {/* Burger Button for Mobile */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Stacked Title and Date */}
                <div className="flex flex-col justify-center"> {/* Idinagdag itong wrapper */}
                    <h2 className="text-xl font-black tracking-tight text-foreground leading-tight">
                        {title}
                    </h2>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-[0.2em] mt-0.5">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar & Dropdown Container */}
                <div className="relative hidden xl:block z-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={16} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            placeholder="Search medical info..." 
                            className="bg-background/50 border border-border rounded-2xl py-2.5 pl-12 pr-10 text-xs w-80 focus:bg-card focus:ring-4 focus:ring-primary/10 focus:border-primary/20 outline-none transition-all font-medium text-foreground relative z-50"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity z-50"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Search Dropdown Menu */}
                    <AnimatePresence>
                        {isSearchFocused && (
                            <>
                                {/* Click Outside Backdrop for Search */}
                                <div className="fixed inset-0 z-40" onClick={() => setIsSearchFocused(false)} />
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 mt-3 w-80 bg-card rounded-2xl shadow-2xl border border-border p-3 z-55 overflow-hidden"
                                >
                                    {/* Recent Searches Section (Shows when search is empty) */}
                                    {!searchQuery ? (
                                        <div>
                                            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-foreground/40 mb-2">Recent Searches</p>
                                            <div className="space-y-0.5">
                                                {mockSearchResults.recent.map((item, idx) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => setSearchQuery(item)}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-foreground/70 hover:bg-primary/5 hover:text-primary transition-all text-left font-medium"
                                                    >
                                                        <Clock size={12} className="opacity-40" />
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Filtered results section when typing
                                        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-custom p-1">
                                            {/* Category: Health Records */}
                                            <div>
                                                <p className="px-2 text-[10px] font-black uppercase tracking-wider text-foreground/40 mb-1.5">Health Records</p>
                                                {mockSearchResults.records.map((item) => (
                                                    <button key={item.id} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all text-left group">
                                                        <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                                                            <FileText size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                                                            <p className="text-[9px] text-foreground/40 font-medium">{item.category}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Category: Insights & Articles */}
                                            <div>
                                                <p className="px-2 text-[10px] font-black uppercase tracking-wider text-foreground/40 mb-1.5">Medical Library</p>
                                                {mockSearchResults.articles.map((item) => (
                                                    <button key={item.id} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all text-left group">
                                                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                                            <BookOpen size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                                                            <p className="text-[9px] text-foreground/40 font-medium">{item.category}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Dropdown Footer */}
                                    <div className="mt-2 pt-2 border-t border-border/50 text-center">
                                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                                            Press Enter to view all results
                                        </p>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Notifications - Using theme colors for hover states */}
                <div className="relative inline-block">
                    <Button 
                        type="circular" 
                        variant="ghost"
                        className="border border-border/50 bg-background/50 hover:bg-card hover:border-primary/20 group relative"
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <Bell size={20} className="text-foreground/60 group-hover:text-primary transition-colors" />
                        {/* Notification Dot */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-background rounded-full group-hover:animate-pulse"></span>
                    </Button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <>
                                {/* Backdrop para ma-close kapag clinick sa labas */}
                                <div className="fixed inset-0 z-55" onClick={() => setIsNotifOpen(false)} />
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="fixed lg:absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 lg:right-0 mt-3 w-72.5 sm:w-80 bg-card rounded-2xl shadow-2xl border border-border p-2 z-60 overflow-hidden"
                                >
                                    {/* Header ng Dropdown */}
                                    <div className="px-5 p-4 border-b border-border/50 flex items-center justify-between">
                                        <h3 className="text-sm font-black text-foreground">Notifications</h3>
                                        <span className="text-[10px] font-black text-primary px-2 py-1 bg-primary/5 rounded-lg uppercase tracking-wider">
                                            3 New
                                        </span>
                                    </div>

                                    {/* Notification List */}
                                    <div className="max-h-100 overflow-y-auto scrollbar-custom p-2 space-y-2">
                                        {notifications.map((notif) => {
                                            // Helper para sa icons at kulay base sa type
                                            const getIcon = (type) => {
                                                switch(type) {
                                                    case 'article': return { icon: <BookOpen size={14}/>, color: 'text-blue-500', bg: 'bg-blue-500/10' };
                                                    case 'query': return { icon: <Mic size={14}/>, color: 'text-primary', bg: 'bg-primary/10' };
                                                    case 'security': return { icon: <Settings size={14}/>, color: 'text-red-500', bg: 'bg-red-500/10' };
                                                    default: return { icon: <Bell size={14}/>, color: 'text-slate-500', bg: 'bg-slate-500/10' };
                                                }
                                            };

                                            const theme = getIcon(notif.type);

                                            return (
                                                <button 
                                                    key={notif.id}
                                                    className="w-full text-left p-3.5 rounded-3xl hover:bg-primary/5 transition-all group relative flex items-start gap-4 border border-transparent hover:border-primary/10"
                                                >
                                                    {/* Icon Container */}
                                                    <div className={`shrink-0 w-10 h-10 ${theme.bg} ${theme.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                        {theme.icon}
                                                    </div>
                                                    
                                                    {/* Content */}
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-sm font-black leading-none truncate ${notif.unread ? 'text-foreground' : 'text-foreground/50'}`}>
                                                                {notif.title}
                                                            </p>
                                                            {notif.unread && (
                                                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                                            )}
                                                        </div>
                                                        
                                                        <p className="text-xs text-foreground/40 font-medium line-clamp-2 leading-relaxed">
                                                            {notif.desc}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <Clock size={10} className="text-primary/30" />
                                                            <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                                                                {notif.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* View All Footer */}
                                    <button className="w-full py-3 mt-2 text-[10px] font-black text-foreground/40 hover:text-primary uppercase tracking-[0.2em] transition-colors border-t border-border/50">
                                        View All Activity
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <ThemeToggle inline />

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-4 transition-all cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                            {user?.profile_picture ? (
                                <img 
                                    src={user?.profile_picture}
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user?.firstName; }}
                                />
                            ) : (
                                <span className="text-sm">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                            )}
                        </div>
                        <ChevronDown size={14} className={`opacity-40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-55" onClick={() => setIsDropdownOpen(false)} />
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute right-0 mt-1 w-60 bg-card backdrop-blur-md rounded-[1.2rem] shadow-xl border border-border/50 p-1.5 z-60"
                                >
                                    {/* 🎨 Header: More compact avatar and text */}
                                    <div className="px-3 py-3 mb-1 bg-primary/5 rounded-xl border border-primary/5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 shrink-0">
                                                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                    {user?.profile_picture ? (
                                                        <img src={user.profile_picture} alt="User" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-black text-primary">{user?.firstName?.charAt(0)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col min-w-0 leading-tight">
                                                <p className="text-[12px] font-black text-foreground truncate">
                                                    {user?.firstName} {user?.lastName}
                                                </p>
                                                <p className="text-[9px] text-foreground/50 font-medium truncate italic">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 🔗 Navigation Links: Tighter spacing */}
                                    <div className="space-y-0.5">
                                        {[
                                            { 
                                                icon: <User size={14} />, 
                                                label: 'My Profile', 
                                                path: '/dashboard/my-profile' 
                                            },
                                            { 
                                                icon: <FileText size={14} />, 
                                                label: 'Health Record',
                                                path: '/dashboard/health-records' 
                                            },
                                            { 
                                                icon: <HelpCircle size={14} />, 
                                                label: 'Help & Support', 
                                                path: '/help-support'
                                            },
                                            { 
                                                icon: <BookMarked size={14} />, 
                                                label: 'Bookmark', 
                                                path: '/dashboard/saved-resources' 
                                            },
                                            { 
                                                icon: <Settings size={14} />, 
                                                label: 'Settings', 
                                                path: '/dashboard/settings' 
                                            }
                                        ].map((item, idx) => (
                                            <Link 
                                                key={idx}
                                                to={item.path}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group hover:bg-primary/5"
                                            >
                                                <div className="text-foreground/40 group-hover:text-primary transition-colors">
                                                    {item.icon}
                                                </div>
                                                <span className="text-[11px] font-bold text-foreground/70 group-hover:text-primary transition-colors">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    
                                    {/* 🚪 Footer: Simple Logout */}
                                    <div className="mt-1 pt-1 border-t border-border/50">
                                        <button 
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                onLogoutClick();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500/80 hover:bg-red-500/5 transition-all group cursor-pointer"
                                        >
                                            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            <span className="text-[11px] font-black uppercase tracking-wider">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;