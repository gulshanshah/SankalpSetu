const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path to your DB config

// Route to get patients for a doctor (without authentication)
router.get('/patients', async (req, res) => {
    const doctorId = req.session.user.id; // Hardcoded doctorId (replace with dynamic value as needed)

    const query = 'SELECT id, first_name, last_name, gender, age, phone, address, created_at FROM patients WHERE doctor_id = ?';

    try {
        // Using async/await with the promise-based pool
        const [results] = await db.query(query, [doctorId]);

        // Respond with the patient data in JSON format
        res.json({ patients: results });
    } catch (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'An error occurred while fetching patients.' });
    }
});

module.exports = router;
