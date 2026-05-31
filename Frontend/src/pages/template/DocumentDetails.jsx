import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { docData } from '../../data/docData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const DocumentDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const article = docData[slug];

    useDocumentTitle(article ? article.title : 'Not Found');

    if (!article) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <p className="text-foreground">Article not found.</p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/documentation')}
                    className="flex items-center text-foreground/50 hover:text-primary mb-10 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Documentation
                </button>

                <article>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-10">
                        {article.title}
                    </h1>
                    
                    {/* Content Rendering Logic */}
                    <div className="space-y-6">
                        {article.sections.map((section, index) => {
                            switch (section.type) {
                                case 'heading':
                                    return (
                                        <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4">
                                            {section.content}
                                        </h2>
                                    );
                                case 'list':
                                    return (
                                        <ul key={index} className="list-disc ml-5 space-y-3 text-foreground/80">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="leading-relaxed">{item}</li>
                                            ))}
                                        </ul>
                                    );
                                case 'text':
                                default:
                                    return (
                                        <p key={index} className="text-foreground/80 leading-relaxed text-lg">
                                            {section.content}
                                        </p>
                                    );
                            }
                        })}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default DocumentDetails;