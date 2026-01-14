/**
 * Custom Drummer Icon Set
 * Clean, minimalistic, modern SVG icons for Drum Kit Social
 *
 * Usage: <DrumIcon size={24} className="my-class" />
 * All icons accept: size (number), className (string), and standard SVG props
 */

// Base wrapper for consistent icon styling
const IconWrapper = ({ children, size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`drummer-icon ${className}`}
    {...props}
  >
    {children}
  </svg>
);

/**
 * Snare/Tom Drum - Side view of a drum shell
 * Used for: Drums section
 */
export const DrumIcon = (props) => (
  <IconWrapper {...props}>
    {/* Drum shell - cylinder side view */}
    <ellipse cx="12" cy="5" rx="8" ry="2.5" />
    <ellipse cx="12" cy="19" rx="8" ry="2.5" />
    {/* Shell sides */}
    <line x1="4" y1="5" x2="4" y2="19" />
    <line x1="20" y1="5" x2="20" y2="19" />
    {/* Tension rods - 3 vertical lines */}
    <line x1="8" y1="5.5" x2="8" y2="18.5" strokeWidth="1.25" />
    <line x1="12" y1="6" x2="12" y2="18" strokeWidth="1.25" />
    <line x1="16" y1="5.5" x2="16" y2="18.5" strokeWidth="1.25" />
  </IconWrapper>
);

/**
 * Cymbal - Top-down view with bell
 * Used for: Cymbals section
 */
export const CymbalIcon = (props) => (
  <IconWrapper {...props}>
    {/* Outer edge - slightly larger ellipse */}
    <ellipse cx="12" cy="12" rx="10" ry="5.5" />
    {/* Bell (center dome) */}
    <ellipse cx="12" cy="11" rx="3.5" ry="2" />
    {/* Stand mount hole */}
    <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
    {/* Lathing line for texture */}
    <ellipse cx="12" cy="12" rx="7" ry="3.8" strokeWidth="1.25" opacity="0.5" />
  </IconWrapper>
);

/**
 * Drum Kit - Simplified kit outline (bass + tom)
 * Used for: Kit Information section
 */
export const DrumKitIcon = (props) => (
  <IconWrapper {...props}>
    {/* Bass drum - front view circle */}
    <circle cx="10" cy="13" r="7.5" />
    <circle cx="10" cy="13" r="4" strokeWidth="1.25" opacity="0.5" />
    {/* Tom drum - smaller, offset above */}
    <ellipse cx="18" cy="6" rx="4.5" ry="1.75" />
    <line x1="13.5" y1="6" x2="13.5" y2="11" />
    <line x1="22.5" y1="6" x2="22.5" y2="11" />
    <ellipse cx="18" cy="11" rx="4.5" ry="1.75" />
    {/* Bass drum legs */}
    <line x1="4.5" y1="19.5" x2="2.5" y2="22" />
    <line x1="15.5" y1="19.5" x2="17.5" y2="22" />
  </IconWrapper>
);

/**
 * Hi-Hat - Side view of hi-hat cymbals on stand
 * Alternative cymbal icon
 */
export const HiHatIcon = (props) => (
  <IconWrapper {...props}>
    {/* Top cymbal */}
    <ellipse cx="12" cy="6" rx="7" ry="2" />
    {/* Bottom cymbal */}
    <ellipse cx="12" cy="9" rx="7" ry="2" />
    {/* Stand */}
    <line x1="12" y1="11" x2="12" y2="20" />
    {/* Base tripod */}
    <line x1="12" y1="20" x2="7" y2="22" />
    <line x1="12" y1="20" x2="17" y2="22" />
    <line x1="12" y1="20" x2="12" y2="22" />
    {/* Clutch */}
    <rect x="10.5" y="4" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
  </IconWrapper>
);

/**
 * Kick Pedal - Side view of bass drum pedal
 * Used for: Other Gear / Hardware section
 */
export const PedalIcon = (props) => (
  <IconWrapper {...props}>
    {/* Footboard */}
    <path d="M6 14 L18 14 L20 18 L4 18 Z" />
    {/* Beater arm */}
    <line x1="16" y1="14" x2="14" y2="5" />
    {/* Beater head */}
    <circle cx="14" cy="4" r="2" />
    {/* Chain/linkage */}
    <path d="M16 14 Q 18 10, 15 6" strokeWidth="1.5" fill="none" />
    {/* Base plate */}
    <line x1="3" y1="20" x2="21" y2="20" />
    <line x1="4" y1="18" x2="4" y2="20" />
    <line x1="20" y1="18" x2="20" y2="20" />
    {/* Hinge */}
    <circle cx="6" cy="14" r="1.5" />
  </IconWrapper>
);

/**
 * Drum Sticks - Crossed drumsticks
 * General drummer icon / brand icon
 */
