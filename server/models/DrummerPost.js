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

  // Extra Drums - Dynamic array for additional drums beyond the base fields
  // Label auto-increments: bass2, tom4, snare2, etc.
  extraDrums: [{
    category: {
      type: String,
      enum: ['bass', 'tom', 'snare'],
      required: true
    },
    label: {
      type: String,
      required: true
      // Auto-generated based on existing count
    },
    value: {
      type: String,
      trim: true,
      required: true
    }
  }],

  // Extra Cymbals - Dynamic array for additional cymbals beyond the base fields
  // Label auto-increments: crash2, ride2, hiHat2, etc.
  extraCymbals: [{
    category: {
      type: String,
      enum: ['crash', 'ride', 'splash', 'china', 'hi-hat'],
      required: true
    },
    label: {
      type: String,
      required: true
      // Auto-generated based on existing count
    },
    value: {
      type: String,
      trim: true,
      required: true
    }
  }],

  // Extras - Dynamic array for other gear (hardware, pedals, effects)
  // Label auto-increments: hardware1, kick-pedal1, effects1, etc.
  extras: [{
    category: {
      type: String,
      enum: ['hardware', 'kick-pedal', 'effects'],
      required: true
    },
    label: {
      type: String,
      required: true
      // Auto-generated based on existing count
    },
    value: {
      type: String,
      trim: true,
      required: true
    }
  }],

  // Voting
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, {
  timestamps: true
});

// Pre-validate hook to auto-generate labels for all extras arrays
// Must run before validation since label is required
drummerPostSchema.pre('validate', function() {
  // Count existing base fields by category
  const baseCounts = {
    // Drums
    bass: this.bass ? 1 : 0,
    tom: [this.tom1, this.tom2, this.tom3].filter(Boolean).length,
    snare: this.snare ? 1 : 0,
    // Cymbals
    crash: this.crash ? 1 : 0,
    ride: this.ride ? 1 : 0,
    splash: this.splash ? 1 : 0,
    china: this.china ? 1 : 0,
    'hi-hat': this.hiHat ? 1 : 0,
    // Other gear (no base fields)
    hardware: 0,
    'kick-pedal': 0,
    effects: 0
  };

  // Track counts including extras (shared across all arrays)
  const counts = { ...baseCounts };

  // Helper function to process an extras array
  const processExtrasArray = (extrasArray) => {
    if (!extrasArray || extrasArray.length === 0) return;

    extrasArray.forEach(extra => {
      if (!extra.label) {
        const category = extra.category;
        const currentCount = counts[category] || 0;
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

        counts[category] = nextNumber;
      } else {
        // If label already exists, count it for subsequent extras
        const category = extra.category;
        // Extract number from label (e.g., "tom4" → 4)
        const match = extra.label.match(/\d+$/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > (counts[category] || 0)) {
            counts[category] = num;
          }
        }
      }
    });
  };

  // Process each array
  processExtrasArray(this.extraDrums);
  processExtrasArray(this.extraCymbals);
  processExtrasArray(this.extras);
});

module.exports = mongoose.model('DrummerPost', drummerPostSchema);
