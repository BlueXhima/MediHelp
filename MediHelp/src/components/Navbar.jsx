import { useEffect, useState, useContext } from "react"
import { cn } from "../lib/utils"
import { Menu, X, Stethoscope, LayoutDashboard, Mic, Heart, BookOpen, Phone, LogOut, Settings, HelpCircle, User } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { AuthModal } from "./AuthModal"
import { AuthContext } from "../context/AuthContext.jsx"
import { Link, useNavigate } from "react-router-dom"

const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/#about' },
    { name: 'Features', to: '/#features' },
    { name: 'Resources', to: '/#resources' },
    { name: 'Contact', to: '/#contact' },
]

const authNavItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Voice Assistant', to: '/voice-assistant', icon: Mic },
    { name: 'Health Profile', to: '/health-profile', icon: Heart },
    { name: 'Guidance Library', to: '/guidance-library', icon: BookOpen },
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { openAuth, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const handleLogout = () => {
        console.log("Logout confirmed");
        logout();
        setIsDropdownOpen(false);
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        console.log("Dropdown toggled", !isDropdownOpen);
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openLogoutModal = () => {
        console.log("Logout modal opened");
        setIsLogoutModalOpen(true);
    };

    const getAvatarLetter = () => {
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <>
            <nav className={cn("fixed w-full z-50 transition-all duration-300", isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5")}>
                <div className="container flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-primary flex items-center">
                        <span className="relative z-10 flex items-center gap-3">
                            <span className="flex items-center gap-2">
                                <Stethoscope size={20} className="text-primary" aria-hidden="true" />
                                <span className="text-glow text-foreground">MediHelp</span>
                            </span>
                            {!user && <span className="text-xs text-primary-foreground font-medium bg-primary px-2 py-1 rounded-full">HIPAA Compliance</span>}
                        </span>
                    </Link>

                    {!user ? (
                        <>
                            {/* Unauthenticated Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                {navItems.map((item) => (
                                    <Link key={item.name} to={item.to} className="text-foreground/80 hover:text-primary transition-colors duration-300">
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Get Started Button + Theme Toggle (desktop) */}
                            <div className="hidden md:flex items-center">
                                <button
                                    type="button"
                                    onClick={openAuth}
                                    className={cn(
                                        "ml-4 inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2",
                                        "rounded-full bg-primary text-primary-foreground text-sm md:text-base",
                                        "font-medium shadow-sm transform-gpu transition duration-200 hover:scale-105",
                                        "active:scale-95 hover:shadow-md focus:outline-none focus:ring-2",
                                        "focus:ring-primary/30 dark:bg-primary/80 dark:text-primary-foreground cursor-pointer"
                                    )}
                                >
                                    Get Started
                                </button>
                                <ThemeToggle inline className="ml-3" />
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="flex items-center gap-4 md:hidden z-[9999] relative">
                                <button
                                    onClick={() => setIsMenuOpen(prev => !prev)}
                                    className="p-2 text-foreground"
                                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                                <ThemeToggle inline />
                            </div>

                            <div className={cn(
                                "fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden flex flex-col justify-center items-center",
                                "px-6 transition-all duration-300",
                                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                            )}>
                                <div className="flex flex-col items-center w-full space-y-6">
                                    {navItems.map((item, key) => (
                                        <Link
                                            key={key}
                                            to={item.to}
                                            className="text-foreground/80 hover:text-primary transition-colors duration-300 text-2xl"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    <button
                                        onClick={() => { setIsMenuOpen(false); openAuth(); }}
                                        className={cn("inline-flex items-center justify-center w-48 px-8 py-3 rounded-full",
                                            "bg-primary text-primary-foreground text-2xl font-medium shadow-sm transform-gpu",
                                            "transition duration-200 hover:scale-105 active:scale-95 hover:shadow-md",
                                            "focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-primary/80 cursor-pointer",
                                            "mt-5")}
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Authenticated Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-6">
                                {authNavItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-300"
                                        >
                                            <IconComponent size={18} />
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Emergency Button + User Dropdown */}
                            <div className="hidden md:flex items-center gap-4">
                                <button
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 rounded-md",
                                        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                                        "text-white font-semibold shadow-md hover:shadow-lg",
                                        "transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95",
                                        "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2",
                                        "cursor-pointer animate-pulse"
                                    )}
                                    aria-label="Emergency call button"
                                >
                                    <Phone size={18} className="text-white" />
                                    <span className="text-sm">Emergency</span>
                                </button>

                                {/* User Avatar Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold cursor-pointer hover:opacity-80 transition"
                                    >
                                        {getAvatarLetter()}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-8 w-50 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                                            <div className="px-4 py-2 border-b border-border">
                                                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/health-profile')}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-foreground/80 hover:bg-primary/10 transition cursor-pointer"
                                            >
                                                <User size={18} />
                                                <span>User</span>
                                            </button>
                                            <button
                                                className="w-full flex items-center gap-3 px-4 py-2 text-foreground/80 hover:bg-primary/10 transition cursor-pointer"
                                            >
                                                <Settings size={18} />
                                                <span>Security</span>
                                            </button>
                                            <button
                                                className="w-full flex items-center gap-3 px-4 py-2 text-foreground/80 hover:bg-primary/10 transition cursor-pointer"
                                            >
                                                <HelpCircle size={18} />
                                                <span>Help & Support</span>
                                            </button>
                                            <button
                                                onClick={openLogoutModal}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 transition cursor-pointer border-t border-border"
                                            >
                                                <LogOut size={18} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <ThemeToggle inline className="ml-2" />
                            </div>

                            {/* Mobile Menu for Authenticated Users */}
                            <div className="flex items-center gap-4 md:hidden z-[9999] relative">
                                <button
                                    onClick={() => setIsMenuOpen(prev => !prev)}
                                    className="p-2 text-foreground"
                                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                                <ThemeToggle inline />
                            </div>

                            <div className={cn(
                                "fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden flex flex-col justify-center items-center",
                                "px-6 transition-all duration-300",
                                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                            )}>
                                <div className="flex flex-col items-center w-full space-y-6">
                                    {authNavItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.to}
                                                className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors duration-300 text-xl"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <IconComponent size={24} />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}

                                    <button
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-3 rounded-full mt-4",
                                            "bg-red-500 hover:bg-red-600 text-white font-medium transition",
                                            "cursor-pointer text-lg"
                                        )}
                                    >
                                        <Phone size={20} />
                                        <span>Emergency</span>
                                    </button>

                                    <button
                                        onClick={() => { setIsMenuOpen(false); setIsLogoutModalOpen(true); }}
                                        className="flex items-center gap-3 px-6 py-3 rounded-full text-red-500 hover:bg-red-500/10 transition cursor-pointer text-lg font-medium"
                                    >
                                        <LogOut size={20} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Auth Modal rendered in Navbar */}
            <AuthModal />

            {/* Logout Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 transform scale-95 hover:scale-100 transition-transform duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out? This action will end your session.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow-md transition-all"
                                onClick={() => setIsLogoutModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 cursor-pointer rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
};