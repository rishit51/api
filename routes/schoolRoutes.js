const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Add School API
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input. Ensure all fields are filled correctly.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error inserting school:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
});

// List Schools API
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate query parameters
    if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        // Calculate distances and sort
        const sortedSchools = results.map((school) => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
});

module.exports = router;
