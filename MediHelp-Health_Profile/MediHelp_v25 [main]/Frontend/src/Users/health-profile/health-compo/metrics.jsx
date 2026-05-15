// metrics.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Activity, Heart, Scale, Thermometer, 
    Droplets, Edit, X, Check, AlertCircle, Loader2
} from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../../components/ToastMessage';

const VALIDATION_RULES = {
    bloodPressure: {
        required: false,
        pattern: /^\d{2,3}\/\d{2,3}$/,
        patternMessage: 'Format: 120/80',
        sanitize: (val) => val.replace(/[^\d/]/g, '').slice(0, 7)
    },
    heartRate: {
        required: false,
        pattern: /^\d{2,3}$/,
        patternMessage: 'Enter 2-3 digits (e.g., 72)',
        sanitize: (val) => val.replace(/[^0-9]/g, '').slice(0, 3)
    },
    weight: {
        required: false,
        pattern: /^\d{2,3}(\.\d{1,2})?$/,
        patternMessage: 'Enter weight in kg (e.g., 65 or 65.5)',
        sanitize: (val) => val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 6)
    },
    height: {
        required: false,
        pattern: /^\d{2,3}(\.\d{1,2})?$/,
        patternMessage: 'Enter height in cm (e.g., 170 or 170.5)',
        sanitize: (val) => val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 6)
    },
    bloodSugar: {
        required: false,
        pattern: /^\d{2,3}$/,
        patternMessage: 'Enter 2-3 digits (e.g., 95)',
        sanitize: (val) => val.replace(/[^0-9]/g, '').slice(0, 3)
    },
    temperature: {
        required: false,
        pattern: /^\d{2}(\.\d{1,2})?$/,
        patternMessage: 'Enter temperature in °C (e.g., 36.5)',
        sanitize: (val) => val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 5)
    }
};

const validateField = (fieldName, value) => {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule) return { isValid: true, error: '' };
    const trimmedValue = value.trim();
    if (!trimmedValue) return { isValid: true, error: '' };
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

