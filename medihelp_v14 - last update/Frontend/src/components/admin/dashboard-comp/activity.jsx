import {Users, User} from 'lucide-react';

const Activity = () => {
    return (
        <div className="space-y-6">
            {/* User Activity Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Active User */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Active User</span>
                        <Users className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">125</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Users who issued at least one voice command.
                    </p>
                </div>

                {/* New User */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">New User</span>
                        <Users className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">25</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Accounts created today.
                    </p>
                </div>

                {/* Total Season */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Total Season</span>
                        <User className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">133</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Number of distinct login or voice sessions today.
                    </p>
                </div>

                {/* Avg. Command Every User */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-md break-words">Avg. Command Every User</span>
                        <User className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">12.8%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Engagement indicator per active user.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Activity;