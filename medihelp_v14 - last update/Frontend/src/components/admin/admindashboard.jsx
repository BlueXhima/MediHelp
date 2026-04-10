import PanelTabs from './dashboard-comp/PanelTabs';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between text-left flex-row">
                {/* Left side */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1 max-w-screen-sm leading-relaxed">
                    Welcome to the MediHelp Admin Dashboard. Here you can monitor system health,
                    track user activity, and review performance insights.
                    </p>
                </div>

                {/* Right side */}
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors">
                    Generate Report
                </button>
            </div>

            {/* Panel Section Tabs */}
            <PanelTabs /> 
        </div>
    );
};

export default Dashboard;