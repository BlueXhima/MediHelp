const db = require('../config/db');

exports.getFeaturedArticles = async (req, res) => {
    try {
        // Gamitin ang [rows] format gaya ng sa userDetails
        const query = `
            SELECT ga.*, ac.category_name 
            FROM guidance_articles ga
            LEFT JOIN article_categories ac ON ga.cat_id = ac.category_id
            ORDER BY ga.view_count DESC LIMIT 3
        `;
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
                ad.external_link,
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

// Dito natin pinagsasama ang view_count increment at ang history logging.
exports.recordArticleVisit = async (req, res) => {
    const { userId, articleId } = req.body;
    
    // DAPAT LUMABAS ITO SA TERMINAL MO
    console.log("DATA RECEIVED FROM FRONTEND:", { userId, articleId });

    try {
        const [result] = await db.query(
            "UPDATE guidance_articles SET view_count = view_count + 1 WHERE article_id = ?", 
            [articleId]
        );
        
        // KUNG 0 ITO, IBIG SABIHIN MALI YUNG articleId NA PINADALA
        console.log("ROWS UPDATED:", result.affectedRows); 

        await db.query(`
            INSERT INTO user_reading_history (user_id, article_id, last_visited)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE last_visited = CURRENT_TIMESTAMP
        `, [userId, articleId]);

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.error("SQL ERROR:", err.message); // DITO LALABAS KUNG MALI ANG TABLE NAMES
        res.status(500).json({ error: err.message });
    }
};

// Ito ang gagamitin mo para ipakita ang "Recently Reading History" sa UI.
exports.getUserHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT
                h.history_id, 
                h.last_visited, 
                h.progress_percentage,
                ga.article_id,
                ga.title,
                ga.image_url,
                ac.category_name 
            FROM user_reading_history h
            INNER JOIN guidance_articles ga ON h.article_id = ga.article_id
            LEFT JOIN article_categories ac ON ga.cat_id = ac.category_id
            WHERE h.user_id = ?
            ORDER BY h.last_visited DESC
        `;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReadingProgress = async (req, res) => {
    const { userId, articleId, progress } = req.body;

    try {
        const query = `
            UPDATE user_reading_history 
            SET progress_percentage = ? 
            WHERE user_id = ? AND article_id = ?
        `;
        await db.query(query, [progress, userId, articleId]);
        res.status(200).json({ message: "Reading progress updated" });
    } catch (err) {
        console.error("Error updating progress:", err);
        res.status(500).json({ error: err.message });
    }
};

// ---- Article Endpoint API functions -----

// Endpoint para i-purge/archive ang history
// ---- Clear All Delete Button ----
exports.purgeReadingHistory = async (req, res) => {
    const { userId } = req.params;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. I-copy ang data sa archived_reading_history
        // Siguraduhin na ang columns ay tugma sa iyong DB (UserID, ArticleID, etc.)
        await connection.query(`
            INSERT INTO archived_reading_history (UserID, ArticleID, ProgressPercentage, ArchivedDate, ArchivedTime)
            SELECT user_id, article_id, progress_percentage, CURDATE(), CURTIME()
            FROM user_reading_history WHERE user_id = ?`, [userId]);

        // 2. Burahin ang records ni user sa main table
        await connection.query('DELETE FROM user_reading_history WHERE user_id = ?', [userId]);

        // 3. I-check kung zero na ang lahat ng records sa table (para sa lahat ng users)
        const [remaining] = await connection.query('SELECT COUNT(*) as count FROM user_reading_history');
        
        if (remaining[0].count === 0) {
            // Kung wala nang laman ang table, i-reset ang counter sa 1
            await connection.query('ALTER TABLE user_reading_history AUTO_INCREMENT = 1');
        }

        await connection.commit();
        res.json({ success: true, message: "History archived successfully" });
    } catch (error) {
        await connection.rollback();
        console.error("Backend Purge Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Endpoint para sa pag-archived ng mga data galing sa
// Reading History
exports.getArchivedHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT 
                arh.ArchiveID,
                arh.ProgressPercentage,
                arh.ArchivedDate,
                arh.ArchivedTime,
                ga.title AS Title
            FROM archived_reading_history arh
            INNER JOIN guidance_articles ga ON arh.ArticleID = ga.article_id
            WHERE arh.UserID = ?
            ORDER BY arh.ArchivedDate DESC, arh.ArchivedTime DESC
        `;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching archives:", err);
        res.status(500).json({ error: err.message });
    }
};

