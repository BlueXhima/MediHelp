import React, { useEffect, useState, useRef } from 'react';
import { 
    ArrowLeft, Clock, Calendar, User, Share2, Bookmark, 
    MessageCircle, ChevronDown, ChevronRight, FileSearch, Home, Download
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion';
import ToastMessage, { showToast } from '../../../components/ToastMessage';
// import html2pdf from 'html2pdf.js';

import Navbar from '../../../components/navbar';
import ArticleContent from './ArticleContent';
import MediHelpAvatar from '../../../assets/mediAvatar.png';
import ArticleNotFound from '../../../pages/error/ArticleNotFound';
import ScrollToTop from '../../../components/ScrollTop';

const ArticlePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // Dito mai-store ang listahan ng tabs para sa TOC
    const [sections, setSections] = useState([]);

    const [articleData, setArticleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('introduction');
    const [textSize, setTextSize] = useState('standard'); // default text size

    // --- NEW: Scroll Progress States ---
    const [maxScroll, setMaxScroll] = useState(0);
    const scrollRef = useRef(0); // Gagamit ng Ref para ma-access ang latest value sa cleanup

    // --- Language State ---
    const [translatedData, setTranslatedData] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [displayTitle, setDisplayTitle] = useState("");
    const [displayContent, setDisplayContent] = useState("");
    const [displayExternal, setDisplayExternal] = useState("");

    const [isSaved, setIsSaved] = useState(false);

    const [currentLang, setCurrentLang] = useState(() => {
        const saved = localStorage.getItem('medihelp_lang');
        return saved ? JSON.parse(saved) : { name: 'English', code: 'en', flag: '🇺🇸' };
    });

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            
            if (height > 0) {
                const scrolled = Math.round((winScroll / height) * 100);
                
                // Siguraduhin na hindi lalampas sa 100 at laging pataas lang ang record
                if (scrolled > scrollRef.current) {
                    const cappedScroll = Math.min(scrolled, 100);
                    scrollRef.current = cappedScroll;
                    setMaxScroll(cappedScroll);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        // CLEANUP: Ito ang tatakbo kapag umalis ang user sa page
        return () => {
            window.removeEventListener("scroll", handleScroll);
            
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData?.UserID;
            const currentProgress = scrollRef.current;

            // I-save lang kung may progress (kahit 1% lang)
            if (userId && id && currentProgress > 0) {
                // Gagamit tayo ng navigator.sendBeacon o standard axios
                // sendBeacon ay mas reliable para sa "page hide/unload" events
                const data = JSON.stringify({
                    userId: userId,
                    articleId: id,
                    progress: currentProgress
                });
                
                // Option A: Axios (Standard)
                axios.post('http://localhost:5000/api/articles/update-progress', {
                    userId: userId,
                    articleId: id,
                    progress: currentProgress
                }).catch(err => console.error("Progress save failed:", err));
            }
        };
    }, [id]); // Re-run lang kapag nag-change ang article ID

    useEffect(() => {
        const fetchFullArticle = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/articles/${id}`);

                if (!res.data || !res.data.full_content) {
                    setArticleData(null); 
                    setLoading(false);
                    return; 
                }

                const rawHTML = res.data.full_content;
                const parser = new DOMParser();
                const doc = parser.parseFromString(rawHTML, 'text/html');
                const h3Headers = doc.querySelectorAll('h3');
                
                // DITO ANG MAGIC: Gawa ng fresh array na may Intro na agad
                const dynamicSections = [
                    { id: 'introduction', label: 'Introduction' }
                ];

                h3Headers.forEach((h3, index) => {
                    const headerText = h3.innerText.trim();
                    
                    // IWAS DUPLICATE: Wag i-add kung ang h3 text ay "Introduction" din
                    if (headerText.toLowerCase() !== 'introduction') {
                        const sectionId = `section-${index}`;
                        h3.setAttribute('id', sectionId);
                        
                        dynamicSections.push({
                            id: sectionId,
                            label: headerText
                        });
                    } else {
                        // Kung may h3 na "Introduction", lagyan lang natin ng ID para gumana ang scroll
                        h3.setAttribute('id', 'introduction');
                    }
                });

                // External links check
                if (res.data.external_link) {
                    dynamicSections.push({ id: 'external-link', label: 'External Links' });
                }

                // FINAL STEP: Overwrite ang buong sections state
                setSections(dynamicSections);
                
                setArticleData({
                    ...res.data,
                    full_content: doc.body.innerHTML
                });

            } catch (err) {
                console.error("Error:", err);
                setArticleData(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFullArticle();
    }, [id]);

    // Smooth Scroll Function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Height ng navbar mo
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            setActiveSection(sectionId);
        }
    };

    // Ito ay para sa "Live" na pag-highlight ng active section habang nag-scroll
    useEffect(() => {
        if (!articleData || sections.length === 0) return;

        const options = {
            root: null,
            // 30% mula sa itaas ang magiging trigger zone
            rootMargin: '0px 0px -70% 0px', 
            threshold: 0
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                // KAPAG PUMASOK SA VIEWPORT
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, options);

        // BANTAYAN ANG INTRODUCTION WRAPPER
        const introSection = document.getElementById('introduction');
        if (introSection) observer.observe(introSection);

        // BANTAYAN LAHAT NG H3 NA MAY ID
        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections, articleData]);

    // ActicleList useEffect Logic
    // "LIVE" Logic: Intersection Observer
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40% 0px', // Binabantayan ang gitna hanggang taas ng screen
            threshold: 0.3, // 30% ng section dapat kita para mag-trigger
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        // Lahat ng section sa ArticleContent na may ID ay babantayan
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    /* ---------------- SAVED LIBRARY FRONTEND INTEGRATION ----------------- */
    useEffect(() => {
        const checkSaveStatus = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            // Gamitin ang 'id' mula sa useParams()
            if (userData?.UserID && id) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/articles/save-status/${userData.UserID}/${id}`);
                    setIsSaved(response.data.isSaved);
                } catch (err) {
                    console.error("Error checking save status:", err);
                }
            }
        };
        checkSaveStatus();
    }, [id]);

    const handleSaveToLibrary = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.UserID;

        if (!userId) {
            showToast("Please login to save articles", "info");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/articles/save-toggle', {
                userId: userId,
                articleId: id
            });

            const isNowSaved = response.data.saved;
            setIsSaved(isNowSaved);

            if (isNowSaved) {
                // Success Feedback with Link instruction
                showToast(
                    <span>
                        Saved to library! View it in your 
                        <button 
                            onClick={() => navigate('/dashboard/guidance-library/save-library')}
                            className="ml-1 underline font-bold hover:text-emerald-500"
                        >
                            Saved Library
                        </button>.
                    </span>, 
                    "success"
                );
            } else {
                showToast("Removed from library", "info");
            }

        } catch (err) {
            console.error("Error toggling save:", err);
            showToast("Failed to update library", "error");
        }
    };
    /* ------------------------------------------------------------------------------------------------------ */

    const getFormattedDate = (dateString) => {
        if (!dateString) return "Date not available";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Global Translation Function
    // Fetch original article data
    const fetchTranslation = async (langCode) => {
        try {
            setIsTranslating(true);
            const res = await axios.get(`http://localhost:5000/api/translate/${id}?lang=${langCode}`);
            setTranslatedData(res.data);
        } catch (error) {
            console.error("Translation error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        if (id && currentLang.code !== 'en') {
            fetchTranslation(currentLang.code);
        }
    }, [id]);

    const handleLanguageChange = async (lang) => {
        setCurrentLang(lang);
        localStorage.setItem('medihelp_lang', JSON.stringify(lang));

        if (lang.code === 'en') {
            setTranslatedData(null);
            return;
        }

        try {
            setIsTranslating(true);
            // FIX: Pass lang.code explicitly in params to match backend req.query.lang
            const response = await axios.get(`http://localhost:5000/api/translate/${id}`, {
                params: { lang: lang.code } 
            });

            if (response.data) {
                // Update the display states and the translated data object
                setDisplayTitle(response.data.title);
                setDisplayContent(response.data.full_content);
                setDisplayExternal(response.data.external_link);
                setTranslatedData(response.data);
            }
        } catch (error) {
            console.error("Translation error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    // ----- Share Article Function -----
    const handleShare = async () => {
        const shareData = {
            title: articleData?.title,
            text: `Check out this health guidance: ${articleData?.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                // 1. Toast appear (Process Started)
                showToast("Opening share options...", "info");
                
                // 2. Share display (Waiting for user to close)
                await navigator.share(shareData);
                
            } catch (err) {
                // Kapag kinancel ng user (pinindot yung 'X' o labas ng window)
                if (err.name === 'AbortError') {
                    showToast("Share cancelled.", "info");
                } else {
                    showToast("Something went wrong while sharing.", "error");
                }
            }
        } else {
            // Fallback for Desktop browsers (Firefox etc.)
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "success");
            } catch (err) {
                showToast("Failed to copy link.", "error");
            }
        }
    };

    // ----- Download PDF functions -----
    const handleDownload = () => {
        // Konting delay para makita ang toast
        setTimeout(() => {
            window.print();
            showToast("Download process finished!", "success");
        }, 800);
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Fetching Content...
            </span>
        </div>
    );

    if (!articleData) {
        return <ArticleNotFound />;
    }

    const textSizeMap = {
        small: 'text-sm',
        standard: 'text-md',
        large: 'text-lg',
        extraLarge: 'text-xl'
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <ScrollToTop progress={maxScroll} />

            <ToastMessage />

            {/* 2. HERO SECTION */}
            <header className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-slate-950">
                <div className="absolute top-24 left-12 z-30"> {/* Dinagdagan ko ang top at left spacing */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-4 cursor-pointer pl-4 pr-6 py-3 bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white transition-all hover:bg-white hover:text-slate-900 hover:border-white shadow-2xl shadow-black/50"
                    >
                        <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-xl group-hover:bg-slate-900/10 transition-colors">
                            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em] mb-1">Return to</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">Library</span>
                        </div>
                    </button>
                </div>
                
                {/* Background Engine */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={articleData.image_url} 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                    />
                    {/* Editorial Gradients: Darker at the bottom and sides for focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-transparent"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-16">
                    <div className="fixed top-[64px] left-0 w-full h-1 z-[50]">
                        <div 
                            className="h-full bg-primary transition-all duration-150 shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                            style={{ width: `${maxScroll}%` }}
                        />
                    </div>
                    
                    {/* Floating Category Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">
                            {translatedData?.category_name || articleData?.category_name}
                        </span>
                    </div>

                    {/* Main Headline: Bigger, Tighter, Stronger */}
                    <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.05] tracking-[-0.04em] mb-10 drop-shadow-2xl">
                        {(() => {
                            const displayTitle = translatedData?.title || articleData?.title || "";

                            // I-apply ang split logic sa kung ano mang text ang active
                            return displayTitle.split(':').map((part, i) => (
                                <span key={i} className={i === 1 ? "text-slate-400 block md:inline" : "block"}>
                                    {i === 1 ? `: ${part}` : part}
                                </span>
                            ));
                        })()}
                    </h1>
                    
                    {/* Premium Meta Row */}
                    <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-white/10 pt-8">
                        {/* Author Profile */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all"></div>
                                <img 
                                    src={MediHelpAvatar} 
                                    alt="Author" 
                                    className="relative w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-2xl" 
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white tracking-tight uppercase">
                                    {articleData?.author_name || "MediHelp Team"}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                    Contributor
                                </p>
                            </div>
                        </div>

                        {/* Reading Stats */}
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Published</span>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <Calendar size={14} className="text-primary" />
                                    <span>{getFormattedDate(articleData?.created_date)}</span>
                                    <span className="text-slate-300">|</span>
                                    <Clock size={14} className="text-primary ml-1" />
                                    <span>{articleData?.created_time}</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reading Time</span>
                                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                    <Clock size={14} className="text-primary"/> {articleData.read_time}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator Dot */}
                <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-2">
                        Scroll
                    </span>
                    <div className="flex flex-col items-center animate-bounce">
                        {/* Upper Arrow */}
                        <ChevronDown 
                            size={18} 
                            className="text-primary -mb-2" 
                        />
                        {/* Lower Arrow */}
                        <ChevronDown 
                            size={18} 
                            className="text-primary" 
                        />
                    </div>
                </div>
            </header>

            {/* 3. MAIN CONTENT AREA (3 COLUMNS) */}
            <main className="max-w-[1440px] mx-auto px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* COLUMN 1: LEFT SIDEBAR (Sticky Table Of Contents) - Span 2 */}
                <aside className="hidden lg:block lg:col-span-2 sticky top-20 group/toc">
                    <div className="space-y-4">
                        {/* Header with Hide Button */}
                        <div 
                            className="flex items-center text-left justify-between pr-4"
                        >
                            <h4 className="text-[14px] font-extrabold text-foreground tracking-[0.2em]">
                                {translatedData?.ui?.toc || "Table of Contents"}
                            </h4>
                            <button className="opacity-0 group-hover/toc:opacity-100 transition-opacity p-1 hover:bg-primary rounded-md text-foreground hover:text-primary-foreground" title="Hide Menu">
                                <ChevronDown size={16} className="rotate-90" />
                            </button>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Navigation Container with Vertical Line */}
                        <div className="relative">
                            <nav 
                                className="flex flex-col gap-2 relative z-10 
                                    /* 1. LIMIT HEIGHT & SPACING */
                                    max-h-[450px] overflow-y-auto 
                                    
                                    /* 2. CUSTOM SCROLLBAR (Para hindi sagabal sa design) */
                                    scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-thumb]:bg-slate-200/50
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    
                                    /* 3. PADDING RIGHT PARA SA SCROLLBAR GAP */
                                    pr-3"
                            >
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-left transition-all duration-300 group relative overflow-hidden shrink-0 ${
                                            activeSection === section.id 
                                            ? 'bg-primary/5 text-primary' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {/* 4. INDICATOR LINE - Mas manipis at saktong position */}
                                        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary transition-transform duration-300 origin-left ${
                                            activeSection === section.id ? 'scale-y-100' : 'scale-y-0'
                                        }`} />

                                        {/* 5. TEXT LABEL - Inalis ang malaking translate-x para hindi "lumilipad" */}
                                        <span className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${
                                            activeSection === section.id 
                                            ? 'translate-x-1 opacity-100' 
                                            : 'translate-x-0 opacity-70 group-hover:opacity-100'
                                        }`}>
                                            {section.label}
                                        </span>

                                        {/* 6. ICON - Mas maliit para hindi agaw-pansin */}
                                        {activeSection === section.id ? (
                                            <div className="bg-primary/20 text-primary p-0.5 rounded-md animate-in zoom-in duration-300">
                                                <ChevronRight size={10} strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <ChevronRight 
                                                size={12} 
                                                className="opacity-0 -translate-x-2 group-hover:opacity-30 group-hover:translate-x-0 transition-all duration-300" 
                                            />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* COLUMN 2: MAIN CONTENT */}
                <article id="article-pdf-area" className="lg:col-span-8 text-left">
                    <div id="introduction" className="max-w-3xl mx-auto scroll-mt-28">
                        <ArticleContent 
                            data={currentLang.code !== 'en' && translatedData ? translatedData : articleData}
                            isTranslating={isTranslating}
                            currentLang={currentLang}
                            onLangChange={handleLanguageChange}
                            textSizeClass={textSizeMap}
                            // Siguraduhin na ang mga display props ay nanggagaling din sa tamang source
                            displayTitle={translatedData?.title || articleData?.title}
                            displayContent={translatedData?.full_content || articleData?.full_content}
                            displayExternal={translatedData?.external_link || articleData?.external_link}
                        />

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-4 mb-4"
                        >
                            <div className="bg-card rounded-[2.5rem] p-8 md:p-12 text-center group relative overflow-hidden">
                                {/* Decorative Glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
                                
                                <div className="relative z-10 space-y-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <Home size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            Finished Reading?
                                        </p>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                                        Explore more health <br /> 
                                        <span className="text-primary italic">insights & guidance.</span>
                                    </h2>

                                    <button 
                                        onClick={() => navigate('/dashboard/guidance-library')} // I-adjust ang path kung kailangan
                                        className="inline-flex cursor-pointer items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-2xl shadow-black/20 active:scale-95"
                                    >
                                        Return to Guidance Library
                                        <ArrowLeft size={18} className="rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </article>

                {/* COLUMN 3: RIGHT SIDEBAR (Appearance & Tools) */}
                <aside className="lg:col-span-2 sticky top-20 group/right">
                    <div className="space-y-4 text-left">
                        
                        {/* APPEARANCE SECTION */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between pr-4">
                                <h4 className="text-[14px] font-extrabold text-foreground tracking-[0.2em]">
                                    {translatedData?.ui?.related || "Appearance"}
                                </h4>
                                <button className="opacity-0 group-hover/right:opacity-100 transition-all p-1 hover:bg-primary rounded-md text-foreground hover:text-primary-foreground" title="Hide Menu">
                                    <ChevronDown size={16} className="-rotate-90" />
                                </button>
                            </div>
                            
                            <hr className="border-slate-100" />

                            {/* Text Size */}
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <p className="text-[12px] font-bold text-foreground">
                                        {translatedData?.ui?.size || "Text Size"}
                                    </p>
                                    <hr className="border-slate-100" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    {['small', 'standard', 'large', 'extraLarge'].map((size) => {
                                        const isActive = textSize === size;
                                        
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setTextSize(size)}
                                                className={`group relative cursor-pointer flex items-center gap-4 w-full py-3.5 px-4 rounded-xl transition-all duration-300 bg-transparent 
                                                    active:scale-[0.98]
                                                    ${isActive ? 'pl-6' : 'hover:bg-slate-50 hover:pl-6'}`}
                                            >
                                                {/* Vertical Indicator sa kaliwa */}
                                                <div className={`absolute left-0 w-1 bg-primary rounded-full transition-all duration-300 
                                                    ${isActive ? 'h-1/2' : 'h-0 group-hover:h-1/2'}`} 
                                                />

                                                {/* Custom Radio Circle */}
                                                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-500 
                                                    ${isActive 
                                                        ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                                        : 'border-slate-200 group-hover:border-slate-400'
                                                    }`}>
                                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 transform 
                                                        ${isActive 
                                                            ? 'bg-primary scale-100' 
                                                            : 'bg-slate-300 scale-0 group-hover:scale-50 opacity-50'
                                                        }`} 
                                                    />
                                                </div>

                                                {/* Text Labels */}
                                                <div className="flex flex-col items-start text-left">
                                                    <span className={`text-[12px] font-black uppercase tracking-tight transition-colors duration-300 
                                                        ${isActive ? 'text-foreground' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                                        {size}
                                                    </span>
                                                    <span className={`text-[9px] font-medium text-slate-400 leading-none transition-opacity duration-300
                                                        ${isActive ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        {isActive ? 'Current Size' : `Switch to ${size}`}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* TOOLS SECTION */}
                        <div className="space-y-2">
                            <h4 className="text-[12px] font-bold text-foreground tracking-widest">
                                {translatedData?.ui?.tool || "Tools"}
                            </h4>
                            <hr className="border-slate-100" />
                            <div className="flex flex-col gap-1.5 px-1">
                                {[
                                    { 
                                        icon: <Share2 size={15} />, 
                                        label: 'Share Article', 
                                        color: 'hover:text-blue-900',
                                        action: handleShare 

                                    },
                                    { 
                                        icon: <Bookmark size={15} />, 
                                        label: 'Save to Library', 
                                        color: 'hover:text-emerald-900',
                                        action: handleSaveToLibrary
                                    },
                                    { 
                                        icon: <Download size={15} />, 
                                        label: 'Download PDF', 
                                        color: 'hover:text-amber-900',
                                        action: handleDownload 
                                    }
                                ].map((tool, i) => (
                                    <button 
                                        key={i}
                                        onClick={tool.action} 
                                        className={`
                                            group flex items-center gap-3 w-full py-2.5 px-3 rounded-xl
                                            text-slate-500 font-extrabold text-[12px] tracking-tight
                                            border border-transparent hover:text-color
                                            hover:bg-white hover:border-slate-100 hover:shadow-sm
                                            active:scale-95 transition-all duration-200 cursor-pointer
                                            ${tool.color}
                                        `}
                                    >
                                        {/* Icon Container with subtle background on hover */}
                                        <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-slate-200 group-hover:bg-opacity-10 transition-colors">
                                            {tool.icon}
                                        </div>
                                        
                                        <span className="flex-1 text-left">
                                            {tool.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* FOOTER AREA */}
            <footer className="max-w-8xl mx-auto px-6 pt-8 pb-18 border-t border-slate-100">
                <div className="max-w-4xl space-y-4 text-left">
                    {/* Timestamp */}
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        This page was last edited on {getFormattedDate()}.
                    </p>

                    {/* License & Terms */}
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Text is available under the <span className="text-primary hover:underline cursor-pointer">MediHelp Creative Commons License</span>; 
                        additional terms may apply. By using this site, you agree to the 
                        <span className="text-slate-900 font-bold hover:underline cursor-pointer"> Terms of Use</span> and 
                        <span className="text-slate-900 font-bold hover:underline cursor-pointer"> Privacy Policy</span>. 
                        MediHelp® is a registered trademark of the MediHelp Foundation, Inc., a non-profit organization.
                    </p>

                    {/* Minimal Horizontal Links */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4">
                        {[
                            "Privacy policy", "About MediHelp", "Disclaimers", 
                            "Contact MediHelp", "Developers", "Cookie statement", "Mobile view"
                        ].map((link) => (
                            <a 
                                key={link} 
                                href="#" 
                                className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-tight"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ArticlePage;