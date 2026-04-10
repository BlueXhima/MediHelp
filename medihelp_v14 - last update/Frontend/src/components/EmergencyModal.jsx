import React, { useState } from 'react';
import { X, Phone, ShieldAlert, HeartPulse, Siren, LifeBuoy, MapPin, Zap, ShieldPlus } from 'lucide-react';

const EmergencyModal = ({ isOpen, onClose, onOpenSafety }) => {
    if (!isOpen) return null;

    const categories = [
        {
            title: "Medical Services",
            icon: <HeartPulse className="text-red-500" size={16} />,
            contacts: [
                { name: "Philippine Red Cross", number: "143" },
                { name: "DOH COVID 19 / Health", number: "1555" },
                { name: "Phil. General Hospital (PGH)", number: "02-8554-8400" }
            ]
        },
        {
            title: "Disaster & Rescues",
            icon: <LifeBuoy className="text-sky-500" size={16} />,
            contacts: [
                { icon: <ShieldPlus size={26} />, name: "NDRRMC Operations", number: "02-8911-5061", desc: "National Disaster Risk Reduction and Management Council" },
                { name: "Phil. Coast Guard (PCG)", number: "02-8527-8481" }
            ]
        },
        {
            title: "Local Assistance",
            icon: <MapPin className="text-emerald-500" size={16} />,
            contacts: [
                { name: "PNP (Hotline / Landline)", number: "117", num2: "02-8723-0401" },
                { name: "Bureau of Fire Protection", number: "02-8426-0246" }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            {/* <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={onClose}></div> */}

            {/* Modal Container - Balanced Width, rounded corners */}
            <div 
                className="relative bg-card dark:bg-card border-t border-b border-border/50 
                dark:border-border/30 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden 
                transition-all duration-300 animate-fade-in"
            >
                {/* HEADER - Minimalist */}
                <div className="flex justify-between items-center p-5 border-b border-border">
                    <div className="flex items-center gap-3 text-left">
                        {/* <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-lg text-red-600 dark:text-red-400">
                            <Siren size={20} />
                        </div> */}
                        <div>
                            <h2 className="text-lg font-extrabold text-foreground tracking-tight uppercase">
                                Philippines Emergency Contacts
                            </h2>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">
                                Essential services available 24/7 nationwide. Stay calm, get help.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="group p-2 rounded-xl border border-transparent 
                                hover:border-border hover:bg-card hover:shadow-sm
                                transition-all duration-200 text-muted-foreground 
                                hover:text-primary active:scale-90 cursor-pointer"
                        title="Close Directory"
                    >
                        <X 
                            size={18} 
                            className="transition-transform duration-200 group-hover:rotate-90" 
                        />
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <div className="p-4 md:p-6 overflow-y-auto max-h-[70vh]">
                    <div className="mb-6 py-3 px-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold uppercase leading-none">
                            Notice: This is an information directory only.
                        </p>
                    </div>

                    {/* 911 Featured Card - Balanced Red and Contrast */}
                    <div className="bg-red-50 border border-red-500 rounded-2xl p-6 mb-8 shadow-md shadow-red-200 dark:shadow-none relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between text-left items-center gap-4">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-red-800 rounded-xl">
                                    <ShieldAlert size={36} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-800">National Emergency Hotline</p>
                                    <div className="flex items-baseline text-black dark:text-red-400 gap-1.5">
                                        <h1 className="text-5xl font-bold tracking-tight leading-none">911</h1>
                                        <span className="text-sm font-medium leading-none">Nationwide Response</span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-red-500 transition-all shadow-sm active:scale-95">
                                <Phone size={16} className="text-white" />
                                Quick Dial 911
                            </button>
                        </div>
                        {/* Decorative Shape */}
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl opacity-70"></div>
                    </div>

                    {/* 3-Column Grid - Smaller text, more spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((cat, i) => (
                            <div key={i} className="space-y-4">
                                {/* Column Header */}
                                <div className="flex items-center gap-2 pb-2">
                                    {cat.icon}
                                    <h3 className="font-bold text-foreground uppercase text-[12px] tracking-widest">{cat.title}</h3>
                                </div>

                                {/* Contacts Grid/List */}
                                <div className="flex flex-col gap-3">
                                    {cat.contacts.map((contact, j) => {
                                        // Condition: Check kung ang "number" field ay maikli (Hotline) o mahaba (Description)
                                        // Karaniwan, ang hotlines ay less than 5 characters or puro digits.
                                        // const isShortNumber = contact.number.length <= 5 || !isNaN(contact.number.replace(/-/g, ''));
                                        return (
                                            <div 
                                                key={j} 
                                                className="flex flex-col p-6 bg-card text-left rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors h-auto"
                                            >
                                                {/* Icon Container - Lalabas lang if may icon data */}
                                                {contact.icon && (
                                                    <div className="flex items-center justify-center w-12 h-12 mb-2 shrink-0 rounded-2xl bg-primary/10 text-primary border border-primary/10">
                                                        {React.cloneElement(contact.icon, { 
                                                            size: 24, 
                                                            className: "text-primary" 
                                                        })}
                                                    </div>
                                                )}
                                                {/* Kung walang icon, magdadagdag tayo ng konting padding para hindi dikit sa gilid */}
                                                {!contact.icon && <div className="pl-1"></div>}
                                                <span className="text-[11px] font-semibold text-muted-foreground tracking-wider">
                                                    {contact.name}
                                                </span>
                                                <span className="text-2xl font-black text-foreground tracking-tight">
                                                    {contact.number}
                                                </span>
                                                <span className="text-md font-medium text-slate-500 tracking-tight">
                                                    {contact.num2}
                                                </span>
                                                <span className="text-[11px] font-medium text-slate-500 mt-2">
                                                    {contact.desc}
                                                </span>
                                                {/* <div className="flex justify-end mt-2 pt-2">
                                                    <a 
                                                        href={`tel:${contact.number}`}
                                                        className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase tracking-tighter hover:underline"
                                                    >
                                                        <Phone size={10} strokeWidth={3} />
                                                        Quick Dial
                                                    </a>
                                                </div> */}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER - Minimalist, clear actions */}
                <div className="p-5 bg-card border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-4 border-l border-border pl-4">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary italic">1</div>
                            <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary italic">2</div>
                        </div>
                        <span className="text-[11px] text-left font-bold text-muted-foreground uppercase tracking-tighter leading-tight">
                            Stay Calm <br /> Identify Location
                        </span>
                    </div>
                    <div className="flex gap-2.5">
                        <div className="flex gap-3">
                            {/* Cancel Button - Ghost/Outline Style */}
                            <button 
                                onClick={onClose}
                                className="px-5 py-2.5 text-muted-foreground font-bold text-xs uppercase tracking-wider rounded-xl 
                                        border border-border hover:bg-accent hover:text-foreground 
                                        transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                                Cancel
                            </button>

                            {/* Safety Guide Button - Primary Action Style */}
                            <button 
                                onClick={onOpenSafety}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground 
                                        rounded-xl font-bold text-xs uppercase tracking-widest
                                        hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 
                                        transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
                            >
                                <ShieldAlert size={16} strokeWidth={2.5} />
                                Safety Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyModal;