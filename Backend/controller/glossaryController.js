const db = require('../config/db');

// Kunin ang lahat ng glossary terms (isinaayos pa-alpabeto)
exports.getAllGlossary = async (req, res) => {
    try {
        const query = `
            SELECT gg.*, ac.category_name 
            FROM guidance_glossary gg
            LEFT JOIN article_categories ac ON gg.cat_id = ac.category_id
            ORDER BY gg.term ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all glossary terms:", err);
        res.status(500).json({ error: err.message });
    }
};

// I-filter ang glossary base sa isang partikular na kategorya
exports.getGlossaryByCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;
        const query = `
            SELECT gg.*, ac.category_name 
            FROM guidance_glossary gg
            LEFT JOIN article_categories ac ON gg.cat_id = ac.category_id
            WHERE gg.cat_id = ?
            ORDER BY gg.term ASC
        `;
        const [rows] = await db.query(query, [cat_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching glossary by category:", err);
        res.status(500).json({ error: err.message });
    }
};

// Kumuha ng isang partikular na terminolohiya gamit ang ID nito
exports.getGlossaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT gg.*, ac.category_name 
            FROM guidance_glossary gg
            LEFT JOIN article_categories ac ON gg.cat_id = ac.category_id
            WHERE gg.glossary_id = ?
        `;
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Glossary term not found." });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching glossary by id:", err);
        res.status(500).json({ error: err.message });
    }
};