import React from 'react';
import { motion } from 'framer-motion';
import { 
    ClipboardList, Activity, Calendar, Clock, 
    ChevronRight, FileText, ShieldCheck, TrendingUp 
} from 'lucide-react';

const HealthRecords = ({ conversations }) => {
    // Kinukuha lang natin ang huling 3 concerns mula sa chat history bilang "Recent Activity"
    const recentConcerns = conversations.slice(-3).reverse();

    const stats = [
        { label: 'Total Consultations', value: conversations.length, icon: <MessageSquare size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Health Score', value: 'Good', icon: <Activity size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Data Security', value: 'Encrypted', icon: <ShieldCheck size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' }
    ];

    return (
        <div className="p-4 max-w-5xl mx-auto text-left">
            {/* Header Section */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Personal Health Records</h3>
                <p className="text-gray-500 text-sm italic">Automated summary based on your AI interactions.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-500" />
                            Recent Activity
                        </h4>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {recentConcerns.length > 0 ? (
                            recentConcerns.map((chat, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={chat.id} 
                                    className="relative pl-8 pb-6 border-l-2 border-gray-100 last:border-0"
                                >
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm"></div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                                        <p className="text-xs font-bold text-indigo-500 mb-1">Consultation #{chat.id}</p>
                                        <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1">"{chat.userMessage}"</p>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
                                            {chat.aiResponse}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">No recent records found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Insights Sidebar */}
                <div className="space-y-6">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" />
                        AI Health Insights
                    </h4>
                    
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-100">
                        <FileText size={24} className="mb-4 opacity-80" />
                        <h5 className="font-bold mb-2">Smart Summary</h5>
                        <p className="text-xs leading-relaxed opacity-90">
                            Based on your recent queries, you are frequently asking about 
                            <span className="font-bold"> respiratory health</span>. 
                            Consider tracking your symptoms daily for a more accurate assessment.
                        </p>
                        <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/20">
                            Generate Report
                        </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50">
                        <h5 className="text-amber-700 font-bold text-sm mb-1">Health Tip of the Day</h5>
                        <p className="text-xs text-amber-600 leading-relaxed">
                            Stay hydrated! Drinking at least 8 glasses of water daily helps maintain energy and focus.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder icon if MessageSquare is not imported in your file
const MessageSquare = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

export default HealthRecords;