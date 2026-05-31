// utils/sanitizer.js

/**
 * Tinatanggal ang mga special characters sa pangalan para iwas SQL injection o XSS.
 */
const sanitizeName = (value) => {
    if (!value) return '';
    return String(value).replace(/[@#$%^&*()=+{}[\]<>/\\|"'";:]/g, '');
};

/**
 * Mas maluwag ng konti dahil ang address ay pwedeng may gitling o period.
 */
const sanitizeAddress = (value) => {
    if (!value) return '';
    return String(value).replace(/[<>{}|\\^`]/g, '');
};

/**
 * Ginagawang lowercase at tinatanggal ang whitespace sa email.
 */
const sanitizeEmail = (value) => {
    if (!value) return '';
    return String(value).toLowerCase().trim();
};

module.exports = {
    sanitizeName,
    sanitizeAddress,
    sanitizeEmail
};