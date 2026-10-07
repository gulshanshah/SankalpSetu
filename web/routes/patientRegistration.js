const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/patient-registration', (req, res) => {
    const { hospital_name, doctor_name, doctor_id } = req.query;
    res.render('patient-registration', { hospital_name, doctor_name, doctor_id });
});

router.post('/submit-patient', async (req, res) => {
    const { first_name, last_name, gender, age, phone, address, doctor_id } = req.body;

    if (!first_name || !last_name || !gender || !age || !phone || !address || !doctor_id) {
        return res.status(400).send('All fields are required');
    }

    const doctorQuery = 'SELECT * FROM doctors WHERE id = ?';
    const [doctorResults] = await db.execute(doctorQuery, [doctor_id]);
    if (doctorResults.length === 0) {
        return res.status(404).send('Doctor not found');
    }

    const sql = `
        INSERT INTO patients (first_name, last_name, gender, age, phone, address, doctor_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [first_name, last_name, gender, age, phone, address, doctor_id];

    try {
        const [result] = await db.execute(sql, values);
        console.log('Patient registered successfully', result);
    } catch (error) {
        console.error('Error saving patient:', error);
        return res.status(500).send('Database error');
    }

    res.redirect(`/thank-you?first_name=${first_name}&last_name=${last_name}&gender=${gender}&age=${age}&phone=${phone}&address=${address}`);
});

router.get('/thank-you', (req, res) => {
    const { first_name, last_name, gender, age, phone, address } = req.query; // Retrieve data from query params

    if (!first_name || !last_name) {
        return res.status(400).send('Missing patient details');
    }

    // Render the "Thank You" page and pass the patient's name
    res.render('thank-you', { first_name, last_name, gender, age, phone, address });
});

module.exports = router;
