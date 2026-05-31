const db = require('../config/db');

// Kunin ang lahat ng gabay sa paunang lunas (First Aid Guides)
exports.getAllSop = async (req, res) => {
    try {
        const query = `
            SELECT gs.*, ac.category_name, ac.icon_name 
            FROM guidance_sop gs
            LEFT JOIN article_categories ac ON gs.cat_id = ac.category_id
            ORDER BY gs.created_date DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all SOP structures:", err);
        res.status(500).json({ error: err.message });
    }
};

// I-filter ang mga gabay o SOP base sa kategorya
exports.getSopByCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;
        const query = `
            SELECT gs.*, ac.category_name, ac.icon_name 
            FROM guidance_sop gs
            LEFT JOIN article_categories ac ON gs.cat_id = ac.category_id
            WHERE gs.cat_id = ?
            ORDER BY gs.created_date DESC
        `;
        const [rows] = await db.query(query, [cat_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching SOP by category:", err);
        res.status(500).json({ error: err.message });
    }
};

// Kumuha ng isang detalyadong SOP gamit ang ID nito
exports.getSopById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT gs.*, ac.category_name, ac.icon_name 
            FROM guidance_sop gs
            LEFT JOIN article_categories ac ON gs.cat_id = ac.category_id
            WHERE gs.sop_id = ?
        `;
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "First aid guide protocol not found." });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching SOP by id:", err);
        res.status(500).json({ error: err.message });
    }
};