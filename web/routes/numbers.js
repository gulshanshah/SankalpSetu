const express = require('express');
const fs = require('fs');
const router = express.Router();

router.post('/updateDoctorNumbers', (req, res) => {
    const { doctorId, currentNumber } = req.body;

    fs.readFile('numbers.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        let numbers = JSON.parse(data);

        numbers[doctorId] = currentNumber;

        fs.writeFile('numbers.json', JSON.stringify(numbers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing to file' });
            }
            res.status(200).json({ message: 'Doctor data updated successfully' });
        });
    });
});

module.exports = router;
