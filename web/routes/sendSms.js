const express = require('express');
const twilio = require('twilio');
require('dotenv').config();

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

router.post('/sendPatientData', (req, res) => {
    const {
        id,
        name,
        gender,
        age,
        phone,
        address,
        additionalNumber,
        addedOn
    } = req.body;

    const messageBody = `
        Patient Details:
        Name: ${name}
        Gender: ${gender}
        Age: ${age}
        Phone: ${phone}
        Address: ${address}
        Additional Number: ${additionalNumber}
        Added On: ${addedOn}
    `;

    if (!client) {
        return res.status(500).json({ success: false, error: 'Twilio credentials are not configured' });
    }

    client.messages
        .create({
            body: messageBody,
            from: fromNumber,
            to: phone,
        })
        .then(message => res.json({ success: true, messageSid: message.sid }))
        .catch(error => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

module.exports = router;
