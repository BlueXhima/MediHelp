import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Moon, Activity, Plus, Bell, Clock, ExternalLink, BookOpen, Heart } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';

const HealthHubCard = () => {
    const [medicationTaken, setMedicationTaken] = useState(false);

    const upcomingMedications = [ 
    {
        id: 1,
        name: "Vitamin D3",
        dosage: "1000 IU",
        time: "3:00 PM",
        timeLeft: "2 hours",
        type: "supplement",
        image: "https://images.unsplash.com/photo-1663491749098-d2c923eab56c",
        alt: "White vitamin D3 supplement capsules in clear bottle on wooden surface"
    },
    {
        id: 2,
        name: "Omega-3",
        dosage: "500mg",
        time: "8:00 PM",
        timeLeft: "7 hours",
        type: "supplement",
        image: "https://images.unsplash.com/photo-1633171031508-a8f26271e8aa",
        alt: "Golden omega-3 fish oil capsules scattered on white background"
    }];

    const recommendedResources = [
    {
        id: 1,
        title: "Heart-Healthy Diet Guide",
        category: "Nutrition",
        readTime: "5 min read",
        icon: "Heart",
        image: "https://images.unsplash.com/photo-1631091877628-9eba5229e8c5",
        alt: "Colorful array of fresh vegetables and fruits arranged on wooden cutting board"
    },
    {
        id: 2,
        title: "Exercise for Beginners",
        category: "Fitness",
        readTime: "8 min read",
        icon: "Dumbbell",
        image: "https://images.unsplash.com/photo-1612732362547-14adf627f24e",
        alt: "Person in athletic wear doing stretching exercises on yoga mat in bright room"
    },
    {
        id: 3,
        title: "Mental Health Resources",
        category: "Wellness",
        readTime: "6 min read",
        icon: "Brain",
        image: "https://images.unsplash.com/photo-1640011430208-ce74dc83c7fd",
        alt: "Peaceful woman meditating with eyes closed in serene natural outdoor setting"
    }];


    const handleMedicationTaken = (medicationId) => {
        setMedicationTaken(true);
        setTimeout(() => setMedicationTaken(false), 2000);
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center">
                    <Heart size={24} className="mr-3 text-red-500" />
                    Your Health Hub
                </h3>
                <Link
                    to="/health-profile"
                    className="text-secondary hover:text-primary text-sm font-medium transition-colors"
                >
                    View Profile
                </Link>
            </div>
            {/* Medication Reminders */}
            <div className="mb-8">
                <h4 className="font-semibold text-text-primary mb-4 flex items-center">
                    <Bell size={20} className="mr-2 text-blue" />
                    Medication Reminders
                </h4>
                
                <div className="space-y-3">
                    {upcomingMedications?.map((medication) =>
                        <div
                            key={medication?.id}
                            className="relative bg-secondary/400 border rounded-lg p-4 medication-pulse"
                        >
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-l-lg"></span>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={medication?.image}
                                            alt={medication?.alt}
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{medication?.name} - {medication?.dosage}</p>
                                        <p className="text-sm text-text-secondary">Due in {medication?.timeLeft} ({medication?.time})</p>
                                    </div>
                                </div>
                                <Button
                                    variant={medicationTaken ? "success" : "default"}
                                    size="sm"
                                    onClick={() => handleMedicationTaken(medication?.id)}
                                    disabled={medicationTaken}
                                    iconName={medicationTaken ? "Check" : "Clock"}
                                    iconPosition="left"
                                    className="
                                        flex items-center space-x-1 bg-success text-white hover:bg-success/90 cursor-pointer"
                                >
                                    <Clock size={16} className="mr-1" />
                                    <span>{medicationTaken ? "Taken" : "Mark as Taken"}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <Link
                    to="/health-profile"
                    className="flex items-center mt-3 text-sm text-secondary hover:text-primary transition-colors"
                >
                    <Plus size={16} className="mr-1" />
                    <span>Add Medication Reminder</span>
                </Link>
            </div>
            {/* Health Stats Quick View */}
            <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-left text-text-primary mb-3">Today's Health Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Droplets size={20} className="text-success" />
                        </div>
                        <p className="text-xs text-text-secondary">Water</p>
                        <p className="text-sm font-medium text-text-primary">6/8 glasses</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Moon size={20} className="text-blue" />
                        </div>
                        <p className="text-xs text-text-secondary">Sleep</p>
                        <p className="text-sm font-medium text-text-primary">7.5 hours</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Activity size={20} className="text-blue" />
                        </div>
                        <p className="text-xs text-text-secondary">Steps</p>
                        <p className="text-sm font-medium text-text-primary">8,432</p>
                    </div>
                </div>
            </div>
            {/* Recommended Resources */}
            <div>
                <h4 className="font-semibold text-text-primary mb-4 flex items-center">
                    <BookOpen size={20} className="mr-2 text-blue" />
                    Recommended Resources
                </h4>
                <div className="space-y-3">
                    {recommendedResources?.map((resource) =>
                        <Link
                            key={resource?.id}
                            to="/guidance-library"
                            className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-200 group medical-card shadow-sm"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={resource?.image}
                                        alt={resource?.alt}
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div>
                                    <span className="text-text-primary group-hover:text-secondary font-medium text-sm">
                                        {resource?.title}
                                    </span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs text-text-secondary">{resource?.category}</span>
                                        <span className="text-xs text-text-secondary">•</span>
                                        <span className="text-xs text-text-secondary">{resource?.readTime}</span>
                                    </div>
                                </div>
                            </div>
                            <ExternalLink size={16} className="group-hover:text-secondary transition-colors" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HealthHubCard;