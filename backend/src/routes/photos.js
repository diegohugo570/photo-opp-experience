const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const { processImage } = require('../services/imageService');
const Photo = require('../models/Photo');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', protect(['PROMOTOR']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const filename = await processImage(req.file.buffer);
    const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    // Assuming we serve the public directory
    const url = `${baseUrl}/public/photos/${filename}`;

    const photo = await Photo.create({
      url,
      originalFilename: req.file.originalname,
      promotorId: req.user.id
    });

    res.json({ success: true, url, photoId: photo._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process image' });
  }
});

module.exports = router;
