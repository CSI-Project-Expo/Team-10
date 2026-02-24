const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  starterCode: [{
    language: { type: String, enum: ['javascript', 'python', 'cpp', 'java'] },
    code: String
  }],
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);
