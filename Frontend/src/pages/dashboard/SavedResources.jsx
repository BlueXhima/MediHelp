import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, BookOpen, HeartPulse, Book, Image as ImageIcon } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const SavedResources = ({ onViewChange }) => {
    useDocumentTitle('Saved Resources');
    const [activeTab, setActiveTab] = useState('articles');
    const [loading, setLoading] = useState(true);
    const [savedData, setSavedData] = useState({ articles: [], firstaid: [], glossary: [], infographics: [] });

    useEffect(() => {
        onViewChange('Saved Resources');
        
        const fetchSaved = async () => {
            setLoading(true);
            try {
                // Palitan ang mga endpoint na ito base sa API mo
                const [art, fa, gl, info] = await Promise.all([
                    axios.get('http://localhost:5000/api/articles/library', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/saved/firstaid', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/saved/glossary', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/saved/infographics', { withCredentials: true })
                ]);
                
                setSavedData({ 
                    articles: art.data, 
                    firstaid: fa.data, 
                    glossary: gl.data, 
                    infographics: info.data 
                });
            } catch (err) {
                console.error("Error fetching saved:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, [onViewChange]);

    const tabs = [
        { id: 'articles', label: 'Articles', icon: BookOpen },
        { id: 'firstaid', label: 'First Aid', icon: HeartPulse },
        { id: 'glossary', label: 'Glossary', icon: Book },
        { id: 'infographics', label: 'Infographics', icon: ImageIcon },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
            <Loader2 className="animate-spin text-foreground/20" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-light tracking-tight">Saved Resources<span className="font-serif italic text-primary">.</span></h1>
                    <div className="flex gap-4 mt-8 border-b border-border/40 pb-4 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Dito mo ilalagay ang grid rendering base sa activeTab */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedData[activeTab].length > 0 ? (
                        savedData[activeTab].map((item) => (
                            <div key={item.id} className="p-6 rounded-2xl border border-border/40 hover:border-primary/20 transition-all">
                                <h3 className="font-semibold mb-2">{item.title || item.term}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground italic">
                            No saved items in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedResources;