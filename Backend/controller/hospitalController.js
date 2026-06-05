// controller/hospitalController.js
// Kung gumagamit ka ng mas lumang Node version, mag-require ng node-fetch:
// const fetch = require('node-fetch'); 

exports.getNearbyHospitals = async (req, res) => {
    // Kinukuha ang query mula sa URL parameter
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(overpassUrl);
        
        if (!response.ok) {
            throw new Error(`Overpass API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // Ibinabalik ang data sa iyong React frontend
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch from Overpass API' });
    }
};
