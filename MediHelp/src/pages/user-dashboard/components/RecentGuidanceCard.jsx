import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, Plus } from 'lucide-react';
import Icon from './Icon';

const RecentGuidanceCard = () => {
    const recentGuidance = [
    {
        id: 1,
        query: "Managing seasonal allergies naturally",
        date: "2 hours ago",
        type: "Allergies",
        severity: "low",
        image: "https://images.unsplash.com/photo-1728649002789-b66a36fefc5c",
        alt: "Close-up of colorful spring flowers and pollen in sunlight"
    },
    {
        id: 2,
        query: "Safe exercises during pregnancy second trimester",
        date: "1 day ago",
        type: "Pregnancy",
        severity: "medium",
        image: "https://images.unsplash.com/photo-1665708394969-fd690d71785b",
        alt: "Pregnant woman in athletic wear doing gentle stretching exercise on yoga mat"
    },
    {
        id: 3,
        query: "Understanding blood pressure readings",
        date: "3 days ago",
        type: "Cardiovascular",
        severity: "medium",
        image: "https://images.unsplash.com/photo-1685485276228-e7e75ceba593",
        alt: "Digital blood pressure monitor displaying readings on white background"
    },
    {
        id: 4,
        query: "Healthy sleep habits for better rest",
        date: "1 week ago",
        type: "Lifestyle",
        severity: "low",
        image: "https://images.unsplash.com/photo-1698321014601-5bea6d5ffef6",
        alt: "Peaceful bedroom with soft lighting and comfortable bedding setup"
    }];


    const getSeverityColor = (severity) => {
        switch (severity) {
        case 'high':return 'border-destructive bg-destructive/5';
        case 'medium':return 'border-warning bg-warning/5';
        default:return 'border-accent bg-accent/5';
        }
    };

    const getTypeColor = (type) => {
        const colors = {
        'Allergies': 'bg-purple-100 text-purple-700',
        'Pregnancy': 'bg-pink-100 text-pink-700',
        'Cardiovascular': 'bg-red-100 text-red-700',
        'Lifestyle': 'bg-green-100 text-green-700'
        };
        return colors?.[type] || 'bg-secondary/10 text-secondary';
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary block items-center">
                    <BookOpen size={24} className="mr-3 inline-block text-blue" />
                    <span>Recent Guidance</span>
                </h3>
                <Link
                    to="/guidance-library"
                    className="text-secondary hover:text-primary text-sm font-medium transition-colors flex items-center"
                >
                    View All
                    <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>
            <div className="space-y-4">
                {recentGuidance?.map((item) =>
                    <div
                        key={item?.id}
                        className={`border-l-4 ${getSeverityColor(item?.severity)} pl-4 py-3 px-4 hover:bg-muted/50 rounded-r-lg transition-all duration-200 cursor-pointer shadow-sm medical-card`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item?.image}
                                    alt={item?.alt}
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-text-primary text-left mb-2 line-clamp-2">{item?.query}</h4>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(item?.type)}`}>
                                        {item?.type}
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center">
                                        <Clock size={12} className="mr-1" />
                                        {item?.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                    to="/guidance-library"
                    className="w-full flex items-center justify-center py-2 text-secondary hover:text-primary font-medium transition-colors"
                >
                    <Plus size={16} className="mr-2" />
                    Ask New Question
                </Link>
            </div>
        </div>
    );
};

export default RecentGuidanceCard;