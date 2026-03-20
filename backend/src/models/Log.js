const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  masked_ip: { type: String, required: true },
  route: { type: String, required: true },
  request_body: { type: Object },
  response_status: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
