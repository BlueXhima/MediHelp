import React, { useState } from 'react';
import { 
    Activity, Heart, Scale, Thermometer, 
    Droplets, Edit, X, Check, AlertCircle 
} from 'lucide-react';

const HealthMetrics = ({ isLoading }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Simpleng state: Isang object lang para sa latest readings
    const [vitals, setVitals] = useState({
        bloodPressure: '120/80',
        heartRate: '72',
        weight: '65',
        height: '170',
        bloodSugar: '95',
        temperature: '36.5'
    });

    const [tempVitals, setTempVitals] = useState({ ...vitals });

    const handleSave = () => {
        setVitals({ ...tempVitals });
        setIsEditing(false);
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400 italic">Updating vitals...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Vital Signs</h3>
                        <p className="text-sm text-slate-500 font-medium">Your latest clinical measurements</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-500 text-white shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all cursor-pointer">
                                <Check size={16} /> Save Vitals
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                            <Edit size={16} /> Update Vitals
                        </button>
                    )}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Blood Pressure */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                        <Activity size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Blood Pressure</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.bloodPressure}
                            onChange={(e) => setTempVitals({...tempVitals, bloodPressure: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.bloodPressure} <span className="text-xs font-bold text-slate-400 block mt-1">mmHg</span></h2>
                    )}
                </div>

                {/* Heart Rate */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                        <Heart size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Heart Rate</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.heartRate}
                            onChange={(e) => setTempVitals({...tempVitals, heartRate: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.heartRate} <span className="text-xs font-bold text-slate-400 block mt-1">BPM</span></h2>
                    )}
                </div>

                {/* Body Temperature */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                        <Thermometer size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Temperature</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.temperature}
                            onChange={(e) => setTempVitals({...tempVitals, temperature: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.temperature} <span className="text-xs font-bold text-slate-400 block mt-1">°C</span></h2>
                    )}
                </div>

                {/* Blood Sugar */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <Droplets size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Blood Sugar</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.bloodSugar}
                            onChange={(e) => setTempVitals({...tempVitals, bloodSugar: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.bloodSugar} <span className="text-xs font-bold text-slate-400 block mt-1">mg/dL</span></h2>
                    )}
                </div>

                {/* Weight */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                        <Scale size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Weight</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.weight}
                            onChange={(e) => setTempVitals({...tempVitals, weight: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.weight} <span className="text-xs font-bold text-slate-400 block mt-1">kg</span></h2>
                    )}
                </div>

                {/* Height */}
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
                        <Activity size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Height</span>
                    {isEditing ? (
                        <input 
                            className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-100 outline-none focus:border-blue-500"
                            value={tempVitals.height}
                            onChange={(e) => setTempVitals({...tempVitals, height: e.target.value})}
                        />
                    ) : (
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{vitals.height} <span className="text-xs font-bold text-slate-400 block mt-1">cm</span></h2>
                    )}
                </div>
            </div>

            {/* Note Card */}
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
}

export default HealthMetrics;