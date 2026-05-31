import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, ChevronLeft, ChevronRight, MapPin, Pill, 
    Stethoscope, Activity, Syringe, Dog 
} from 'lucide-react';

const CategoryOverlay = ({ isSidebarOpen, activeCategory, handleCategoryChange, userData }) => {
    const scrollRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 160; 
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const categories = [
        { id: 'hospital', label: 'Hospitals', icon: <MapPin size={16}/> },
        { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={16}/> },
        { id: 'clinic', label: 'Clinics', icon: <Stethoscope size={16}/> },
        { id: 'dentist', label: 'Dentist', icon: <Activity size={16}/> },
        { id: 'doctors', label: 'Doctors', icon: <Syringe size={16}/> },
        { id: 'veterinary', label: 'Veterinary', icon: <Dog size={16}/> }
    ];

    const currentCat = categories.find(c => c.id === activeCategory) || categories[0];

    return (
        <div className={`absolute top-4 z-[1001] flex items-center gap-2 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'left-[396px]' : 'left-4'
        } right-4`}>
            
            {/* BACK BUTTON */}
            <button 
                onClick={() => window.history.back()}
                className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-2.5 md:px-4 rounded-xl shadow-xl border border-slate-200 active:scale-95 transition-all group cursor-pointer"
            >
                <ChevronLeft size={18} className="text-slate-700 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:inline font-bold text-sm text-slate-700">Dashboard</span>
            </button>

            <div className="h-8 w-[1px] bg-slate-300/50 hidden sm:block mx-1 flex-shrink-0"></div>

            {/* --- CATEGORY SECTION --- */}
            <div className="flex-1 md:flex-none flex items-center min-w-0 relative md:w-[460px]">
                
                {/* MOBILE VIEW: Custom Framer Motion Dropdown */}
                <div className="md:hidden relative flex-1">
                    <motion.button 
                        layout // Smooth transition para sa paglaki/pagliit ng button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`flex items-center justify-between bg-white border border-slate-200 py-2.5 rounded-xl shadow-lg text-xs font-bold text-slate-700 outline-none active:scale-95 transition-all ${
                            isSidebarOpen ? 'px-3 w-fit' : 'px-4 w-fit'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-purple-500">{currentCat.icon}</span>
                            {/* Itatago ang label kapag open ang sidebar sa mobile */}
                            <AnimatePresence mode="wait">
                                {!isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap overflow-hidden"
                                    >
                                        {currentCat.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Itatago rin ang arrow kapag open ang sidebar para tipid sa space */}
                        {!isSidebarOpen && (
                            <motion.div
                                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-2"
                            >
                                <ChevronDown size={14} className="text-slate-400" />
                            </motion.div>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMobileMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 5, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute top-full left-0 min-w-[160px] bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden p-1 z-50"
                                >
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                handleCategoryChange(cat.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                                                activeCategory === cat.id 
                                                ? 'bg-purple-50 text-purple-600' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className={activeCategory === cat.id ? 'text-purple-600' : 'text-slate-400'}>
                                                {cat.icon}
                                            </span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* DESKTOP VIEW: Slider Wrapper (Unchanged) */}
                <div className="hidden md:flex items-center w-full relative group h-12">
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute -left-3 z-30 bg-white p-2 rounded-full shadow-2xl border border-slate-200 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-purple-600 scale-110 cursor-pointer"
                    >
                        <ChevronLeft size={16} strokeWidth={3} />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-2" 
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all whitespace-nowrap border-2 cursor-pointer flex-shrink-0 ${
                                    activeCategory === cat.id 
                                    ? 'bg-purple-600 border-purple-400 text-white' 
                                    : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className={activeCategory === cat.id ? 'text-white' : 'text-purple-500'}>
                                    {cat.icon}
                                </span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => scroll('right')}
                        className="absolute -right-3 z-30 bg-white p-2 rounded-full shadow-2xl border border-slate-200 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-purple-600 scale-110 cursor-pointer"
                    >
                        <ChevronRight size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* USER PROFILE AVATAR */}
            <div className="flex-shrink-0 ml-auto relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                    {userData?.profile_picture ? (
                        <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs font-bold text-slate-600">
                            {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="absolute top-7 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
        </div>
    );
};

export default CategoryOverlay;