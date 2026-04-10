import React from 'react'
import { Server, Users, Filter, ArrowUpDown, ArrowUpRight, 
    MoreVertical, User, Eye, BookOpen, 
    TableOfContents, ChevronDown, 
    Clock, AudioLines, Goal } from 'lucide-react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    Legend,
    ComposedChart,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Sample data for charts
const userGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 200 },
    { month: 'Mar', users: 320 },
    { month: 'Apr', users: 400 },
    { month: 'May', users: 500 },
];

const healthData = [
    { day: 'Mon', records: 30 },
    { day: 'Tue', records: 45 },
    { day: 'Wed', records: 60 },
    { day: 'Thu', records: 50 },
    { day: 'Fri', records: 70 },
];

const engagementData = [
    { type: 'Likes', value: 400 },
    { type: 'Comments', value: 300 },
    { type: 'Shares', value: 300 },
    { type: 'Views', value: 200 },
];

const recentLearningActivityData = [
    {
        id: 1,
        activity: "Completed Nutrition Module",
        user: "Valdo Biro",
        details: "Module 1: Healthy Eating",
        date: "Mar 5, 2026",
    },
    {
        id: 2,
        activity: "Watched First Aid Video",
        user: "MakMak Taba",
        details: "Video: CPR Basics",
        date: "Mar 4, 2026",
    },
    {
        id: 3,
        activity: "Passed Preventive Care Quiz",
        user: "ChiChi Bureche",
        details: "Quiz: Preventive Measures",
        date: "Mar 3, 2026",
    },
    {
        id: 4,
        activity: "Attended Health Webinar",
        user: "Baldado",
        details: "Webinar: Mental Health Awareness",
        date: "Mar 2, 2026",
    },
    {
        id: 5,
        activity: "Completed Fitness Challenge",
        user: "Kulas Palpak",
        details: "Challenge: 10k Steps",
        date: "Mar 1, 2026",
    },
];

const Overview = () => {
    return (
        <div className="space-y-6">
            {/* Overview Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Voice Accuracy */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Voice Accuracy</span>
                        <Goal className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">92%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Recognition accuracy across all processed commands.
                    </p>
                </div>

                {/* System Uptime */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">System Uptime</span>
                        <Clock className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">99.8%</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Stable uptime over the last 30 days.
                    </p>
                </div>

                {/* Active Users */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Active Users</span>
                        <Users className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">320</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Currently logged in and active in the system.
                    </p>
                </div>

                {/* Commands Processed */}
                <div className="bg-card rounded-lg shadow p-6 flex flex-col h-48 text-left">
                    <div className="flex items-start justify-between">
                        <span className="font-semibold md:text-lg break-words">Commands Processed</span>
                        <AudioLines className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-2xl font-bold">12,450</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Total commands executed successfully this month.
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6">
                {/* Health Data Trends Chart */}
                <div className="bg-card rounded-lg shadow p-6 text-left w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Server className="text-primary h-6 w-6" />
                            <h2 className="text-lg font-semibold">Health Data Trends</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                <Filter className="h-4 w-4 mr-1" /> Filter
                            </button>
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
                            </button>
                            <button className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-2">
                        <h3 className="text-4xl font-semibold">
                            12.250 Records
                        </h3>
                        <span className="inline-flex items-center w-fit px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            15.8% 
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                        </span>
                        <p className="text-sm text-gray-500 mb-4">
                            Growth rate compared to last month.
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={healthData}>
                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="records" barSize={30} fill="#82ca9d" />
                            <Line type="monotone" dataKey="records" stroke="#16a34a" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-2">Summary</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Highest activity recorded on Wednesday (60 records)</li>
                            <li>• Lowest activity recorded on Monday (30 records)</li>
                            <li>• Average daily records: 51</li>
                        </ul>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-card rounded-lg shadow p-6 text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <User className="text-primary h-6 w-6" />
                            <h2 className="text-lg font-semibold">User Growth</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                <Filter className="h-4 w-4 mr-1" /> Filter
                            </button>
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
                            </button>
                            <button className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-2">
                        <h3 className="text-4xl font-semibold">
                            500 Users
                        </h3>
                        <span className="inline-flex items-center w-fit px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            15.2%
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                        </span>
                        <p className="text-sm text-gray-500 mb-4">
                            + 80 users compared to last month
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#2563eb"
                                strokeWidth={2}
                                label={{ position: 'top' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-2">Summary</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Highest growth recorded in May (500 users)</li>
                            <li>• Steady increase from January (150 users) to April (400 users)</li>
                            <li>• Average monthly growth: +87 users</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pie Chart and Table */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 gap-6 mt-6">
                {/* Left Column - Pie Chart */}
                <div className="bg-card rounded-lg shadow p-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <TableOfContents className="text-primary h-6 w-6" />
                            <h2 className="text-lg font-semibold">Content Engagement</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                Monthly <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium break-words">
                            Total Engagements: 1,000
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Active Users: 320
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            ↑ 8% vs last month
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={engagementData}
                                dataKey="value"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {engagementData.map((entry, index) => {
                                    const colors = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea", "#ef4444"];
                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                })}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} engagements`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>Most engaged format: <span className="font-semibold">Articles (45%)</span></p>
                        <p>Least engaged format: <span className="font-semibold">Quizzes (15%)</span></p>
                        <p className="text-green-600 font-medium">+12% engagement vs last month</p>
                    </div>
                </div>

                {/* Right Column - Table */}
                <div className="bg-card rounded-lg shadow p-6 text-left w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="text-primary h-6 w-6" />
                            <h2 className="text-lg font-semibold">Recent Learning Activity</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 border rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                                <Eye className="h-4 w-4 mr-1" /> See All
                            </button>
                            <button className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-gray-600 mt-4 border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-center">
                                    <input type="checkbox" />
                                </th>
                                <th className="py-3 px-4">Activity</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Details</th>
                                <th className="py-3 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLearningActivityData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 border-b">
                                    <td className="py-3 px-4 text-center">
                                    <input type="checkbox" />
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{item.activity}</td>
                                    <td className="py-3 px-4">{item.user}</td>
                                    <td className="py-3 px-4">{item.details}</td>
                                    <td className="py-3 px-4 text-gray-500">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;