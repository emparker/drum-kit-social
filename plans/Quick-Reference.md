# DrummerPost Refactor - Quick Reference

## Current Status

**Backend:** ✅ COMPLETE
**Frontend:** ✅ COMPLETE
**Documentation:** ✅ COMPLETE

---

## New Schema Quick Lookup

### Required Fields
- `drummerName` (String)
- `band` (String) ← **NEW**
- `album` (String)
- `user` (ObjectId)

### Kit Metadata (All Optional)
- `drumKitModel` (String)
- `material` (String)
- `color` (String)
- `kitPieceCount` (Number)

### Drums (All Optional)
- `bass` (String)
- `tom1` (String)
- `tom2` (String)
- `tom3` (String)
- `snare` (String)

### Cymbals (All Optional)
- `crash` (String)
- `ride` (String)
- `splash` (String)
- `china` (String)
- `hiHat` (String)

### Extras (Array)
```javascript
extras: [{ category, label, value }]
```

---

## Field Name Mapping

| Old | New |
|-----|-----|
| `drumKit.kickDrum` | `bass` |
| `drumKit.snare` | `snare` |
| `drumKit.rackTom1` | `tom1` |
| `drumKit.rackTom2` | `tom2` |
| `drumKit.floorTom` | `tom3` |
| `addOns.hiHats` | `hiHat` |
| `addOns.rideCymbal` | `ride` |
| `addOns.crashCymbal` | `crash` |
| `addOns.hardware` | `extras` |
| `addOns.effects` | `extras` |

---

## Extras Categories Enum

```javascript
[
  'bass', 'tom', 'snare',           // Drums
  'crash', 'ride', 'splash',        // Cymbals
  'china', 'hi-hat',                // More Cymbals
  'hardware', 'kick-pedal', 'effects' // Gear
]
```

---

## Label Generation Examples

```javascript
// Base: tom1, tom2, tom3
// Extra tom → "tom4"

// Base: snare
// Extra snare → "snare2"

// Base: none
// First hardware → "hardware1"
```

---

## Files Checklist

- [x] server/models/DrummerPost.js
- [x] server/routes/drummerPostRouter.js
- [x] client/src/pages/CreatePost.jsx
- [x] client/src/components/DrummerCard.jsx
- [x] client/src/index.css
- [x] CLAUDE.md

---

## Test Post Data

```javascript
{
  drummerName: "Neil Peart",
  band: "Rush",
  album: "Moving Pictures",
  drumKitModel: "Slingerland Chrome Over Wood",
  bass: "Slingerland 22x14",
  tom1: "Slingerland 8x8",
  tom2: "Slingerland 10x10",
  tom3: "Slingerland 12x12",
  snare: "Slingerland 14x6.5",
  crash: "Zildjian 18\"",
  ride: "Zildjian 22\"",
  extras: [
    { category: 'tom', value: 'Slingerland 13x13' },
    { category: 'hardware', value: 'Gibraltar Double Bass Pedal' }
  ]
}
```

Expected labels: `tom4`, `hardware1`

---

## Technical Notes

### Pre-Validate Hook (Important!)
- Labels are generated using `pre('validate')` hook, NOT `pre('save')`
- This ensures labels exist before Mongoose validation runs
- Hook runs synchronously (no `next()` callback needed)

### UI Layout
- **Band & Album:** Displayed inline in a flexbox row (`.band-album-row`)
- **Sections:** Kit Metadata → Drums → Cymbals → Extras (all conditional render)
- **Edit Mode:** All fields editable on My Posts page only

---

**Refactor Completed:** January 11, 2026
