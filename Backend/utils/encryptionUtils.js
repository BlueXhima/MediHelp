const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const algorithm = 'aes-256-cbc';
const rawKey = process.env.ENCRYPTION_KEY;
const rawIv = process.env.ENCRYPTION_IV;

// Ang SHA-256 ay nagbibigay ng saktong 32 bytes (tamang sukat para sa aes-256 key)
const key = crypto.createHash('sha256').update(String(rawKey)).digest();

// Ang MD5 naman ay nagbibigay ng saktong 16 bytes (tamang sukat para sa CBC Initialization Vector)
const iv = crypto.createHash('md5').update(String(rawIv)).digest();

/**
 * Encrypts plain text to hex string
 */
const encrypt = (text) => {
    if (!text || String(text).trim() === '') return '';
    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(String(text), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error("Encryption transaction failed:", error.message);
        return '';
    }
};

/**
 * Decrypts hex string back to plain text
 */
const decrypt = (encryptedText) => {
    if (!encryptedText || String(encryptedText).trim() === '') return '';
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(String(encryptedText), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error.message);
        // Kung hindi ma-decrypt (hal. lumang data na hindi encrypted), ibalik ang orihinal na text para hindi mag-crash ang app
        return encryptedText; 
    }
};

module.exports = { encrypt, decrypt };