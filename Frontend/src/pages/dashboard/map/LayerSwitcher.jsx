import { Search, Menu, LocateFixed, ChevronDown, X, ChevronLeft, 
    Layers, MapPin, Pill, Stethoscope, Activity, Syringe, Dog
} from 'lucide-react';

const LayerSwitcher = ({ isSidebarOpen, isSatellite, setIsSatellite, selectedHosp }) => {

    // Logic para sa Left Position
    let leftPos = 'left-4'; // Default
    
    if (isSidebarOpen && selectedHosp) {
        leftPos = 'left-[790px]'; // Sidebar (390) + Details (400)
    } else if (isSidebarOpen || selectedHosp) {
        leftPos = 'left-[400px]'; // Kung isa lang sa kanila ang bukas
    }

    return (
        <div 
            className={`absolute bottom-4 z-[1001] transition-all duration-500 ease-in-out ${leftPos}`}
        >
            {/* Ilagay dito yung JSX ng Back Button at Chips */}
            <button
                onClick={() => setIsSatellite(!isSatellite)}
                className="group relative h-auto min-h-30 min-w-30 w-auto px-3 rounded-xl border border-border shadow-2xl overflow-hidden hover:scale-105 transition-all active:scale-95 bg-card flex items-end justify-center pb-2.5 cursor-pointer"
            >
                {/* Image Layer */}
                <img
                    key={isSatellite ? 'street-img' : 'sat-img'}
                    src={isSatellite ? "/map-types/satellite.png" : "/map-types/street.png"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Map Type"
                />

                {/* Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Container - Ginawa nating relative para sumunod ang button width dito */}
                <div className="relative text-primary-foreground flex items-center gap-1.5 px-3 py-1">
                    <Layers 
                        size={12} 
                        className="drop-shadow-md flex-shrink-0" 
                    />
                    
                    {/* 3. Gumamit ng Grid para hindi mag-collapse ang space habang nag-a-animate */}
                    <div className="relative grid items-center overflow-hidden">
                        {/* Default Text: Layer */}
                        <span className="col-start-1 row-start-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform translate-y-0 group-hover:-translate-y-full group-hover:opacity-0">
                            Layer
                        </span>

                        {/* Hover Text: Type (Satellite/Street) */}
                        <span className="col-start-1 row-start-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                            {isSatellite ? 'Satellite' : 'Street'}
                        </span>
                    </div>
                </div>
            </button>
        </div>
    );
};
export default LayerSwitcher;