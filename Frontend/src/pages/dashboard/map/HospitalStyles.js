import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icons
export const setDefaultIcon = () => {
    let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
};

// Custom Hospital Icon (SVG)
export const hospitalIcon = L.divIcon({
    className: 'hospital-pin',
    html: `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16 17.5 19 14.4087 19 10.5C19 6.63401 15.866 3.5 12 3.5C8.13401 3.5 5 6.63401 5 10.5C5 14.4087 8 17.5 12 21Z" fill="#ef4444" stroke="white" stroke-width="1.5"/>
            <circle cx="12" cy="10.5" r="2.5" fill="white"/>
        </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

// Tailwind Classes for reusability
export const styles = {
    sidebar: "absolute top-0 left-0 z-[999] h-full bg-white transition-transform duration-300 ease-in-out shadow-2xl w-[380px] flex flex-col",
    searchBox: "bg-white rounded-xl shadow-lg border border-slate-200 flex items-center px-4 h-12 pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-blue-500",
    chip: "bg-white border border-slate-200 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-slate-50 whitespace-nowrap",
    actionBtn: "bg-white p-3 rounded-full shadow-xl text-blue-600 hover:bg-blue-50 border border-slate-100 transition-all active:scale-90"
};

export const selectedHospitalIcon = L.divIcon({
    className: 'hospital-pin-selected',
    html: `
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16 17.5 19 14.4087 19 10.5C19 6.63401 15.866 3.5 12 3.5C8.13401 3.5 5 6.63401 5 10.5C5 14.4087 8 17.5 12 21Z" fill="#6366f1" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="10.5" r="3" fill="white"/>
        </svg>`,
    iconSize: [45, 45],
    iconAnchor: [22.5, 45],
    popupAnchor: [0, -40]
});