const mongoose = require('mongoose');

const drummerPostSchema = new mongoose.Schema({
  drummerName: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Standard 5-Piece Kit
  drumKit: {
    kickDrum: { type: String, trim: true },
    snare: { type: String, trim: true },
    rackTom1: { type: String, trim: true },
    rackTom2: { type: String, trim: true },
    floorTom: { type: String, trim: true }
  },

  // Add-ons (predefined categories)
  addOns: {
    hiHats: { type: String, trim: true },
    rideCymbal: { type: String, trim: true },
    crashCymbal: { type: String, trim: true },
    hardware: { type: String, trim: true },
    effects: { type: String, trim: true }
  },


  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('DrummerPost', drummerPostSchema);
