const db = require('../config/db');

// Kunin ang lahat ng infographics materials
exports.getAllInfographics = async (req, res) => {
    try {
        const query = `
            SELECT gi.*, ac.category_name 
            FROM guidance_infographics gi
            LEFT JOIN article_categories ac ON gi.cat_id = ac.category_id
            ORDER BY gi.created_date DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all infographics materials:", err);
        res.status(500).json({ error: err.message });
    }
};

// I-filter ang infographics base sa kategorya
exports.getInfographicsByCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;
        const query = `
            SELECT gi.*, ac.category_name 
            FROM guidance_infographics gi
            LEFT JOIN article_categories ac ON gi.cat_id = ac.category_id
            WHERE gi.cat_id = ?
            ORDER BY gi.created_date DESC
        `;
        const [rows] = await db.query(query, [cat_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching infographics by category:", err);
        res.status(500).json({ error: err.message });
    }
};

// Kumuha ng isang infographic file data gamit ang ID nito
exports.getInfographicById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT gi.*, ac.category_name 
            FROM guidance_infographics gi
            LEFT JOIN article_categories ac ON gi.cat_id = ac.category_id
            WHERE gi.infographic_id = ?
        `;
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Infographic poster data not found." });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching infographic record by id:", err);
        res.status(500).json({ error: err.message });
    }
};