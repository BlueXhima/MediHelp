import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image1 from '../../assets/FeatureArticle1.jpg';

export const BlogHero = () => {
    // Featured article data (can be replaced with dynamic data)
    const featuredArticle = {
        id: 1,
        title: 'The Future of Healthcare: AI and Telemedicine',
        excerpt: 'Discover how artificial intelligence and telemedicine are revolutionizing patient care and improving health outcomes worldwide.',
        author: 'Dr. Sarah Johnson',
        date: 'January 1, 2026',
        category: 'Technology',
        image: Image1,
        readTime: '5 min read',
    };

    return (
        <section className="pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Title & Tagline */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                        Health Insights & Resources
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Stay informed with the latest articles, expert insights, and healthcare trends to help you make better health decisions.
                    </p>
                </div>

                {/* Featured Article Card */}
                <div className="mt-12">
                    <div className="overflow-hidden rounded-lg border border-border/50 dark:border-border/30 bg-card dark:bg-card hover:shadow-lg transition-shadow duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 px-4 py-4 gap-0 items-stretch">
                            {/* Featured Image */}
                            <div className="overflow-hidden">
                                <img
                                    src={Image1}
                                    alt={featuredArticle.title}
                                    className="w-full h-90 object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Featured Content */}
                            <div className="p-6 md:p-8 flex flex-col items-center justify-between">
                                <div>
                                    {/* Category Badge */}
                                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full mb-3">
                                        {featuredArticle.category}
                                    </span>

                                    {/* Title */}
                                    <h2 className="text-3xl font-bold text-foreground mb-3">
                                        {featuredArticle.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-base text-muted-foreground mb-4">
                                        {featuredArticle.excerpt}
                                    </p>
                                </div>

                                {/* Meta Information */}
                                <div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>{featuredArticle.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>{featuredArticle.date}</span>
                                        </div>
                                        <span>{featuredArticle.readTime}</span>
                                    </div>

                                    {/* Read Article Button */}
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                        Read Article
                                        <ArrowRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
