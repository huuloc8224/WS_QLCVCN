const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  jobId: {
    type: Number,
    ref: 'Job',
  },
  jobTitle: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', logSchema);
