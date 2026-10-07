const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json([]);
    }

    const sql = `
        SELECT id, name, address 
        FROM hospitals 
        WHERE name LIKE ? OR address LIKE ? OR search_details LIKE ? 
        LIMIT 10`;

    const searchTerm = `%${query}%`;

    try {
        const [results] = await db.execute(sql, [searchTerm, searchTerm, searchTerm]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching suggestions: ', error);
        res.status(500).json({ error: 'Database query error' });
    }
});

module.exports = router;
