import React from 'react';
import { CheckCircle, BarChart2, Activity, Clock, BookOpen, AlertCircle } from 'lucide-react';

const VoiceMetricCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="bg-[hsl(var(--card))] rounded-3xl p-6 shadow-sm border border-[hsl(var(--border))] hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{title}</h3>
      <div className={`${color} p-3 rounded-xl`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">{value}</p>
    <p className="text-xs text-[hsl(var(--muted-foreground))]">{description}</p>
  </div>
);

const Insights = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">System Insights</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">High-level performance overview and system health.</p>
      </div>

      {/* Voice Performance */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Voice Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <VoiceMetricCard title="Average Accuracy" value="94.5%" description="Success rate of recognized commands" icon={CheckCircle} color="bg-emerald-500" />
          <VoiceMetricCard title="Avg Response Time" value="1.5s" description="Time between command and reply" icon={Clock} color="bg-sky-500" />
          <VoiceMetricCard title="Total Commands" value="850" description="Commands processed today" icon={BarChart2} color="bg-amber-500" />
          <VoiceMetricCard title="Misheard Ratio" value="3.1%" description="Percentage of misinterpreted commands" icon={AlertCircle} color="bg-rose-500" />
        </div>
      </section>

      {/* System Health */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <VoiceMetricCard title="System Uptime" value="99.9%" description="Online time today" icon={CheckCircle} color="bg-green-500" />
          <VoiceMetricCard title="CPU Usage" value="45%" description="Average CPU usage" icon={BarChart2} color="bg-orange-500" />
          <VoiceMetricCard title="Memory Usage" value="68%" description="Current consumption" icon={Activity} color="bg-red-500" />
          <VoiceMetricCard title="Avg Process Time" value="120ms" description="Request processing time" icon={Clock} color="bg-blue-500" />
        </div>
      </section>
    </div>
  );
};

export default Insights;