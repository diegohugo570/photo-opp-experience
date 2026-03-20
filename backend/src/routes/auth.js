const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { logEvent } = require('../middlewares/logger');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    const ip = req.ip || req.connection.remoteAddress;

    if (!user) {
      await logEvent(ip, '/api/auth/login', { email, password: '[REDACTED]' }, 401);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logEvent(ip, '/api/auth/login', { email, password: '[REDACTED]' }, 401);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Success log is automatically handled by the middleware if configured correctly, but we specifically track logins
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
