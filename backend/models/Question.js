const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, 
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);