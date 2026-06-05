import React, { useState, useEffect } from 'react';
import { LocateFixed, Plus, Minus } from 'lucide-react';
import { useMap } from 'react-leaflet'; // Added import
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios';

// Imports from our separated files
import { userService } from '../../services/userService';
import { getCachedLocation } from '../../lib/locationUtils';
import { setDefaultIcon, styles } from './map/HospitalStyles';
import SidebarMenu from './map/SidebarMenu'; // Renamed import to match common usage
import CategoryOverlay from './map/CategoryOverlay';
import LayerSwitcher from './map/LayerSwitcher';
import MapView from './map/MapView';
import HospitalDetails from './map/HospitalDetails';

// Initialize Leaflet defaults
setDefaultIcon();

// Move calculateDistance outside to avoid recreation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); 
};

const NearbyHospitalMap = () => {
    // --- STATE ---
    const [userLoc, setUserLoc] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [selectedHosp, setSelectedHosp] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSatellite, setIsSatellite] = useState(false);
    const [activeCategory, setActiveCategory] = useState('hospital');
    const [userData, setUserData] = useState(null);
    const [map, setMap] = useState(null);

    // --- LOGIC / EFFECTS ---
    useEffect(() => {
        getCachedLocation()
            .then(coords => {
                setUserLoc(coords);
                fetchHospitals(coords.latitude, coords.longitude, activeCategory);
            })
            .catch(err => console.error("Location error:", err));
            
        userService.getFullDetails()
            .then(data => setUserData(data))
            .catch(err => console.error("User fetch error:", err));
    }, []);

    // Redundant useEffect removed

    const fetchHospitals = async (lat, lon, type = activeCategory) => {
        if (!lat || !lon) return;

        let categoryQuery = `node["amenity"="${type}"](around:5000, ${lat}, ${lon});
                        way["amenity"="${type}"](around:5000, ${lat}, ${lon});
                        rel["amenity"="${type}"](around:5000, ${lat}, ${lon});`;

        if (type === 'pharmacy') {
            categoryQuery += `node["shop"="pharmacy"](around:5000, ${lat}, ${lon});
                            node["healthcare"="pharmacy"](around:5000, ${lat}, ${lon});
                            rel["shop"="pharmacy"](around:5000, ${lat}, ${lon});`;
        }

        if (type === 'doctors' || type === 'clinic') {
            categoryQuery += `node["healthcare"="${type}"](around:5000, ${lat}, ${lon});
                            way["healthcare"="${type}"](around:5000, ${lat}, ${lon});
                            rel["healthcare"="${type}"](around:5000, ${lat}, ${lon});`;
        }

        if (type === 'hospital') {
            categoryQuery += `node["healthcare"="hospital"](around:5000, ${lat}, ${lon});
                            way["healthcare"="hospital"](around:5000, ${lat}, ${lon});
                            rel["healthcare"="hospital"](around:5000, ${lat}, ${lon});`;
        }

        const query = `[out:json][timeout:60];(${categoryQuery});out center;`;
        
        try {
            // GAMIT ANG AXIOS:
            // Ang endpoint ay 'proxy-overpass' na dinefine natin sa backend
            const response = await api.get('/proxy-overpass', {
                params: { query } // Ipapasa ni axios ito bilang ?query=...
            });
            
            if (!res.ok) {
                if (res.status === 429) return; // Handle too many requests
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();
            
            if (!data.elements) {
                setHospitals([]);
                return;
            }

            // Remove duplicates
            const uniqueElements = Array.from(new Map(data.elements.map(item => [item.id, item])).values());

            const formatted = uniqueElements.map(el => {
                const itemLat = el.lat || el.center.lat;
                const itemLon = el.lon || el.center.lon;

                return {
                    id: el.id,
                    lat: itemLat,
                    lon: itemLon,
                    name: el.tags.name || el.tags['name:en'] || el.tags.brand || (type.charAt(0).toUpperCase() + type.slice(1)),
                    address: el.tags['addr:street'] || el.tags['addr:full'] || "Address not listed",
                    phone: el.tags.phone || el.tags['contact:phone'] || "No contact",
                    distance: calculateDistance(itemLat, itemLon, lat, lon),
                    // Optional: keep random data for simulation, or fetch real data
                    rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
                    reviews: Math.floor(Math.random() * 500) + 10
                };
            }).sort((a, b) => a.distance - b.distance);
            
            setHospitals(formatted);
        } catch (e) { 
            console.error("Fetch error details:", e.message); 
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        fetchHospitals(userLoc.latitude, userLoc.longitude, category);
    };

    const handleDirections = (e, hospital) => {
        e.stopPropagation();
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.latitude},${userLoc.longitude}&destination=${hospital.lat},${hospital.lon}&travelmode=driving`;
        window.open(url, '_blank');
    };

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRecenter = () => {
        if (map && userLoc) {
            setSelectedHosp(null); // Clear selection
            map.setView([userLoc.latitude, userLoc.longitude], 15, { animate: true });
        }
    };

    if (!userLoc) return <div className="h-screen w-full flex items-center justify-center font-medium text-slate-500">Initializing Map...</div>;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-50">

            {/* isSidebarOpen prop passed here is CRITICAL */}
            <CategoryOverlay 
                isSidebarOpen={isSidebarOpen} 
                activeCategory={activeCategory} 
                handleCategoryChange={handleCategoryChange} 
                userData={userData} 
            />
            
            <LayerSwitcher 
                isSidebarOpen={isSidebarOpen} 
                isSatellite={isSatellite} 
                setIsSatellite={setIsSatellite}
                selectedHosp={selectedHosp} 
            />

            <SidebarMenu 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredHospitals={filteredHospitals}
                selectedHosp={selectedHosp}
                setSelectedHosp={setSelectedHosp}
                handleDirections={handleDirections}
            />

            <HospitalDetails 
                hospital={selectedHosp} 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onClose={() => setSelectedHosp(null)}
                onDirections={(e) => handleDirections(e, selectedHosp)}
            />

            <MapView 
                userLoc={userLoc} 
                isSatellite={isSatellite} 
                filteredHospitals={filteredHospitals} 
                selectedHosp={selectedHosp} 
                setSelectedHosp={setSelectedHosp} 
                setMap={setMap}
                isSidebarOpen={isSidebarOpen}
            />

            {/* FLOAT BUTTONS (Bottom-Right) */}
            <div className="absolute bottom-10 right-5 z-[1000] flex flex-col gap-2">
                {/* My Location Button */}
                <button 
                    onClick={handleRecenter} 
                    className="p-2.5 bg-white rounded-lg shadow-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-blue-600 flex items-center justify-center"
                    title="Recenter Map"
                >
                    <LocateFixed size={20} strokeWidth={2.5} />
                </button>

                {/* Zoom Controls Group */}
                <div className="flex flex-col items-center bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
                    <button 
                        onClick={() => map?.zoomIn()} // Siguraduhin na may access ka sa map instance
                        className="p-2 hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-600 active:bg-slate-200"
                        title="Zoom In"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                    <button 
                        onClick={() => map?.zoomOut()}
                        className="p-2 hover:bg-slate-50 transition-colors text-slate-600 active:bg-slate-200"
                        title="Zoom Out"
                    >
                        <Minus size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NearbyHospitalMap;
