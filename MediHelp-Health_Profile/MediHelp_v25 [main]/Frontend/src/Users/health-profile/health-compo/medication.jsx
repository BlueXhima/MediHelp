//medication.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Pill, Clock, User, Plus, Trash2, Edit, X, Check, 
    AlertTriangle, Loader2, Activity, RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../../components/ToastMessage';

const Medication = ({ isLoading: parentIsLoading, patientId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: ''
    });

    // Validation error state
    const [medErrors, setMedErrors] = useState({ name: '' });

    // Inline delete confirmation state: { id: number, name: string }
    const [pendingDelete, setPendingDelete] = useState(null);

    // Fetch medications from database
    const fetchMedications = useCallback(async () => {
        if (!patientId) {
            console.log('fetchMedications: No patientId provided');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users/medications/${patientId}`
            );
            
            console.log('fetchMedications response:', response.data);
            
            if (response.data.success) {
                const mappedMeds = response.data.medications.map(med => ({
                    id: med.id,
                    name: med.name,
                    dosage: med.dosage || '',
                    frequency: med.frequency || '',
                    prescribedBy: med.prescribedBy || '',
                    status: med.status || 'Active',
                    _status: 'existing'
                }));
                setMedications(mappedMeds);
            }
        } catch (error) {
            console.error('Error fetching medications:', error.response?.data || error.message);
            showToast('Failed to load medications', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchMedications();
    }, [fetchMedications]);

    const validateMedication = () => {
        const errors = { name: '' };
        let isValid = true;

        if (!newMed.name.trim()) {
            errors.name = 'Medication name is required';
            isValid = false;
        }

        setMedErrors(errors);
        return isValid;
    };

    const addMedication = () => {
        if (!validateMedication() || !patientId) return;

        // Add to local state with _status flag
        setMedications([...medications, { 
            ...newMed, 
            id: `temp-${Date.now()}`, // Temporary ID for new items
            status: 'Active',
            _status: 'new' // Flag to identify unsaved items
        }]);
        setNewMed({ name: '', dosage: '', frequency: '', prescribedBy: '' });
        setMedErrors({ name: '' });
    };

    // Stage an item for deletion (mark as deleted — stays visible with visual indicator)
    const stageDelete = (id, name) => {
        setPendingDelete({ id, name });
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        
        // Mark the item as deleted (soft delete in state)
        setMedications(prev => prev.map(m => 
            m.id === pendingDelete.id ? { ...m, _status: 'deleted' } : m
        ));
        setPendingDelete(null);
    };

    // Restore a staged-deleted item back to existing
    const restoreMedication = (id) => {
        setMedications(prev => prev.map(m => 
            m.id === id ? { ...m, _status: 'existing' } : m
        ));
    };

    // Save all changes: add new items to DB + delete staged items
    const handleSaveChanges = async () => {
        if (!patientId) {
            showToast('No patient ID found. Please save your profile first.', 'error');
            return;
        }

        const numericPatientId = parseInt(patientId, 10);
        if (isNaN(numericPatientId)) {
            showToast('Invalid patient ID detected.', 'error');
            return;
        }

        setIsSaving(true);

        try {
            // 1. DELETE all staged items from database (only existing items, not temp- ones)
            const deletedItems = medications.filter(m => m._status === 'deleted' && !String(m.id).startsWith('temp-'));
            
            const deletePromises = deletedItems
                .map(med => axios.delete(`http://localhost:5000/api/users/medication/${med.id}`));

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }

            // 2. Add all new items to database
            const newItems = medications.filter(m => m._status === 'new');
            const addPromises = newItems.map(med => 
                axios.post(
                    `http://localhost:5000/api/users/medication/${numericPatientId}`,
                    {
                        name: med.name.trim(),
                        dosage: med.dosage?.trim() || null,
                        frequency: med.frequency?.trim() || null,
                        prescribedBy: med.prescribedBy?.trim() || null,
                        status: 'Active'
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                )
            );

            if (addPromises.length > 0) {
                await Promise.all(addPromises);
            }

            // 3. Clear staging and refresh from DB
            setPendingDelete(null);
            await fetchMedications();
            setIsEditing(false);
            
            const deletedCount = deletedItems.length;
            const addedCount = newItems.length;
            
            if (deletedCount > 0 && addedCount > 0) {
                showToast(`${addedCount} medication(s) added, ${deletedCount} deleted`, 'success');
            } else if (addedCount > 0) {
                showToast(`${addedCount} medication(s) added successfully!`, 'success');
            } else if (deletedCount > 0) {
                showToast(`${deletedCount} medication(s) deleted`, 'success');
            } else {
                showToast('Changes saved', 'success');
            }

        } catch (error) {
            console.error('Error saving changes:', error);
            showToast(
                error.response?.data?.error || error.response?.data?.details || 'Failed to save changes. Please try again.',
                'error'
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel edit: discard all changes and refetch from DB
    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewMed({ name: '', dosage: '', frequency: '', prescribedBy: '' });
        setMedErrors({ name: '' });
        setPendingDelete(null);
        fetchMedications();
        showToast('Changes discarded', 'info');
    };

    if (parentIsLoading || isLoading) {
        return (
            <div className="p-10 text-center font-bold text-slate-400 italic flex items-center justify-center gap-3">
                <Loader2 size={20} className="animate-spin" />
                Fetching medications...
            </div>
        );
    }

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
                            <button 
                                onClick={handleCancelEdit} 
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button 
                                onClick={handleSaveChanges} 
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Check size={16} /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <Edit size={16} /> Update List
                        </button>
                    )}
                </div>
            </div>

            {!patientId && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <p className="text-amber-700 font-bold text-sm">
                        Please complete and save your Personal Information first to manage medications.
                    </p>
                </div>
            )}

            {/* Medications List */}
            <div className="space-y-4">
                {medications.filter(m => m._status !== 'deleted').length === 0 && !isEditing ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                            <Pill size={32} />
                        </div>
                        <h4 className="font-black text-slate-400 text-lg">No medications recorded</h4>
                        <p className="text-sm text-slate-400 mt-1">Click "Update List" to add your prescriptions</p>
                    </div>
                ) : (
                    medications.filter(m => m._status !== 'deleted').map((med) => (
                        <div key={med.id} className="group relative w-full p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-emerald-200 transition-all flex justify-between items-center animate-in slide-in-from-left-2">
                            <div className="flex items-center gap-6 text-left">
                                <div className="hidden md:flex w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                    <Pill size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black text-slate-800 text-xl leading-none">{med.name}</h4>
                                        {med.status === 'Active' && (
                                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                                                Active
                                            </span>
                                        )}
                                        {med._status === 'new' && (
                                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold">
                                        {med.dosage && (
                                            <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                                <Activity size={14} className="text-emerald-500" /> {med.dosage}
                                            </span>
                                        )}
                                        {med.frequency && (
                                            <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                                <Clock size={14} className="text-blue-500" /> {med.frequency}
                                            </span>
                                        )}
                                        {med.prescribedBy && (
                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                <User size={14} /> Prescribed by: <span className="text-slate-900">{med.prescribedBy}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    {pendingDelete?.id === med.id ? (
                                        <div className="flex items-center gap-2 animate-in zoom-in-95">
                                            <span className="text-xs font-bold text-red-500">Delete?</span>
                                            <button 
                                                onClick={confirmDelete}
                                                disabled={isSaving}
                                                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                                title="Confirm Delete"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={cancelDelete}
                                                disabled={isSaving}
                                                className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50"
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => stageDelete(med.id, med.name)} 
                                            disabled={isSaving || pendingDelete !== null}
                                            className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-30"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Marked for Deletion — Medications */}
                {isEditing && medications.some(m => m._status === 'deleted') && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                            <div className="h-px flex-1 bg-red-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Marked for Deletion</span>
                            <div className="h-px flex-1 bg-red-200"></div>
                        </div>
                        {medications.filter(m => m._status === 'deleted').map((med) => (
                            <div key={med.id} className="w-full p-6 bg-red-50/60 border border-red-200 rounded-[2rem] flex justify-between items-center opacity-70">
                                <div className="flex items-center gap-6 text-left">
                                    <div className="hidden md:flex w-14 h-14 bg-red-100/50 rounded-2xl items-center justify-center text-red-400">
                                        <Pill size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-red-800/60 text-xl leading-none line-through">{med.name}</h4>
                                            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                                                Deleting
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold text-red-600/50">
                                            {med.dosage && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <Activity size={14} /> {med.dosage}
                                                </span>
                                            )}
                                            {med.frequency && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <Clock size={14} /> {med.frequency}
                                                </span>
                                            )}
                                            {med.prescribedBy && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <User size={14} /> Prescribed by: {med.prescribedBy}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => restoreMedication(med.id)}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <RotateCcw size={14} /> Restore
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Medication Form */}
                {isEditing && (
                    <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Medication Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    placeholder="e.g. Paracetamol" 
                                    className={`w-full p-4 rounded-2xl border font-bold text-sm outline-none focus:border-emerald-500 bg-white transition-all ${
                                        medErrors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                                    }`}
                                    value={newMed.name}
                                    onChange={e => {
                                        setNewMed({...newMed, name: e.target.value});
                                        if (medErrors.name) setMedErrors({...medErrors, name: ''});
                                    }}
                                />
                                {medErrors.name && (
                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1">{medErrors.name}</p>
                                )}
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
                        <button 
                            onClick={addMedication} 
                            disabled={!newMed.name.trim() || isSaving}
                            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} /> Add Medication to My List
                                </>
                            )}
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