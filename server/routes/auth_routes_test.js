const express = require('express');
const { sign, verify } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Make sure the User model is correctly imported

const auth_router_test = express.Router();

// JWT Secret and Expiry from env
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour

// Helper function to create JWT
function createToken(user) {
  return sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware to authenticate user
function auth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  try {
    const data = verify(token, JWT_SECRET);
    req.user = data; // Attaching user data to request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// function isAuth(req, res, next) {
//   const token = req.cookies?.token; // Get the token from the cookie
//   if (!token) {
//     return res.json({ message: 'NUH UH no token for you' });
//   }

//   try {
//     const data = verify(token, process.env.JWT_SECRET); // Verify the token

//     if (!data) {
//       return res.json({ message: 'NUH UH' });
//     }

//     req.user = data; // Set the user data (including id) in the request object
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ message: 'NUH UH:', error });
//   }
// }

// REGISTER: POST /auth/register
auth_router_test.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT token
    const token = createToken(newUser);

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

    // Send response with user info (excluding password)
    res.status(201).json({ user: newUser.toJSON() });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGIN: POST /auth/login
auth_router_test.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = createToken(user);

    // Set token in an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

    // Send response with user info (excluding password)
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGOUT: POST /auth/logout
auth_router_test.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Successfully logged out' });
});

// PROTECTED ROUTE: GET /auth/protected
auth_router_test.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = auth_router_test;
