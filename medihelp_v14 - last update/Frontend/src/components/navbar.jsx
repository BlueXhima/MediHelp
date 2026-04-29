import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { ThemeToggle } from "../ThemeToggle/themetoggle";
import { Stethoscope, Menu, X, ChevronDown, User, Activity, BookOpen, Mic2, LayoutDashboard, Settings2Icon,
    Search
} from "lucide-react";
import DefaultAvatar from "../assets/default-avatar.png";
import { Settings, Clipboard, HelpCircle, Shield, Sliders, LogOut, Bookmark } from "lucide-react";
import axios from "axios";
import LogoutModal from "./logoutmodal";

const navItems = [
    { 
        name: "Health Library", 
        path: "/guidance-library", 
        isMegaMenu: true,
        categories: [
            { 
                title: "General Wellness", 
                items: ["General Health", "Nutrition", "Exercise", "Preventive Care"] 
            },
            { 
                title: "Medical Conditions", 
                items: ["Symptoms", "Medications", "Mental Health", "Chronic Conditions"] 
            },
            { 
                title: "Specialized Care", 
                items: ["Emergency Care", "Pediatric"] 
            }
        ]
    },
    { name: "Emergency Guide", path: "/emergency" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Community", path: "/community" },
];

// Nagdagdag ako ng icons para sa User Nav Items para mas premium tingnan
const userNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Voice Assistant", path: "/dashboard/voice-assistant", icon: Mic2 },
    { name: "Health Profile", path: "/dashboard/health-profile", icon: Activity },
    { name: "Guidance Library", path: "/dashboard/guidance-library", icon: BookOpen },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) {
            setIsLoggedIn(true);
            setUserRole(role);
        }
        const handleStorageChange = () => {
            const role = localStorage.getItem("userRole");
            if (role) {
                setIsLoggedIn(true);
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        withCredentials: true,
                    });
                    const { firstName, lastName, profile_picture } = response.data;
                    setUserName(`${firstName} ${lastName}`);
                    setUser({ firstName, lastName, profile_picture });
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserName();
    }, []);

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        if (path === "/dashboard") return location.pathname === "/dashboard";
        return location.pathname === path;
    };

    // Halimbawang data, ito ay papalitan mo ng data mula sa iyong Guidance Library backend
    const liveResults = [
        { title: "Fever Management", category: "Guidance" },
        { title: "First Aid for Burns", category: "Emergency" },
        { title: "Cough Home Remedies", category: "Wellness" }
    ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[50] transition-all duration-500",
                    isScrolled 
                        ? "py-3 px-4 sm:px-10" 
                        : "py-2 px-4 sm:px-10"
                )}
            >
                {/* Main Container with Glassmorphism */}
                <div className={cn(
                    "container mx-auto flex items-center justify-between px-6 py-2.5 rounded-[2rem] transition-all duration-500",
                    isScrolled 
                        ? "bg-background/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]" 
                        : "bg-transparent"
                )}>
                    
                    {/* Brand/Logo */}
                    <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-[10deg] transition-transform">
                            <Stethoscope size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-400">
                            Medi<span className="text-primary">Help</span>
                        </span>
                    </Link>

                    {/* Desktop Center Navigation */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center bg-muted/30 p-1.5 rounded-2xl border border-border/40">
                            <ul className="flex items-center relative">
                                {(isLoggedIn ? userNavItems : navItems).map((item, index) => {
                                    const active = isActive(item.path);
                                    return (
                                        <li key={index} className="relative z-10 group">
                                            <Link
                                                to={item.path}
                                                className={cn(
                                                    "flex items-center gap-2 px-5 py-2 text-[13px] font-bold transition-colors duration-300",
                                                    active ? "text-white bg-primary rounded-xl" : "text-slate-500 hover:text-indigo-600"
                                                )}
                                            >
                                                {item.icon && <item.icon size={16} />}
                                                {item.name}
                                                {item.isMegaMenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                                            </Link>
                                            
                                            {/* Mega Menu Placeholder */}
                                            {item.isMegaMenu && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/8 w-[750px] mt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
                                                    <div className="absolute -top-4 left-0 w-full h-4" />
                                                    
                                                    <div className="bg-card/95 backdrop-blur-2xl border border-border/50 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
                                                        {/* Top Header Strip - Adds character to the menu */}
                                                        <div className="bg-primary/5 px-8 py-3 border-b border-border/40 flex justify-between items-center">
                                                            <span className="text-[13px] font-black tracking-[0.2em] text-primary/60">MediHelp Knowledge Base</span>
                                                            <Link to="/guidance-library" className="text-[10px] font-bold text-primary hover:underline transition-all">Explore Full Library</Link>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-0 p-4">
                                                            {item.categories.map((cat, i) => (
                                                                <div key={i} className={cn(
                                                                    "p-6 hover:bg-primary/[0.02] transition-colors rounded-3xl",
                                                                    i !== item.categories.length - 1 && "border-r border-border/30"
                                                                )}>
                                                                    <div className="flex items-center gap-2 mb-4">
                                                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                                            {/* Pwedeng lagyan ng dynamic icons base sa category title */}
                                                                            <Activity size={14} className="text-primary" />
                                                                        </div>
                                                                        <p className="text-[12px] font-black text-foreground uppercase tracking-wider">{cat.title}</p>
                                                                    </div>

                                                                    <ul className="space-y-3">
                                                                        {cat.items.map((sub, j) => (
                                                                            <li key={j} className="group/link">
                                                                                <Link 
                                                                                    to={`/resources/${sub.toLowerCase().replace(/ /g, '-')}`}
                                                                                    className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-all duration-200"
                                                                                >
                                                                                    <div className="w-1 h-1 rounded-full bg-border group-hover/link:bg-primary group-hover/link:scale-150 transition-all" />
                                                                                    <span className="font-medium">{sub}</span>
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        
                                                        {/* Bottom Footer - Encourages Sign Up */}
                                                        <div className="px-8 py-5 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                                                            <div className="flex items-center text-left gap-3">
                                                                <div className="p-2 bg-background rounded-lg shadow-sm border border-border/50">
                                                                    <Mic2 size={16} className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[14px] font-bold">Try Voice Assistance</p>
                                                                    <p className="text-[11px] text-muted-foreground">Search and listen to guides hands-free</p>
                                                                </div>
                                                            </div>
                                                            <Link 
                                                                to="/login" 
                                                                className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[11px] font-black transition-all"
                                                            >
                                                                GET STARTED
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {active && (
                                                <motion.div
                                                    layoutId="nav-glow"
                                                    className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50 -z-10"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Search Input Integrated */}
                        <div className="relative group ml-4">
                            <div className="relative flex items-center">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(e.target.value.length > 0);
                                    }}
                                    onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                    placeholder="Search symptoms..." // Mas maikli at malinis
                                    className="w-48 lg:w-60 focus:w-72 transition-all duration-300 bg-muted/40 text-slate-500 border border-border/40 rounded-xl px-4 py-2 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <div className="absolute right-3 text-slate-500 group-focus-within:text-primary">
                                    <Search size={15} />
                                </div>
                            </div>

                            {/* Live Search Dropdown */}
                            <AnimatePresence>
                                {showResults && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full mt-6 w-full min-w-[280px] bg-card border border-border/50 rounded-2xl shadow-xl z-[70] overflow-hidden p-2"
                                    >
                                        {/* Live Results Area */}
                                        <div className="space-y-1">
                                            {liveResults.length > 0 ? (
                                                liveResults.map((result, i) => (
                                                    <button
                                                        key={i}
                                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-primary/5 flex items-center justify-between group/item transition-all duration-200"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] font-bold text-foreground group-hover/item:text-primary transition-colors">
                                                                    {result.title}
                                                                </span>
                                                                {result.isPremium && (
                                                                    <Lock size={12} className="text-muted-foreground/50" />
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={cn(
                                                                    "text-[10px] font-black uppercase tracking-wider",
                                                                    result.isPremium ? "text-amber-500/80" : "text-primary/70"
                                                                )}>
                                                                    {result.isPremium ? "Member Only" : "Public Guidance"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <ChevronDown size={14} className="-rotate-90 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center flex flex-col items-center gap-2">
                                                    <div className="p-3 bg-muted/50 rounded-full">
                                                        <HelpCircle size={20} className="text-muted-foreground/40" />
                                                    </div>
                                                    <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                                                        No medical guidance found for <br />
                                                        <span className="text-foreground font-bold">"{searchQuery}"</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Direct Action Footer */}
                                        <div className="mt-2 pt-2 border-t border-border/50">
                                            <button className="w-full py-2 text-[11px] font-black text-primary hover:bg-primary/5 rounded-lg transition-all uppercase tracking-wider">
                                                See all results for "{searchQuery}"
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Side: Theme & User */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle inline />
                        
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center cursor-pointer gap-2 p-1 pl-1 pr-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-all border border-border/20"
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-background">
                                        <img
                                            src={user?.profile_picture || DefaultAvatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = DefaultAvatar; }}
                                        />
                                    </div>
                                    {/* <span className="hidden sm:inline-block text-sm font-bold text-foreground/80">
                                        {user?.firstName || "User"}
                                    </span> */}
                                    <ChevronDown size={14} className={cn("text-slate-500 transition-transform", isDropdownOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-72 bg-card/80 backdrop-blur-2xl border border-border/50 rounded-[1.5rem] shadow-2xl p-3 z-[60]"
                                        >
                                            <div className="flex items-center gap-3 p-3 mb-2 bg-primary/5 rounded-2xl">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-background flex items-center justify-center text-primary overflow-hidden">
                                                    <img
                                                        src={user?.profile_picture || DefaultAvatar}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = DefaultAvatar; }}
                                                    />
                                                </div>
                                                <div className="overflow-hidden text-left">
                                                    <p className="text-sm font-black truncate">{userName || "User"}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Patient</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                {[
                                                    { to: "/dashboard/health-profile", icon: Settings, label: "Account" },
                                                    { to: "/dashboard/health-profile/records", icon: Clipboard, label: "Health Records" },
                                                    { to: "/dashboard/guidance-library/save-library", icon: Bookmark, label: "Bookmark" },
                                                    { to: "/dashboard/help-support", icon: HelpCircle, label: "Help & Support" },
                                                    { to: "/dashboard/settings", icon: Settings2Icon, label: "Settings" },
                                                ].map((link, i) => (
                                                    <Link
                                                        key={i}
                                                        to={link.to}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                    >
                                                        <link.icon size={16} />
                                                        {link.label}
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-border/50 my-2 mx-2" />
                                                <button
                                                    onClick={() => { setIsDropdownOpen(false); setIsLogoutModalOpen(true); }}
                                                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-7 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background border-l border-border z-[100] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-black">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)}><X /></button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {(isLoggedIn ? userNavItems : navItems).map((item, i) => (
                                    <Link 
                                        key={i} 
                                        to={item.path} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn("text-lg font-bold p-3 rounded-2xl", isActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground")}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Logout Modal remains as per original logic */}
                {isLogoutModalOpen && (
                    <LogoutModal onCancel={() => setIsLogoutModalOpen(false)} onLogout={() => setIsLogoutModalOpen(false)} />
                )}
            </nav>
        </>
    );
};

export default Navbar;