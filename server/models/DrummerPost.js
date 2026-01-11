const mongoose = require('mongoose');

const drummerPostSchema = new mongoose.Schema({
  // Primary Display Fields (most prominent in UI)
  drummerName: {
    type: String,
    required: true,
    trim: true
  },
  band: {
    type: String,
    required: true,
    trim: true
  },

  // Secondary Display Field
  album: {
    type: String,
    required: true,
    trim: true
  },

  // Post Owner Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Drum Kit Details
  drumKitModel: {
    type: String,
    trim: true
    // e.g., "Tama Starclassic"
  },
  material: {
    type: String,
    trim: true
    // e.g., "Birch/Maple"
  },
  color: {
    type: String,
    trim: true
    // e.g., "Starburst Fade"
  },
  kitPieceCount: {
    type: Number
    // e.g., 4
  },

  // Drums
  bass: {
    type: String,
    trim: true
  },
  tom1: {
    type: String,
    trim: true
  },
  tom2: {
    type: String,
    trim: true
  },
  tom3: {
    type: String,
    trim: true
  },
  snare: {
    type: String,
    trim: true
  },

  // Cymbals
  crash: {
    type: String,
    trim: true
  },
  ride: {
    type: String,
    trim: true
  },
  splash: {
    type: String,
    trim: true
  },
  china: {
    type: String,
    trim: true
  },
  hiHat: {
    type: String,
    trim: true
  },

  // Extras - Dynamic array for flexible additions
  // Users can add more drums, cymbals, or other gear beyond the base fields
  // Label auto-increments: tom4, tom5, snare2, crash2, etc.
  extras: [{
    category: {
      type: String,
      enum: [
        // Additional Drums
        'bass',
        'tom',
        'snare',
        // Additional Cymbals
        'crash',
        'ride',
        'splash',
        'china',
        'hi-hat',
        // Extras
        'hardware',
        'kick-pedal',
        'effects'
      ],
      required: true
    },
    label: {
      type: String,
      required: true
      // Auto-generated based on existing count
      // e.g., "tom4" (if tom1-3 exist), "snare2", "crash2", etc.
    },
    value: {
      type: String,
      trim: true,
      required: true
      // User-entered value
    }
  }],

  // Voting
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, {
  timestamps: true
});

// Pre-validate hook to auto-generate labels for extras
// Must run before validation since label is required
drummerPostSchema.pre('validate', function() {
  if (!this.extras || this.extras.length === 0) {
    return;
  }

  // Count existing base fields by category
  const baseCounts = {
    bass: this.bass ? 1 : 0,
    tom: [this.tom1, this.tom2, this.tom3].filter(Boolean).length,
    snare: this.snare ? 1 : 0,
    crash: this.crash ? 1 : 0,
    ride: this.ride ? 1 : 0,
    splash: this.splash ? 1 : 0,
    china: this.china ? 1 : 0,
    'hi-hat': this.hiHat ? 1 : 0,
    hardware: 0,
    'kick-pedal': 0,
    effects: 0
  };

  // Track counts including extras
  const extrasCounts = { ...baseCounts };

  // Auto-generate labels for extras without labels
  this.extras.forEach(extra => {
    if (!extra.label) {
      const category = extra.category;
      const currentCount = extrasCounts[category] || 0;
      const nextNumber = currentCount + 1;

      // Generate label based on category
      if (['bass', 'tom', 'snare', 'crash', 'ride', 'splash', 'china'].includes(category)) {
        extra.label = `${category}${nextNumber}`;
      } else if (category === 'hi-hat') {
        extra.label = nextNumber === 1 ? 'hiHat' : `hiHat${nextNumber}`;
      } else {
        // hardware, kick-pedal, effects
        extra.label = `${category}${nextNumber}`;
      }

      extrasCounts[category] = nextNumber;
    } else {
      // If label already exists, count it for subsequent extras
      const category = extra.category;
      // Extract number from label (e.g., "tom4" → 4)
      const match = extra.label.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > (extrasCounts[category] || 0)) {
          extrasCounts[category] = num;
        }
      }
    }
  });
});

module.exports = mongoose.model('DrummerPost', drummerPostSchema);
