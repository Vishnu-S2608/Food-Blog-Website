const otpStore = new Map();
const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const senderNumber = process.env.TWILIO_PHONE_NUMBER;

// ✅ Send OTP via SMS & WhatsApp
const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(phone, otp);

  try {
    // SMS
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: senderNumber,
      to: phone
    });

    // WhatsApp (comment out if you don't have sandbox set up)
    // await client.messages.create({
    //   body: `Your OTP is: ${otp}`,
    //   from: 'whatsapp:' + senderNumber,
    //   to: 'whatsapp:' + phone
    // });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
     console.error('sendOtp error:', error.message);
    return res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

// ✅ Verify OTP
const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = otpStore.get(phone);

  if (storedOtp && storedOtp === otp) {
    otpStore.delete(phone); // clear after success
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, error: 'Invalid OTP' });
};

module.exports = { sendOtp, verifyOtp };
