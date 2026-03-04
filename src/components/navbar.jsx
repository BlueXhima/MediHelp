import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ThemeToggle } from "../ThemeToggle/themetoggle";
import { Stethoscope, Menu, X } from "lucide-react";

const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Community", path: "/community" },
    { name: "Contact", path: "/contact" },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Get current route

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
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
                        {navItems.map((item, index) => (
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

                {/* Right Side: Get Started Button and Theme Toggle */}
                <div className="hidden md:flex items-center gap-4">
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
                        {navItems.map((item, index) => (
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
        </nav>
    );
};

export default Navbar;