export const DrumSticksIcon = (props) => (
  <IconWrapper {...props}>
    {/* Left stick */}
    <line x1="4" y1="20" x2="18" y2="4" strokeWidth="2.5" />
    <ellipse cx="18.5" cy="3.5" rx="1.5" ry="1" transform="rotate(-50 18.5 3.5)" />
    {/* Right stick */}
    <line x1="20" y1="20" x2="6" y2="4" strokeWidth="2.5" />
    <ellipse cx="5.5" cy="3.5" rx="1.5" ry="1" transform="rotate(50 5.5 3.5)" />
  </IconWrapper>
);

/**
 * Hardware/Stand - Cymbal or drum stand
 * Used for: Other Gear section
 */
export const HardwareIcon = (props) => (
  <IconWrapper {...props}>
    {/* Top clamp */}
    <circle cx="12" cy="4" r="2" />
    {/* Main tube */}
    <line x1="12" y1="6" x2="12" y2="16" strokeWidth="2" />
    {/* Tripod base */}
    <line x1="12" y1="16" x2="5" y2="22" />
    <line x1="12" y1="16" x2="19" y2="22" />
    <line x1="12" y1="16" x2="12" y2="22" />
    {/* Height adjustment collar */}
    <rect x="10" y="10" width="4" height="2" rx="0.5" />
  </IconWrapper>
);

/**
 * Comment Bubble - Speech bubble for comments
 * Used for: Comments section
 */
export const CommentIcon = (props) => (
  <IconWrapper {...props}>
    {/* Rounded speech bubble */}
    <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-4.5-1.2L3 21l1.2-4.5A9 9 0 0 1 3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9z" />
    {/* Chat lines */}
    <line x1="8" y1="10" x2="16" y2="10" strokeWidth="1.5" opacity="0.6" />
    <line x1="8" y1="14" x2="13" y2="14" strokeWidth="1.5" opacity="0.6" />
  </IconWrapper>
);

/**
 * Snare Drum - Top-down view with snare wires
 * Alternative drum icon
 */
export const SnareIcon = (props) => (
  <IconWrapper {...props}>
    {/* Drum shell from top */}
    <circle cx="12" cy="12" r="9" />
    {/* Inner rim */}
    <circle cx="12" cy="12" r="7" strokeWidth="1" opacity="0.5" />
    {/* Snare wires across bottom */}
    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="0.75" opacity="0.6" />
    <line x1="5.5" y1="10" x2="18.5" y2="10" strokeWidth="0.75" opacity="0.4" />
    <line x1="5.5" y1="14" x2="18.5" y2="14" strokeWidth="0.75" opacity="0.4" />
    {/* Tension lugs */}
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="20.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="20.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </IconWrapper>
);

/**
 * Effects/Electronics - Waveform or electronic pad
 * Used for: Effects in Other Gear
 */
export const EffectsIcon = (props) => (
  <IconWrapper {...props}>
    {/* Pad outline */}
    <rect x="3" y="6" width="18" height="12" rx="2" />
    {/* Trigger zones */}
    <line x1="9" y1="6" x2="9" y2="18" strokeWidth="1" opacity="0.4" />
    <line x1="15" y1="6" x2="15" y2="18" strokeWidth="1" opacity="0.4" />
    {/* LED indicators */}
    <circle cx="6" cy="9" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="9" r="1" fill="currentColor" stroke="none" />
    {/* Waveform hint */}
    <path d="M5 14 Q 7 12, 9 14 T 13 14 T 17 14 T 19 14" strokeWidth="1.5" fill="none" />
  </IconWrapper>
);

/**
 * Gear/Settings - Clean cog gear icon
 * Used for: Other Gear section
 */
export const GearIcon = (props) => (
  <IconWrapper {...props}>
    {/* Gear with 6 teeth - single clean path */}
    <path d="M10.5 2.5 L13.5 2.5 L13.5 5 L16 5.5 L17.5 3.5 L20 6 L18 8 L18.5 10.5 L21.5 10.5 L21.5 13.5 L18.5 13.5 L18 16 L20 18 L17.5 20.5 L15.5 18.5 L13.5 19 L13.5 21.5 L10.5 21.5 L10.5 19 L8 18.5 L6 20.5 L3.5 18 L5.5 16 L5 13.5 L2.5 13.5 L2.5 10.5 L5 10.5 L5.5 8 L3.5 6 L6 3.5 L8 5.5 L10.5 5 Z" />
    {/* Center hole */}
    <circle cx="12" cy="12" r="3.5" />
  </IconWrapper>
);

// Export all icons as named exports (already done above)
// Also export as a collection for convenience
export const DrummerIcons = {
  DrumIcon,
  CymbalIcon,
  DrumKitIcon,
  HiHatIcon,
  PedalIcon,
  DrumSticksIcon,
  HardwareIcon,
  CommentIcon,
  SnareIcon,
  EffectsIcon,
  GearIcon,
};

export default DrummerIcons;
