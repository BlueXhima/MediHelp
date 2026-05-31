// src/components/modals/EmergencyModal.jsx
import React from 'react';
import { X, Phone, ShieldAlert, HeartPulse, LifeBuoy, MapPin, Info, Copy } from 'lucide-react';
import Button from '../ui/Button';
import { showToast } from '../ToastMessage';

const EmergencyModal = ({ isOpen, onClose, onOpenSafety }) => {
    if (!isOpen) return null;

    const categories = [
        {
            title: "Medical Assistance",
            icon: HeartPulse,
            iconColor: "text-red-500",
            contacts: [
                { name: "Philippine Red Cross", number: "143" },
                { name: "DOH Health Hotline", number: "1555" },
                { name: "PGH Main Office", number: "02-8554-8400", desc: "Philippine General Hospital" }
            ]
        },
        {
            title: "Disaster & Rescue",
            icon: LifeBuoy,
            iconColor: "text-sky-500",
            contacts: [
                { name: "NDRRMC Operations", number: "02-8911-5061" },
                { name: "Coast Guard (PCG)", number: "02-8527-8481", num2: "0917-724-3682" }
            ]
        },
        {
            title: "Local Services",
            icon: MapPin,
            iconColor: "text-emerald-500",
            contacts: [
                { name: "PNP (Police Hotline)", number: "117", num2: "02-8723-0401" },
                { name: "Fire Protection", number: "02-8426-0246" }
            ]
        }
    ];

    // Helper function para sa mabilis at ligtas na pagkopya ng numero sa clipboard gamit ang showToast
    const handleCopyNumber = (number, name) => {
        navigator.clipboard.writeText(number);
        showToast(`${name} hotline (${number}) copied to clipboard.`);
    };

    return (
        /* Left without animate-fade-in on the backdrop overlay to prevent styling and blur issues */
        <div className="fixed inset-0 bg-black/60 z-200 flex items-center justify-center p-4 backdrop-blur-[2px]">
            
            {/* The animation remains applied directly to the modal card element */}
            <div className="bg-card w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-border animate-fade-in flex flex-col max-h-[90vh]">
                
                {/* Header Section */}
                <div className="flex justify-between items-start p-6 sm:p-7 border-b border-border bg-card shrink-0">
                    <div className="space-y-1">
                        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter uppercase leading-none" style={{ fontFamily: "'Unesa', sans-serif" }}>
                            Emergency Reference Matrix
                        </h2>
                        <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Philippine National Hotline Directory (Informational View)
                        </p>
                    </div>
                    <Button variant="ghost" type="circular" onClick={onClose} size="sm" className="-mt-2 -mr-2">
                        <X size={18} className="stroke-[1.5]" />
                    </Button>
                </div>

                {/* Content Section (Scrollable Area) */}
                <div className="p-6 sm:p-7 overflow-y-auto scrollbar-custom flex-1 space-y-8">
                    
                    {/* Informational Core Box */}
                    <div className="border border-border bg-foreground/1 rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden group">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                            <div className="flex items-start sm:items-center gap-5">
                                <div className="p-4 bg-primary/5 text-primary rounded-2xl border border-primary/10 shrink-0">
                                    <ShieldAlert size={32} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-2 py-0.5 rounded">Core Hotline</span>
                                    <div className="flex items-baseline gap-2">
                                        <h1 className="text-4xl sm:text-5xl font-mono font-black tracking-tighter text-foreground">911</h1>
                                        <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">National Command Center</span>
                                    </div>
                                    <p className="text-xs text-foreground/50 leading-relaxed max-w-xl">
                                        This central emergency line directly connects to local responder units for immediate emergency dispatch.
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full sm:w-auto text-[10px] uppercase font-bold tracking-wider py-3 px-5 whitespace-nowrap shrink-0"
                                leadingIcon={Copy}
                                onClick={() => handleCopyNumber('911', 'National Command Center')}
                            >
                                Copy Hotline
                            </Button>
                        </div>
                    </div>

                    {/* Matrix Grid Reference */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {categories.map((cat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                                    <cat.icon className={`${cat.iconColor} stroke-[1.5]`} size={16} />
                                    <h3 className="font-mono text-foreground uppercase text-[10px] tracking-[0.15em] font-black">{cat.title}</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {cat.contacts.map((contact, j) => (
                                        <div key={j} className="bg-foreground/2 border border-border/50 p-4 rounded-xl text-left space-y-1 transition-all hover:border-primary/20 group">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-0.5 group-hover:text-primary transition-colors truncate pr-2">{contact.name}</p>
                                                <div className="w-5 h-5 rounded bg-foreground/5 text-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => window.location.href = `tel:${contact.number}`}>
                                                    <Phone size={10} className="stroke-[1.5]" />
                                                </div>
                                            </div>
                                            <p className="text-xl font-mono font-bold text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">{contact.number}</p>
                                            {(contact.num2 || contact.desc) && (
                                                <div className="text-[9px] text-foreground/40 font-mono pt-1.5 space-y-0.5 border-t border-border/30 mt-2">
                                                    {contact.num2 && <p className="truncate">Alt: {contact.num2}</p>}
                                                    {contact.desc && <p className="italic font-sans text-foreground/50">{contact.desc}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed Responsive Footer Layout */}
                <div className="p-5 sm:p-6 bg-foreground/1 border-t border-border/60 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-start sm:items-center gap-3 text-left w-full sm:w-auto">
                        <div className="p-1.5 bg-foreground/5 text-foreground/50 rounded-lg shrink-0 hidden sm:block">
                            <Info size={14} className="stroke-[1.5]" />
                        </div>
                        <p className="text-[11px] font-medium text-foreground/50 leading-relaxed max-w-md">
                            This directory is for informational purposes only. Ensure you provide your <span className="text-primary font-semibold">exact landmark</span> to dispatchers to accelerate response times.
                        </p>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                        <Button variant="ghost" className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-wider py-2.5 px-4" onClick={onClose}>
                            Close Directory
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-wider py-2.5 px-4" 
                            trailingIcon={ShieldAlert}
                            onClick={onOpenSafety}
                        >
                            Open Safety Protocol
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmergencyModal;