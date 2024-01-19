// authController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

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
    const saved_user = await newUser.save();

    // Generate an access token
    // const accessToken = generateAccessToken(newUser._id);

    res
      .status(201)
      .json({ message: "User registered successfully", saved_user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Helper function to validate password format
const isValidPassword = (password) => {
  // Password should be at least 8 characters long and include a combination of letters, numbers, and symbols
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Helper function to generate an access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Replace process.env.JWT_SECRET with your own secret key
};

exports.getUserData = async (req, res) => {
  try {
    // Assuming you have implemented some form of user authentication middleware
    const userId = req.user.id;

    // Fetch user data from the database
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  // Implement login logic here
};
