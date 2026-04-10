import React, { useState } from 'react';
import { 
    FileText, Activity, AlertTriangle, Scissors, 
    Trash2, Plus, Edit, X, Check, Calendar, Hospital
} from 'lucide-react';

const MedicalRecord = ({ isLoading }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Main States for Array Management
    const [conditions, setConditions] = useState([
        { id: 1, name: 'Hypertension', date: '2020-06-15', status: 'Active' },
        { id: 2, name: 'Type 2 Diabetes', date: '2018-03-22', status: 'Under Treatment' }
    ]);
    const [allergies, setAllergies] = useState([
        { id: 1, name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
        { id: 2, name: 'Shellfish', severity: 'Moderate', reaction: 'Hives' }
    ]);
    const [surgeries, setSurgeries] = useState([
        { id: 1, name: 'Appendectomy', date: '2015-08-20', hospital: 'General Hospital' },
        { id: 2, name: 'Knee Arthroscopy', date: '2019-11-05', hospital: 'City Medical Center' }
    ]);

    // Temp States for Inputs
    const [newCondition, setNewCondition] = useState({ name: '', date: '', status: 'Active' });
    const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'Moderate', reaction: '' });
    const [newSurgery, setNewSurgery] = useState({ name: '', date: '', hospital: '' });

    // Handlers
    const addItem = (type) => {
        if (type === 'condition' && newCondition.name) {
            setConditions([...conditions, { ...newCondition, id: Date.now() }]);
            setNewCondition({ name: '', date: '', status: 'Active' });
        }
        if (type === 'allergy' && newAllergy.name) {
            setAllergies([...allergies, { ...newAllergy, id: Date.now() }]);
            setNewAllergy({ name: '', severity: 'Moderate', reaction: '' });
        }
        if (type === 'surgery' && newSurgery.name) {
            setSurgeries([...surgeries, { ...newSurgery, id: Date.now() }]);
            setNewSurgery({ name: '', date: '', hospital: '' });
        }
    };

    const removeItem = (list, setter, id) => {
        setter(list.filter(item => item.id !== id));
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Medical Records</h3>
                        <p className="text-sm text-slate-500 font-medium">Detailed history and documentation</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                }} 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-100 transition-all cursor-pointer"
                            >
                                <Check size={16} /> Save Records
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <Edit size={16} /> Edit Records
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Container */}
            <div className="space-y-10">
                
                {/* --- MEDICAL CONDITIONS --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500 ml-1">
                        <Activity size={20} />
                        <h4 className="font-black uppercase tracking-widest text-sm text-slate-400">Medical Conditions</h4>
                    </div>

                    <div className="space-y-4">
                        {conditions.map(item => (
                            <div key={item.id} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center animate-in slide-in-from-left-2">
                                <div className="text-left">
                                    <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                    <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-300" />
                                        Diagnosed: <span className="text-slate-900">{item.date || 'N/A'}</span> 
                                        <span className="text-slate-200 mx-1">•</span>
                                        Status: <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{item.status}</span>
                                    </p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => removeItem(conditions, setConditions, item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Full Width Edit Card */}
                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2rem] space-y-5 bg-slate-50/50 animate-in zoom-in-95">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Condition Name</label>
                                        <input 
                                            placeholder="e.g. Hypertension" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white"
                                            value={newCondition.name}
                                            onChange={e => setNewCondition({...newCondition, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Diagnosis Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                            value={newCondition.date}
                                            onChange={e => setNewCondition({...newCondition, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Current Status</label>
                                        <select 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white appearance-none"
                                            value={newCondition.status}
                                            onChange={e => setNewCondition({...newCondition, status: e.target.value})}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Recovered">Recovered</option>
                                            <option value="Under Treatment">Under Treatment</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={() => addItem('condition')} className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
                                    <Plus size={18} /> Add Condition to List
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- ALLERGIES --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-500 ml-1">
                        <AlertTriangle size={20} />
                        <h4 className="font-black uppercase tracking-widest text-sm text-slate-400">Allergies</h4>
                    </div>

                    <div className="space-y-4">
                        {allergies.map(item => (
                            <div key={item.id} className="w-full p-6 bg-slate-50 border border-amber-100/50 rounded-3xl flex justify-between items-center">
                                <div className="text-left">
                                    <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                    <p className="text-sm text-slate-600 font-bold mt-2">
                                        Severity: <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">{item.severity}</span> 
                                        <span className="text-slate-200 mx-1">•</span> 
                                        Reaction: <span className="text-slate-900">{item.reaction}</span>
                                    </p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => removeItem(allergies, setAllergies, item.id)} className="p-3 text-amber-600 hover:bg-amber-100 rounded-2xl transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-amber-200 rounded-[2rem] space-y-5 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Allergen</label>
                                        <input 
                                            placeholder="e.g. Peanuts" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-amber-500 bg-white"
                                            value={newAllergy.name}
                                            onChange={e => setNewAllergy({...newAllergy, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Severity Level</label>
                                        <select 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                            value={newAllergy.severity}
                                            onChange={e => setNewAllergy({...newAllergy, severity: e.target.value})}
                                        >
                                            <option value="Mild">Mild</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Severe">Severe</option>
                                            <option value="Life-threatening">Life-threatening</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Known Reaction</label>
                                        <input 
                                            placeholder="e.g. Anaphylaxis, Rashes" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                            value={newAllergy.reaction}
                                            onChange={e => setNewAllergy({...newAllergy, reaction: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button onClick={() => addItem('allergy')} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-100">
                                    <Plus size={18} /> Add Allergy to List
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- SURGERIES --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500 ml-1">
                        <Scissors size={20} />
                        <h4 className="font-black uppercase tracking-widest text-sm text-slate-400">Surgeries & Procedures</h4>
                    </div>

                    <div className="space-y-4">
                        {surgeries.map(item => (
                            <div key={item.id} className="w-full p-6 bg-slate-50 border border-emerald-100/50 rounded-3xl flex justify-between items-center animate-in slide-in-from-left-2">
                                <div className="text-left">
                                    <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                    <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-300" />
                                        Date: <span className="text-slate-900">{item.date || 'N/A'}</span> 
                                        <span className="text-slate-200 mx-1">•</span>
                                        <Hospital size={14} className="text-slate-300" />
                                        Hospital: <span className="text-slate-900">{item.hospital || 'N/A'}</span>
                                    </p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => removeItem(surgeries, setSurgeries, item.id)} className="p-3 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Full Width Edit Card for Surgery */}
                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-emerald-200 rounded-[2rem] space-y-5 bg-slate-50/50 animate-in zoom-in-95">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Procedure Name</label>
                                        <input 
                                            placeholder="e.g. Appendectomy" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-emerald-500 bg-white transition-all"
                                            value={newSurgery.name}
                                            onChange={e => setNewSurgery({...newSurgery, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Date of Procedure</label>
                                        <input 
                                            type="date" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white transition-all"
                                            value={newSurgery.date}
                                            onChange={e => setNewSurgery({...newSurgery, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Medical Facility / Hospital</label>
                                        <input 
                                            placeholder="e.g. Cavite Medical Center" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white transition-all"
                                            value={newSurgery.hospital}
                                            onChange={e => setNewSurgery({...newSurgery, hospital: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button onClick={() => addItem('surgery')} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                                    <Plus size={18} /> Add Procedure to History
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MedicalRecord;