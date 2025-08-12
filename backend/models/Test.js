const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'published', 'completed'], default: 'draft' },
  scheduledAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

module.exports = mongoose.model('Test', TestSchema);