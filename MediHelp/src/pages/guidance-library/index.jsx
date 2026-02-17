import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { CategoryFilter } from './components/CategoryFilter.jsx';
import { ContentCard } from './components/ContentCard.jsx';
import { GuidanceHistory } from './components/GuidanceHistory.jsx';
import { FeaturedContent } from './components/FeaturedContent.jsx';
import { QuickActions } from './components/QuickActions.jsx';
import Icon from '../../components/AppIcon.jsx';
import Button from '../../components/Button.jsx';

export const GuidanceLibrary = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isListening, setIsListening] = useState(false);
    const [filteredContent, setFilteredContent] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const itemsPerPage = 12;

    // Mock data for categories
    const categories = [
        { id: 'general', name: 'General Health', icon: 'Heart', count: 156 },
        { id: 'symptoms', name: 'Symptoms', icon: 'Stethoscope', count: 89 },
        { id: 'medications', name: 'Medications', icon: 'Pill', count: 234 },
        { id: 'nutrition', name: 'Nutrition', icon: 'Apple', count: 78 },
        { id: 'exercise', name: 'Exercise', icon: 'Dumbbell', count: 92 },
        { id: 'mental-health', name: 'Mental Health', icon: 'Brain', count: 67 },
        { id: 'chronic-conditions', name: 'Chronic Conditions', icon: 'Activity', count: 145 },
        { id: 'preventive-care', name: 'Preventive Care', icon: 'Shield', count: 103 },
        { id: 'emergency', name: 'Emergency Care', icon: 'AlertTriangle', count: 45 },
        { id: 'pediatric', name: 'Pediatric', icon: 'Baby', count: 87 }
    ];

    // Mock data for content library
    const contentLibrary = [
        {
            id: 1,
            title: "Heart Health Essentials: Preventing Hypertension Naturally",
            description: `Hypertension can be managed and prevented with the right lifestyle choices. This guide highlights natural remedies, daily habits, and practical monitoring techniques.\n\nLearn about balanced diets, stress reduction, and simple exercises that support cardiovascular health. Discover how early detection and consistent tracking can make a big difference.`,
            type: 'article',
            category: 'chronic-conditions',
            tags: ['hypertension', 'healthy living', 'nutrition', 'exercise'],
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
            imageAlt: 'Fresh fruits and vegetables arranged on a table promoting heart health',
            readTime: 6,
            rating: 4.6,
            updatedAt: '2025-01-05',
            isBookmarked: true,
            views: 3120
        },
        {
            id: 2,
            title: "Living Well with Diabetes: Daily Habits for Balance",
            description: `Managing diabetes is about consistency and awareness. This article explores practical routines, meal planning, and exercise strategies to keep blood sugar levels stable.\n\nUnderstand how technology, mindful eating, and regular check-ups can empower individuals to live healthier lives.`,
            type: 'article',
            category: 'chronic-conditions',
            tags: ['diabetes care', 'blood sugar control', 'healthy habits', 'wellness'],
            image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
            imageAlt: 'Healthy meal prep with vegetables and grains for diabetes management',
            readTime: 9,
            rating: 4.8,
            updatedAt: '2025-01-08',
            isBookmarked: false,
            views: 2895
        },
        {
            id: 3,
            title: "Building Mental Resilience: Mindfulness and Self-Care",
            description: `Mental resilience is key to thriving in daily life. This guide introduces mindfulness practices, journaling, and relaxation techniques to strengthen emotional well-being.\n\nLearn how to create a supportive environment, recognize stress triggers, and build habits that nurture long-term mental health.`,
            type: 'article',
            category: 'mental-health',
            tags: ['mindfulness', 'resilience', 'self-care', 'emotional health'],
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
            imageAlt: 'Person meditating outdoors surrounded by nature for mental clarity',
            readTime: 8,
            rating: 4.9,
            updatedAt: '2025-01-10',
            isBookmarked: true,
            views: 2450
        },
        {
            id: 4,
            title: "Nutrition Basics: Building a Balanced Plate",
            description: `Good nutrition is the foundation of health. This article explains how to create balanced meals using the right mix of proteins, carbohydrates, and healthy fats.\n\nLearn practical tips for portion control, hydration, and incorporating more whole foods into your daily routine.`,
            type: 'article',
            category: 'nutrition',
            tags: ['nutrition', 'healthy eating', 'balanced diet', 'wellness'],
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            imageAlt: 'Colorful balanced meal with vegetables, grains, and protein on a plate',
            readTime: 6,
            rating: 4.7,
            updatedAt: '2025-01-12',
            isBookmarked: false,
            views: 1780
        },
        {
            id: 5,
            title: "Fitness Fundamentals: Strength and Cardio for Beginners",
            description: `Starting a fitness journey can feel overwhelming. This beginner-friendly guide introduces strength training, cardio routines, and recovery practices.\n\nDiscover how to set achievable goals, track progress, and build consistency for long-term results.`,
            type: 'article',
            category: 'fitness',
            tags: ['fitness', 'exercise', 'strength training', 'cardio'],
            image: "https://plus.unsplash.com/premium_photo-1670505062582-fdaa83c23c9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D",
            imageAlt: 'Person lifting weights in a modern gym with motivational atmosphere',
            readTime: 8,
            rating: 4.6,
            updatedAt: '2025-01-11',
            isBookmarked: true,
            views: 2105
        },
        {
            id: 6,
            title: "Tech in Health: Wearables and Smart Monitoring",
            description: `Technology is transforming healthcare. This article explores how wearables, apps, and smart devices help track fitness, sleep, and chronic conditions.\n\nLearn about the benefits of continuous monitoring, data-driven insights, and how to choose the right device for your lifestyle.`,
            type: 'article',
            category: 'technology',
            tags: ['health tech', 'wearables', 'smart devices', 'digital health'],
            image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
            imageAlt: 'Smartwatch displaying health metrics like heart rate and steps',
            readTime: 7,
            rating: 4.8,
            updatedAt: '2025-01-09',
            isBookmarked: false,
            views: 1950
        },
        // ...other updated content items
    ];

    // Mock data for guidance history
    const guidanceHistory = [
        {
            id: 1,
            query: "What are the symptoms of high blood pressure?",
            summary: "Discussed hypertension symptoms, monitoring techniques, and when to seek medical attention.",
            type: 'voice',
            category: 'cardiovascular',
            timestamp: '2024-10-19T14:30:00Z',
            isBookmarked: true
        },
        {
            id: 2,
            query: "Diabetes management tips",
            summary: "Provided lifestyle and dietary recommendations for effective diabetes management.",
            type: 'search',
            category: 'chronic-conditions',
            timestamp: '2024-10-18T10:15:00Z',
            isBookmarked: false
        },
        {
            id: 3,
            query: "How to improve mental health?",
            summary: "Explored strategies for enhancing mental well-being, including mindfulness and therapy options.",
            type: 'article',
            category: 'mental-health',
            timestamp: '2024-10-17T09:00:00Z',
            isBookmarked: true
        },
        // ...other history items
    ];

    // Mock data for featured content
    const featuredContent = [
        {
            id: 'f1',
            title: 'Winter Health: Staying Healthy During Cold Season',
            description: 'Essential tips for maintaining good health during winter months, including immune system support and seasonal affective disorder prevention.',
            category: 'Seasonal Health',
            icon: 'Snowflake',
            image: "https://images.unsplash.com/photo-1609013752263-be760a991921",
            imageAlt: 'Person bundled in warm winter clothing walking through snowy landscape with healthy winter scene',
            readTime: 6,
            views: '2.3k'
        },
        {
            id: 'f2',
            title: 'Telehealth Best Practices: Making the Most of Virtual Visits',
            description: 'How to prepare for and get the most out of telehealth appointments with your healthcare providers.',
            category: 'Chronic Conditions',
            icon: 'Video',
            image: "https://images.unsplash.com/photo-1601510147164-34014c9b6690",
            imageAlt: 'Person checking blood sugar levels with glucose meter and healthy lifestyle choices for diabetes management',
            readTime: 10,
            views: '3.1k'
        },
        {
            id: 'f3',
            title: 'Understanding Your Lab Results: A Patient Guide',
            description: 'Comprehensive guide to understanding common lab tests, normal ranges, and what abnormal results might indicate.',
            category: 'Diagnostic Tests',
            icon: 'FileText',
            image: "https://images.unsplash.com/photo-1680759290911-79034667aabb",
            imageAlt: 'Person sitting alone in a park looking thoughtful and contemplative about mental health',
            readTime: 7,
            views: '1.8k'
        },
        // ...other featured items
    ];

    // Filter content based on search and category
    useEffect(() => {
        let filtered = contentLibrary;

        if (selectedCategory !== 'all') {
            filtered = filtered?.filter((item) => item?.category === selectedCategory);
        }

        if (searchQuery?.trim()) {
            const query = searchQuery?.toLowerCase();
            filtered = filtered?.filter((item) =>
                item?.title?.toLowerCase()?.includes(query) ||
                item?.description?.toLowerCase()?.includes(query) ||
                item?.tags?.some((tag) => tag?.toLowerCase()?.includes(query))
            );
        }

        // Sort content
        switch (sortBy) {
            case 'newest':
                filtered?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'rating':
                filtered?.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
                break;
            case 'popular':
                filtered?.sort((a, b) => (b?.views || 0) - (a?.views || 0));
                break;
            default:
                // Keep original order for relevance
                break;
        }

        setFilteredContent(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortBy]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleVoiceSearch = () => {
        setIsListening(!isListening);
        // In a real app, this would integrate with Web Speech API
        if (!isListening) {
            setTimeout(() => {
                setIsListening(false);
                setSearchQuery("What are the symptoms of diabetes?");
            }, 3000);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleBookmark = (contentId) => {
        // In a real app, this would update the backend
        console.log('Bookmarking content:', contentId);
    };

    const handleViewContent = (content) => {
        // In a real app, this would navigate to detailed content view
        console.log('Viewing content:', content?.title);
    };

    const handleViewHistory = (item = null) => {
        if (item) {
            console.log('Viewing history item:', item?.query);
        } else {
            console.log('Viewing all history');
        }
    };

    const handleClearHistory = () => {
        console.log('Clearing guidance history');
    };

    const handleQuickAction = (actionId) => {
        switch (actionId) {
            case 'voice-assistant':navigate('/voice-interaction-interface');
                break;
            case 'symptom-checker':setSearchQuery('symptom checker');
                setSelectedCategory('symptoms');
                break;
            case 'medication-info':setSelectedCategory('medications');
                break;
            case 'emergency-guide':setSelectedCategory('emergency');
                break;
            case 'wellness-tips':setSelectedCategory('preventive-care');
                break;
            case 'find-provider':console.log('Navigate to provider directory');
                break;
            default:
                console.log('Unknown action:', actionId);
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredContent?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContent = filteredContent?.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-4">
                            Health Guidance Library
                        </h1>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                            Access comprehensive health information, previous guidance, and educational resources 
                            from trusted medical sources. Search by topic or browse by category to find the 
                            information you need.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        onVoiceSearch={handleVoiceSearch}
                        isListening={isListening} />


                    {/* Featured Content */}
                    <FeaturedContent
                        featuredItems={featuredContent}
                        onViewContent={handleViewContent} />


                    {/* Quick Actions */}
                    <QuickActions onAction={handleQuickAction} />

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Category Filter */}
                            <CategoryFilter
                                selectedCategory={selectedCategory}
                                onCategoryChange={handleCategoryChange}
                                categories={categories} 
                            />

                            {/* Content Controls */}
                            <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 shadow-medical rounded-xl p-4 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-text-secondary">
                                            {filteredContent?.length} results found
                                        </span>
                                        {searchQuery &&
                                        <span className="text-sm text-primary">
                                            for "{searchQuery}"
                                        </span>
                                        }
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="text-sm text-text-secondary">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e?.target?.value)}
                                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">

                                            <option value="relevance">Relevance</option>
                                            <option value="newest">Newest</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="popular">Most Popular</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid */}
                            {paginatedContent?.length > 0 ?
                                <>
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        {paginatedContent?.map((content) =>
                                        <ContentCard
                                            key={content?.id}
                                            content={content}
                                            onBookmark={handleBookmark}
                                            onView={handleViewContent} />

                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 &&
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                className="btn-outline"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                            >
                                                Previous
                                            </button>

                                            <div className="flex space-x-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) =>
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page ?
                                                    'bg-primary text-primary-foreground' :
                                                    'text-text-secondary hover:bg-muted'}`
                                                    }>

                                                    {page}
                                                </button>
                                                )}
                                            </div>

                                            <button
                                                className="btn-outline"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(currentPage + 1)}>

                                                Next
                                            </button>
                                        </div>
                                    }
                                </> :

                                <div className="bg-white rounded-xl shadow-medical border border-gray-200 p-12 text-center">
                                    <Icon name="Search" size={64} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-primary mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-text-secondary mb-6">
                                        Try adjusting your search terms or browse different categories
                                    </p>
                                    <button
                                        className="btn-outline"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}>

                                        Clear Filters
                                    </button>
                                </div>
                            }
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <GuidanceHistory
                                history={guidanceHistory}
                                onViewHistory={handleViewHistory}
                                onClearHistory={handleClearHistory} 
                            />
                        </div>
                    </div>
                </div>
            </main>
            {/* Emergency Button */}
            <button
                className="fixed bottom-4 right-4 flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer shadow-md border-8 border-red-300 animate-pulse hover:bg-red-600 transition-all"
                onClick={() => alert('Emergency button clicked!')}
            >
                <Icon name="Phone" size={20} />
                <span>Emergency</span>
            </button>
        </div>
    );
};

export default GuidanceLibrary;