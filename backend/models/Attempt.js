const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOption: { type: Number, required: true },
  }],
  score: { type: Number },
  total: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Attempt', AttemptSchema);