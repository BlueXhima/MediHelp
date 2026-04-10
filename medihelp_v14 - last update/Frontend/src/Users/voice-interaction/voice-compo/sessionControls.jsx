import React from 'react';
import { Timer, Clock, Save, Calendar, Share2, Printer, Download, Mail } from 'lucide-react';

const SessionControls = ({ 
    sessionDuration, 
    onSaveSession, 
    onScheduleAppointment, 
    onShareSession 
}) => {
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <Timer size={20} className="mr-3 text-accent" />
                    Session Controls
                </h3>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Clock size={16} />
                    <span>{formatDuration(sessionDuration)}</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Save Session */}
                <button
                    onClick={onSaveSession}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 
                        text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <Save size={16} className="mr-2" />
                    Save to Health Records
                </button>

                {/* Schedule Appointment */}
                <button
                    onClick={onScheduleAppointment}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white 
                        hover:bg-blue-600 transition-colors"
                >
                    <Calendar size={16} className="mr-2" />
                    Find Doctor Nearby
                </button>

                {/* Share Session */}
                <button
                    onClick={onShareSession}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 
                        text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <Share2 size={16} className="mr-2" />
                    Share with Healthcare Provider
                </button>
            </div>

            {/* Session Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-text-secondary mb-3">Session Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-blue">8</p>
                        <p className="text-xs text-text-secondary">Questions Asked</p>
                    </div>
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-primary/500">3</p>
                        <p className="text-xs text-text-secondary">Topics Covered</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-text-secondary mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => console.log('Export action triggered')}
                        className="flex items-center px-4 py-2 gap-2 rounded-md border border-gray-300 
                            text-gray-700 hover:bg-primary hover:text-white transition-colors"
                    >
                        <Download size={16} className="mr-2" />
                        Export
                    </button>
                    <button
                        onClick={() => console.log('Print action triggered')}
                        className="flex items-center px-4 py-2 gap-2 rounded-md border border-gray-300 
                            text-gray-700 hover:bg-primary hover:text-white transition-colors"
                    >
                        <Printer size={16} className="mr-2" />
                        Print
                    </button>
                    <button
                        onClick={() => console.log('Email action triggered')}
                        className="flex items-center px-4 py-2 gap-2 rounded-md border border-gray-300 
                            text-gray-700 hover:bg-primary hover:text-white transition-colors"
                    >
                        <Mail size={16} className="mr-2" />
                        Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionControls;