const express = require('express');
const fs = require('fs');
const router = express.Router();

// Route to update doctor data
router.post('/updateDoctorNumbers', (req, res) => {
    const { doctorId, currentNumber } = req.body;

    // Read the existing data from the JSON file
    fs.readFile('numbers.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        // Parse the existing data
        let numbers = JSON.parse(data);

        // Update the data for the specified doctorId
        numbers[doctorId] = currentNumber;

        // Save the updated data back to the JSON file
        fs.writeFile('numbers.json', JSON.stringify(numbers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing to file' });
            }
            res.status(200).json({ message: 'Doctor data updated successfully' });
        });
    });
});

module.exports = router;
