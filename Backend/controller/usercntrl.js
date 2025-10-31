const User = require('../models/usermdl');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// ✅ User SignUp
const userSignUp = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ error: "Required fields can't be empty" });
    }

    // Check if a user exists with the same email AND phone
    const existingUser = await User.findOne({ email, phone });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Proceed even if phone or email exists separately
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
    });

    console.log("User _id:", newUser._id); // For signup

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id.toString() },
      process.env.SECRET_KEY
    );

    return res.status(200).json({
      message: "User Created",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};





// ✅ User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Required fields can't be empty" });
    }

    const user = await User.findOne({ email });
    const isMatch = user && await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("User _id:", user._id);    // For login

    const token = jwt.sign(
      { email: user.email, id: user._id.toString() },
      process.env.SECRET_KEY,
      // { expiresIn: '1h' } // Optional
    );

    return res.status(200).json({
      message: "User Logged In",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get User (securely)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('email');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { userLogin, userSignUp, getUser };
