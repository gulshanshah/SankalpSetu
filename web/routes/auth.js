const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [hospitals] = await db.query('SELECT * FROM hospitals WHERE username = ?', [username]);
        if (hospitals.length > 0) {
            const hospital = hospitals[0];
            const isMatch = await bcrypt.compare(password, hospital.password);
            if (isMatch) {
                req.session.user = { id: hospital.id, name: hospital.name, type: 'hospital' };
                return res.redirect('/hospital/dashboard');
            }
        }

        const [doctors] = await db.query('SELECT * FROM doctors WHERE username = ?', [username]);
        if (doctors.length > 0) {
            const doctor = doctors[0];
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (isMatch) {
                req.session.user = { id: doctor.id, name: doctor.name, type: 'doctor' };
                return res.redirect('/doctor/dashboard');
            }
        }

        res.status(401).send('Invalid credentials');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
