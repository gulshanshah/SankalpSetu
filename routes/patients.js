const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/patients', async (req, res) => {
    const doctorId = req.session.user.id;

    const query = 'SELECT id, first_name, last_name, gender, age, phone, address, created_at FROM patients WHERE doctor_id = ?';

    try {
        const [results] = await db.query(query, [doctorId]);

        res.json({ patients: results });
    } catch (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'An error occurred while fetching patients.' });
    }
});

module.exports = router;
