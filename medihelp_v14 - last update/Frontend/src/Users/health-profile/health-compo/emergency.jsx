import React, { useState } from 'react';
import { 
    Phone, Heart, Mail, Star, Trash2, AlertTriangle, 
    Edit, X, Check, Plus, UserPlus, ShieldAlert 
} from 'lucide-react';

const EmergencyContact = ({ isLoading }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Main State para sa Emergency Contacts
    const [contacts, setContacts] = useState([
        { 
            id: 1, 
            name: 'Maria Clara Reyes', 
            relationship: 'Spouse', 
            phone: '0917-123-4567', 
            email: 'maria@email.com',
            isPrimary: true 
        },
        { 
            id: 2, 
            name: 'Juan Dela Cruz', 
            relationship: 'Brother', 
            phone: '0922-888-9999', 
            email: 'juan@email.com',
            isPrimary: false 
        }
    ]);

    // Temp State para sa bagong contact
    const [newContact, setNewContact] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: ''
    });

    const addContact = () => {
        if (newContact.name.trim() && newContact.phone.trim()) {
            setContacts([...contacts, { 
                ...newContact, 
                id: Date.now(), 
                isPrimary: contacts.length === 0 
            }]);
            setNewContact({ name: '', relationship: '', phone: '', email: '' });
        }
    };

    const removeContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const setPrimary = (id) => {
        setContacts(contacts.map(c => ({
            ...c,
            isPrimary: c.id === id
        })));
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading emergency contacts...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Emergency Contacts</h3>
                        <p className="text-sm text-slate-500 font-medium">Who to notify in case of emergency</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all cursor-pointer">
                                <Check size={16} /> Save Contacts
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                            <Edit size={16} /> Edit Contacts
                        </button>
                    )}
                </div>
            </div>

            {/* Contacts List (Full Width) */}
            <div className="space-y-4">
                {contacts.map((contact) => (
                    <div key={contact.id} className={`relative w-full p-6 border rounded-[2rem] transition-all flex justify-between items-center animate-in slide-in-from-left-2 ${
                        contact.isPrimary ? 'bg-rose-50/30 border-rose-100 shadow-sm' : 'bg-white border-slate-100 shadow-sm'
                    }`}>
                        <div className="flex items-center gap-6 text-left">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                contact.isPrimary ? 'bg-rose-500 text-white shadow-md shadow-rose-100' : 'bg-slate-50 text-slate-400'
                            }`}>
                                <Heart size={24} fill={contact.isPrimary ? "currentColor" : "none"} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h4 className="font-black text-slate-800 text-xl leading-none">{contact.name}</h4>
                                    {contact.isPrimary && (
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-tighter rounded-md">Primary</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold">
                                    <span className="flex items-center gap-1.5 text-slate-600">
                                        <UserPlus size={14} className="text-rose-400" /> {contact.relationship}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-900 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                                        <Phone size={14} className="text-rose-500" /> {contact.phone}
                                    </span>
                                    {contact.email && (
                                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                                            <Mail size={14} /> {contact.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex items-center gap-2">
                                {!contact.isPrimary && (
                                    <button onClick={() => setPrimary(contact.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all" title="Set as Primary">
                                        <Star size={20} />
                                    </button>
                                )}
                                <button onClick={() => removeContact(contact.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add New Contact Card (Full Width) */}
                {isEditing && (
                    <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <input 
                                    placeholder="e.g. Maria Clara" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-rose-500 bg-white"
                                    value={newContact.name}
                                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Relationship</label>
                                <input 
                                    placeholder="e.g. Spouse, Parent" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newContact.relationship}
                                    onChange={e => setNewContact({...newContact, relationship: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <input 
                                    placeholder="09XX-XXX-XXXX" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newContact.phone}
                                    onChange={e => setNewContact({...newContact, phone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address (Optional)</label>
                                <input 
                                    placeholder="email@example.com" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newContact.email}
                                    onChange={e => setNewContact({...newContact, email: e.target.value})}
                                />
                            </div>
                        </div>
                        <button onClick={addContact} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                            <Plus size={20} /> Add Emergency Contact
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Action Info */}
            <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-[2rem] flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0 mt-1">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h5 className="font-black text-rose-900 leading-none mb-2 text-base">Local Emergency Services</h5>
                    <p className="text-sm text-rose-800/70 font-medium leading-relaxed">
                        For immediate life-threatening situations, please call **911** or your local emergency hotline immediately. The contacts listed above will be notified by the MediHelp system during an emergency event.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EmergencyContact;