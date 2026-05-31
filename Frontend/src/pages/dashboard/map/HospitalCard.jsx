import React from 'react';
import { Star, Navigation, Phone, MapPin, Bookmark } from 'lucide-react';
import Button from '../../../components/ui/Button';

const HospitalCard = ({ hospital, isSelected, onClick, onDirections }) => {
    return (
        <div 
            onClick={() => onClick(hospital)}
            className={`group p-5 border-b cursor-pointer transition-all duration-300 hover:bg-slate-50/80 ${
                isSelected ? 'bg-purple-50/50 ring-1 ring-inset ring-purple-200' : 'bg-white'
            }`}
        >
            {/* Header: Name and Distance */}
            <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-purple-700 transition-colors">
                        {hospital.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-700 border border-yellow-100">
                            <Star size={10} fill="currentColor" className="mr-1"/>
                            {hospital.rating}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">({hospital.reviews} reviews)</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase bg-purple-600 text-white px-2 py-1 rounded-md shadow-sm tracking-tighter">
                        {hospital.distance} km away
                    </span>
                </div>
            </div>

            {/* Content: Address and Contact info */}
            <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-slate-500">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <p className="text-xs leading-relaxed line-clamp-2 italic">
                        {hospital.address}
                    </p>
                </div>
                
                {hospital.phone && hospital.phone !== "No contact" && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={14} className="shrink-0 text-slate-400" />
                        <span className="text-xs font-medium">{hospital.phone}</span>
                    </div>
                )}
            </div>

            {/* Actions: Using your custom Button Component */}
            <div className="flex gap-2 mt-5">
                <Button 
                    variant="primary" 
                    type="pill" 
                    size="sm" 
                    className="flex-1 shadow-md hover:shadow-purple-200"
                    onClick={onDirections}
                    leadingIcon={Navigation}
                >
                    Directions
                </Button>
                
                <Button 
                    variant="ghost" 
                    type="circular" 
                    className="border border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add save logic here
                    }}
                >
                    <Bookmark size={16} />
                </Button>
            </div>
        </div>
    );
};

export default HospitalCard;