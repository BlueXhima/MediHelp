import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Corrected navigate import
import { cn } from "../lib/utils";
import { ThemeToggle } from "../ThemeToggle/themetoggle";
import { Stethoscope, Menu, X } from "lucide-react";
import DefaultAvatar from "../assets/default-avatar.png";
import { Settings, Clipboard, HelpCircle, Shield, Sliders, LogOut } from "lucide-react";
import axios from "axios";
import LogoutModal from "./logoutmodal"; // Import the LogoutModal component

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
    { name: "Health Profile", path: "/health-profile" },
    { name: "Guidance Library", path: "/guidance-library" },
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
                    const { firstName, lastName } = response.data;
                    const fullName = `${firstName} ${lastName}`;
                    setUserName(fullName);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserName();
    }, []);

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true); // Show the modal
    };

    const handleCancel = () => {
        setIsLogoutModalOpen(false); // Hide the modal
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false); // Close the dropdown menu
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed w-full z-50 transition-all duration-300",
                    isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
                )}
            >
                <div className="container flex items-center justify-between">
                    {/* Left Side: Logo and Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
                            <span className="relative z-10 flex items-center gap-3">
                                <span className="flex items-center gap-2">
                                    <Stethoscope size={20} className="text-primary" aria-hidden="true" />
                                    <span className="text-glow text-foreground">MediHelp</span>
                                </span>
                            </span>
                        </Link>

                        <ul className="hidden md:flex items-center space-x-8">
                            {(isLoggedIn ? userNavItems : navItems).map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "relative text-foreground hover:text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full",
                                            isActive(item.path) && "text-blue-600 after:w-full"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side: Get Started Button or Avatar */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 shadow-md cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <img
                                        src={localStorage.getItem("avatar") || DefaultAvatar}
                                        alt="User Avatar"
                                        className="w-full h-full bg-foreground object-cover"
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-card border border-gray-200 rounded-md shadow-lg">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm text-left font-medium text-foreground">{userName || "User"}</p>
                                        </div>
                                        <ul className="py-1">
                                            <li>
                                                <Link
                                                    to="/account-settings"
                                                    className="flex items-center px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <i className="mr-2"><Settings size={16} /></i> Account Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/health-records"
                                                    className="flex items-center px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <i className="mr-2"><Clipboard size={16} /></i> My Health Records
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/help-support"
                                                    className="flex items-center px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <i className="mr-2"><HelpCircle size={16} /></i> Help / Support
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/terms-privacy"
                                                    className="flex items-center px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <i className="mr-2"><Shield size={16} /></i> Terms & Privacy
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <i className="mr-2"><Sliders size={16} /></i> Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="border-gray-200 my-1" />
                                            </li>
                                            <li>
                                                <button
                                                    className="flex items-center w-full text-left px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                                    onClick={() => {
                                                        handleDropdownItemClick(); // Close dropdown
                                                        handleLogoutClick(); // Open logout modal
                                                    }}
                                                >
                                                    <i className="mr-2"><LogOut size={16} /></i> Logout
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