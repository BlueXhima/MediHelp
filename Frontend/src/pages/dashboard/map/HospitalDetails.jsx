import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Phone, Globe, Clock, Star, MapPin, ChevronLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';

const HospitalDetails = ({ hospital, onClose, onDirections, isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <AnimatePresence>
            {hospital && (
                <div 
                    className="absolute z-[999] transition-all duration-300 ease-in-out flex items-center"
                    style={{ 
                        left: isSidebarOpen ? '390px' : '0px', 
                        top: '80px', // Hindi kakainin ang CategoryOverlay sa taas
                        bottom: '17px' // Hindi dikit sa sahig
                    }}
                >
                    {/* ANG CARD MISMO */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="h-full w-[380px] bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        {/* Header Image */}
                        <div className="relative h-40 bg-slate-100 shrink-0">
                            <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md">
                                <X size={18} />
                            </button>
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <MapPin size={40} />
                            </div>
                        </div>

                        {/* Content Area (Scrollable) */}
                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                            <h2 className="text-xl font-black text-slate-800 mb-2">{hospital.name}</h2>
                            {/* ... (Yung ibang details mo dito) ... */}
                        </div>
                    </motion.div>

                    {/* ANG TOGGLE BUTTON: Nakadikit sa gilid ng card */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="h-12 w-6 bg-white border border-l-0 border-slate-200 shadow-md rounded-r-xl flex items-center justify-center hover:bg-slate-50 transition-all"
                    >
                        <ChevronLeft 
                            size={16} 
                            className={`text-slate-400 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} 
                        />
                    </button>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HospitalDetails;