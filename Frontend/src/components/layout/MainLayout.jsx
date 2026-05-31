import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

import EmergencyModal from '../modals/EmergencyModal';
import SafetyGuideModal from '../modals/SafetyGuideModal';

const MainLayout = ({ children, isLoggedIn }) => {
    // Global Modals State Management Matrix
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

    const handleOpenEmergency = () => {
        setIsEmergencyModalOpen(true);
        setIsSafetyModalOpen(false);
    };

    const handleOpenSafety = () => {
        setIsEmergencyModalOpen(false);
        setIsSafetyModalOpen(true);
    };

    const handleCloseAll = () => {
        setIsEmergencyModalOpen(false);
        setIsSafetyModalOpen(false);
    };

    return (
        /* Gagamit ng global CSS variables para sa background at text colors */
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Isasama natin ang Navbar dito para laging present */}
            <Navbar isLoggedIn={isLoggedIn} onOpenEmergency={handleOpenEmergency} />
            
            {/* Ang main content ng bawat page */}
            <main className="pt-20"> {/* pt-20 para hindi matakpan ng fixed navbar */}
                {children}
            </main>

            <Footer />

            <EmergencyModal 
                isOpen={isEmergencyModalOpen} 
                onClose={handleCloseAll} 
                onOpenSafety={handleOpenSafety} 
            />
            <SafetyGuideModal 
                isOpen={isSafetyModalOpen} 
                onClose={handleCloseAll} 
                onBack={handleOpenEmergency} 
            />
        </div>
    );
};

export default MainLayout;