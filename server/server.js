require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running! 🥁' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Server running on port ${PORT}`);
});
