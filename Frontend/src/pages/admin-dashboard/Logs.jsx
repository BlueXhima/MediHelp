import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Trash2, Shield, Clock } from 'lucide-react';

const Logs = () => {
  // Mock data for logs
  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2026-05-26 14:30:05', level: 'info', message: 'User "Admin" logged into the system', icon: <Shield size={16} /> },
    { id: 2, timestamp: '2026-05-26 13:15:22', level: 'warning', message: 'Failed login attempt detected from IP 192.168.1.45', icon: <AlertCircle size={16} /> },
    { id: 3, timestamp: '2026-05-26 10:05:00', level: 'info', message: 'System database backup completed', icon: <CheckCircle size={16} /> },
    { id: 4, timestamp: '2026-05-25 09:45:12', level: 'info', message: 'User "JohnDoe" updated profile information', icon: <Shield size={16} /> },
  ]);

  const [saved, setSaved] = useState(false);

  const handleClearLogs = () => {
    setLogs([]); // Clear the logs
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">System Activity Logs</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Review recent system events and security alerts</p>
          </div>
          <button 
            onClick={handleClearLogs} 
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
          >
            <Trash2 size={16} />
            Clear All Logs
          </button>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto border border-[hsl(var(--border))] rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2 text-[hsl(var(--foreground))]">
                      <Clock size={14} className="text-[hsl(var(--muted-foreground))]" />
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        log.level === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--foreground))]">{log.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-[hsl(var(--muted-foreground))] italic">
                    No logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-green-200">
            <CheckCircle size={16} />
            System logs have been cleared.
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;