// ============================================
// METRIC CARD — DEFINED OUTSIDE PARENT COMPONENT
// ============================================
const MetricCard = ({ 
    icon, 
    iconColor, 
    bgColor, 
    label, 
    field, 
    unit, 
    placeholder,
    isEditing,
    vitals,
    tempVitals,
    vitalsErrors,
    touchedFields,
    onInputChange,
    onBlur
}) => (
    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
        <div className={`w-14 h-14 ${bgColor} ${iconColor} rounded-2xl flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
        {isEditing ? (
            <div className="w-full space-y-1">
                <input 
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    className={`w-full text-center text-2xl font-black text-slate-900 border-b-2 outline-none bg-transparent transition-all ${
                        vitalsErrors[field] && touchedFields[field] 
                            ? 'border-red-400 focus:border-red-500' 
                            : 'border-blue-100 focus:border-blue-500'
                    }`}
                    value={tempVitals[field]}
                    onChange={e => onInputChange(field, e.target.value)}
                    onBlur={() => onBlur(field)}
                />
                {vitalsErrors[field] && touchedFields[field] && (
                    <p className="text-[10px] text-red-500 font-bold">{vitalsErrors[field]}</p>
                )}
            </div>
        ) : (
            <h2 className="text-3xl font-black text-slate-900 leading-none">
                {vitals[field] || '—'} 
                <span className="text-xs font-bold text-slate-400 block mt-1">{unit}</span>
            </h2>
        )}
    </div>
);

const HealthMetrics = ({ isLoading: parentIsLoading, patientId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [vitals, setVitals] = useState({
        bloodPressure: '',
        heartRate: '',
        weight: '',
        height: '',
        bloodSugar: '',
        temperature: ''
    });

    const [tempVitals, setTempVitals] = useState({ ...vitals });
    const [vitalsErrors, setVitalsErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [formValid, setFormValid] = useState(true);

    const fetchMetrics = useCallback(async () => {
        if (!patientId) {
            console.log('fetchMetrics: No patientId provided');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users/health-metrics/${patientId}`
            );

            console.log('fetchMetrics response:', response.data);

            if (response.data.success && response.data.metrics) {
                const m = response.data.metrics;
                const fetched = {
                    bloodPressure: m.bloodPressure || '',
                    heartRate: m.heartRate ? String(m.heartRate) : '',
                    weight: m.weight ? String(m.weight) : '',
                    height: m.height ? String(m.height) : '',
                    bloodSugar: m.bloodSugar ? String(m.bloodSugar) : '',
                    temperature: m.temperature ? String(m.temperature) : ''
                };
                setVitals(fetched);
                setTempVitals(fetched);
            }
        } catch (error) {
            console.error('Error fetching health metrics:', error.response?.data || error.message);
            showToast('Failed to load health metrics', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        let isValid = true;
        Object.keys(tempVitals).forEach(field => {
            const result = validateField(field, tempVitals[field]);
            if (!result.isValid) isValid = false;
        });
        setFormValid(isValid);
    }, [tempVitals]);

    const handleInputChange = useCallback((field, value) => {
        const sanitized = sanitizeInput(field, value);
        setTempVitals(prev => ({ ...prev, [field]: sanitized }));

        setTouchedFields(prev => {
            if (!prev[field]) return prev;
            const { error } = validateField(field, sanitized);
            setVitalsErrors(prevErrors => ({ ...prevErrors, [field]: error }));
            return prev;
        });
    }, []);

    const handleBlur = useCallback((field) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
        const { error } = validateField(field, tempVitals[field]);
        setVitalsErrors(prev => ({ ...prev, [field]: error }));
    }, [tempVitals]);

    const handleSave = async () => {
        if (!patientId) {
            showToast('No patient ID found. Please save your profile first.', 'error');
            return;
        }

        const numericPatientId = parseInt(patientId, 10);
        if (isNaN(numericPatientId)) {
            showToast('Invalid patient ID detected.', 'error');
            return;
        }

        const errors = {};
        let isValid = true;
        Object.keys(tempVitals).forEach(field => {
            const result = validateField(field, tempVitals[field]);
            errors[field] = result.error;
            if (!result.isValid) isValid = false;
        });

        setVitalsErrors(errors);
        setTouchedFields({ bloodPressure: true, heartRate: true, weight: true, height: true, bloodSugar: true, temperature: true });

        if (!isValid) {
            showToast('Please fix the errors before saving.', 'error');
            return;
        }

        setIsSaving(true);

        try {
            const response = await axios.post(
                `http://localhost:5000/api/users/health-metrics/${numericPatientId}`,
                {
                    bloodPressure: tempVitals.bloodPressure.trim() || null,
                    heartRate: tempVitals.heartRate ? parseInt(tempVitals.heartRate, 10) : null,
                    weight: tempVitals.weight ? parseFloat(tempVitals.weight) : null,
                    height: tempVitals.height ? parseFloat(tempVitals.height) : null,
                    bloodSugar: tempVitals.bloodSugar ? parseInt(tempVitals.bloodSugar, 10) : null,
                    temperature: tempVitals.temperature ? parseFloat(tempVitals.temperature) : null
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setVitals({ ...tempVitals });
                setIsEditing(false);
                setTouchedFields({});
                setVitalsErrors({});
                showToast('Health metrics saved successfully!', 'success');
            }

        } catch (error) {
            console.error('Error saving health metrics:', error);
            showToast(
                error.response?.data?.error || error.response?.data?.details || 'Failed to save health metrics.',
                'error'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setTempVitals({ ...vitals });
        setIsEditing(false);
        setTouchedFields({});
        setVitalsErrors({});
    };

    if (parentIsLoading || isLoading) {
        return (
            <div className="p-10 text-center font-bold text-slate-400 italic flex items-center justify-center gap-3">
                <Loader2 size={20} className="animate-spin" />
                Fetching vitals...
            </div>
        );
    }

    const metricConfigs = [
        { icon: <Activity size={28} />, iconColor: 'text-red-500', bgColor: 'bg-red-50', label: 'Blood Pressure', field: 'bloodPressure', unit: 'mmHg', placeholder: '120/80' },
        { icon: <Heart size={28} />, iconColor: 'text-rose-500', bgColor: 'bg-rose-50', label: 'Heart Rate', field: 'heartRate', unit: 'BPM', placeholder: '72' },
        { icon: <Thermometer size={28} />, iconColor: 'text-orange-500', bgColor: 'bg-orange-50', label: 'Temperature', field: 'temperature', unit: '°C', placeholder: '36.5' },
        { icon: <Droplets size={28} />, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', label: 'Blood Sugar', field: 'bloodSugar', unit: 'mg/dL', placeholder: '95' },
        { icon: <Scale size={28} />, iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50', label: 'Weight', field: 'weight', unit: 'kg', placeholder: '65' },
        { icon: <Activity size={28} />, iconColor: 'text-slate-500', bgColor: 'bg-slate-50', label: 'Height', field: 'height', unit: 'cm', placeholder: '170' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Vital Signs</h3>
                        <p className="text-sm text-slate-500 font-medium">Your latest clinical measurements</p>
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
                                onClick={handleSave} 
                                disabled={isSaving || !formValid}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-500 text-white shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                ) : (
                                    <><Check size={16} /> Save Vitals</>
                                )}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <Edit size={16} /> Update Vitals
                        </button>
                    )}
                </div>
            </div>

            {!patientId && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <p className="text-amber-700 font-bold text-sm">
                        Please complete and save your Personal Information first to manage health metrics.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metricConfigs.map(config => (
                    <MetricCard
                        key={config.field}
                        {...config}
                        isEditing={isEditing}
                        vitals={vitals}
                        tempVitals={tempVitals}
                        vitalsErrors={vitalsErrors}
                        touchedFields={touchedFields}
                        onInputChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                ))}
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0 mt-1">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h5 className="font-black text-slate-900 leading-none mb-2 text-base">Medical Note</h5>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        These vitals are for informational purposes. If you notice any sudden or significant changes, please contact your doctor immediately or use the emergency contact tab.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HealthMetrics;
