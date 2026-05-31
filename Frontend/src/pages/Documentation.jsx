import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation = () => {
    useDocumentTitle('Documentation');
    const [searchQuery, setSearchQuery] = useState('');

    const links = [
        { title: 'Getting Started', slug: 'getting-started', desc: 'System overview and setup.' },
        { title: 'API Reference', slug: 'api-reference', desc: 'Technical integration details.' },
        { title: 'User Guides', slug: 'user-guides', desc: 'Feature walkthroughs.' },
        { title: 'Privacy & Security', slug: 'privacy-security', desc: 'Data protection policies.' },
        { title: 'Accessibility', slug: 'accessibility', desc: 'Platform usability standards.' },
        { title: 'Release Notes', slug: 'release-notes', desc: 'Recent updates and fixes.' },
    ];

    // LIVE SEARCH LOGIC
    const filteredLinks = links.filter(link => 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        link.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background min-h-screen">
            <Navbar />
            
            <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
                <header className="mb-14">
                    <h1 className="text-4xl font-light tracking-tight text-foreground mb-8">Documentation</h1>
                    <div className="relative flex items-center">
                        <Search className="absolute left-0 -top-3.5 inset-y-0 my-auto text-foreground/30" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search topics..." 
                            className="w-full pl-8 pb-3 text-lg border-b border-border bg-transparent focus:border-primary outline-none transition-colors placeholder:text-foreground/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <section className="space-y-2">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map((item, idx) => (
                            <Link 
                                key={idx} 
                                to={`/documentation/${item.slug}`}
                                className="group flex items-center justify-between py-6 border-b border-border/50 hover:border-primary transition-all duration-300"
                            >
                                <div>
                                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-foreground/50 text-sm mt-1">{item.desc}</p>
                                </div>
                                <ArrowRight size={18} className="text-foreground/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                        ))
                    ) : (
                        <div className="py-10 text-center text-foreground/40">
                            No articles found matching "{searchQuery}"
                        </div>
                    )}
                </section>

                <section className="mt-14">
                    <p className="text-foreground/60 mb-4">Still have questions?</p>
                    <a href="/contact-support" className="text-primary font-medium flex items-center hover:underline">
                        Contact our support team <ArrowRight size={16} className="ml-2" />
                    </a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Documentation;