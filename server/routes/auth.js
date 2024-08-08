const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration request:', { username, email }); // Log the received data
  try {
    // Check if user already exists
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword
    }).returning('id');

    // Create and send token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await db('users').where({ email }).first();
     console.log('Login attempt:', { email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token created');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('id', 'email', 'username');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
