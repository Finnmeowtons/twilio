require('dotenv').config();
const express = require('express');
const Twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'], 
}));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = "+15392810659";
const client = Twilio(accountSid, authToken);

app.post('/send-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: twilioPhoneNumber,
      to: phone,
    });

    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
