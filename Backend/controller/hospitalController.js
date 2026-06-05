// controller/hospitalController.js

exports.getNearbyHospitals = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(overpassUrl, {
            method: 'GET',
            headers: {
                // Mahalaga ito para hindi mag-406 error
                'User-Agent': 'MediHelp-App/1.0 (Contact: your-email@example.com)',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text(); // Basahin ang error message mula sa Overpass
            console.error('Overpass API Error:', errorText);
            throw new Error(`Overpass API responded with status ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch from Overpass API' });
    }
};
