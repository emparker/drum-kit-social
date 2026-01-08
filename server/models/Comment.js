const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  drummerPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DrummerPost',
    required: true
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Comment', commentSchema);
