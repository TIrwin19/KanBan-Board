const express = require('express');
const authenticate = require('../middleware/authMiddleware')

const router = express.Router();

//example of a protected route
router.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router