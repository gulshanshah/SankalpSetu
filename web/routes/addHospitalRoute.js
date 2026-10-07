const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('hospitalPhoto'), async (req, res) => {
    const { hospitalName, hospitalAddress, hospitalUsername, hospitalPassword, hospitalSearchDetails } = req.body;
    const hospitalPhotoPath = req.file ? req.file.path : null;

    try {
        if (!hospitalName || !hospitalAddress || !hospitalUsername || !hospitalPassword) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const hashedHospitalPassword = await bcrypt.hash(hospitalPassword, 10);

        const sql = 'INSERT INTO hospitals (name, address, photo, username, password, search_details) VALUES (?, ?, ?, ?, ?, ?)';

        await db.execute(sql, [
            hospitalName,
            hospitalAddress,
            hospitalPhotoPath || null,
            hospitalUsername,
            hashedHospitalPassword,
            hospitalSearchDetails || null
        ]);

        res.status(201).send('Hospital added successfully');
    } catch (error) {
        console.error('Error processing request: ', error);

        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ error: 'Database table not found. Please check your database configuration.' });
        }

        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

module.exports = router;
