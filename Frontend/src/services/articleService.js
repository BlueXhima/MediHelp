// Frontend/src/services/articleService.js

import api from '../api/axios';

let articlesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const articleService = {
    getAllArticles: async () => {
        try {
            const now = Date.now();
            if (articlesCache && (now - cacheTimestamp) < CACHE_TTL) {
                return articlesCache;
            }
            const response = await api.get('/articles/all');
            articlesCache = response.data;
            cacheTimestamp = now;
            return response.data;
        } catch (error) {
            console.error("Error fetching articles from database:", error);
            throw error;
        }
    },

    getArticleById: async (id) => {
        try {
            const response = await api.get(`/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching article with ID ${id}:`, error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('/articles/categories');
            return response.data;
        } catch (error) {
            console.error("Error fetching article categories:", error);
            throw error;
        }
    },

    findByTitle: async (title) => {
        const articles = await articleService.getAllArticles();
        const normalized = title.toLowerCase().trim();
        return articles.find(a => a.title.toLowerCase().includes(normalized) || normalized.includes(a.title.toLowerCase())) || null;
    },

    mapAiArticles: async (aiArticles) => {
        if (!Array.isArray(aiArticles) || aiArticles.length === 0) return [];
        const articles = await articleService.getAllArticles();
        return aiArticles.map(aiArt => {
            const normalizedTitle = aiArt.title.toLowerCase().trim();
            const match = articles.find(a => a.title.toLowerCase().includes(normalizedTitle) || normalizedTitle.includes(a.title.toLowerCase()));
            if (match) {
                return {
                    id: match.id || match._id,
                    title: match.title,
                    source: match.source || 'MediHelp Library',
                    readTime: match.readTime || `${Math.ceil((match.content?.length || 1200) / 240)} min read`,
                    url: `/library/article/${match.id || match._id}`
                };
            }
            return {
                id: null,
                title: aiArt.title,
                source: aiArt.source || 'MediHelp Library',
                readTime: aiArt.readTime || '5 min read',
                url: '/library'
            };
        });
    }
};