// Endpoint para i-restore yung mga data na nasa ArchivedHistory
exports.restoreHistory = async (req, res) => {
    const { archiveId } = req.params;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [archiveData] = await connection.query(
            'SELECT * FROM archived_reading_history WHERE ArchiveID = ?', [archiveId]
        );

        if (archiveData.length > 0) {
            const { UserID, ArticleID, ProgressPercentage } = archiveData[0];
            
            await connection.query(`
                INSERT INTO user_reading_history (user_id, article_id, progress_percentage, last_visited)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE progress_percentage = ?
            `, [UserID, ArticleID, ProgressPercentage, ProgressPercentage]);

            // Remove from archive
            await connection.query('DELETE FROM archived_reading_history WHERE ArchiveID = ?', [archiveId]);

            // Reset Archive Auto_Increment if now empty
            const [remaining] = await connection.query('SELECT COUNT(*) as count FROM archived_reading_history');
            if (remaining[0].count === 0) {
                await connection.query('ALTER TABLE archived_reading_history AUTO_INCREMENT = 1');
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Restored successfully" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Delete individual archive record
exports.deleteArchiveRecord = async (req, res) => {
    const { archiveId } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Kunin ang record bago i-delete para malaman ang ArchiveID
        await connection.query('DELETE FROM archived_reading_history WHERE ArchiveID = ?', [archiveId]);

        // Check kung empty na ang table para i-reset sa 1, 
        // kung hindi empty, ang susunod na insert ay susunod sa huling ID.
        const [remaining] = await connection.query('SELECT COUNT(*) as count FROM archived_reading_history');
        if (remaining[0].count === 0) {
            await connection.query('ALTER TABLE archived_reading_history AUTO_INCREMENT = 1');
        }

        await connection.commit();
        res.json({ success: true, message: "Record permanently deleted" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Delete All Archives for a user
exports.deleteAllArchives = async (req, res) => {
    const { userId } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM archived_reading_history WHERE UserID = ?', [userId]);

        // Reset auto_increment dahil All Delete ang ginawa
        const [remaining] = await connection.query('SELECT COUNT(*) as count FROM archived_reading_history');
        if (remaining[0].count === 0) {
            await connection.query('ALTER TABLE archived_reading_history AUTO_INCREMENT = 1');
        }

        await connection.commit();
        res.json({ success: true, message: "All archives cleared" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Restore All Archives for a user
exports.restoreAllArchives = async (req, res) => {
    const { userId } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. I-balik lahat sa main history table
        await connection.query(`
            INSERT INTO user_reading_history (user_id, article_id, progress_percentage, last_visited)
            SELECT UserID, ArticleID, ProgressPercentage, CURRENT_TIMESTAMP
            FROM archived_reading_history WHERE UserID = ?
            ON DUPLICATE KEY UPDATE progress_percentage = VALUES(progress_percentage)
        `, [userId]);

        // 2. Burahin ang archives ng user
        await connection.query('DELETE FROM archived_reading_history WHERE UserID = ?', [userId]);

        // 3. Reset increment kung empty na
        const [remaining] = await connection.query('SELECT COUNT(*) as count FROM archived_reading_history');
        if (remaining[0].count === 0) {
            await connection.query('ALTER TABLE archived_reading_history AUTO_INCREMENT = 1');
        }

        await connection.commit();
        res.json({ success: true, message: "All records restored" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Archive a single history record
exports.archiveSingleHistory = async (req, res) => {
    const { historyId } = req.params; 
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Get the data first
        const [record] = await connection.query(
            'SELECT user_id, article_id, progress_percentage FROM user_reading_history WHERE history_id = ?', 
            [historyId]
        );

        if (record.length === 0) return res.status(404).json({ success: false });

        const { user_id, article_id, progress_percentage } = record[0];

        // 2. Insert into archived table
        await connection.query(`
            INSERT INTO archived_reading_history (UserID, ArticleID, ProgressPercentage, ArchivedDate, ArchivedTime)
            VALUES (?, ?, ?, CURDATE(), CURTIME())
        `, [user_id, article_id, progress_percentage]);

        // 3. Delete from active history
        await connection.query('DELETE FROM user_reading_history WHERE history_id = ?', [historyId]);

        await connection.commit();
        res.json({ success: true });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ----- SAVED LIBRARY ENDPOINT -----
// Toggle Save/Unsave Article
exports.toggleSaveArticle = async (req, res) => {
    const { userId, articleId } = req.body;

    try {
        // 1. Check kung saved na ba ang article para sa user na ito
        const [existing] = await db.query(
            'SELECT * FROM saved_library WHERE user_id = ? AND article_id = ?',
            [userId, articleId]
        );

        if (existing.length > 0) {
            // 1. Delete the record
            await db.query('DELETE FROM saved_library WHERE user_id = ? AND article_id = ?', 
            [userId, articleId]);

            // 2. I-reset ang AUTO_INCREMENT (Kukunin ang max ID + 1)
            // Babala: Sa production apps, hindi ito ginagawa, pero para sa project mo:
            const [maxIdResult] = await db.query('SELECT MAX(saved_id) as maxId FROM saved_library');
            const nextId = (maxIdResult[0].maxId || 0) + 1;
            await db.query(`ALTER TABLE saved_library AUTO_INCREMENT = ${nextId}`);

            return res.json({ saved: false, message: "Removed from library" });
        } else {
            // 3. Kung wala pa, i-insert (Save action)
            // Gagamit tayo ng CURDATE() at CURTIME() ng MySQL para sa saved_date at saved_time
            await db.query(
                'INSERT INTO saved_library (user_id, article_id, saved_date, saved_time) VALUES (?, ?, CURDATE(), CURTIME())', 
                [userId, articleId]
            );
            return res.json({ saved: true, message: "Saved to library" });
        }
    } catch (err) {
        console.error("Error in toggleSaveArticle:", err);
        res.status(500).json({ error: "Database error occurred" });
    }
};

// Check if specific article is saved by user
exports.checkSaveStatus = async (req, res) => {
    const { userId, articleId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM saved_library WHERE user_id = ? AND article_id = ?', 
            [userId, articleId]
        );
        res.json({ isSaved: rows.length > 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Kunin lahat ng saved articles ng isang user (Para sa Library Page soon)
exports.getSavedArticles = async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT 
                sl.saved_id, sl.saved_date, sl.saved_time,
                ga.*, ac.category_name 
            FROM saved_library sl
            JOIN guidance_articles ga ON sl.article_id = ga.article_id
            LEFT JOIN article_categories ac ON ga.cat_id = ac.category_id
            WHERE sl.user_id = ?
            ORDER BY sl.saved_date DESC, sl.saved_time DESC
        `;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Clear all saved articles for a user
exports.clearSavedLibrary = async (req, res) => {
    const { userId } = req.params;

    try {
        // 1. Burahin lahat ng records ng user sa saved_library
        await db.query('DELETE FROM saved_library WHERE user_id = ?', [userId]);

        // 2. I-reset ang AUTO_INCREMENT sa 1 (Dahil empty na ang library niya)
        // Note: Safe ito rito dahil wala nang records na matitira para sa user na ito
        const [totalRecords] = await db.query('SELECT COUNT(*) as count FROM saved_library');
        if (totalRecords[0].count === 0) {
            await db.query('ALTER TABLE saved_library AUTO_INCREMENT = 1');
        }

        res.json({ success: true, message: "Library cleared successfully" });
    } catch (err) {
        console.error("Error clearing library:", err);
        res.status(500).json({ error: "Failed to clear library" });
    }
};