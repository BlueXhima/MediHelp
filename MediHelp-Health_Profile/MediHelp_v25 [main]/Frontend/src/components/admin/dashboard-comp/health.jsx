import {MonitorCheck, Server, Save, ConciergeBell} from 'lucide-react';

const Health = () => {
    return (
        <div className="space-y-6">
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* System Uptime */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">System Uptime</span>
                        <MonitorCheck className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">99.7%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Percent (%) of time system was online today.
                    </p>
                </div>

                {/* Server Load */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Server Load</span>
                        <Server className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">72%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        CPU usage average.
                    </p>
                </div>

                {/* Memory Usage */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Memory Usage</span>
                        <Save className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">68%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Current memory consumption.
                    </p>
                </div>

                {/* Average Process */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Average Process</span>
                        <ConciergeBell className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">14</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Key system services running.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Health;