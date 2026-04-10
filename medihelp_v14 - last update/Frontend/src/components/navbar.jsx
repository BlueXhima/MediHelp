import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Corrected navigate import
import { cn } from "../lib/utils";
import { ThemeToggle } from "../ThemeToggle/themetoggle";
import { Stethoscope, Menu, X } from "lucide-react";
import DefaultAvatar from "../assets/default-avatar.png";
import { Settings, Clipboard, HelpCircle, Shield, Sliders, LogOut } from "lucide-react";
import axios from "axios";
import LogoutModal from "./logoutmodal";

const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Community", path: "/community" },
    { name: "Contact", path: "/contact" },
];

const userNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Voice Assistant", path: "/dashboard/voice-assistant" },
    { name: "Health Profile", path: "/dashboard/health-profile" },
    { name: "Guidance Library", path: "/dashboard/guidance-library" },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState('');
    const location = useLocation(); // Get current route
    const navigate = useNavigate(); // Corrected navigate import
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Define state for logout modal
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
    const [user, setUser] = useState(null); // State to hold user data

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Check if user is logged in and retrieve role
        const role = localStorage.getItem("userRole"); // Updated to check 'userRole'
        if (role) {
            setIsLoggedIn(true);
            setUserRole(role);
        }

        const handleStorageChange = () => {
            const role = localStorage.getItem("userRole"); // Updated to check 'userRole'
            if (role) {
                setIsLoggedIn(true);
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        };

        // Listen for changes in localStorage
        window.addEventListener("storage", handleStorageChange);

        // Initial check
        handleStorageChange();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            const email = localStorage.getItem('email'); // Retrieve email from localStorage
            if (email) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        params: { email },
                    });

                    // 1. Idinagdag ang profile_picture sa pag-destructure
                    const { firstName, lastName, profile_picture } = response.data;
                    const fullName = `${firstName} ${lastName}`;
                    
                    setUserName(fullName);

                    // 2. I-set ang user state para kasama ang profile_picture
                    // Siguraduhin na may [user, setUser] state ka sa taas
                    setUser({
                        firstName,
                        lastName,
                        profile_picture: profile_picture // Ito yung gagamitin ng <img> tag
                    });

                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserName();
    }, []);

    useEffect(() => {
        console.log("isLoggedIn:", isLoggedIn);
        console.log("userRole:", userRole);
    }, [isLoggedIn, userRole]);

    const isActive = (path) => {
        // 1. Para sa Guest Home (/) - Strict match dapat
        if (path === "/") {
            return location.pathname === "/";
        }

        // 2. Para sa User Dashboard (/dashboard) - Strict match dapat
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }

        // 3. Para sa lahat ng iba pang links (About, Health Profile, etc.)
        // Check kung exact match o kung ito ay sub-page ng current path
        return location.pathname === path;
    };

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true); // Show the modal
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false); // Close the dropdown menu
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[50] transition-all duration-500",
                    isScrolled 
                        ? "py-3 bg-background/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" 
                        : "py-5 bg-transparent"
                )}
            >
                <div className="container flex items-center justify-between">
                    {/* Left Side: Logo and Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-2xl font-bold text-primary flex items-center">
                            <span className="relative z-10 flex items-center gap-3">
                                <span className="flex items-center gap-2">
                                    <Stethoscope size={20} className="text-primary" aria-hidden="true" />
                                    <span className="text-glow text-foreground">MediHelp</span>
                                </span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <ul className="flex items-center space-x-1">
                                {(isLoggedIn ? userNavItems : navItems).map((item, index) => {
                                    const active = isActive(item.path);
                                    return (
                                        <li key={index} className="relative list-none">
                                            <Link
                                                to={item.path}
                                                className={cn(
                                                    "relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10",
                                                    active ? "text-primary" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                                                )}
                                            >
                                                {item.name}

                                                {active && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Get Started Button or Avatar */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 shadow-md cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <img
                                        src={user?.profile_picture || DefaultAvatar}
                                        alt="User Avatar"
                                        className="w-full h-full bg-foreground object-cover"
                                        onError={(e) => { e.target.src = DefaultAvatar; }}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute p-2 right-0 mt-2 w-64 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-5 py-4 bg-accent/20 text-left border-b border-border/50">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Authorized User</p>
                                            <p className="text-lg font-medium text-foreground">{userName || "User"}</p>
                                        </div>
                                        <ul className="py-1 space-y-2">
                                            <li>
                                                <Link
                                                    to="/account-settings"
                                                    className="group flex items-center px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full"
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <Settings size={16} />
                                                    </i> Account Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/health-records"
                                                    className="group flex items-center px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full"
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <Clipboard size={16} />
                                                    </i> My Health Records
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/help-support"
                                                    className="group flex items-center px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full"
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <HelpCircle size={16} />
                                                    </i> Help / Support
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/terms-privacy"
                                                    className="group flex items-center px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full"
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <Shield size={16} />
                                                    </i> Terms & Privacy
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/settings"
                                                    className="group flex items-center px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full"
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <Sliders size={16} />
                                                    </i> Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="border-border my-1" />
                                            </li>
                                            <li>
                                                <button
                                                    className="group flex items-center w-full text-left px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 hover:rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        handleDropdownItemClick(); // Close dropdown
                                                        handleLogoutClick(); // Open logout modal
                                                    }}
                                                >
                                                    <i className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                                        <LogOut size={16} />
                                                    </i> Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                aria-label="Get Started"
                                className="px-6 py-2 bg-primary text-white rounded-md 
                                    hover:bg-primary-dark focus:outline-none 
                                    focus:ring-2 focus:ring-primary focus:ring-offset-2 
                                    transition-transform duration-200 ease-in-out 
                                    hover:scale-105 shadow-sm flex items-center justify-center"
                            >
                                Get Started
                            </Link>
                        )}
                        <ThemeToggle inline className="ml-3" />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex items-center gap-4 md:hidden z-[9999] relative">
                        <button
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="p-2 text-foreground"
                            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div
                        className={cn(
                            "fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden flex flex-col justify-center items-center",
                            "px-6 transition-all duration-300",
                            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        )}
                    >
                        <ul className="flex flex-col items-center space-y-6">
                            {(isLoggedIn ? userNavItems : navItems).map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "text-gray-700 hover:text-blue-600 text-lg",
                                            isActive(item.path) && "text-blue-600"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Logout Modal */}
                {isLogoutModalOpen && (
                    <LogoutModal
                        onCancel={() => setIsLogoutModalOpen(false)}
                        onLogout={() => {
                            setIsLogoutModalOpen(false);
                            // Additional logout logic if needed
                        }}
                    />
                )}
            </nav>
        </>
    );
};

export default Navbar;