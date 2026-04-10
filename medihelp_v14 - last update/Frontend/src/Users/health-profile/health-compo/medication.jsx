import React, { useState } from 'react';
import { 
    Pill, Clock, User, Plus, Trash2, Edit, X, Check, 
    AlertTriangle, Calendar, ChevronRight, Activity 
} from 'lucide-react';

const Medication = ({ isLoading }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Main State para sa List ng Gamot
    const [medications, setMedications] = useState([
        { 
            id: 1, 
            name: 'Metformin', 
            dosage: '500mg', 
            frequency: 'Once daily', 
            prescribedBy: 'Dr. Reyes',
            status: 'Active'
        },
        { 
            id: 2, 
            name: 'Amlodipine', 
            dosage: '5mg', 
            frequency: 'Every morning', 
            prescribedBy: 'Dr. Santos',
            status: 'Active'
        }
    ]);

    // Temp State para sa Input
    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: ''
    });

    const addMedication = () => {
        if (newMed.name.trim()) {
            setMedications([...medications, { ...newMed, id: Date.now(), status: 'Active' }]);
            setNewMed({ name: '', dosage: '', frequency: '', prescribedBy: '' });
        }
    };

    const removeMedication = (id) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400 italic">Fetching medications...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <Pill size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Medications</h3>
                        <p className="text-sm text-slate-500 font-medium">Manage prescriptions and schedules</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all cursor-pointer">
                                <Check size={16} /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                            <Edit size={16} /> Update List
                        </button>
                    )}
                </div>
            </div>

            {/* Medications List (Full Width Cards) */}
            <div className="space-y-4">
                {medications.map((med) => (
                    <div key={med.id} className="group relative w-full p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-emerald-200 transition-all flex justify-between items-center animate-in slide-in-from-left-2">
                        <div className="flex items-center gap-6 text-left">
                            <div className="hidden md:flex w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <Pill size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-xl leading-none">{med.name}</h4>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold">
                                    <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        <Activity size={14} className="text-emerald-500" /> {med.dosage}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        <Clock size={14} className="text-blue-500" /> {med.frequency}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-500">
                                        <User size={14} /> Prescribed by: <span className="text-slate-900">{med.prescribedBy}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {isEditing && (
                            <button onClick={() => removeMedication(med.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add New Medication Card (Full Width) */}
                {isEditing && (
                    <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Medication Name</label>
                                <input 
                                    placeholder="e.g. Paracetamol" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-emerald-500 bg-white"
                                    value={newMed.name}
                                    onChange={e => setNewMed({...newMed, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dosage</label>
                                <input 
                                    placeholder="e.g. 500mg" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newMed.dosage}
                                    onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Frequency</label>
                                <input 
                                    placeholder="e.g. Twice a day" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newMed.frequency}
                                    onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Prescribed By</label>
                                <input 
                                    placeholder="Doctor's Name" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                    value={newMed.prescribedBy}
                                    onChange={e => setNewMed({...newMed, prescribedBy: e.target.value})}
                                />
                            </div>
                        </div>
                        <button onClick={addMedication} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                            <Plus size={20} /> Add Medication to My List
                        </button>
                    </div>
                )}
            </div>

            {/* Interaction Warning Card */}
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0 mt-1">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h5 className="font-black text-amber-900 leading-none mb-2 text-base">Important Reminder</h5>
                    <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
                        Always consult your primary healthcare provider before changing your dosage or stopping any medication. Ensure you update this list every time you receive a new prescription.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Medication;