const db = require('../config/db');

exports.getFeaturedArticles = async (req, res) => {
    try {
        // Gamitin ang [rows] format gaya ng sa userDetails
        const query = "SELECT * FROM guidance_articles ORDER BY view_count DESC LIMIT 3";
        const [rows] = await db.query(query);
        
        res.json(rows);
    } catch (err) {
        console.error("Error fetching featured articles:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllArticles = async (req, res) => {
    try {
        const query = `
            SELECT 
                ga.*, 
                ac.category_name, 
                ac.icon_name 
            FROM guidance_articles ga
            LEFT JOIN article_categories ac ON ga.cat_id = ac.category_id
            ORDER BY ga.created_date DESC
        `;
        const [rows] = await db.query(query);
        
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all articles:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const query = `
            SELECT 
                ac.category_id, 
                ac.category_name, 
                ac.icon_name, 
                COUNT(ga.article_id) AS article_count
            FROM article_categories ac
            LEFT JOIN guidance_articles ga ON ac.category_id = ga.cat_id
            GROUP BY ac.category_id, ac.category_name, ac.icon_name
            ORDER BY ac.category_name ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getArticlesByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        let query = `
            SELECT ga.*, ac.category_name, ac.icon_name 
            FROM guidance_articles ga
            JOIN article_categories ac ON ga.cat_id = ac.category_id
        `;
        
        // Kung hindi "All", mag-filter tayo
        if (categoryId && categoryId !== 'all') {
            query += " WHERE ga.cat_id = ?";
        }
        
        query += " ORDER BY ga.created_date DESC";
        
        const [rows] = await db.query(query, categoryId !== 'all' ? [categoryId] : []);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                ga.title,
                ad.author_name,
                ga.image_url,
                ga.created_date,
                ga.created_time,
                ga.read_time,
                ga.view_count,
                ad.full_content, 
                ad.references_list,
                ac.category_name 
            FROM guidance_articles ga
            JOIN article_details ad ON ga.article_id = ad.article_id
            LEFT JOIN article_categories ac ON ga.cat_id = ac.category_id -- I-join ang categories
            WHERE ga.article_id = ?
        `;
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching article detailed info:", err);
        res.status(500).json({ error: err.message });
    }
};