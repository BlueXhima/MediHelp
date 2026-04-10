import React, { useState } from 'react';
import Overview from './overview';
import Performance from './performance';
import Activity from './activity';
import SystemHealth from './health';

const PanelTabs = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <Overview />;
            case 'Voice Performance':
                return <Performance />;
            case 'User Activity':
                return <Activity />;
            case 'System Health':
                return <SystemHealth />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex space-x-4 justify-between md:justify-start cursor">
                {['Overview', 'Voice Performance', 'User Activity', 'System Health'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
                            activeTab === tab
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground bg-transparent border border-border hover:bg-primary hover:text-primary-foreground'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default PanelTabs;