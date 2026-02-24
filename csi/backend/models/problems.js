const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Markdown supported
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Easy' 
  },
  // Boilerplate code for different languages
  starterCode: [{
    language: { type: String, enum: ['javascript', 'python', 'cpp', 'java'] },
    code: String
  }],
  // Test cases for the execution engine
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);