import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import { useParams, useNavigate } from 'react-router-dom';

import LibraryHero from './library-compo/LibraryHero';
import FeaturedResources from './library-compo/FeaturedResources';
import CategoryFilters from './library-compo/CategoryFilters';
import RecentHistory from './library-compo/RecentHistory';
import ArticleList from './library-compo/ArticleList';

const GuidanceLibrary = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [selectedCatId, setSelectedCatId] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isArchivedOpen, setIsArchivedOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Only fetch the list data here
                const [catRes, artRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/articles/categories'),
                    axios.get('http://localhost:5000/api/articles/all')
                ]);
                
                setCategories(catRes.data);
                setArticles(artRes.data);

                // Fetch specific article ONLY if an ID exists in the URL
                if (id) {
                    const articleRes = await axios.get(`http://localhost:5000/api/articles/${id}`);
                    // Do something with articleRes.data if needed
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Logic para sa pag-filter ng articles sa tabi ng sidebar
    // --- LIVE SEARCH & FILTER LOGIC ---
    const displayArticles = articles.filter(art => {
        // 1. Search Logic (Gumagana na ito sabi mo)
        const matchesSearch = 
            art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            art.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 2. Category Logic Fix
        // Gagamit tayo ng loose comparison (==) imbes na strict (===) 
        // para hindi tayo magkaproblema sa String vs Number
        const matchesCategory = 
            selectedCatId === 'all' || 
            String(art.category_id) === String(selectedCatId) ||
            art.category_name === categories.find(c => String(c.category_id) === String(selectedCatId))?.category_name;

        // DEBUGGING: I-uncomment mo ito para makita sa Console kung bakit false ang match
        // console.log(`Article: ${art.title} | ID sa DB: ${art.category_id} | Selected ID: ${selectedCatId} | Match: ${matchesCategory}`);

        if (searchQuery !== "") return matchesSearch;
        return matchesCategory;
    });
    
    const handleArticleClick = async (articleId) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            console.log("FULL USER OBJECT:", userData); // Tingnan mo ito sa Console
    
            // Subukan nating i-check kung 'id', 'UserID', o 'id_user' ang tawag
            const userId = userData?.UserID || userData?.id || userData?.userID;

            // Debug log para makita mo sa Console (F12) kung may laman ba talaga
            console.log("UserID:", userId, "ArticleID:", articleId);

            if (userId && articleId) {
                // Siguraduhin na ang second argument ng axios.post ay ang object data
                await axios.post('http://localhost:5000/api/articles/record-visit', {
                    userId: userId,
                    articleId: articleId
                });
            }

            navigate(`/dashboard/guidance-library/article/${articleId}`);
        } catch (error) {
            console.error("Tracking Error:", error);
            navigate(`/dashboard/guidance-library/article/${articleId}`);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Background Decor from your index.css logic */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-subtle" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue/5 blur-[100px] rounded-full" />
            </div>

            <div className="pt-26 pb-8 relative z-10">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* 1. Header Section */}
                    <LibraryHero 
                        searchQuery={searchQuery} 
                        onSearch={(val) => {
                            setSearchQuery(val);
                            if(val !== "") setSelectedCatId('all'); // Reset category pag nag-search
                        }}
                    />

                    {/* 2. Featured Health Resources */}
                    {searchQuery === "" && (
                        <div className="animate-in fade-in duration-500">
                            <FeaturedResources onArticleClick={handleArticleClick} />
                        </div>
                    )}

                    {/* 3. Two-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-14">
                        {/* Left: Sidebar (5 cols) */}
                        <aside className="lg:col-span-4">
                            <CategoryFilters 
                                categories={categories}       // Ito yung data mula sa API
                                activeId={selectedCatId}     // Yung state para sa filter
                                onSelect={(id) => {
                                    console.log("Selected Category ID:", id); // I-debug mo dito kung undefined ang ID
                                    setSelectedCatId(id);
                                    setSearchQuery(""); 
                                }}
                            />
                        </aside>

                        {/* Right: Dynamic Article List (8 cols) */}
                        <main className="lg:col-span-8">
                            <ArticleList 
                                articles={displayArticles} 
                                categoryName={
                                    searchQuery !== "" 
                                        ? `Search Results for: "${searchQuery}"` 
                                        : selectedCatId === 'all'
                                            ? 'All Resources'
                                            // Gamitan ng loose equality (==) para mahanap ang name kahit magkaiba ang data type
                                            : categories.find(c => c.category_id == selectedCatId)?.category_name || "Specialized Category"
                                }
                                loading={loading}
                                onOpenHistory={() => setIsHistoryOpen(true)}
                                onArticleClick={handleArticleClick}
                            />
                        </main>
                    </div>
                </div>
            </div>

            <RecentHistory 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
            />
        </div>
    );
};

export default GuidanceLibrary;