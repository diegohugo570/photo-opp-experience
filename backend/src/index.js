require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const adminRoutes = require('./routes/admin');
const seedRoutes = require('./routes/seed');
const { requestLogger } = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static processed images
app.use('/public', express.static('public'));

app.use(requestLogger); // Log all requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

async function startServer() {
  let uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('127.0.0.1')) {
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log('Started in-memory MongoDB at', uri);
  }

  mongoose.connect(uri)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

startServer();
