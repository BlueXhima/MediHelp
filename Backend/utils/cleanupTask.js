const cron = require('node-cron');
const dbconnection = require('../config/db');

// Tatakbo ito tuwing hatinggabi (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup for unverified accounts...');
    try {
        // Buburahin ang accounts na hindi verified at lagpas 24 hours na
        const [result] = await dbconnection.query(`
            DELETE FROM users 
            WHERE isVerified = 0 
            AND TIMESTAMP(created_date, created_time) < NOW() - INTERVAL 24 HOUR
        `);
        
        console.log(`Cleanup finished. Removed ${result.affectedRows} junk accounts.`);
    } catch (error) {
        console.error('Cleanup Task Error:', error);
    }
});