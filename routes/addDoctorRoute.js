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

router.post('/', upload.single('doctorPhoto'), async (req, res) => {
    const { hospitalId, doctorName, doctorSkills, doctorUsername, doctorPassword } = req.body;
    const doctorPhotoPath = req.file ? req.file.path : null;

    try {
        if (!hospitalId || !doctorName || !doctorUsername || !doctorPassword) {
            return res.status(400).send('All required fields must be provided');
        }

        const hashedDoctorPassword = await bcrypt.hash(doctorPassword, 10);

        const sql = 'INSERT INTO doctors (hospital_id, name, skills, photo, username, password) VALUES (?, ?, ?, ?, ?, ?)';
        
        await db.execute(sql, [
            hospitalId,
            doctorName,
            doctorSkills || null,
            doctorPhotoPath || null,
            doctorUsername,
            hashedDoctorPassword
        ]);

        res.status(201).send('Doctor added successfully');
    } catch (error) {
        console.error('Error processing request: ', error);

        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ error: 'Database table not found. Please check your database configuration.' });
        }
        
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

module.exports = router;
