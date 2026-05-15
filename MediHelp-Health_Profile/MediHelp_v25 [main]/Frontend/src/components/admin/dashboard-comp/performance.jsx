import React from 'react'
import {Goal, Clock, AudioLines, Ear} from 'lucide-react';

const Performance = () => {
    return (
        <div className="space-y-6">
            {/* Performance Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Voice Accuracy */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Average Accuracy</span>
                        <Goal className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">94.5%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Overall success rate of recognized commands.
                    </p>
                </div>

                {/* Average Response Time */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Average Response Time</span>
                        <Clock className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">1.5s</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Average time between user command and system reply.
                    </p>
                </div>

                {/* Total Commands */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Total Commands</span>
                        <AudioLines className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">3,250</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Total commands successfully processed today.
                    </p>
                </div>

                {/* Misheard Ratio */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Misheard Ratio</span>
                        <Ear className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">3.1%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Percentage of misinterpreted commands.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Performance;