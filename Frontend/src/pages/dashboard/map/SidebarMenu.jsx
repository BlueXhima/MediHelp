import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { styles } from './HospitalStyles';
import HospitalCard from './HospitalCard';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery, filteredHospitals, selectedHosp, setSelectedHosp, handleDirections }) => {
    return (
        <div className={`${styles.sidebar} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            <div className="pt-3 px-4 pb-4 border-b bg-white">
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <span className="font-bold text-blue-600">Hospital Finder</span>
                    <button onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
                </div>

                <div className={styles.searchBox}>
                    <input 
                        className="flex-1 outline-none text-sm font-medium"
                        placeholder="Search hospitals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="text-slate-400" size={18} />
                </div>
            </div>

            <div className="px-5 py-3 bg-slate-50/50 border-b">
                <p className="text-[11px] font-extrabold text-foreground tracking-widest">
                    {filteredHospitals.length} RESULTS
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredHospitals.map(h => (
                    <HospitalCard 
                        key={h.id} 
                        hospital={h} 
                        isSelected={selectedHosp?.id === h.id}
                        onClick={setSelectedHosp}
                        onDirections={(e) => handleDirections(e, h)}
                    />
                ))}
            </div>

            {!selectedHosp && (
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-1/2 -right-6 bg-white h-12 w-6 shadow-md rounded-r-md border border-slate-200 flex items-center justify-center transition-all duration-300"
                >
                    <ChevronDown 
                        className={`text-slate-400 ${isSidebarOpen ? 'rotate-90' : '-rotate-90'}`} 
                        size={16}
                    />
                </button>
            )}
        </div>
    );
};

export default Sidebar;