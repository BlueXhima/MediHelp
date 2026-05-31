import React, { useEffect } from 'react';
import { FileText, ShieldAlert, Pill, Loader2, Heart, Scale } from 'lucide-react';

// GUMAGAMIT NG MGA CUSTOM HOOKS MULA SA ARCHITECTURE NG PROFILE
import { useMedicalManager } from '../hooks/useMedicalManager';
import { useMedicationManager } from '../hooks/useMedicationManager';
import { useMetricsManager } from '../hooks/useMetricsManager';

const HealthRecord = ({ userData, onViewChange }) => {
    // Kunin ang Patient ID mula sa loaded userData (or session context mo)
        const patientId = userData?.id || 1; // Gawing dynamic base sa Auth/User data model mo

    // 1. INITIALIZE ANG MGA HOOK MANAGERS
    const medicalManager = useMedicalManager(patientId);
    const medicationManager = useMedicationManager(patientId);
    const metricsManager = useMetricsManager(patientId);

    // I-destructure ang mga kailangang arrays at objects mula sa mga managers
    const { conditions = [], allergies = [], isLoading: medicalLoading } = medicalManager;
    const { medications = [], isLoading: medsLoading } = medicationManager;
    const { vitals = null, isLoading: metricsLoading } = metricsManager;

    // Isang indicator habang nag-fe-fetch ang mga managers
    const isLoading = medicalLoading || medsLoading || metricsLoading;

    useEffect(() => {
        onViewChange('Health Record'); // Ito ay papasa sa Dashboard
    }, [onViewChange]);

    // Loading screen ui fallback habang kumukuha ng records
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wide uppercase font-bold">
                    Loading Clinical Data Streams...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-left animate-fade-in">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-foreground">Medical Health Records</h1>
                    <p className="text-xs text-foreground/50 font-medium">Manage and view your official medical documents and history.</p>
                </div>
            </div>

            {/* Vitals Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Pressure and Heart Rate Card */}
                <div className="bg-card p-5 rounded-3xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                        <Heart size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Blood Pressure / HR</p>
                        <p className="text-base font-black text-foreground">
                            {vitals?.bloodPressure || 'N/A'} mmHg { vitals?.heartRate ? `• ${vitals.heartRate} bpm` : '' }
                        </p>
                    </div>
                </div>

                {/* Allergies Summary Card */}
                <div className="bg-card p-5 rounded-3xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Registered Allergies</p>
                        <p className="text-base font-black text-foreground truncate max-w-45">
                            {/* TINAMAAN: Ginamit ang a.name dahil ito ang nakalagay sa MedicalRecord.jsx mo */}
                            {allergies.length > 0 
                                ? allergies.map(a => a.name || a.allergyName || a.AllergenName).join(', ') 
                                : 'None Reported'}
                        </p>
                    </div>
                </div>

                {/* Weight Card */}
                <div className="bg-card p-5 rounded-3xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Scale size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Last Logged Weight</p>
                        <p className="text-base font-black text-foreground">
                            {vitals?.weight ? `${vitals.weight} kg` : 'Not Set'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Data Layout Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Area Panel: Diagnostics Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-3xl overflow-hidden">
                        <div className="p-5 border-b border-border/50">
                            <h3 className="text-sm font-black text-foreground">Medical Conditions & Diagnosis</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {conditions.length === 0 ? (
                                <div className="p-8 text-center text-xs text-foreground/40 font-medium">
                                    No diagnosed medical conditions recorded in your ledger.
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-primary/5 text-[10px] font-black uppercase tracking-wider text-foreground/50">
                                            <th className="p-4 pl-6">Condition Name</th>
                                            <th className="p-4">Date Diagnosed</th>
                                            <th className="p-4 text-right pr-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-xs font-medium">
                                        {conditions.map((cond) => (
                                            <tr key={cond.id || cond.ConditionID} className="hover:bg-primary/5 transition-colors">
                                                <td className="p-4 pl-6 flex items-center gap-3">
                                                    <div className="p-2 bg-foreground/5 text-foreground/60 rounded-xl">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="font-bold text-foreground">
                                                        {cond.name || cond.conditionName || cond.ConditionName}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-foreground/60">
                                                    {/* TINAMAAN: cond.date or cond.diagnosisDate */}
                                                    {cond.date || cond.diagnosisDate || cond.DiagnosisDate ? new Date(cond.date || cond.diagnosisDate || cond.DiagnosisDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4 text-right pr-6">
                                                    <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${
                                                        (cond.status || cond.Status) === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                        (cond.status || cond.Status) === 'Under Treatment' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                        {cond.status || cond.Status || 'Active'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Area Panel: Current Active Maintenance Prescriptions */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-5 space-y-4">
                        <div className="border-b border-border/50 pb-3">
                            <h3 className="text-sm font-black text-foreground">Current Prescriptions</h3>
                        </div>

                        <div className="space-y-3 max-h-87.5 overflow-y-auto scrollbar-custom pr-1">
                            {medications.length === 0 ? (
                                <div className="text-center py-6 text-xs text-foreground/40 font-medium">
                                    No active maintenance or prescriptions found.
                                </div>
                            ) : (
                                medications.map((med) => (
                                    <div 
                                        key={med.id || med.MedicationID} 
                                        className="p-3 bg-background border border-border rounded-2xl flex items-start gap-3 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="p-2.5 bg-primary/5 text-primary rounded-xl shrink-0">
                                            <Pill size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1 leading-tight">
                                            {/* TINAMAAN: Ginamit ang med.name base sa ginawa mo sa Medication.jsx */}
                                            <p className="text-xs font-black text-foreground truncate">
                                                {med.name || med.medicationName || med.MedicationName}
                                            </p>
                                            <p className="text-[11px] text-foreground/50 font-medium mt-0.5">
                                                {med.dosage || med.Dosage} • {med.frequency || med.Frequency}
                                            </p>
                                            {(med.prescribedBy || med.PrescribedBy) && (
                                                <p className="text-[9px] text-slate-400 mt-1 font-medium">
                                                    Dr. {med.prescribedBy || med.PrescribedBy}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HealthRecord;