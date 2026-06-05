// src/components/tabs/EmergencyContact.jsx
import React from 'react';
import { Contact, Phone, Mail, Star, Trash2, Plus, AlertTriangle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const EmergencyContact = ({ isEditing, emergencyManager, onNearbyHospitalClick }) => {
    // Deconstruct properties from the shared custom manager hook
    const {
        contacts,
        newContact,
        handleInputChange,
        handleAddContact,
        handleRemoveContact
    } = emergencyManager;

    return (
        <div className="space-y-8 text-left">
            <section className="space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                    <Contact size={16} strokeWidth={2.5} />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Emergency Contacts</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contacts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contacts.map(contact => (
                                <div key={contact.id} className="bg-card border border-border/60 p-5 rounded-2xl flex justify-between items-center card-hover">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-bold text-foreground text-base tracking-tight">{contact.name}</h5>
                                            <span className="text-slate-400 text-xs font-semibold">({contact.relationship})</span>
                                            {Number(contact.isPrimary) === 1 && (
                                                <span className="flex items-center gap-0.5 text-[8px] font-black tracking-widest bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full uppercase">
                                                    <Star size={8} fill="currentColor"/> Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {contact.phone}</span>
                                            {contact.email && <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {contact.email}</span>}
                                        </div>
                                    </div>
                                    {isEditing && Number(contact.isPrimary) !== 1 && (
                                        <button onClick={() => handleRemoveContact(contact.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all duration-200">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Minimalist Empty State Wrapper Container */
                        <div className="border border-dashed border-border/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-card/20 animate-in fade-in duration-200">
                            <p className="text-sm font-bold text-foreground/80 mb-1">No emergency contacts listed</p>
                            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Please add an emergency connection profile to secure quick access during system alerts.
                            </p>
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="p-6 border border-dashed border-border/80 rounded-2xl space-y-4 bg-card/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Full Name</label>
                                <input 
                                    placeholder="e.g. Juan Dela Cruz" 
                                    className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium outline-none focus:border-primary transition-colors"
                                    value={newContact.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Relationship</label>
                                <input 
                                    placeholder="e.g. Mother, Sibling" 
                                    className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium outline-none focus:border-primary transition-colors"
                                    value={newContact.relationship}
                                    onChange={e => handleInputChange('relationship', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Phone Number</label>
                                <input 
                                    placeholder="e.g. 0917-XXX-XXXX" 
                                    className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium outline-none focus:border-primary transition-colors"
                                    value={newContact.phone}
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Email Address</label>
                                <input 
                                    type="email"
                                    placeholder="e.g. juan@email.com" 
                                    className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium outline-none focus:border-primary transition-colors"
                                    value={newContact.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    className="accent-primary rounded"
                                    checked={newContact.isPrimary}
                                    onChange={e => handleInputChange('isPrimary', e.target.checked)}
                                />
                                <span className="text-xs text-slate-500 font-semibold">Set as Primary Contact</span>
                            </label>
                            
                            <Button buttonType="button" variant="primary" type="rounded" leadingIcon={Plus} onClick={handleAddContact} className="text-xs py-2 px-4">
                                Add Contact
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            <div className="p-5 border border-rose-500/20 bg-rose-500/0.02 dark:bg-rose-500/0.01 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm relative overflow-hidden group">
                {/* Subtle soft background glow effect */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:scale-110" />
                
                <div className="flex items-start gap-4">
                    {/* Enhanced Status Icon Container */}
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 ring-4 ring-rose-500/0.03">
                        <AlertTriangle size={18} className="animate-pulse" />
                    </div>
                    
                    {/* English Translated & Refined Content */}
                    <div className="space-y-1 text-left">
                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            National Emergency Hotline
                        </h5>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[95%]">
                            For immediate medical critical care or life-threatening emergencies, please dial{' '}
                            <a href="tel:911" className="text-rose-500 font-extrabold hover:underline inline-flex items-center gap-0.5 align-baseline">
                                911
                            </a>{' '}
                            directly or proceed straight to the nearest medical center. Alternatively, you can use our <strong className="text-rose-500 font-semibold">Hospital Locator feature</strong> to find <strong className="text-rose-500 font-semibold">real-time nearby emergency rooms</strong>.
                        </p>
                    </div>
                </div>

                {/* Dynamic Route Link Button papunta sa Nearby Hospitals */}
                <button 
                    type="button"
                    onClick={onNearbyHospitalClick} // <- Dito tinawag ang function mula sa Dashboard
                    className="z-10 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 rounded-xl transition-all duration-200 text-center shrink-0 border border-rose-500/10 hover:border-rose-500/30 active:scale-[0.98]"
                >
                    Find Nearby Hospitals
                </button>
            </div>
        </div>
    );
};

export default EmergencyContact;
