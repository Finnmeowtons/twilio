require("dotenv").config();
const express = require("express");
const Twilio = require("twilio");
const cors = require("cors");
const req = require("express/lib/request");

//sendgrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendGridEmail = "nero.ferrer.up@phinmaed.com";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const accountSid = "ACddd5d9ba010b2bcbc2c9c64c47c1e3c8";
const authToken = "125d832ce40652700d1c0707ffef9c04";
const twilioPhoneNumber = "+12185229850";
const client = Twilio(accountSid, authToken);

// sendgrid API
app.post("/send-email-otp", async (req, res) => {
  const { userEmail, otp } = req.body;

  if (!userEmail || !otp) {
    return res.status(400).json({error: "User Email and otp are required"})
  }

  const emailMsg = {
    to: userEmail,
    from: sendGridEmail,
    subject: "Email Verification",
    text: `OTP Number: ${otp}`,
  };

  try {
    await sgMail.send(emailMsg);
    console.log("Email sent");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error }); 
  }

});

app.post("/send-otp", async (req, res) => {
  const { phone, otp } = req.body;
  console.log(phone + otp);
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  try {
    client.messages.create({
      body: otp,
      from: twilioPhoneNumber,
      to: phone,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/call", async (req, res) => {
  const { phone } = req.body;
  console.log(phone);

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const response = new VoiceResponse();

  response.say("Tee tee");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(response.toString());
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
