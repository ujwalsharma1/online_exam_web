const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  attempt: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Attempt', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  test: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: true 
  },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);