import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, Home, ArrowLeft, LayoutList, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from '../components/ui/ScrollTopButton';
import { showToast } from '../components/ToastMessage';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import DownloadPDFModal from '../components/modals/DownloadPDFModal';
import MobileDrawer from '../components/modals/MobileDrawer';

// Import sub-components
import ArticleLeftSidebar from './article-page/ArticleLeftSidebar';
import ArticleMainContent from './article-page/ArticleMainContent';
import ArticleRightSidebar from './article-page/ArticleRightSidebar';

const ArticlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [articleData, setArticleData] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [textSize, setTextSize] = useState('standard');
    const [activeSection, setActiveSection] = useState('introduction');
    const [maxScroll, setMaxScroll] = useState(0);
    const [isReadyToTrack, setIsReadyToTrack] = useState(false);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [userFeedback, setUserFeedback] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uiLabels, setUiLabels] = useState({
        backBtn: "Back to Library",
        // LEFT SIDEBAR
        toc: "Table of Contents",
        subtoc: "Education Library",
        tip: "Tip: Use the text size tools on the right for better readability.",
        // RIGHT SIDEBAR
        appearance: "Appearance",
        textSize: "Text Size",
        sizeSmall: "Small",
        sizeStandard: "Standard",
        sizeLarge: "Large",
        tool: "Tools",
        buttonShare: "Share",
        buttonSaved: "Saved to Library",
        buttonSave: "Save Article",
        buttonDownload: "Download PDF",
        wasHelpful: "Was this helpful?",
        yes: "Yes",
        no: "No",
        needHelp: "Need Help?",
        descHelp: "Found a mistake or have medical concerns? Reach out to our team.",
        contactSupport: "Contact Support",
        // MAIN CONTENT
        // isama mo din to "By {article?.author_name}"
        // isama mo din to "{labels.lastEdited} recently"
        view: "views",
        link: "External Links",
        finishedReading: "Finished Reading?",
        exploreMore: "Explore more health",
        insightsGuidance: "insights & guidance.",
        returnBtn: "Return to Education Library",
        isTranslatingTitle: "Translating Content",
        isTranslatingSubtitle: "Please wait a moment",
        // FOOTER
        lastEdited: "This page was last edited on",
        licenseText: "Text is available under the MediHelp Creative Commons License; additional terms may apply. By using this site, you agree to the Terms of Use and Privacy Policy.",
        footerLinks: [
            { label: "Privacy policy", path: "/privacy" },
            { label: "About MediHelp", path: "/about-us" },
            { label: "Disclaimers", path: "/disclaimer" },
            { label: "Terms of Use", path: "/terms" },
            { label: "Contact MediHelp", path: "/contact" },
            { label: "Developers", path: "/developers" },
            { label: "Cookie statement", path: "/cookies" }
        ]
    });
    const [selectedLangCode, setSelectedLangCode] = useState(localStorage.getItem('preferredLanguage') || 'en');

    // Gamitin ang useRef para sa values na kailangan sa cleanup functions
    const scrollRef = useRef(0);
    const idRef = useRef(id);

    // I-update ang Ref kapag nagbago ang ID
    useEffect(() => { idRef.current = id; }, [id]);

    // 1. FETCH & TOC GENERATION
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                const rawHTML = res.data.full_content;
                const parser = new DOMParser();
                const doc = parser.parseFromString(rawHTML, 'text/html');
                const h3Headers = doc.querySelectorAll('h3');
                
                const dynamicSections = [{ id: 'introduction', label: 'Introduction' }];
                let sectionCounter = 0;

                h3Headers.forEach((h3) => {
                    const headerText = h3.innerText.trim();
                    if (headerText.toLowerCase() === 'introduction') {
                        h3.setAttribute('id', 'introduction');
                    } else {
                        const sectionId = `section-${sectionCounter}`;
                        h3.setAttribute('id', sectionId);
                        dynamicSections.push({ id: sectionId, label: headerText });
                        sectionCounter++;
                    }
                });

                if (res.data.external_link) {
                    dynamicSections.push({ id: 'external-link', label: 'External Links' });
                }

                setSections(dynamicSections);
                setArticleData({ ...res.data, full_content: doc.body.innerHTML });

                setArticleData(res.data);
            
                // DITO ANG FIX:
                // Dapat ang backend mo ay nagbabalik kung saved na ba ito (e.g., res.data.isSaved)
                // Kung hindi, kailangan mong i-check sa library:
                checkIfSaved(); 

                if (res.data.content_sections) {
                    setSections(JSON.parse(res.data.content_sections));
                }
            } catch (err) {
                console.error("Error fetching article:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    // Function para i-verify kung saved na ang article na ito
    const checkIfSaved = async () => {
        try {
            const res = await api.get('/articles/library', {
                withCredentials: true
            });
            // I-check kung yung ID ng article ngayon ay nasa listahan ng saved articles
            const saved = res.data.some(item => item.article_id === parseInt(id));
            setIsSaved(saved);
        } catch (err) {
            console.error("Check saved error:", err);
        }
    };

    const getFormattedDate = () => {
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // UPDATE 1: Browser Title Logic
    useEffect(() => {
        if (articleData && articleData.title) {
            document.title = `${articleData.title} | MediHelp`;
        } else {
            document.title = "MediHelp";
        }

        // Optional: Ibalik sa "MediHelp" kapag umalis sa page
        return () => {
            document.title = "MediHelp";
        };
    }, [articleData]);

    useEffect(() => {
        const handleScroll = () => {
            // 1. Kunin ang total height na pwedeng i-scroll
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            const scrollY = window.scrollY;

            // 2. Calculate progress (0 to 100)
            const totalScrollable = fullHeight - windowHeight;
            if (totalScrollable > 0) {
                const currentProgress = (scrollY / totalScrollable) * 100;
                // I-set ang state para mag-re-render ang progress bar
                setMaxScroll(currentProgress);
            }
        };

        // Makinig sa global window scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial calculation
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Magdagdag ng cleanup para i-save ang final progress pag-alis ng user
    useEffect(() => {
        return () => {
            const saveFinalProgress = async () => {
                if (maxScroll > 0) {
                    try {
                        await api.post('/articles/update-progress', {
                            articleId: id,
                            progress: maxScroll
                        }
                    } catch (err) {
                        console.error("Failed to save progress on leave");
                    }
                }
            };
            saveFinalProgress();
        };
    }, [id, maxScroll]);

    const textSizeClasses = {
        small: 'text-sm [&_p]:text-sm [&_h3]:text-lg [&_li]:text-sm',
        standard: 'text-base [&_p]:text-base [&_h3]:text-xl [&_li]:text-base',
        large: 'text-lg [&_p]:text-lg [&_h3]:text-2xl [&_li]:text-lg',
    };

    // =================================================================================
    // SHARE FUNCTION
    const handleShare = async () => {
        const shareData = {
            title: articleData?.title,
            text: `Check out this health guidance: ${articleData?.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                // 1. Notify user that the native share sheet is opening
                showToast("Opening share options...", "info");
                
                // 2. Trigger native browser/mobile share dialog
                await navigator.share(shareData);
                
            } catch (err) {
                // Handle cases where the user manually closes or cancels the share window
                if (err.name === 'AbortError') {
                    showToast("Share cancelled.", "info");
                } else {
                    showToast("Something went wrong while sharing.", "error");
                }
            }
        } else {
            // Fallback for browsers that don't support the Web Share API (e.g., Desktop Firefox)
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "success");
            } catch (err) {
                showToast("Failed to copy link.", "error");
            }
        }
    };
    // =================================================================================

    // =================================================================================
    // SAVED ARTICLE LIBRARY
    useEffect(() => {
        const checkSaveStatus = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            // Gamitin ang 'id' mula sa useParams()
            if (userData?.UserID && id) {
                try {
                    const response = await api.get(`/articles/save-status/${userData.UserID}/${id}`);
                    setIsSaved(response.data.isSaved);
                } catch (err) {
                    console.error("Error checking save status:", err);
                }
            }
        };
        checkSaveStatus();
    }, [id]);

    const handleBackToSaved = () => {
        navigate('/dashboard/health-insights?view=saved');
    };

    const handleSaveToLibrary = async () => {
        try {
            const response = await api.post('/articles/save-toggle',
                { articleId: id }, 
                { withCredentials: true } // Importante para sa cookies/token
            );

            const isNowSaved = response.data.saved;
            setIsSaved(isNowSaved);

            if (isNowSaved) {
                const newSavedStatus = !isSaved; 
                setIsSaved(newSavedStatus)

                // Success Feedback with Link instruction
                showToast(
                    <span>
                        Saved to library! View it in your 
                        <button 
                            onClick={handleBackToSaved}
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
    // =================================================================================

    // =================================================================================
    // DOWNLOAD PDF FUNCTION
    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // 1. The Trigger: This starts the flow when the tool icon is clicked
    const openDownloadFlow = () => {
        showToast("Preparing your PDF File...", "info");
        
        // Small delay to let the toast be seen before the modal pops up
        setTimeout(() => {
            setIsPDFModalOpen(true);
        }, 800);
    };

    // 2. The Executor: This runs when "Download Now" is clicked INSIDE the modal
    const handleDownloadPDF = async () => {
        try {
            setIsGeneratingPDF(true);
            
            const pdfDoc = await PDFDocument.create();
            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            
            let page = pdfDoc.addPage([595.28, 841.89]);
            const { width, height } = page.getSize();
            
            const fontSize = 11;
            const lineHeight = 14; 
            const paragraphGap = 10; 
            const margin = 50;
            const maxWidth = width - (margin * 2);
            let currentY = height - margin;

            // --- HEADER ---
            page.drawText("MediHelp Guidance Library", {
                x: margin, y: currentY, size: 16, font: timesBoldFont, color: rgb(0, 0.53, 0.71),
            });
            currentY -= 30;

            // --- TITLE ---
            const titleText = articleData?.title || "Health Article";
            page.drawText(titleText, { x: margin, y: currentY, size: 14, font: timesBoldFont });
            currentY -= 20;

            // --- DATE & AUTHOR ---
            const dateStr = articleData?.created_date ? new Date(articleData.created_date).toLocaleDateString() : "N/A";
            page.drawText(`Published: ${dateStr} | Author: ${articleData?.author_name || 'MediHelp'}`, {
                x: margin, y: currentY, size: 9, font: timesRomanFont, color: rgb(0.4, 0.4, 0.4)
            });
            currentY -= 35; 

            // --- CONTENT LOGIC ---
            const cleanContent = stripHtml(articleData?.full_content || articleData?.content || "");
            const paragraphs = cleanContent.split(/\n\s*\n/); 

            for (const paragraph of paragraphs) {
                const words = paragraph.trim().split(/\s+/);
                let line = '';

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const testLineWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);

                    if (testLineWidth > maxWidth) {
                        page.drawText(line.trim(), { x: margin, y: currentY, size: fontSize, font: timesRomanFont });
                        line = word + ' ';
                        currentY -= lineHeight; 

                        if (currentY < margin) {
                            page = pdfDoc.addPage([595.28, 841.89]);
                            currentY = height - margin;
                        }
                    } else {
                        line = testLine;
                    }
                }
                page.drawText(line.trim(), { x: margin, y: currentY, size: fontSize, font: timesRomanFont });
                currentY -= (lineHeight + paragraphGap);
            }

            // --- FINALIZE ---
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${titleText.replace(/\s+/g, '_')}_MediHelp.pdf`;
            link.click();

            // --- SUCCESS FEEDBACK ---
            setIsGeneratingPDF(false);
            setIsPDFModalOpen(false); // Close the modal automatically
            
            // As requested: showToast after successful download
            setTimeout(() => {
                showToast("Successfully downloaded!", "success");
            }, 300);

        } catch (error) {
            console.error(error);
            setIsGeneratingPDF(false);
            showToast("Error creating PDF", "error");
        }
    };
    // =================================================================================

    // =================================================================================
    // Was it Helpful FUNCTION
    // Magdagdag ng useEffect para i-check ang status pag-load
    useEffect(() => {
        const checkFeedbackStatus = async () => {
            try {
                const response = await api.get(`/articles/feedback-status/${id}`);
                if (response.data.hasFeedback) {
                    // Siguraduhin na boolean ang pagkaka-set (1 becomes true, 0 becomes false)
                    setUserFeedback(!!response.data.is_helpful);
                }
            } catch (err) {
                console.error("Error fetching feedback status:", err);
            }
        };

        if (id) checkFeedbackStatus();
    }, [id]);

    const handleFeedback = async (isHelpful) => {
        try {
            const response = await api.post('/articles/feedback', {
                article_id: id,
                is_helpful: isHelpful
            });

            if (response.data.success) {
                setUserFeedback(isHelpful); // Eto yung magpapalit ng kulay agad
                showToast("Thank you for your feedback!", "success");
            }
        } catch (err) {
            showToast("Failed to submit feedback", "error");
        }
    };
    // =================================================================================

    // =================================================================================
    // LANGUAGE TRANSLATE FUNCTION
    const handleTranslate = async (targetLangCode) => {
        if (isTranslating) return;

        // 1. Instant state updates
        setSelectedLangCode(targetLangCode);
        setIsTranslating(true);

        try {
            // 2. MABILISANG TRANSLATION PARA SA LOADER LANG (Para hindi English ang makita ng user)
            const loaderRes = await api.post('/translate/process', {
                text: ["Translating Content", "Please wait a moment"],
                targetLang: targetLangCode
            });
            
            const [tTitle, tSubtitle] = loaderRes.data.translatedText;

            // I-update agad ang UI para sa Loader
            setUiLabels(prev => ({
                ...prev,
                isTranslatingTitle: tTitle,
                isTranslatingSubtitle: tSubtitle
            }));

            // 3. MAIN TRANSLATION (Article + UI Labels)
            const footerLabels = uiLabels.footerLinks.map(f => f.label);
            
            const textToTranslate = [
                articleData.title,           // [0]
                articleData.full_content,    // [1]
                articleData.external_link || "", // [2]
                uiLabels.backBtn,            // [3]
                uiLabels.toc,                // [4]
                uiLabels.subtoc,             // [5]
                uiLabels.tip,                // [6]
                uiLabels.appearance,         // [7]
                uiLabels.textSize,           // [8]
                uiLabels.sizeSmall,          // [9]
                uiLabels.sizeStandard,       // [10]
                uiLabels.sizeLarge,          // [11]
                uiLabels.tool,               // [12]
                uiLabels.buttonShare,        // [13]
                uiLabels.buttonSaved,        // [14]
                uiLabels.buttonSave,         // [15]
                uiLabels.buttonDownload,     // [16]
                uiLabels.wasHelpful,         // [17]
                uiLabels.yes,                // [18]
                uiLabels.no,                 // [19]
                uiLabels.needHelp,           // [20]
                uiLabels.descHelp,           // [21]
                uiLabels.contactSupport,     // [22]
                uiLabels.view,               // [23]
                uiLabels.link,               // [24]
                uiLabels.lastEdited,         // [25]
                uiLabels.licenseText,        // [26]
                "By",                        // [27]
                "recently",                  // [28]
                uiLabels.finishedReading,    // [29]
                uiLabels.exploreMore,        // [30]
                uiLabels.insightsGuidance,   // [31]
                uiLabels.returnBtn,          // [32]
                ...footerLabels              // [33] onwards
            ];

            const mainRes = await api.post('/translate/process', {
                text: textToTranslate,
                targetLang: targetLangCode
            });

            const translated = mainRes.data.translatedText;

            // 4. FINAL STATE UPDATES
            setArticleData(prev => ({
                ...prev,
                title: translated[0],
                full_content: translated[1],
                external_link: translated[2]
            }));

            setUiLabels(prev => ({
                ...prev,
                backBtn: translated[3],
                toc: translated[4],
                subtoc: translated[5],
                tip: translated[6],
                appearance: translated[7],
                textSize: translated[8],
                sizeSmall: translated[9],
                sizeStandard: translated[10],
                sizeLarge: translated[11],
                tool: translated[12],
                buttonShare: translated[13],
                buttonSaved: translated[14],
                buttonSave: translated[15],
                buttonDownload: translated[16],
                wasHelpful: translated[17],
                yes: translated[18],
                no: translated[19],
                needHelp: translated[20],
                descHelp: translated[21],
                contactSupport: translated[22],
                view: translated[23],
                link: translated[24],
                lastEdited: translated[25],
                licenseText: translated[26],
                authorBy: translated[27],
                recently: translated[28],
                finishedReading: translated[29],
                exploreMore: translated[30],
                insightsGuidance: translated[31],
                returnBtn: translated[32],
                // Hindi na natin i-uupdate dito ang Loader Labels dahil updated na sila sa Step 2
                footerLinks: prev.footerLinks.map((link, index) => ({
                    ...link,
                    label: translated[33 + index] // Inadjust ko ang index (33 na dahil tinanggal natin yung loader labels sa array)
                }))
            }));
            localStorage.setItem('preferredLanguage', targetLangCode);
        } catch (error) {
            console.error("Translation Error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    // Auto-translate logic
    useEffect(() => {
        const savedLang = localStorage.getItem('preferredLanguage');
        
        // Kung ang saved lang ay HINDI English at tapos na mag-load ang main article data
        if (savedLang && savedLang !== 'en' && !loading && articleData) {
            // Tatawagin nito yung handleTranslate function mo automatic
            handleTranslate(savedLang);
        }
    }, [loading]); // Gagana lang ito kapag nagbago ang 'loading' status (mula true naging false)
    // =================================================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const handleBackToLibrary = () => {
        navigate('/dashboard/health-insights');
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">

            {/* PROGRESS BAR */}
            <div className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-10 pointer-events-none"> 
                <div className="container mx-auto relative px-6">
                    <div 
                        className="h-[3px] bg-primary transition-all duration-150 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${maxScroll}%` }}
                    />
                </div>
            </div>

            {/* MOBILE FLOATING HEADER (Visible only on small screens) */}
            <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between gap-4">
                {/* Left Button */}
                <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 hover:bg-primary/10 rounded-xl text-primary shrink-0">
                    <LayoutList size={20} />
                </button>

                {/* Title - Ginawang flex-1 at tinanggal ang fixed max-width */}
                <div className="flex-1 min-w-0 flex justify-center"> 
                    <span className="text-[11px] font-black uppercase tracking-wider text-foreground/60 truncate text-center">
                        {articleData?.title}
                    </span>
                </div>

                {/* Right Button */}
                <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 hover:bg-primary/10 rounded-xl text-primary shrink-0">
                    <Settings2 size={20} />
                </button>
            </div>

            {/* MODERN LOADER OVERLAY */}
            <AnimatePresence>
                {isTranslating && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-slate-950/30"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            {/* Outer Glow Effect */}
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                            
                            <div className="relative flex flex-col items-center gap-6 p-10 bg-card backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-border min-w-[280px]">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-primary" size={48} strokeWidth={1.5} />
                                    <motion.div 
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 1, 0.5] 
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute -top-1 -right-1 text-primary"
                                    >
                                        <Sparkles size={16} fill="currentColor" />
                                    </motion.div>
                                </div>
                                
                                <div className="space-y-1 text-center">
                                    <h3 className="text-lg font-black tracking-tight text-foreground">
                                        {/* I-check natin ang code na pinili ng user para sa instant translation */}
                                        {selectedLangCode === 'ja' ? "翻訳中..." : 
                                        selectedLangCode === 'ko' ? "번역 중..." : 
                                        selectedLangCode === 'tl' ? "Nagsasalin..." : 
                                        selectedLangCode === 'zh-CN' ? "正在翻译..." : 
                                        "Translating Content"}
                                    </h3>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
                                        {selectedLangCode === 'ja' ? "少々お待ちください" : 
                                        selectedLangCode === 'ko' ? "잠시만 기다려 주세요" : 
                                        selectedLangCode === 'tl' ? "Maghintay lamang..." : 
                                        selectedLangCode === 'zh-CN' ? "请稍候..." : 
                                        "Enhancing your experience"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3 COLUMN LAYOUT WRAPPER */}
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-4 lg:pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT SIDEBAR (Desktop: Sticky | Mobile: Drawer) */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-8 self-start h-[calc(100vh-3rem)]">
                        <ArticleLeftSidebar 
                            sections={sections} 
                            activeSection={activeSection} 
                            setActiveSection={setActiveSection}
                            labelBack={uiLabels.backBtn}
                            labelToc={uiLabels.toc}
                            labelSubtoc={uiLabels.subtoc}
                            labelTip={uiLabels.tip}
                        />
                    </aside>

                    {/* MAIN CONTENT: Scrollable Center */}
                    <main className="lg:col-span-6 pb-14">
                        <ArticleMainContent 
                            article={articleData} 
                            textSize={textSizeClasses[textSize]}
                            onTranslate={handleTranslate}
                            isTranslating={isTranslating}
                            labels={uiLabels}
                        />

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-14"
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
                                            {uiLabels.finishedReading}
                                        </p>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                                        {uiLabels.exploreMore} <br /> 
                                        <span className="text-primary italic">{uiLabels.insightsGuidance}</span>
                                    </h2>

                                    <button 
                                        onClick={handleBackToLibrary}
                                        className="inline-flex cursor-pointer items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-2xl shadow-black/20 active:scale-95"
                                    >
                                        {uiLabels.returnBtn}
                                        <ArrowLeft size={18} className="rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </main>

                    {/* RIGHT SIDEBAR (Desktop: Sticky | Mobile: Drawer) */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-8">
                        <ArticleRightSidebar 
                            textSize={textSize}      // Pass current state for active button styling
                            setTextSize={setTextSize} // Pass setter to change size
                            articleId={id}
                            onShare={handleShare}
                            onDownload={openDownloadFlow}
                            onSave={handleSaveToLibrary}
                            isSaved={isSaved}
                            onFeedback={handleFeedback}
                            userFeedback={userFeedback}
                            labelAppearance={uiLabels.appearance}
                            labelSize={uiLabels.textSize}
                            labelNeedHelp={uiLabels.needHelp}
                            labelContact={uiLabels.contactSupport}
                            labels={uiLabels}
                        />
                    </aside>

                </div>

                {/* --- MOBILE DRAWERS --- */}
                <MobileDrawer isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} side="left">
                    <ArticleLeftSidebar 
                        sections={sections} 
                        activeSection={activeSection} 
                        setActiveSection={setActiveSection}
                        onItemClick={() => setIsLeftSidebarOpen(false)} // Add this to close on click
                        labelBack={uiLabels.backBtn}
                        labelToc={uiLabels.toc}
                        labelSubtoc={uiLabels.subtoc}
                        labelTip={uiLabels.tip}
                    />
                </MobileDrawer>

                <MobileDrawer isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} side="right">
                    <ArticleRightSidebar 
                        setTextSize={setTextSize} 
                        textSize={textSize} 
                        onDownload={() => setIsPDFModalOpen(true)}
                        onSave={handleSaveToLibrary}
                        isSaved={isSaved}
                        onFeedback={handleFeedback}
                        userFeedback={userFeedback}
                        labelAppearance={uiLabels.appearance}
                        labelSize={uiLabels.textSize}
                        labelNeedHelp={uiLabels.needHelp}
                        labelContact={uiLabels.contactSupport}
                        labels={uiLabels} 
                    />
                </MobileDrawer>

                {/* FOOTER AREA: Spans across the bottom but stays within max-width */}
                <footer className="mt-12 py-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-4xl space-y-6">
                        <div className="space-y-4 text-left">
                            <p className="text-sm text-slate-400 font-medium">
                                {/* DAPAT GANITO LANG: Variable + Date */}
                                {uiLabels.lastEdited} {getFormattedDate()}
                            </p>
                            <p className="text-[13px] text-slate-500 leading-relaxed max-w-3xl">
                                {/* GAMITIN ANG DYNAMIC LICENSE TEXT */}
                                {uiLabels.licenseText}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4">
                            {/* SIGURADUHIN NA uiLabels.footerLinks ANG GINAGAMIT SA MAP */}
                            {uiLabels.footerLinks.map((item) => (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-tight"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </footer>

                <ScrollToTop progress={maxScroll} />

                <DownloadPDFModal 
                    isOpen={isPDFModalOpen}
                    onClose={() => setIsPDFModalOpen(false)}
                    onConfirm={handleDownloadPDF} // This executes the actual generation logic
                    articleData={articleData}
                    isGenerating={isGeneratingPDF} // Passes the loading state for the button spinner
                />

            </div>
        </div>
    );
};

export default ArticlePage;
