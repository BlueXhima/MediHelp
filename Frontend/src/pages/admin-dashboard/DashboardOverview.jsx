import React, { useState } from 'react';
import { Users, Activity, UserPlus, ArrowRight, Settings, FileText, UserCog, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DashboardOverview = () => {
    const [timeframe, setTimeframe] = useState('7d');

    // Data points
    const healthData7d = [
        { name: 'Sun', value: 35 }, { name: 'Mon', value: 58 }, 
        { name: 'Tue', value: 35 }, { name: 'Wed', value: 50 }, { name: 'Thu', value: 15 }, 
        { name: 'Fri', value: 35 }, { name: 'Sat', value: 55 }
    ];

    const healthData30d = [
        { name: 'Week 1', value: 40 }, { name: 'Week 2', value: 60 }, 
        { name: 'Week 3', value: 45 }, { name: 'Week 4', value: 80 }
    ];

    // Switch data based on state
    const displayData = timeframe === '7d' ? healthData7d : healthData30d;

    const users = [
        { name: 'John Doe', status: 'Active', color: 'text-success' },
        { name: 'Jane Smith', status: 'Pending', color: 'text-amber-500' },
        { name: 'Bob Ross', status: 'Active', color: 'text-success' }
    ];
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* 3 Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[ 
                        {title: "Total Users", value: "1,284", icon: <Users size={16}/>}, 
                        {title: "Health Index", value: "98%", icon: <Activity size={16}/>}, 
                        {title: "New Users", value: "12", icon: <UserPlus size={16}/>} 
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border p-5 rounded-2xl">
                            <p className="text-[10px] text-foreground/50 uppercase tracking-wider">{s.title}</p>
                            <p className="text-xl font-bold mt-1 text-foreground">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Line Graph */}
                <div className="bg-card border border-border rounded-2xl p-6 h-96 flex flex-col">
                    {/* Header with Title and Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-foreground">Medi Voice Query</h3>
                        
                        {/* Pill-Shaped Selection Switch */}
                        <div className="flex p-1 bg-secondary rounded-full border border-border">
                            {['7d', '30d'].map((t) => (
                                <button 
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all duration-300 ${
                                        timeframe === t 
                                        ? 'bg-background text-primary shadow-sm' 
                                        : 'text-foreground/40 hover:text-foreground'
                                    }`}
                                >
                                    {t === '7d' ? 'LAST 7 DAYS' : 'LAST 30 DAYS'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                                data={displayData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    intervalue={0} // Pwersahin na ipakita LAHAT ng labels
                                    padding={{ left: 20, right: 10 }}
                                    tick={{fontSize: 10, fill: 'hsl(var(--foreground))', opacity: 0.5}} 
                                />
                                <Tooltip 
                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} // Naglalagay ng vertical line pag hover
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))', 
                                        border:'1px solid hsl(var(--border))', 
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={3}
                                    fill="url(#colorvalue)" 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-foreground">Recent User Activity</h3>
                        <button className="text-[10px] text-primary font-bold hover:underline">VIEW ALL</button>
                    </div>
                    
                    <div className="overflow-x-auto border border-border rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/30 text-[10px] uppercase text-foreground/60 font-bold">
                                    <th className="px-4 py-3 border-b border-r border-border">User</th>
                                    <th className="px-4 py-3 border-b border-r border-border">Status</th>
                                    <th className="px-4 py-3 border-b border-border text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-4 py-3 border-b border-r border-border text-xs font-semibold text-foreground">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 border-b border-r border-border">
                                            <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                                                user.color === 'text-success' 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-border text-right">
                                            <button className="text-foreground/40 hover:text-primary transition-colors">
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-primary p-6 rounded-2xl text-center text-primary-foreground">
                    <h3 className="font-bold">System Status</h3>
                    <p className="text-xs opacity-80 mt-2">All modules running smoothly</p>
                    <div className="mt-4 p-4 bg-black/20 rounded-xl text-2xl font-black">99.9%</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl">
                    <h3 className="text-xs font-bold mb-4 text-foreground uppercase tracking-wider">Quick Shortcuts</h3>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: 'Manage Users', icon: <UserCog size={16} /> },
                            { label: 'System Logs', icon: <FileText size={16} /> },
                            { label: 'Settings', icon: <Settings size={16} /> }
                        ].map((item, i) => (
                            <button 
                                key={i} 
                                className="group w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-foreground/40 group-hover:text-primary transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
                                        {item.label}
                                    </span>
                                </div>
                                <ChevronRight 
                                    size={14} 
                                    className="text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" 
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardOverview;