const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.use((req, res, next) => {
    if (!req.session.user || req.session.user.type !== 'doctor') {
        return res.redirect('/login');
    }
    next();
});

router.get('/dashboard', async (req, res) => {
    try {
        const [doctorDetails] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.session.user.id]);
        res.render('doctorDashboard', { doctor: doctorDetails[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
