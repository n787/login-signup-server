// authController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = async (req, res) => {
  // Implement signup logic here
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password should be: \n1. minimum 8 character \n2. combination of letters, numbers and symbols @,$,!,%,*,#,?,&",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to validate password format
const isValidPassword = (password) => {
  // Password should be at least 8 characters long and include a combination of letters, numbers, and symbols
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

exports.login = async (req, res) => {
  // Implement login logic here
};
