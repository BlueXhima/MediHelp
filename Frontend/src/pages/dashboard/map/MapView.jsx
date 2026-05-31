import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle, Tooltip, Popup } from 'react-leaflet'
import { hospitalIcon, selectedHospitalIcon } from './HospitalStyles';
import { Star, MapPin, Navigation, Bookmark } from 'lucide-react';

const MapController = ({ center, focusTarget, isSidebarOpen }) => {
    const map = useMap();

    useEffect(() => {
        if (!focusTarget) {
            if (center) map.setView([center.latitude, center.longitude], 15);
            return;
        }

        // 1. Force recalculate size
        map.invalidateSize();

        // 2. Ang sukat ng iyong cards
        const sidebarWidth = 390;
        const detailsWidth = 380;
        
        // Calculate total blocked space sa kaliwa
        // Kung bukas ang sidebar, 770px ang occupied. Kung sarado, 380px lang.
        const totalPadding = isSidebarOpen ? (sidebarWidth + detailsWidth) : detailsWidth;

        // 3. Timing: Bigyan natin ng sapat na oras yung Framer Motion (HospitalDetails) 
        // na lumitaw bago tayo mag-calculate
        const timer = setTimeout(() => {
            // Imbes na paddingTopLeft lang, gamitin natin ang setView na may custom offset
            // o kaya fitBounds sa sarili nyang location pero may padding.
            
            const targetPoint = map.project([focusTarget.lat, focusTarget.lon], 16);
            
            // "Itutulak" natin yung point pakanan base sa width ng panels
            // Ang logic: I-center natin yung focusTarget sa NATITIRANG space
            const screenWidth = map.getSize().x;
            const remainingSpace = screenWidth - totalPadding;
            const centerOfRemaining = totalPadding + (remainingSpace / 2);
            
            // Calculate how much we need to shift the center
            const shiftPixels = (screenWidth / 2) - centerOfRemaining;
            
            targetPoint.x += shiftPixels;

            const targetLatLng = map.unproject(targetPoint, 16);

            map.flyTo(targetLatLng, 16, {
                animate: true,
                duration: 1.5
            });
        }, 400); // Tumaas sa 400ms para sure na tapos na ang animation

        return () => clearTimeout(timer);
    }, [focusTarget, isSidebarOpen, map, center]);

    return null;
};

const MapView = ({ userLoc, isSatellite, filteredHospitals, selectedHosp, setSelectedHosp, setMap, isSidebarOpen }) => {
    return (
        <div className="absolute inset-0 z-0">
            <MapContainer 
                center={[userLoc.latitude, userLoc.longitude]} 
                zoom={15} 
                zoomControl={false} 
                className="h-full w-full" 
                ref={setMap} 
            >
                {isSatellite ? (
                    <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="Google" />
                ) : (
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="CARTO" />
                )}

                <MapController 
                    center={userLoc} 
                    focusTarget={selectedHosp} 
                    isSidebarOpen={isSidebarOpen}
                />
                
                <Marker position={[userLoc.latitude, userLoc.longitude]}>
                    <Popup>You are here</Popup>
                </Marker>

                {filteredHospitals.map(h => {
                    const isSelected = selectedHosp?.id === h.id;

                    return (
                        <Marker 
                            key={h.id} 
                            position={[h.lat, h.lon]} 
                            icon={isSelected ? selectedHospitalIcon : hospitalIcon}
                            zIndexOffset={isSelected ? 1000 : 0}
                            eventHandlers={{ 
                                click: () => setSelectedHosp(h) 
                            }}
                        >
                            <Tooltip 
                                direction="top" 
                                offset={[0, -30]} 
                                opacity={1}
                                className="custom-tooltip"
                            >
                                {/* CARD CONTAINER - Ginawang w-64 para sa sapat na space */}
                                <div className="w-64 overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
                                    {/* 1. IMG CONTAINER */}
                                    <div className="h-24 w-full bg-slate-200 relative">
                                        {h.image ? (
                                            <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                                <MapPin size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. DETAILS AREA */}
                                    <div className="p-2">
                                        {/* NAME AND BUTTONS ROW */}
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <h4 className="flex-1 whitespace-normal text-[14px] font-black text-slate-800 leading-tight">
                                                {h.name}
                                            </h4>
                                            
                                            {/* ACTION BUTTONS */}
                                            <div className="flex gap-1 shrink-0">
                                                <button className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                                                    <Navigation size={12} fill="currentColor" />
                                                </button>
                                                <button className="p-1.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">
                                                    <Bookmark size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Rate and Review Row */}
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center text-yellow-500">
                                                <Star size={10} fill="currentColor" />
                                                <span className="ml-1 text-[11px] font-bold text-slate-700">{h.rating || 'N/A'}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">({h.reviews || 0} reviews)</span>
                                        </div>

                                        {/* Location */}
                                        <div className="mt-2 pt-2 border-t border-slate-50 flex items-start gap-1 text-slate-500">
                                            <MapPin size={10} className="mt-0.5 shrink-0" />
                                            <p className="line-clamp-2 text-[10px] leading-tight font-medium">{h.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                        </Marker>
                    );
                })}
                <Circle center={[userLoc.latitude, userLoc.longitude]} radius={5000} pathOptions={{ fillOpacity: 0.05 }} />
            </MapContainer>
        </div>
    );
};

export default MapView;