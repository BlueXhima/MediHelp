// src/pages/Learn.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle'; // 1. I-import ang hook
import { articleService } from '../services/articleService';
import { glossaryService } from '../services/glossaryService';
import { sopService } from '../services/sopService';
import { infographicService } from '../services/infographicService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    BookOpen, Heart, Brain, Activity, Stethoscope, Pill, Apple, 
    Dumbbell, ShieldCheck, AlertTriangle, Baby, ChevronRight, Clock,
    FileText, Layers, HelpCircle, ShieldAlert, ArrowLeft, Image, LifeBuoy
} from 'lucide-react';

const IconMap = {
    Heart, Stethoscope, Pill, Apple, Dumbbell, Brain, Activity,
    ShieldCheck, ShieldAlert, Baby, BookOpen, FileText, HelpCircle, Image, LifeBuoy
};

const Learn = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [dbArticles, setDbArticles] = useState([]);
    const [dbGlossary, setDbGlossary] = useState([]);
    const [dbInfographics, setDbInfographics] = useState([]);
    const [dbFirstAid, setDbFirstAid] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const contentTypes = [
        { id: 'all', name: 'All Resources' },
        { id: 'education', name: 'Education Articles' },
        { id: 'infographics', name: 'Infographics' },
        { id: 'glossary', name: 'Medical Glossary' },
        { id: 'firstaid', name: 'First Aid Guide' }
    ];

    const activeType = searchParams.get('type') || (searchParams.get('cat') ? 'education' : 'all');
    const activeCatSlug = searchParams.get('cat') || 'general-health';

    // 2. DYNAMIC TITLE MAPPING BASE SA RESOURCE FILTER BUTTONS
    const titleMap = {
        all: "Knowledge Library",
        education: "Educational Articles",
        infographics: "Medical Infographics",
        glossary: "Medical Glossary",
        firstaid: "First Aid Response Guide"
    };
    
    // Tawagin ang hook gamit ang kasalukuyang value ng active tab
    useDocumentTitle(titleMap[activeType] || "Knowledge Library");

    const learnCategories = [
        { category_id: 1, category_name: 'General Health', icon_name: 'Heart', slug: 'general-health' },
        { category_id: 2, category_name: 'Symptoms', icon_name: 'Stethoscope', slug: 'symptoms' },
        { category_id: 3, category_name: 'Medications', icon_name: 'Pill', slug: 'medications' },
        { category_id: 4, category_name: 'Nutrition', icon_name: 'Apple', slug: 'nutrition' },
        { category_id: 5, category_name: 'Exercise', icon_name: 'Dumbbell', slug: 'exercise' },
        { category_id: 6, category_name: 'Mental Health', icon_name: 'Brain', slug: 'mental-health' },
        { category_id: 7, category_name: 'Chronic Conditions', icon_name: 'Activity', slug: 'chronic-conditions' },
        { category_id: 8, category_name: 'Preventive Care', icon_name: 'ShieldCheck', slug: 'preventive-care' },
        { category_id: 9, category_name: 'Emergency Care', icon_name: 'ShieldAlert', slug: 'emergency-care' },
        { category_id: 10, category_name: 'Pediatric Basics', icon_name: 'Baby', slug: 'pediatric' },
    ];

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [articlesRes, glossaryRes, infoRes, sopRes] = await Promise.allSettled([
                    articleService.getAllArticles(),
                    glossaryService.getAllGlossary(),
                    infographicService.getAllInfographics(),
                    sopService.getAllFirstAid()
                ]);

                if (articlesRes.status === 'fulfilled') setDbArticles(articlesRes.value);
                if (glossaryRes.status === 'fulfilled') setDbGlossary(glossaryRes.value);
                if (infoRes.status === 'fulfilled') setDbInfographics(infoRes.value);
                if (sopRes.status === 'fulfilled') setDbFirstAid(sopRes.value);
            } catch (err) {
                console.error("Critical error mapping databases:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleTypeChange = (typeId) => {
        setSearchParams({ type: typeId, cat: activeCatSlug });
    };

    const handleCategoryChange = (catSlug) => {
        setSearchParams({ type: activeType, cat: catSlug });
    };

    const filterByMedicalBranch = (items) => {
        const targetCat = learnCategories.find(c => c.slug === activeCatSlug);
        return items.filter(item => 
            item.cat_id === targetCat?.category_id || 
            item.category_id === targetCat?.category_id ||
            item.category_name?.toLowerCase() === targetCat?.category_name?.toLowerCase() ||
            item.associated_category?.toLowerCase() === targetCat?.slug
        );
    };

    const getCombinedFeed = () => {
        const articles = filterByMedicalBranch(dbArticles).map(item => ({ ...item, display_type: 'education' }));
        const glossary = filterByMedicalBranch(dbGlossary).map(item => ({ ...item, display_type: 'glossary' }));
        const infographics = filterByMedicalBranch(dbInfographics).map(item => ({ ...item, display_type: 'infographics' }));
        const firstaid = filterByMedicalBranch(dbFirstAid).map(item => ({ ...item, display_type: 'firstaid' }));

        if (activeType === 'education') return articles;
        if (activeType === 'glossary') return glossary;
        if (activeType === 'infographics') return infographics;
        if (activeType === 'firstaid') return firstaid;
        
        return [...articles, ...glossary, ...infographics, ...firstaid];
    };

    const displayedContent = getCombinedFeed();

    const handleCardNavigation = (card) => {
        if (card.display_type === 'education') navigate(`/learn/article-viewer/${card.article_id || card.id}`);
        else if (card.display_type === 'glossary') navigate(`/resources/glossary/${card.glossary_id || card.id}`);
        else if (card.display_type === 'infographics') navigate(`/resources/infographics/${card.infographic_id || card.id}`);
        else if (card.display_type === 'firstaid') navigate(`/resources/first-aid/${card.sop_id || card.id}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20">
            <Navbar />
            <main className="flex-1 pt-24 sm:pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full space-y-12">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/landingpage')}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/40 hover:text-primary transition-colors cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Landing Page
                    </button>
                </div>

                <div className="space-y-2 max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-light tracking-tight uppercase leading-none" style={{ fontFamily: "'Unesa', sans-serif" }}>
                        Knowledge Library
                    </h1>
                    <p className="text-xs sm:text-sm text-foreground/50 font-medium leading-relaxed">
                        Access verified clinical resources, framework matrices, and interactive lifestyle tracking.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
                    {contentTypes.map((type) => {
                        const isSelected = activeType === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleTypeChange(type.id)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border duration-200 cursor-pointer ${
                                    isSelected 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10' 
                                        : 'bg-card text-foreground/60 border-border hover:text-foreground hover:border-foreground/40'
                                }`}
                            >
                                {type.name}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-3 pr-3 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-border shrink-0">
                        {learnCategories.map((cat) => {
                            const CatIcon = IconMap[cat.icon_name] || BookOpen;
                            const isSelected = activeCatSlug === cat.slug;

                            return (
                                <button
                                    key={cat.category_id}
                                    onClick={() => handleCategoryChange(cat.slug)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-primary/10 text-primary lg:w-full'
                                            : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground lg:w-full'
                                    }`}
                                >
                                    <CatIcon size={16} className="shrink-0" />
                                    <span>{cat.category_name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <section className="lg:col-span-9 space-y-6">
                        {isLoading ? (
                            <div className="text-xs text-foreground/40 font-mono">Synchronizing clinical arrays...</div>
                        ) : displayedContent.length === 0 ? (
                            <div className="text-xs text-foreground/40 font-mono py-12 border border-dashed border-border rounded-2xl text-center bg-card/10">
                                <Layers className="mx-auto text-foreground/20 stroke-[1.2] mb-2" size={32} />
                                No database entries recorded under this specific filter option yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayedContent.map((item, index) => {
                                    let FormatIcon = IconMap[item.icon_name] || BookOpen;
                                    let badgeColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                                    let displayBadge = "Article";

                                    if (item.display_type === 'glossary') {
                                        FormatIcon = HelpCircle;
                                        badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                                        displayBadge = "Glossary";
                                    } else if (item.display_type === 'infographics') {
                                        FormatIcon = Image;
                                        badgeColor = "bg-purple-500/10 text-purple-500 border-purple-500/20";
                                        displayBadge = "Infographic";
                                    } else if (item.display_type === 'firstaid') {
                                        FormatIcon = LifeBuoy;
                                        badgeColor = "bg-red-500/10 text-red-500 border-red-500/20";
                                        displayBadge = "First Aid";
                                    }

                                    return (
                                        <div 
                                            key={`${item.display_type}-${item.id || index}`}
                                            onClick={() => handleCardNavigation(item)}
                                            className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between gap-6 hover:border-primary/40 transition-all duration-300 group cursor-pointer"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="p-2 bg-foreground/5 text-foreground/70 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <FormatIcon size={16} />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                                            {displayBadge}
                                                        </span>
                                                        <span className="font-mono text-[9px] text-foreground/40 flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded-md">
                                                            <Clock size={10} /> {item.read_time || '5 min read'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors pt-1">
                                                    {item.title || item.term || item.guide_name}
                                                </h3>
                                                <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed">
                                                    {item.summary_content || item.definition || item.description || item.body_content}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pt-2 text-foreground/40 group-hover:text-primary transition-colors border-t border-border/40">
                                                <span>View Full Structure</span>
                                                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Learn;
