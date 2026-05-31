import React from 'react';
import { Pill, Clock, User, Plus, Trash2, Mic, AlertCircle, ShieldCheckIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';

const Medication = ({ isEditing, medicationManager }) => {
    const {
        medications = [],
        newMed = { name: '', dosage: '', frequency: '', prescribedBy: '' },
        handleInputChange,
        handleAddMedication,
        handleRemoveMedication
    } = medicationManager || {};

    return (
        <div className="space-y-8 text-left animate-in fade-in duration-300">
            
            {/* CURRENT MEDICATIONS SECTION */}
            <section className="space-y-5">
                <div className="flex items-center gap-2.5 text-primary">
                    <Pill size={18} className="text-primary/90" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/90">
                        Current Medications
                    </h4>
                </div>

                {/* CONDITION: EMPTY STATE VS MEDICATION LIST */}
                {medications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {medications.map(med => (
                            <div 
                                key={med.id} 
                                className="bg-card/60 backdrop-blur-sm border border-border/50 p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:border-primary/30 hover:shadow-sm"
                            >
                                <div className="space-y-2">
                                    <h5 className="font-bold text-foreground text-base tracking-tight flex items-center gap-2">
                                        {med.name} 
                                        {med.dosage && (
                                            <span className="text-xs bg-secondary/60 text-secondary-foreground font-semibold px-2 py-0.5 rounded-md">
                                                {med.dosage}
                                            </span>
                                        )}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                                        {med.frequency && (
                                            <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded">
                                                <Clock size={11} className="text-primary/70" /> {med.frequency}
                                            </span>
                                        )}
                                        {med.prescribedBy && (
                                            <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded">
                                                <User size={11} className="text-primary/70" /> {med.prescribedBy}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <button 
                                        onClick={() => handleRemoveMedication(med.id)} 
                                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
                                        title="Remove medication"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center text-center p-10 border border-dashed border-border/60 rounded-2xl bg-card/20 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                            <Pill size={22} />
                        </div>
                        <h5 className="text-sm font-bold text-foreground tracking-tight">No medication records declared</h5>
                        <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
                            Your active prescriptions are empty. Click the edit button above to start documenting your medication schedule.
                        </p>
                    </div>
                )}

                {/* ADD MEDICATION FORM (EDIT MODE ONLY) */}
                {isEditing && (
                    <div className="p-6 border border-border/80 rounded-2xl space-y-4 bg-card/80 shadow-inner group transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Medication Name</label>
                                <input 
                                    placeholder="e.g. Paracetamol" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                    value={newMed.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Dosage</label>
                                <input 
                                    placeholder="e.g. 500mg" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                    value={newMed.dosage}
                                    onChange={e => handleInputChange('dosage', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Frequency</label>
                                <input 
                                    placeholder="e.g. Twice a day" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                    value={newMed.frequency}
                                    onChange={e => handleInputChange('frequency', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Prescribed By</label>
                                <input 
                                    placeholder="e.g. Dr. Ramos" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                    value={newMed.prescribedBy}
                                    onChange={e => handleInputChange('prescribedBy', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button 
                                buttonType="button" 
                                variant="primary" 
                                type="rounded" 
                                leadingIcon={Plus} 
                                onClick={handleAddMedication} 
                                className="text-xs py-2.5 px-4 font-bold shadow-md shadow-primary/10"
                            >
                                Add Medication
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* DUAL-CARD GRID FOR DISCLAIMERS & INTEGRATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* 1. VOICE QUERY SYNC (RAG) */}
                <div className="p-5 border border-primary/10 bg-primary/5 rounded-2xl flex items-start gap-3.5 shadow-sm transition-all duration-300 hover:bg-primary/10">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative">
                        <Mic size={16} className="animate-bounce" style={{ animationDuration: '3s' }} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="space-y-1">
                        <h6 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <ShieldCheckIcon size={13} className="text-primary" />
                            Voice Query AI Synchronization (RAG)
                        </h6>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            The records you provide in this Medication Tab are securely indexed and used as ground truth data for the <strong className="text-primary font-semibold">MediHelp Voice Assistant</strong>. Keeping this updated allows the system to accurately answer context-aware queries about your prescriptions in real time.
                        </p>
                    </div>
                </div>

                {/* 2. MEDICAL DISCLAIMER & NO DIAGNOSIS CLAUSE */}
                <div className="p-5 border border-amber-500/10 bg-amber-500/5 rounded-2xl flex items-start gap-3.5 shadow-sm transition-all duration-300 hover:bg-amber-500/10">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <AlertCircle size={16} />
                    </div>
                    <div className="space-y-1">
                        <h6 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            Informational Purposes Only
                        </h6>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            This platform provides clinical data management and automated voice tracking tools for your convenience. <strong className="text-amber-600 font-semibold">MediHelp does not provide medical diagnoses, clinical advice, or treatment prescriptions.</strong> Always consult a licensed healthcare professional for any medical concerns or prescription adjustments.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Medication;