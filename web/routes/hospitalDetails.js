const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    const hospitalId = req.query.id;
    console.log('Fetching details for hospital ID:', hospitalId);

    if (!hospitalId) {
        return res.status(400).json({ error: 'Hospital ID is required' });
    }

    try {
        const hospitalQuery = `SELECT * FROM hospitals WHERE id = ?`;
        const doctorQuery = `SELECT * FROM doctors WHERE hospital_id = ?`;
        const skillsQuery = `SELECT DISTINCT skills FROM doctors WHERE hospital_id = ?`;

        const [hospitalResults] = await db.execute(hospitalQuery, [hospitalId]);
        if (hospitalResults.length === 0) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        const hospital = hospitalResults[0];

        const [doctorResults] = await db.execute(doctorQuery, [hospitalId]);

        const [skillsResults] = await db.execute(skillsQuery, [hospitalId]);

        res.render('hospital-details', { hospital, doctors: doctorResults, skills: skillsResults });

    } catch (error) {
        console.error('Error fetching details:', error);
        return res.status(500).json({ error: 'Database query error' });
    }
});

module.exports = router;
