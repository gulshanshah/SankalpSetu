const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.use((req, res, next) => {
    if (!req.session.user || req.session.user.type !== 'hospital') {
        return res.status(403).send('Access denied');
    }
    next();
});

router.get('/dashboard', async (req, res) => {
    try {
        const [hospitalDetails] = await db.query('SELECT * FROM hospitals WHERE id = ?', [req.session.user.id]);
        res.render('hospitalDashboard', { hospital: hospitalDetails[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
