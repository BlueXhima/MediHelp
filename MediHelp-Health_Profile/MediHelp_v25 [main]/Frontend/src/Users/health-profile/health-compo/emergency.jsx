// emergency.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Phone, Heart, Mail, Star, Trash2, AlertTriangle, 
    Edit, X, Check, Plus, UserPlus, ShieldAlert, Loader2, RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../../components/ToastMessage';

// ============================================
// VALIDATION RULES
// ============================================

const VALIDATION_RULES = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z][a-zA-Z\s'.-]{0,98}$/,
        patternMessage: 'Only letters, spaces, hyphens, periods, and apostrophes allowed. Must start with a letter.',
        sanitize: (val) => {
            let cleaned = val.replace(/[^a-zA-Z\s'.-]/g, '');
            cleaned = cleaned.replace(/\s+/g, ' ');
            return cleaned;
        }
    },
    relationship: {
        required: false,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z][a-zA-Z\s'.-]{0,48}$/,
        patternMessage: 'Only letters, spaces, hyphens, periods, and apostrophes allowed. Must start with a letter.',
        sanitize: (val) => {
            let cleaned = val.replace(/[^a-zA-Z\s'.-]/g, '');
            cleaned = cleaned.replace(/\s+/g, ' ');
            return cleaned;
        }
    },
    phone: {
        required: true,
        minLength: 7,
        maxLength: 15,
        pattern: /^[0-9]{7,15}$/,
        patternMessage: 'Enter a valid phone number (numbers only, e.g., 09171234567)',
        sanitize: (val) => val.replace(/[^0-9]/g, '').slice(0, 15)
    },
    email: {
        required: false,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        patternMessage: 'Enter a valid email address (e.g., name@email.com)',
        sanitize: (val) => val.trim().toLowerCase().slice(0, 100)
    }
};

const validateField = (fieldName, value) => {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule) return { isValid: true, error: '' };

    const trimmedValue = value.trim();

    // Required check
    if (rule.required && !trimmedValue) {
        return { isValid: false, error: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` };
    }

    // Skip further validation if empty and not required
    if (!rule.required && !trimmedValue) {
        return { isValid: true, error: '' };
    }

    // Min length check
    if (rule.minLength && trimmedValue.length < rule.minLength) {
        return { isValid: false, error: `Must be at least ${rule.minLength} characters` };
    }

    // Max length check
    if (rule.maxLength && trimmedValue.length > rule.maxLength) {
        return { isValid: false, error: `Must not exceed ${rule.maxLength} characters` };
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(trimmedValue)) {
        return { isValid: false, error: rule.patternMessage };
    }

    return { isValid: true, error: '' };
};

const sanitizeInput = (fieldName, value) => {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule || !rule.sanitize) return value;
    return rule.sanitize(value);
};

const EmergencyContact = ({ isLoading: parentIsLoading, patientId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [newContact, setNewContact] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: ''
    });

    const [contactErrors, setContactErrors] = useState({ name: '', relationship: '', phone: '', email: '' });
    const [touchedFields, setTouchedFields] = useState({ name: false, relationship: false, phone: false, email: false });
    const [pendingDelete, setPendingDelete] = useState(null);
    
    // Track form validity in state
    const [formValid, setFormValid] = useState(false);

    // Fetch contacts from database
    const fetchContacts = useCallback(async () => {
        if (!patientId) {
            console.log('fetchContacts: No patientId provided');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users/emergency-contacts/${patientId}`
            );
            
            console.log('fetchContacts response:', response.data);
            
            if (response.data.success) {
                const mappedContacts = response.data.contacts.map(contact => ({
                    id: contact.id,
                    name: contact.name,
                    relationship: contact.relationship || '',
                    phone: contact.phone || '',
                    email: contact.email || '',
                    isPrimary: contact.isPrimary === 1 || contact.isPrimary === true,
                    _status: 'existing'
                }));
                setContacts(mappedContacts);
            }
        } catch (error) {
            console.error('Error fetching emergency contacts:', error.response?.data || error.message);
            showToast('Failed to load emergency contacts', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // Re-validate and update form validity whenever newContact changes
    useEffect(() => {
        const nameResult = validateField('name', newContact.name);
        const phoneResult = validateField('phone', newContact.phone);
        const relationshipResult = validateField('relationship', newContact.relationship);
        const emailResult = validateField('email', newContact.email);
        
        const isValid = nameResult.isValid && phoneResult.isValid && relationshipResult.isValid && emailResult.isValid;
        setFormValid(isValid);
        
        console.log('Form validation:', {
            name: { value: newContact.name, valid: nameResult.isValid, error: nameResult.error },
            phone: { value: newContact.phone, valid: phoneResult.isValid, error: phoneResult.error },
            relationship: { value: newContact.relationship, valid: relationshipResult.isValid, error: relationshipResult.error },
            email: { value: newContact.email, valid: emailResult.isValid, error: emailResult.error },
            overallValid: isValid
        });
    }, [newContact]);

    const handleInputChange = (field, value) => {
        const sanitized = sanitizeInput(field, value);
        
        // Always update state, don't skip even if same (prevents stale state bugs)
        setNewContact(prev => ({ ...prev, [field]: sanitized }));
        
        // Real-time validation if field was already touched
        if (touchedFields[field]) {
            const { error } = validateField(field, sanitized);
            setContactErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleBlur = (field) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
        const { error } = validateField(field, newContact[field]);
        setContactErrors(prev => ({ ...prev, [field]: error }));
    };

    const validateAllFields = () => {
        const errors = {};
        let isValid = true;

        Object.keys(newContact).forEach(field => {
            const result = validateField(field, newContact[field]);
            errors[field] = result.error;
            if (!result.isValid) isValid = false;
        });

        setContactErrors(errors);
        setTouchedFields({ name: true, relationship: true, phone: true, email: true });
        setFormValid(isValid);
        
        console.log('validateAllFields result:', { isValid, errors, newContact });
        return isValid;
    };

    const addContact = () => {
        console.log('addContact clicked', { newContact, patientId, formValid });
        
        if (!patientId) {
            showToast('No patient ID found. Please save your profile first.', 'error');
            return;
        }

        const isValid = validateAllFields();
        if (!isValid) {
            console.log('Validation failed, cannot add contact');
            showToast('Please fix the errors before adding.', 'error');
            return;
        }

        console.log('Adding contact:', newContact);

        setContacts(prev => [...prev, { 
            ...newContact, 
            id: `temp-${Date.now()}`,
            isPrimary: prev.length === 0,
            _status: 'new'
        }]);
        
        // Reset form
        setNewContact({ name: '', relationship: '', phone: '', email: '' });
        setContactErrors({ name: '', relationship: '', phone: '', email: '' });
        setTouchedFields({ name: false, relationship: false, phone: false, email: false });
        
        showToast('Contact added to list. Click Save Contacts to save.', 'success');
    };

    const stageDelete = (id, name) => {
        setPendingDelete({ id, name });
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        
        setContacts(prev => prev.map(c => 
            c.id === pendingDelete.id ? { ...c, _status: 'deleted' } : c
        ));
        setPendingDelete(null);
    };

    const restoreContact = (id) => {
        setContacts(prev => prev.map(c => 
            c.id === id ? { ...c, _status: 'existing' } : c
        ));
    };

    const setPrimary = (id) => {
        setContacts(prev => prev.map(c => ({
            ...c,
            isPrimary: c.id === id
        })));
    };

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
            // 1. DELETE staged existing items from database
            const deletedItems = contacts.filter(c => c._status === 'deleted' && !String(c.id).startsWith('temp-'));
            
            const deletePromises = deletedItems
                .map(contact => axios.delete(`http://localhost:5000/api/users/emergency-contact/${contact.id}`));

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }

            // 2. UPDATE existing items (for primary changes)
            const existingItems = contacts.filter(c => c._status === 'existing' && !String(c.id).startsWith('temp-'));
            const updatePromises = existingItems.map(contact => 
                axios.put(
                    `http://localhost:5000/api/users/emergency-contact/${contact.id}`,
                    {
                        name: contact.name.trim(),
                        relationship: contact.relationship?.trim() || null,
                        phone: contact.phone?.trim() || null,
                        email: contact.email?.trim() || null,
                        isPrimary: contact.isPrimary
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                )
            );

            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
            }

            // 3. ADD new items to database
            const newItems = contacts.filter(c => c._status === 'new');
            const addPromises = newItems.map(contact => 
                axios.post(
                    `http://localhost:5000/api/users/emergency-contact/${numericPatientId}`,
                    {
                        name: contact.name.trim(),
                        relationship: contact.relationship?.trim() || null,
                        phone: contact.phone?.trim(),
                        email: contact.email?.trim() || null,
                        isPrimary: contact.isPrimary
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                )
            );

            if (addPromises.length > 0) {
                await Promise.all(addPromises);
            }

            setPendingDelete(null);
            await fetchContacts();
            setIsEditing(false);
            
            const deletedCount = deletedItems.length;
            const addedCount = newItems.length;
            
            if (deletedCount > 0 && addedCount > 0) {
                showToast(`${addedCount} contact(s) added, ${deletedCount} deleted`, 'success');
            } else if (addedCount > 0) {
                showToast(`${addedCount} contact(s) added successfully!`, 'success');
            } else if (deletedCount > 0) {
                showToast(`${deletedCount} contact(s) deleted`, 'success');
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

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewContact({ name: '', relationship: '', phone: '', email: '' });
        setContactErrors({ name: '', relationship: '', phone: '', email: '' });
        setTouchedFields({ name: false, relationship: false, phone: false, email: false });
        setPendingDelete(null);
        fetchContacts();
        showToast('Changes discarded', 'info');
    };

    if (parentIsLoading || isLoading) {
        return (
            <div className="p-10 text-center font-bold text-slate-400 italic flex items-center justify-center gap-3">
                <Loader2 size={20} className="animate-spin" />
                Fetching emergency contacts...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Emergency Contacts</h3>
                        <p className="text-sm text-slate-500 font-medium">Who to notify in case of emergency</p>
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
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Check size={16} /> Save Contacts
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <Edit size={16} /> Edit Contacts
                        </button>
                    )}
                </div>
            </div>

            {!patientId && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <p className="text-amber-700 font-bold text-sm">
                        Please complete and save your Personal Information first to manage emergency contacts.
                    </p>
                </div>
            )}

            {/* Contacts List */}
            <div className="space-y-4">
                {contacts.filter(c => c._status !== 'deleted').length === 0 && !isEditing ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                            <Heart size={32} />
                        </div>
                        <h4 className="font-black text-slate-400 text-lg">No emergency contacts recorded</h4>
                        <p className="text-sm text-slate-400 mt-1">Click "Edit Contacts" to add emergency contacts</p>
                    </div>
                ) : (
                    contacts.filter(c => c._status !== 'deleted').map((contact) => (
                        <div key={contact.id} className={`group relative w-full p-6 border rounded-[2rem] transition-all flex justify-between items-center animate-in slide-in-from-left-2 ${
                            contact.isPrimary ? 'bg-rose-50/30 border-rose-100 shadow-sm' : 'bg-white border-slate-100 shadow-sm'
                        }`}>
                            <div className="flex items-center gap-6 text-left">
                                <div className={`hidden md:flex w-14 h-14 rounded-2xl items-center justify-center shrink-0 ${
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
                                        {contact._status === 'new' && (
                                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold">
                                        {contact.relationship && (
                                            <span className="flex items-center gap-1.5 text-slate-600">
                                                <UserPlus size={14} className="text-rose-400" /> {contact.relationship}
                                            </span>
                                        )}
                                        {contact.phone && (
                                            <span className="flex items-center gap-1.5 text-slate-900 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                                                <Phone size={14} className="text-rose-500" /> {contact.phone}
                                            </span>
                                        )}
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
                                        <button 
                                            onClick={() => setPrimary(contact.id)} 
                                            disabled={isSaving || pendingDelete !== null}
                                            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all disabled:opacity-30" 
                                            title="Set as Primary"
                                        >
                                            <Star size={20} />
                                        </button>
                                    )}
                                    {pendingDelete?.id === contact.id ? (
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
                                            onClick={() => stageDelete(contact.id, contact.name)} 
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

                {/* Marked for Deletion */}
                {isEditing && contacts.some(c => c._status === 'deleted') && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                            <div className="h-px flex-1 bg-red-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Marked for Deletion</span>
                            <div className="h-px flex-1 bg-red-200"></div>
                        </div>
                        {contacts.filter(c => c._status === 'deleted').map((contact) => (
                            <div key={contact.id} className="w-full p-6 bg-red-50/60 border border-red-200 rounded-[2rem] flex justify-between items-center opacity-70">
                                <div className="flex items-center gap-6 text-left">
                                    <div className="hidden md:flex w-14 h-14 bg-red-100/50 rounded-2xl items-center justify-center text-red-400">
                                        <Heart size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-red-800/60 text-xl leading-none line-through">{contact.name}</h4>
                                            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                                                Deleting
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm font-bold text-red-600/50">
                                            {contact.relationship && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <UserPlus size={14} /> {contact.relationship}
                                                </span>
                                            )}
                                            {contact.phone && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <Phone size={14} /> {contact.phone}
                                                </span>
                                            )}
                                            {contact.email && (
                                                <span className="flex items-center gap-1.5 line-through">
                                                    <Mail size={14} /> {contact.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => restoreContact(contact.id)}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <RotateCcw size={14} /> Restore
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Contact Form */}
                {isEditing && (
                    <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Maria Clara" 
                                    maxLength={100}
                                    className={`w-full p-4 rounded-2xl border font-bold text-sm outline-none focus:border-rose-500 bg-white transition-all ${
                                        contactErrors.name && touchedFields.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                                    }`}
                                    value={newContact.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                />
                                {contactErrors.name && touchedFields.name && (
                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> {contactErrors.name}
                                    </p>
                                )}
                                <p className="text-[10px] text-slate-400 ml-1">Letters, spaces, hyphens, periods, apostrophes only. Min 2 chars.</p>
                            </div>

                            {/* Relationship */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Relationship</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Spouse, Parent" 
                                    maxLength={50}
                                    className={`w-full p-4 rounded-2xl border font-bold text-sm outline-none bg-white transition-all ${
                                        contactErrors.relationship && touchedFields.relationship ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                                    }`}
                                    value={newContact.relationship}
                                    onChange={e => handleInputChange('relationship', e.target.value)}
                                    onBlur={() => handleBlur('relationship')}
                                />
                                {contactErrors.relationship && touchedFields.relationship && (
                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> {contactErrors.relationship}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="09171234567" 
                                    maxLength={15}
                                    className={`w-full p-4 rounded-2xl border font-bold text-sm outline-none bg-white transition-all ${
                                        contactErrors.phone && touchedFields.phone ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                                    }`}
                                    value={newContact.phone}
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                    onBlur={() => handleBlur('phone')}
                                />
                                {contactErrors.phone && touchedFields.phone && (
                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> {contactErrors.phone}
                                    </p>
                                )}
                                <p className="text-[10px] text-slate-400 ml-1">Numbers only, 7-15 digits.</p>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address (Optional)</label>
                                <input 
                                    type="email"
                                    placeholder="email@example.com" 
                                    maxLength={100}
                                    className={`w-full p-4 rounded-2xl border font-bold text-sm outline-none bg-white transition-all ${
                                        contactErrors.email && touchedFields.email ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                                    }`}
                                    value={newContact.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                />
                                {contactErrors.email && touchedFields.email && (
                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> {contactErrors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={addContact} 
                            disabled={!formValid || isSaving}
                            className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} /> Add Emergency Contact
                                </>
                            )}
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
};

export default EmergencyContact;
