const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Kunin ang token mula sa secure cookie

    if (!token) {
        return res.status(403).json({ error: "Access denied. No session found." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // I-attach ang user data sa request
        next(); // Patuloy sa susunod na function
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = verifyToken;