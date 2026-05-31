import React from 'react';
import { Activity, Heart, Scale, Thermometer, Droplets, Loader2, AlertCircle, HelpCircle } from 'lucide-react';

const HealthMetrics = ({ isEditing, metricsManager }) => {
    // Sinasalo ang states mula sa ipinasang custom hook manager
    const { vitals, handleMetricChange, isLoading } = metricsManager;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-xs font-bold tracking-wider uppercase">Fetching latest vitals...</span>
            </div>
        );
    }

    // Helper para i-verify kung blanko o walang laman ang lahat ng fields (para sa Empty State trigger)
    const hasNoData = !vitals || Object.values(vitals).every(val => !val || String(val).trim() === '');

    const metricCards = [
        { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: 'text-primary bg-primary/10' },
        { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'text-red-500 bg-red-500/10' },
        { key: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: 'text-indigo-500 bg-indigo-500/10' },
        { key: 'height', label: 'Height', unit: 'cm', icon: Scale, color: 'text-emerald-500 bg-emerald-500/10' },
        { key: 'bloodSugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplets, color: 'text-amber-500 bg-amber-500/10' },
        { key: 'temperature', label: 'Body Temp', unit: '°C', icon: Thermometer, color: 'text-sky-500 bg-sky-500/10' },
    ];

    return (
        <div className="space-y-8 text-left">
            {/* HEADER */}
            <div className="flex items-center gap-2.5 text-primary">
                <Activity size={16} strokeWidth={2.5} />
                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Latest Health Metrics</h4>
            </div>

            {/* MAIN CONTENT AREA: EMPTY STATE VS METRIC GRID */}
            {hasNoData && !isEditing ? (
                /* 1. EMPTY STATE INTERFACE (Kapag walang data at hindi pa nag-eedit) */
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/80 rounded-2xl bg-card/30 space-y-3.5 text-center transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/80 border border-border/40">
                        <HelpCircle size={22} strokeWidth={1.5} />
                    </div>
                    <div className="max-w-340px space-y-1">
                        <h6 className="text-[13px] font-bold text-foreground tracking-tight">No Vitals Recorded Yet</h6>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Your personal dashboard is currently blank. Click the "Edit Profile" button to record your baseline metrics.
                        </p>
                    </div>
                </div>
            ) : (
                /* 2. METRIC CARDS GRID (Kung may data o kaya naman ay kasalukuyang naka-Edit Mode) */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {metricCards.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <div key={metric.key} className="bg-card border border-border/60 p-5 rounded-2xl space-y-3 card-hover flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.label}</span>
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${metric.color}`}>
                                        <Icon size={14} />
                                    </div>
                                </div>

                                <div>
                                    {isEditing ? (
                                        <div className="flex items-baseline gap-1.5 border-b border-border focus-within:border-primary transition-colors pb-1">
                                            <input 
                                                type="text"
                                                className="w-full bg-transparent text-xl font-bold font-mono text-foreground outline-none"
                                                value={vitals[metric.key] || ''}
                                                onChange={e => handleMetricChange(metric.key, e.target.value)}
                                                placeholder="--"
                                            />
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{metric.unit}</span>
                                        </div>
                                    ) : (
                                        <h3 className="text-2xl font-black text-foreground tracking-tight font-mono">
                                            {vitals[metric.key] || '--'}
                                            {vitals[metric.key] && (
                                                <span className="text-[11px] font-bold text-slate-400 tracking-normal uppercase ml-1.5">{metric.unit}</span>
                                            )}
                                        </h3>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 3. WARNING / PAALALA BANNER (Sychronization Note) */}
            <div className="p-5 border border-amber-500/10 bg-amber-500/5 rounded-2xl flex items-start gap-3.5 shadow-sm transition-all duration-300 hover:bg-amber-500/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle size={16} />
                </div>
                <div className="space-y-1">
                    <h6 className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
                        Manual Entry Notice
                    </h6>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        This tab is <strong className="text-amber-600 font-semibold">not connected to any smartwatches, fitness trackers, or medical wearables.</strong> All statistics displayed here are logs generated strictly via continuous manual inputs. Please make sure to enter verified data for accurate dashboard mapping.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default HealthMetrics;