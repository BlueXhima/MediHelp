import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Activity, Mic, Users, FileText, 
    TrendingUp, Settings, LogOut, ChevronLeft, ChevronRight, 
    BookOpen, ChevronDown 
} from 'lucide-react';
import Button from './ui/Button'; // Assuming file structure
import MediHelpLogo from '/MediHelpLogo.png';

const AdminSidebar = ({ isOpen, toggleSidebar, onLogout, activeTab, setActiveTab, adminData }) => {
    // State to handle the open/close state of the Resources dropdown
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);

    const mainItems = [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Health Data", icon: Activity },
        { label: "Voice Map", icon: Mic },
    ];

    const systemItems = [
        { label: "Users", icon: Users },
        { label: "Logs", icon: FileText },
        { label: "Insights", icon: TrendingUp },
        { label: "Settings", icon: Settings },
    ];

    const resourcesItems = [
        { label: "Educational Articles" },
        { label: "Medical Glossary" },
        { label: "Infographics" },
        { label: "First Aid Guides" },
    ];

    useEffect(() => {
        // I-check kung ang activeTab ay HINDI isa sa resourcesItems
        const isResource = resourcesItems.some(item => item.label === activeTab);
        
        if (!isResource) {
            setIsResourcesOpen(false);
        }
    }, [activeTab]);

    const NavGroup = ({ title, items }) => (
        <div className="mb-8">
            {isOpen && (
                <p className="px-4 mb-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                    {title}
                </p>
            )}
            <div className="space-y-1">
                {items.map((item, idx) => {
                    const isActive = activeTab === item.label;
                    return (
                        <button 
                            key={idx} 
                            onClick={() => {
                                // Logic: Kung active na, balik sa Dashboard, kung hindi, set as active
                                setActiveTab(isActive ? "Dashboard" : item.label);
                            }}
                            className={`
                                w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                                }
                            `}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col justify-between transition-all duration-300
            ${isOpen ? 'w-64' : 'w-20'}
        `}>
            <div className="flex flex-col p-3">
                {/* Header & Logo */}
                <div className="flex items-center justify-between py-2 mb-8 px-2">
                    <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} w-full`}>
                        <img 
                            src="/MediHelpLogo.png" 
                            alt="MediHelp Logo" 
                            className={`transition-all duration-300 ${isOpen ? 'h-8' : 'h-8'}`} 
                        />
                        {isOpen && (
                            <span className="ml-3 text-2xl font-black tracking-tighter text-primary" 
                                style={{ fontFamily: "'Unesa', sans-serif" }}>
                                MEDIHELP
                            </span>
                        )}
                    </div>
                    
                    <button 
                        onClick={toggleSidebar} 
                        className="absolute -right-3 top-10 bg-card border border-border rounded-full p-1 text-foreground/30 hover:text-primary transition-colors"
                    >
                        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>

                <nav className={`
                    overflow-y-auto pr-1 scrollbar-thin 
                    ${isOpen ? 'max-h-[calc(100vh-220px)]' : 'max-h-full overflow-y-hidden'}
                `}>
                    <NavGroup title="Main" items={mainItems} />
                    <NavGroup title="System" items={systemItems} />

                    {/* Resources Dropdown */}
                    <div className="mb-2 group">
                        {isOpen ? (
                            // --- Normal View (Kapag OPEN ang Sidebar) ---
                            <>
                                <p className="px-4 mb-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Resources</p>
                                <button 
                                    onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                        isResourcesOpen ? 'bg-foreground/5 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <BookOpen size={18} />
                                        <span className="text-sm font-medium">Resources Library</span>
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isResourcesOpen && (
                                    <div className="mt-1 ml-4 border-l border-border pl-2 space-y-1">
                                        {resourcesItems.map((res) => {
                                            // Dito ang importante: Check kung ito ang active tab
                                            const isActive = activeTab === res.label;
                                            return (
                                                <button 
                                                    key={res.label} 
                                                    onClick={() => {
                                                        setActiveTab(res.label);
                                                    }} 
                                                    className={`w-full text-left px-4 py-2 text-xs rounded-lg transition-colors ${
                                                        isActive 
                                                            ? 'bg-primary/10 text-primary font-semibold' 
                                                            : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                                                    }`}
                                                >
                                                    {res.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            // --- Hover View (Kapag CLOSED ang Sidebar) ---
                            <div className="relative">
                                <div className="w-full flex items-center justify-center p-3 text-foreground/50 hover:text-primary transition-colors cursor-pointer">
                                    <BookOpen size={20} />
                                </div>

                                {/* Floating Popover - Lalabas sa labas ng sidebar */}
                                <div className="fixed left-16 top-85 w-48 bg-card border border-border rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-9999 pointer-events-none group-hover:pointer-events-auto">
                                    <p className="px-4 py-2 text-[10px] font-bold text-foreground/30 uppercase">Resources</p>
                                    {resourcesItems.map((res) => (
                                        <button 
                                            key={res.label}
                                            onClick={() => setActiveTab(res.label)}
                                            className="w-full text-left px-4 py-2 text-sm text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            {res.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Footer: Avatar and Logout */}
            <div className="p-4 border-t border-border space-y-4">
                <div className="flex items-center gap-3 px-2 mb-2 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                        {adminData?.profile_picture ? (
                            <img src={adminData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm">{adminData?.firstName?.charAt(0)}{adminData?.lastName?.charAt(0)}</span>
                        )}
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden animate-in fade-in duration-500">
                            {/* Dito natin ilalagay ang dynamic name */}
                            <p className="text-sm font-semibold truncate">
                                {adminData ? `${adminData.firstName} ${adminData.lastName}` : "Loading..."}
                            </p>
                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest">
                                Administrator
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Logout Button */}
                <Button 
                    variant="dangerGhost" 
                    // Ginawa nating 'justify-center' kapag closed, 'justify-start' kapag open
                    className={`w-full gap-3 ${isOpen ? 'justify-start' : 'justify-center'} rounded-xl`} 
                    onClick={onLogout}
                    leadingIcon={LogOut}
                >
                    {isOpen && "Logout"}
                </Button>
            </div>
        </aside>
    );
};

export default AdminSidebar;