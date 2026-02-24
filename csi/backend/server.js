const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // This loads your .env file

const app = express();

// The Connection Part
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // Inside your mongoose.connect().then() block:
const User = require('./models/User'); // Ensure you have your User model file

const testUser = new User({
  username: "Snehith_Test",
  email: "test@example.com",
  password: "securepassword123"
});

testUser.save()
  .then(() => console.log("🚀 Data sent! Refresh Atlas now."))
  .catch(err => console.log("Data already exists or error:", err.message));
    console.log("✅ Successfully connected to MongoDB Atlas!");
    console.log("📁 Database: pixel_duel");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(express.json()); // Allows server to read JSON body
app.use('/api/auth', require('./routes/auth'));