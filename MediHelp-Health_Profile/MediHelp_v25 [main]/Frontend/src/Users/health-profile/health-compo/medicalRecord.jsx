// medicalRecord.jsx - Component for displaying and managing a patient's medical records.
// FEATURES: Staged add/delete with RESTORE button. Changes only commit to DB on "Save Records".
// Cancel discards everything and restores all staged-deleted items.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
    FileText, Activity, AlertTriangle, Scissors, 
    Trash2, Plus, Edit, X, Check, Calendar, Hospital, Loader2, RotateCcw
} from 'lucide-react';
import { showToast } from '../../../components/ToastMessage';

const MedicalRecord = ({ isLoading: parentLoading, patientId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [recordsLoading, setRecordsLoading] = useState(true);

    // Data from database (displayed when NOT editing)
    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [surgeries, setSurgeries] = useState([]);

    // Working copies for editing (displayed when IS editing)
    const [stagedConditions, setStagedConditions] = useState([]);
    const [stagedAllergies, setStagedAllergies] = useState([]);
    const [stagedSurgeries, setStagedSurgeries] = useState([]);

    // Form states for new items
    const [newCondition, setNewCondition] = useState({ name: '', date: '', status: 'Active' });
    const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'Moderate', reaction: '' });
    const [newSurgery, setNewSurgery] = useState({ name: '', date: '', hospital: '' });

    // Validation error states
    const [conditionErrors, setConditionErrors] = useState({ name: '', date: '' });
    const [allergyErrors, setAllergyErrors] = useState({ name: '' });
    const [surgeryErrors, setSurgeryErrors] = useState({ name: '', date: '' });

    // Inline delete confirmation state: { type: 'condition'|'allergy'|'surgery', id: number, name: string }
    const [pendingDelete, setPendingDelete] = useState(null);

    // Track if we've initialized staged data for current edit session
    const stagedInitialized = useRef(false);

    // Fetch all records from DB
    const fetchRecords = useCallback(async () => {
        if (!patientId) {
            console.log('fetchRecords: No patientId provided');
            setRecordsLoading(false);
            return;
        }
        setRecordsLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/users/medical-records/${patientId}`);
            console.log('fetchRecords response:', res.data);
            if (res.data.success) {
                setConditions(res.data.conditions || []);
                setAllergies(res.data.allergies || []);
                setSurgeries(res.data.surgeries || []);
            }
        } catch (error) {
            console.error('Error fetching medical records:', error.response?.data || error.message);
            showToast('Failed to load medical records', 'error');
        } finally {
            setRecordsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    // Initialize staged data ONLY when entering edit mode
    useEffect(() => {
        if (isEditing && !stagedInitialized.current) {
            setStagedConditions(conditions.map(c => ({ ...c, _status: 'existing' })));
            setStagedAllergies(allergies.map(a => ({ ...a, _status: 'existing' })));
            setStagedSurgeries(surgeries.map(s => ({ ...s, _status: 'existing' })));
            stagedInitialized.current = true;
        }
    }, [isEditing]); // ONLY depend on isEditing

    // Reset the flag when exiting edit mode
    useEffect(() => {
        if (!isEditing) {
            stagedInitialized.current = false;
            setPendingDelete(null);
        }
    }, [isEditing]);

    const handleSaveRecords = async () => {
        if (!patientId) {
            showToast('No patient ID found.', 'error');
            return;
        }

        const numericPatientId = parseInt(patientId, 10);
        if (isNaN(numericPatientId)) {
            showToast('Invalid patient ID detected.', 'error');
            return;
        }

        setIsSaving(true);

        try {
            // 1. DELETE removed items (only permanently delete items that were marked for deletion)
            const deletedConditions = stagedConditions.filter(c => c._status === 'deleted' && !String(c.id).startsWith('temp-'));
            const deletedAllergies = stagedAllergies.filter(a => a._status === 'deleted' && !String(a.id).startsWith('temp-'));
            const deletedSurgeries = stagedSurgeries.filter(s => s._status === 'deleted' && !String(s.id).startsWith('temp-'));

            const deletePromises = [
                ...deletedConditions.map(c => axios.delete(`http://localhost:5000/api/users/medical-condition/${c.id}`)),
                ...deletedAllergies.map(a => axios.delete(`http://localhost:5000/api/users/allergy/${a.id}`)),
                ...deletedSurgeries.map(s => axios.delete(`http://localhost:5000/api/users/surgery/${s.id}`))
            ];

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }

            // 2. ADD new items
            const newConditions = stagedConditions.filter(c => c._status === 'new');
            const newAllergiesList = stagedAllergies.filter(a => a._status === 'new');
            const newSurgeriesList = stagedSurgeries.filter(s => s._status === 'new');

            const addPromises = [
                ...newConditions.map(c => axios.post(
                    `http://localhost:5000/api/users/medical-condition/${numericPatientId}`,
                    { name: c.name.trim(), date: c.date, status: c.status || 'Active' },
                    { headers: { 'Content-Type': 'application/json' } }
                )),
                ...newAllergiesList.map(a => axios.post(
                    `http://localhost:5000/api/users/allergy/${numericPatientId}`,
                    { name: a.name.trim(), severity: a.severity || 'Moderate', reaction: a.reaction?.trim() || null },
                    { headers: { 'Content-Type': 'application/json' } }
                )),
                ...newSurgeriesList.map(s => axios.post(
                    `http://localhost:5000/api/users/surgery/${numericPatientId}`,
                    { name: s.name.trim(), date: s.date, hospital: s.hospital?.trim() || null },
                    { headers: { 'Content-Type': 'application/json' } }
                ))
            ];

            if (addPromises.length > 0) {
                await Promise.all(addPromises);
            }

            // 3. Clear staged data, refresh from DB, exit edit mode
            setStagedConditions([]);
            setStagedAllergies([]);
            setStagedSurgeries([]);
            stagedInitialized.current = false;
            setPendingDelete(null);

            await fetchRecords();
            setIsEditing(false);
            
            const addedCount = newConditions.length + newAllergiesList.length + newSurgeriesList.length;
            const deletedCount = deletedConditions.length + deletedAllergies.length + deletedSurgeries.length;

            if (addedCount > 0 && deletedCount > 0) {
                showToast(`${addedCount} added, ${deletedCount} deleted`, 'success');
            } else if (addedCount > 0) {
                showToast(`${addedCount} record(s) added successfully!`, 'success');
            } else if (deletedCount > 0) {
                showToast(`${deletedCount} record(s) deleted`, 'success');
            } else {
                showToast('Records updated', 'success');
            }

        } catch (error) {
            console.error('Error saving records:', error);
            showToast(
                error.response?.data?.error || error.response?.data?.details || 'Failed to save changes. Please try again.',
                'error'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewCondition({ name: '', date: '', status: 'Active' });
        setNewAllergy({ name: '', severity: 'Moderate', reaction: '' });
        setNewSurgery({ name: '', date: '', hospital: '' });
        setConditionErrors({ name: '', date: '' });
        setAllergyErrors({ name: '' });
        setSurgeryErrors({ name: '', date: '' });
        setStagedConditions([]);
        setStagedAllergies([]);
        setStagedSurgeries([]);
        setPendingDelete(null);
        stagedInitialized.current = false;
        fetchRecords();
        showToast('Changes discarded', 'info');
    };

    // VALIDATION
    const validateCondition = () => {
        const errors = { name: '', date: '' };
        let isValid = true;
        if (!newCondition.name.trim()) { errors.name = 'Condition name is required'; isValid = false; }
        if (!newCondition.date) { errors.date = 'Diagnosis date is required'; isValid = false; }
        setConditionErrors(errors);
        return isValid;
    };

    const validateAllergy = () => {
        const errors = { name: '' };
        let isValid = true;
        if (!newAllergy.name.trim()) { errors.name = 'Allergen name is required'; isValid = false; }
        setAllergyErrors(errors);
        return isValid;
    };

    const validateSurgery = () => {
        const errors = { name: '', date: '' };
        let isValid = true;
        if (!newSurgery.name.trim()) { errors.name = 'Procedure name is required'; isValid = false; }
        if (!newSurgery.date) { errors.date = 'Procedure date is required'; isValid = false; }
        setSurgeryErrors(errors);
        return isValid;
    };

    // STAGED ADD
    const stageAddCondition = () => {
        if (!validateCondition()) return;
        setStagedConditions(prev => [...prev, {
            id: `temp-${Date.now()}`,
            name: newCondition.name.trim(),
            date: newCondition.date,
            status: newCondition.status,
            _status: 'new'
        }]);
        setNewCondition({ name: '', date: '', status: 'Active' });
        setConditionErrors({ name: '', date: '' });
    };

    const stageAddAllergy = () => {
        if (!validateAllergy()) return;
        setStagedAllergies(prev => [...prev, {
            id: `temp-${Date.now()}`,
            name: newAllergy.name.trim(),
            severity: newAllergy.severity,
            reaction: newAllergy.reaction?.trim() || '',
            _status: 'new'
        }]);
        setNewAllergy({ name: '', severity: 'Moderate', reaction: '' });
        setAllergyErrors({ name: '' });
    };

    const stageAddSurgery = () => {
        if (!validateSurgery()) return;
        setStagedSurgeries(prev => [...prev, {
            id: `temp-${Date.now()}`,
            name: newSurgery.name.trim(),
            date: newSurgery.date,
            hospital: newSurgery.hospital?.trim() || '',
            _status: 'new'
        }]);
        setNewSurgery({ name: '', date: '', hospital: '' });
        setSurgeryErrors({ name: '', date: '' });
    };

    // STAGED DELETE (mark for deletion — item stays visible with visual indicator)
    const stageDelete = (type, id, name) => {
        setPendingDelete({ type, id, name });
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        const { type, id } = pendingDelete;
        
        if (type === 'condition') {
            setStagedConditions(prev => prev.map(c => c.id === id ? { ...c, _status: 'deleted' } : c));
        } else if (type === 'allergy') {
            setStagedAllergies(prev => prev.map(a => a.id === id ? { ...a, _status: 'deleted' } : a));
        } else if (type === 'surgery') {
            setStagedSurgeries(prev => prev.map(s => s.id === id ? { ...s, _status: 'deleted' } : s));
        }
        setPendingDelete(null);
    };

    // RESTORE a staged-deleted item back to existing
    const restoreItem = (type, id) => {
        if (type === 'condition') {
            setStagedConditions(prev => prev.map(c => c.id === id ? { ...c, _status: 'existing' } : c));
        } else if (type === 'allergy') {
            setStagedAllergies(prev => prev.map(a => a.id === id ? { ...a, _status: 'existing' } : a));
        } else if (type === 'surgery') {
            setStagedSurgeries(prev => prev.map(s => s.id === id ? { ...s, _status: 'existing' } : s));
        }
    };

    // CHOOSE WHICH DATA TO DISPLAY
    // In edit mode, show ALL items including deleted ones (so user can see and restore them)
    const displayConditions = isEditing ? stagedConditions : conditions;
    const displayAllergies = isEditing ? stagedAllergies : allergies;
    const displaySurgeries = isEditing ? stagedSurgeries : surgeries;

    if (parentLoading || recordsLoading) {
        return (
            <div className="p-10 text-center font-bold text-slate-400 flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" /> Loading records...
            </div>
        );
    }

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
                            <button onClick={handleCancelEdit} disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={handleSaveRecords} disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-100 transition-all cursor-pointer disabled:opacity-50">
                                <Check size={16} /> Save Records
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                            <Edit size={16} /> Edit Records
                        </button>
                    )}
                </div>
            </div>

            {!patientId && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <p className="text-amber-700 font-bold text-sm">
                        Please complete and save your Personal Information first to manage medical records.
                    </p>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-10">
                
                {/* --- MEDICAL CONDITIONS --- */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500 ml-1">
                        <Activity size={20} />
                        <h4 className="font-black uppercase tracking-widest text-sm text-slate-400">Medical Conditions</h4>
                    </div>
                    <div className="space-y-4">
                        {displayConditions.filter(c => c._status !== 'deleted').length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-2">No medical conditions recorded.</p>
                        ) : (
                            displayConditions.filter(c => c._status !== 'deleted').map(item => (
                                <div key={item.id} className={`w-full p-6 bg-slate-50 border rounded-3xl shadow-sm flex justify-between items-center animate-in slide-in-from-left-2 ${isEditing && item._status === 'new' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                            {isEditing && item._status === 'new' && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-300" />
                                            Diagnosed: <span className="text-slate-900">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span> 
                                            <span className="text-slate-200 mx-1">•</span>
                                            Status: <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{item.status}</span>
                                        </p>
                                    </div>
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            {pendingDelete?.type === 'condition' && pendingDelete?.id === item.id ? (
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
                                                    onClick={() => stageDelete('condition', item.id, item.name)} 
                                                    disabled={isSaving || pendingDelete !== null}
                                                    className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors disabled:opacity-30"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Marked for Deletion — Conditions */}
                        {isEditing && displayConditions.some(c => c._status === 'deleted') && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <div className="h-px flex-1 bg-red-200"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Marked for Deletion</span>
                                    <div className="h-px flex-1 bg-red-200"></div>
                                </div>
                                {displayConditions.filter(c => c._status === 'deleted').map(item => (
                                    <div key={item.id} className="w-full p-6 bg-red-50/60 border border-red-200 rounded-3xl flex justify-between items-center opacity-70">
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-black text-red-800/60 text-lg leading-none line-through">{item.name}</h5>
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full">Deleting</span>
                                            </div>
                                            <p className="text-sm text-red-600/50 font-bold mt-2 flex items-center gap-2">
                                                <Calendar size={14} />
                                                Diagnosed: <span className="line-through">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span> 
                                                <span className="mx-1">•</span>
                                                Status: <span className="line-through">{item.status}</span>
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => restoreItem('condition', item.id)}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2rem] space-y-5 bg-slate-50/50 animate-in zoom-in-95">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">
                                            Condition Name <span className="text-red-500">*</span>
                                        </label>
                                        <input placeholder="e.g. Hypertension" 
                                            className={`w-full mt-1 p-3.5 rounded-2xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white transition-all ${conditionErrors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                                            value={newCondition.name}
                                            onChange={e => { setNewCondition({...newCondition, name: e.target.value}); if (conditionErrors.name) setConditionErrors({...conditionErrors, name: ''}); }} />
                                        {conditionErrors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{conditionErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">
                                            Diagnosis Date <span className="text-red-500">*</span>
                                        </label>
                                        <input type="date" 
                                            className={`w-full mt-1 p-3.5 rounded-2xl border font-bold text-sm outline-none bg-white transition-all ${conditionErrors.date ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                                            value={newCondition.date}
                                            onChange={e => { setNewCondition({...newCondition, date: e.target.value}); if (conditionErrors.date) setConditionErrors({...conditionErrors, date: ''}); }} />
                                        {conditionErrors.date && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{conditionErrors.date}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Current Status</label>
                                        <select className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white appearance-none"
                                            value={newCondition.status}
                                            onChange={e => setNewCondition({...newCondition, status: e.target.value})}>
                                            <option value="Active">Active</option>
                                            <option value="Recovered">Recovered</option>
                                            <option value="Under Treatment">Under Treatment</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={stageAddCondition} disabled={isSaving}
                                    className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
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
                        {displayAllergies.filter(a => a._status !== 'deleted').length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-2">No allergies recorded.</p>
                        ) : (
                            displayAllergies.filter(a => a._status !== 'deleted').map(item => (
                                <div key={item.id} className={`w-full p-6 bg-slate-50 border rounded-3xl flex justify-between items-center ${isEditing && item._status === 'new' ? 'border-amber-200 bg-amber-50/30' : 'border-amber-100/50'}`}>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                            {isEditing && item._status === 'new' && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 font-bold mt-2">
                                            Severity: 
                                            <span className={`px-2 py-0.5 rounded-md ml-1 ${item.severity === 'Life-threatening' || item.severity === 'Severe' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50'}`}>
                                                {item.severity}
                                            </span> 
                                            <span className="text-slate-200 mx-1">•</span> 
                                            Reaction: <span className="text-slate-900">{item.reaction || 'N/A'}</span>
                                        </p>
                                    </div>
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            {pendingDelete?.type === 'allergy' && pendingDelete?.id === item.id ? (
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
                                                    onClick={() => stageDelete('allergy', item.id, item.name)} 
                                                    disabled={isSaving || pendingDelete !== null}
                                                    className="p-3 text-amber-600 hover:bg-amber-100 rounded-2xl transition-colors disabled:opacity-30"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Marked for Deletion — Allergies */}
                        {isEditing && displayAllergies.some(a => a._status === 'deleted') && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <div className="h-px flex-1 bg-red-200"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Marked for Deletion</span>
                                    <div className="h-px flex-1 bg-red-200"></div>
                                </div>
                                {displayAllergies.filter(a => a._status === 'deleted').map(item => (
                                    <div key={item.id} className="w-full p-6 bg-red-50/60 border border-red-200 rounded-3xl flex justify-between items-center opacity-70">
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-black text-red-800/60 text-lg leading-none line-through">{item.name}</h5>
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full">Deleting</span>
                                            </div>
                                            <p className="text-sm text-red-600/50 font-bold mt-2">
                                                Severity: <span className="line-through">{item.severity}</span>
                                                <span className="mx-1">•</span> 
                                                Reaction: <span className="line-through">{item.reaction || 'N/A'}</span>
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => restoreItem('allergy', item.id)}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-amber-200 rounded-[2rem] space-y-5 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">
                                            Allergen <span className="text-red-500">*</span>
                                        </label>
                                        <input placeholder="e.g. Peanuts" 
                                            className={`w-full mt-1 p-3.5 rounded-2xl border font-bold text-sm outline-none focus:border-amber-500 bg-white transition-all ${allergyErrors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                                            value={newAllergy.name}
                                            onChange={e => { setNewAllergy({...newAllergy, name: e.target.value}); if (allergyErrors.name) setAllergyErrors({...allergyErrors, name: ''}); }} />
                                        {allergyErrors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{allergyErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Severity Level</label>
                                        <select className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                            value={newAllergy.severity}
                                            onChange={e => setNewAllergy({...newAllergy, severity: e.target.value})}>
                                            <option value="Mild">Mild</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Severe">Severe</option>
                                            <option value="Life-threatening">Life-threatening</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Known Reaction</label>
                                        <input placeholder="e.g. Anaphylaxis, Rashes" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white"
                                            value={newAllergy.reaction}
                                            onChange={e => setNewAllergy({...newAllergy, reaction: e.target.value})} />
                                    </div>
                                </div>
                                <button onClick={stageAddAllergy} disabled={isSaving}
                                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-100 disabled:opacity-50 disabled:cursor-not-allowed">
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
                        {displaySurgeries.filter(s => s._status !== 'deleted').length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-2">No surgeries or procedures recorded.</p>
                        ) : (
                            displaySurgeries.filter(s => s._status !== 'deleted').map(item => (
                                <div key={item.id} className={`w-full p-6 bg-slate-50 border rounded-3xl flex justify-between items-center animate-in slide-in-from-left-2 ${isEditing && item._status === 'new' ? 'border-emerald-200 bg-emerald-50/30' : 'border-emerald-100/50'}`}>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                                            {isEditing && item._status === 'new' && (
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-300" />
                                            Date: <span className="text-slate-900">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span> 
                                            <span className="text-slate-200 mx-1">•</span>
                                            <Hospital size={14} className="text-slate-300" />
                                            Hospital: <span className="text-slate-900">{item.hospital || 'N/A'}</span>
                                        </p>
                                    </div>
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            {pendingDelete?.type === 'surgery' && pendingDelete?.id === item.id ? (
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
                                                    onClick={() => stageDelete('surgery', item.id, item.name)} 
                                                    disabled={isSaving || pendingDelete !== null}
                                                    className="p-3 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-colors disabled:opacity-30"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Marked for Deletion — Surgeries */}
                        {isEditing && displaySurgeries.some(s => s._status === 'deleted') && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <div className="h-px flex-1 bg-red-200"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Marked for Deletion</span>
                                    <div className="h-px flex-1 bg-red-200"></div>
                                </div>
                                {displaySurgeries.filter(s => s._status === 'deleted').map(item => (
                                    <div key={item.id} className="w-full p-6 bg-red-50/60 border border-red-200 rounded-3xl flex justify-between items-center opacity-70">
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-black text-red-800/60 text-lg leading-none line-through">{item.name}</h5>
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full">Deleting</span>
                                            </div>
                                            <p className="text-sm text-red-600/50 font-bold mt-2 flex items-center gap-2">
                                                <Calendar size={14} />
                                                Date: <span className="line-through">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span> 
                                                <span className="mx-1">•</span>
                                                <Hospital size={14} />
                                                Hospital: <span className="line-through">{item.hospital || 'N/A'}</span>
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => restoreItem('surgery', item.id)}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isEditing && (
                            <div className="w-full p-8 border-2 border-dashed border-emerald-200 rounded-[2rem] space-y-5 bg-slate-50/50 animate-in zoom-in-95">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">
                                            Procedure Name <span className="text-red-500">*</span>
                                        </label>
                                        <input placeholder="e.g. Appendectomy" 
                                            className={`w-full mt-1 p-3.5 rounded-2xl border font-bold text-sm outline-none focus:border-emerald-500 bg-white transition-all ${surgeryErrors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                                            value={newSurgery.name}
                                            onChange={e => { setNewSurgery({...newSurgery, name: e.target.value}); if (surgeryErrors.name) setSurgeryErrors({...surgeryErrors, name: ''}); }} />
                                        {surgeryErrors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{surgeryErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">
                                            Date of Procedure <span className="text-red-500">*</span>
                                        </label>
                                        <input type="date" 
                                            className={`w-full mt-1 p-3.5 rounded-2xl border font-bold text-sm outline-none bg-white transition-all ${surgeryErrors.date ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                                            value={newSurgery.date}
                                            onChange={e => { setNewSurgery({...newSurgery, date: e.target.value}); if (surgeryErrors.date) setSurgeryErrors({...surgeryErrors, date: ''}); }} />
                                        {surgeryErrors.date && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{surgeryErrors.date}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-foreground ml-1">Medical Facility / Hospital</label>
                                        <input placeholder="e.g. Cavite Medical Center" 
                                            className="w-full mt-1 p-3.5 rounded-2xl border border-slate-200 font-bold text-sm outline-none bg-white transition-all"
                                            value={newSurgery.hospital}
                                            onChange={e => setNewSurgery({...newSurgery, hospital: e.target.value})} />
                                    </div>
                                </div>
                                <button onClick={stageAddSurgery} disabled={isSaving}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Plus size={18} /> Add Procedure to History
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MedicalRecord;