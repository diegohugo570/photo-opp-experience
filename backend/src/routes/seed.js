const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Helper to create initial users, to be deleted or secured later
router.post('/seed', async (req, res) => {
  const adminExists = await User.findOne({ role: 'ADMIN' });
  if (adminExists) return res.status(400).json({ msg: 'Already seeded' });

  const adminPass = await bcrypt.hash('admin123', 10);
  const promotorPass = await bcrypt.hash('promo123', 10);

  await User.insertMany([
    { email: 'admin@nex.lab', password: adminPass, role: 'ADMIN' },
    { email: 'promo@nex.lab', password: promotorPass, role: 'PROMOTOR' }
  ]);

  res.json({ msg: 'Users seeded' });
});

module.exports = router;
