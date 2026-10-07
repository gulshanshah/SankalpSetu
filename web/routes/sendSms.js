const express = require('express');
const twilio = require('twilio');

const router = express.Router();

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

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

    // Create the SMS message body
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

    // Send SMS via Twilio
    client.messages
        .create({
            body: messageBody,
            from: 'YOUR_TWILIO_PHONE_NUMBER', // Your Twilio phone number
            to: phone, // Patient's phone number
        })
        .then(message => res.json({ success: true, messageSid: message.sid }))
        .catch(error => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

module.exports = router;
