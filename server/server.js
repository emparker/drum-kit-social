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

// Middleware
const authMiddleware = require('./middleware/authMiddleware');

// Routes
const authRouter = require('./routes/authRouter');
app.use('/api/auth', authRouter);

const drummerPostRouter = require('./routes/drummerPostRouter');
app.use('/api/posts', authMiddleware, drummerPostRouter);

const commentRouter = require('./routes/commentRouter');
app.use('/api/comments', authMiddleware, commentRouter);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running! 🥁' });
});

// Protected test route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    user: req.auth
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Server running on port ${PORT}`);
});
