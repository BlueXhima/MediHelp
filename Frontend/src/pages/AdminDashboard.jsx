import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../components/ToastMessage";
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { userService } from '../services/userService';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';


import DashboardOverview from './admin-dashboard/DashboardOverview';
import HealthData from './admin-dashboard/HealthData';
import VoiceMap from './admin-dashboard/VoiceMap';
import Users from './admin-dashboard/Users';
import Logs from './admin-dashboard/Logs';
import Insights from './admin-dashboard/Insights';
import Settings from './admin-dashboard/Settings';
import ArticleManage from './admin-dashboard/ArticleManage';
import GlossaryManage from './admin-dashboard/GlossaryManage';
import InfographicsManage from './admin-dashboard/InfographicsManage';
import SopManage from './admin-dashboard/SopManage';

const AdminDashboard = () => {
    useDocumentTitle("Admin Dashboard");
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        sessionStorage.removeItem("userRole");
        showToast("Administrative session closed successfully.", "success");
        navigate('/');
    };

    // Function para i-render ang tamang component
    const renderContent = () => {
        switch(activeTab) {
            case "Dashboard":
                return (
                    <DashboardOverview />
                );
            case "Health Data":
                return (
                    <HealthData />
                );
            case "Voice Map":
                return (
                    <VoiceMap />
                );
            case "Users":
                return (
                    <Users />
                );
            case "Logs":
                return (
                    <Logs />
                );
            case "Insights":
                return (
                    <Insights />
                );
            case "Settings":
                return (
                    <Settings />
                );
            case "Educational Articles":
                return (
                    <ArticleManage />
                );
            case "Medical Glossary":
                return (
                    <GlossaryManage />
                );
            case "Infographics":
                return (
                    <InfographicsManage />
                );
            case "First Aid Guides":
                return (
                    <SopManage />
                );
            // Idagdag ang iba pang cases...
            default:
                return <DashboardOverview />;
        }
    };

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const data = await userService.getFullDetails();
                setAdminData(data);
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            }
        };
        fetchAdmin();
    }, []);

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-hidden">
            <AdminSidebar 
                isOpen={isSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab} // Pass the setter
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                onLogout={handleLogout}
                adminData={adminData}
            />

            <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* DITO YUNG HEADER, HINDI NA SIYA PAULIT-ULIT SA MGA PAGES */}
                <AdminHeader 
                    title={activeTab} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />
                
                {/* Main Content Area na may padding */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;