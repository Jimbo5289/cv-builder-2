const express = require('express');
const router = express.Router();

// Example user registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Simulate user registration logic
  res.status(201).json({ message: 'User registered successfully', user: { username } });
});

module.exports = router;
