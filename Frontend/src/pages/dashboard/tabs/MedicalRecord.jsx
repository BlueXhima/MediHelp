import React from 'react';
import { 
    Activity, AlertTriangle, Scissors, 
    Trash2, Plus, Calendar, Hospital, Loader2,
    Mic, ShieldCheckIcon, AlertCircle, ClipboardList
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { showToast } from '../../../components/ToastMessage';

const MedicalRecord = ({ isEditing, medicalManager }) => {
    const {
        conditions, allergies, surgeries, isLoading,
        newCondition, newAllergy, newSurgery,
        handleConditionChange, handleAllergyChange, handleSurgeryChange,
        addItem, removeItem
    } = medicalManager;

    const handleAddItem = async (type) => {
        const result = await addItem(type);
        if (result && result.success) {
            showToast(result.message, "success");
        } else if (result) {
            showToast(result.message, "error");
        }
    };

    const handleRemoveItem = async (type, id) => {
        const result = await removeItem(type, id);
        if (result && result.success) {
            showToast(result.message, "success");
        } else if (result) {
            showToast(result.message, "error");
        }
    };

    // Helper component para sa Empty States ng sections
    const EmptySection = ({ icon: Icon, label, description }) => (
        <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/20 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Icon size={20} />
            </div>
            <h5 className="text-[13px] font-bold text-foreground tracking-tight">{label}</h5>
            <p className="text-[11px] text-muted-foreground max-w-250px mt-1 leading-relaxed">
                {description}
            </p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40 gap-2 text-muted-foreground">
                <Loader2 size={20} className="animate-spin text-primary" />
                <p className="text-xs uppercase tracking-wider font-bold">Synchronizing Medical Vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 text-left animate-in fade-in duration-300">
            
            {/* --- MEDICAL CONDITIONS --- */}
            <section className="space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                    <Activity size={18} className="text-primary/90" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/90">Medical Conditions</h4>
                </div>

                {conditions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {conditions.map(item => (
                            <div key={item.id} className="bg-card/60 backdrop-blur-sm border border-border/50 p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-foreground text-base tracking-tight">{item.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                                        <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded"><Calendar size={11} /> {item.date ? item.date.split('T')[0] : 'N/A'}</span>
                                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest">{item.status}</span>
                                    </div>
                                </div>
                                {isEditing && (
                                    <button onClick={() => handleRemoveItem('condition', item.id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptySection 
                        icon={Activity} 
                        label="No conditions documented" 
                        description="Keep track of your diagnosed medical conditions for a more accurate health profile."
                    />
                )}

                {isEditing && (
                    <div className="p-6 border border-border/80 rounded-2xl space-y-4 bg-card/80 shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Condition Name</label>
                                <input 
                                    placeholder="e.g. Hypertension" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all"
                                    value={newCondition.name}
                                    onChange={e => handleConditionChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Diagnosis Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all text-muted-foreground"
                                    value={newCondition.date}
                                    onChange={e => handleConditionChange('date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Status</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all text-muted-foreground"
                                    value={newCondition.status}
                                    onChange={e => handleConditionChange('status', e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Recovered">Recovered</option>
                                    <option value="Under Treatment">Under Treatment</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button buttonType="button" variant="primary" type="rounded" leadingIcon={Plus} onClick={() => handleAddItem('condition')} className="text-xs py-2 px-4 shadow-md shadow-primary/10">
                                Add Condition
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* --- ALLERGIES --- */}
            <section className="space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                    <AlertTriangle size={18} className="text-primary/90" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/90">Allergies</h4>
                </div>

                {allergies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allergies.map(item => (
                            <div key={item.id} className="bg-card/60 backdrop-blur-sm border border-border/50 p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-foreground text-base tracking-tight">{item.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-semibold tracking-wide">
                                        <span className="text-destructive font-black uppercase text-[9px] bg-destructive/10 px-2 py-0.5 rounded">Severity: {item.severity}</span>
                                        <span className="text-foreground/70 italic bg-muted/40 px-2 py-0.5 rounded">"{item.reaction}"</span>
                                    </div>
                                </div>
                                {isEditing && (
                                    <button onClick={() => handleRemoveItem('allergy', item.id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptySection 
                        icon={AlertTriangle} 
                        label="No allergies declared" 
                        description="Documenting your allergies is crucial for your safety and automated medical cross-referencing."
                    />
                )}

                {isEditing && (
                    <div className="p-6 border border-border/80 rounded-2xl space-y-4 bg-card/80 shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Allergen</label>
                                <input 
                                    placeholder="e.g. Peanuts" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all"
                                    value={newAllergy.name}
                                    onChange={e => handleAllergyChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Severity Level</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all text-muted-foreground"
                                    value={newAllergy.severity}
                                    onChange={e => handleAllergyChange('severity', e.target.value)}
                                >
                                    <option value="Mild">Mild</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Severe">Severe</option>
                                    <option value="Life-threatening">Life-threatening</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Known Reaction</label>
                                <input 
                                    placeholder="e.g. Rashes, Hives" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all"
                                    value={newAllergy.reaction}
                                    onChange={e => handleAllergyChange('reaction', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button buttonType="button" variant="primary" type="rounded" leadingIcon={Plus} onClick={() => handleAddItem('allergy')} className="text-xs py-2 px-4 shadow-md shadow-primary/10">
                                Add Allergy
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* --- SURGERIES --- */}
            <section className="space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                    <Scissors size={18} className="text-primary/90" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/90">Surgeries & Procedures</h4>
                </div>

                {surgeries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {surgeries.map(item => (
                            <div key={item.id} className="bg-card/60 backdrop-blur-sm border border-border/50 p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-foreground text-base tracking-tight">{item.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                                        <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded"><Calendar size={11} /> {item.date ? item.date.split('T')[0] : 'N/A'}</span>
                                        <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded"><Hospital size={11} /> {item.hospital || 'N/A'}</span>
                                    </div>
                                </div>
                                {isEditing && (
                                    <button onClick={() => handleRemoveItem('surgery', item.id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptySection 
                        icon={Scissors} 
                        label="No surgical history" 
                        description="Record your major surgical procedures to help healthcare providers understand your physical history."
                    />
                )}

                {isEditing && (
                    <div className="p-6 border border-border/80 rounded-2xl space-y-4 bg-card/80 shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Procedure Name</label>
                                <input 
                                    placeholder="e.g. Appendectomy" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all"
                                    value={newSurgery.name}
                                    onChange={e => handleSurgeryChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Date of Procedure</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all text-muted-foreground"
                                    value={newSurgery.date}
                                    onChange={e => handleSurgeryChange('date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Hospital Facility</label>
                                <input 
                                    placeholder="e.g. Cavite Medical Center" 
                                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:border-primary transition-all"
                                    value={newSurgery.hospital}
                                    onChange={e => handleSurgeryChange('hospital', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button buttonType="button" variant="primary" type="rounded" leadingIcon={Plus} onClick={() => handleAddItem('surgery')} className="text-xs py-2 px-4 shadow-md shadow-primary/10">
                                Add Procedure
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* DUAL-CARD GRID FOR DISCLAIMERS & INTEGRATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40">
                
                {/* 1. VOICE QUERY SYNC (RAG) */}
                <div className="p-5 border border-primary/10 bg-primary/5 rounded-2xl flex items-start gap-3.5 shadow-sm transition-all duration-300 hover:bg-primary/10">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative">
                        <Mic size={16} className="animate-bounce" style={{ animationDuration: '3s' }} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="space-y-1">
                        <h6 className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
                            <ShieldCheckIcon size={13} className="text-primary" />
                            Voice Assistant Personalization (RAG)
                        </h6>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            Your medical history, including allergies and chronic conditions, is synchronized as reference data for the <strong className="text-primary font-semibold">MediHelp Voice Assistant</strong>. This enables the AI to provide context-aware safety warnings and personalized health insights based on your unique profile.
                        </p>
                    </div>
                </div>

                {/* 2. MEDICAL DISCLAIMER */}
                <div className="p-5 border border-amber-500/10 bg-amber-500/5 rounded-2xl flex items-start gap-3.5 shadow-sm transition-all duration-300 hover:bg-amber-500/10">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <AlertCircle size={16} />
                    </div>
                    <div className="space-y-1">
                        <h6 className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
                            Personal Health Ledger Disclaimer
                        </h6>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            This record management tool is for informational tracking purposes only. <strong className="text-amber-600 font-semibold">MediHelp does not provide clinical diagnoses or substitute for professional medical records.</strong> Always verify your critical health data with a licensed medical professional before making any health decisions.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MedicalRecord;