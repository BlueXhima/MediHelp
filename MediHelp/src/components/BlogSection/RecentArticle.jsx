import React from 'react';
import { User, Calendar, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Img1 from '../../assets/RecentArticle1.jpg';
import Img2 from '../../assets/RecentArticle2.jpg';
import Img3 from '../../assets/RecentArticle3.jpg';
import Img4 from '../../assets/RecentArticle4.jpg';

export const BlogArticle = () => {
    const articles = [
        {
            id: 1,
            title: 'How AI is improving diagnostics',
            excerpt: 'AI tools enable faster, more accurate diagnoses by assisting clinicians with image analysis and risk prediction.',
            author: 'Dr. Emily Reyes',
            date: 'Dec 20, 2025',
            readTime: '4 min read',
            category: 'AI',
            image: Img1,
        },
        {
            id: 2,
            title: 'Telehealth adoption after the pandemic',
            excerpt: 'Telemedicine usage surged and continues to expand access to care for rural and underserved populations.',
            author: 'Mark Santos',
            date: 'Nov 10, 2025',
            readTime: '6 min read',
            category: 'Telemedicine',
            image: Img2,
            locked: true,
        },
        {
            id: 3,
            title: 'Secure patient data best practices',
            excerpt: 'Protecting patient privacy requires a combination of technology, policy, and staff training.',
            author: 'Atty. Cruz',
            date: 'Oct 5, 2025',
            readTime: '7 min read',
            category: 'Security',
            image: Img3,
        },
        {
            id: 4,
            title: 'HIPAA compliance checklist for startups',
            excerpt: 'A simple checklist to help new health startups get started with privacy and security requirements.',
            author: 'Legal Team',
            date: 'Sep 1, 2025',
            readTime: '3 min read',
            category: 'Compliance',
            image: Img4,
            locked: true,
        },
    ];

    return (
        <section className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-left">
                    <h3 className="text-2xl font-bold text-foreground">Recent Articles</h3>
                    <p className="text-muted-foreground mt-2">Latest insights, tips, and research from our experts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map((a) => (
                        <article
                            key={a.id}
                            className="relative h-full flex flex-col overflow-hidden rounded-lg border border-border/50 dark:border-border/30 bg-card dark:bg-card transform transition duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="h-40 overflow-hidden flex-shrink-0">
                                <img
                                    src={a.image}
                                    alt={a.title}
                                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="text-center text-white px-4">
                                    <Lock className="mx-auto mb-2" />
                                    <div className="font-semibold">Locked</div>
                                    <div className="text-sm mt-2 mb-4">Login or register to unlock this article</div>
                                    <div className="flex items-center gap-3 justify-center">
                                        <Link to="/login" className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium">Login</Link>
                                        <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Register</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">{a.category}</span>
                                    <h4 className="mt-3 text-lg font-semibold text-foreground leading-tight mb-2">{a.title}</h4>
                                    <p className="mt-2 text-sm text-muted-foreground max-h-14 overflow-hidden">{a.excerpt}</p>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <User size={14} />
                                        <span>{a.author}</span>
                                    </div>

                                    <div className="text-xs text-muted-foreground text-right">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Calendar size={14} />
                                            <span>{a.date}</span>
                                        </div>
                                        <div>{a.readTime}</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        to={`/blog/${a.id}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Read Article
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogArticle;
