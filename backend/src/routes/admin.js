const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const Photo = require('../models/Photo');
const Log = require('../models/Log');

const router = express.Router();

router.use(protect(['ADMIN']));

router.get('/metrics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const totalPhotos = await Photo.countDocuments();
    const filteredPhotos = await Photo.countDocuments(filter);

    res.json({ totalPhotos, filteredPhotos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/photos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const photos = await Photo.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Photo.countDocuments();

    res.json({ photos, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
