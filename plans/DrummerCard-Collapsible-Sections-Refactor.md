# DrummerCard UX/UI Refactor Plan: Collapsible Sections Strategy

## Executive Summary

The current DrummerCard component displays all information in a flat, vertical layout, resulting in cards that are excessively tall (estimated 800-1200px per card) and creating a monotonous, fatiguing feed experience. This refactor introduces a progressive disclosure pattern using collapsible sections that reduce initial card height by approximately 70% while improving information scannability and user engagement.

---

## Current State Analysis

### Content Hierarchy
1. **Header** (Drummer Name + Edit Controls)
2. **Band & Album Row** (inline display)
3. **Kit Metadata** (4 fields: Model, Material, Color, Pieces)
4. **Drums Section** (5 fields + extraDrums array)
5. **Cymbals Section** (5 fields + extraCymbals array)
6. **Other Gear Section** (extras array)
7. **Voting Section**
8. **Card Footer** (Posted by)
9. **Comment Section**

### Problems Identified
- **Vertical sprawl**: Cards can be 800-1200px tall with complete kit configurations
- **Information overload**: All data visible simultaneously reduces scannability
- **Weak information hierarchy**: Equal visual weight given to all sections
- **Poor feed dynamics**: Users must scroll extensively between posts
- **No progressive disclosure**: No way to quickly scan multiple posts
- **Engagement fatigue**: Dense information discourages exploration

---

## Proposed Solution: Progressive Disclosure Architecture

### Design Philosophy

**"Intrigue, then reveal"** - Each section becomes a clickable container that:
1. Shows just enough information to spark curiosity (collapsed state)
2. Reveals full details on interaction (expanded state)
3. Operates independently for flexible exploration
4. Works seamlessly in both view and edit modes
5. Maintains accessibility and mobile responsiveness

---

## Section-by-Section Refactor Strategy

### 1. ALWAYS VISIBLE (Non-Collapsible)

**Sections:** Header, Band/Album Row, Voting, Footer

**Rationale:** These provide essential context and primary interaction points that should always be accessible.

**Design:**
- **Drummer Name**: Remains prominent (Michroma, uppercase, 2rem)
- **Band & Album Row**: Keep current inline design with lime border accent
- **Voting Buttons**: Always visible for immediate engagement
- **Posted By**: Small, subtle footer information

---

### 2. KIT METADATA SECTION (Collapsible)

#### Collapsed State Design

```
┌─────────────────────────────────────────────────────┐
│ 🛠️ Kit Information                          [>]    │
│ Tama Starclassic • Birch/Maple • 5-piece          │
└─────────────────────────────────────────────────────┘
```

**Visual Elements:**
- **Icon**: 🛠️ (wrench) for kit/gear identity
- **Title**: "Kit Information" (Inter Bold, 18px)
- **Preview Line**: Inline summary showing filled fields separated by bullets
  - Format: `{Model} • {Material} • {Color} • {X-piece}`
  - Only show fields that have values
  - Use lime green color for values (#C5D945)
  - Gray italics if no data: "No kit details provided"
- **Chevron**: Rotates 90° when expanded (right → down)
- **Background**: Subtle hover state (--color-bg-accent)
- **Cursor**: Pointer on entire container

**Layout:**
- Height: 60px
- Padding: 16px
- Border: 1px solid --color-border
- Border-radius: 8px
- Margin-bottom: 16px

#### Expanded State Design

```
┌─────────────────────────────────────────────────────┐
│ 🛠️ Kit Information                          [v]    │
│                                                     │
│ Model:        Tama Starclassic                      │
│ Material:     Birch/Maple                           │
│ Color:        Starburst Fade                        │
│ Pieces:       5                                     │
└─────────────────────────────────────────────────────┘
```

**Interaction:**
- **Animation**: Smooth height expansion (350ms ease-out)
- **Content fade-in**: Opacity 0 → 1 (250ms delay)
- **Grid layout**: 2 columns on desktop, 1 on mobile
- **Edit mode**: Show input fields instead of values

**Edit Mode Considerations:**
- Input fields replace static values
- Maintain same grid layout
- Add subtle blue border on focus
- Validation states inline

---

### 3. DRUMS SECTION (Collapsible)

#### Collapsed State Design

```
┌─────────────────────────────────────────────────────┐
│ 🥁 Drums (7 pieces)                         [>]    │
│ Bass • Tom 1 • Tom 2 • Snare • +3 more             │
└─────────────────────────────────────────────────────┘
```

**Visual Elements:**
- **Icon**: 🥁 (drum emoji)
- **Title**: "Drums" with count badge `(X pieces)`
  - Count includes base fields + extraDrums array length
  - Badge in lime green background, dark text
- **Preview Line**: Show first 3-4 filled drum labels, then "+X more"
  - Example: "Bass • Tom 1 • Tom 2 • Snare • +3 more"
  - Truncate intelligently based on available width
- **No data state**: "No drums configured" (gray, italic)

**Count Badge Design:**
```css
.section-count-badge {
  background: var(--color-primary);
  color: var(--color-text);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
}
```

#### Expanded State Design

```
┌─────────────────────────────────────────────────────┐
│ 🥁 Drums (7 pieces)                         [v]    │
│                                                     │
│ ┌─ Standard Drums ─────────────────────────────┐   │
│ │ Bass:   DW 22x18                             │   │
│ │ Tom 1:  DW 10x8                              │   │
│ │ Tom 2:  DW 12x9                              │   │
│ │ Tom 3:  DW 14x12                             │   │
│ │ Snare:  Ludwig Black Beauty 14x6.5          │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌─ Additional Drums ───────────────────────────┐   │
│ │ tom4:   Pearl 16x14                          │   │
│ │ bass2:  DW 24x18                             │   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Layout:**
- **Standard Drums**: Grouped in a subtle bordered container
- **Additional Drums** (extraDrums): Separate subsection if present
- **Grid**: 2 columns on desktop, 1 on mobile
- **Visual separation**: Dashed border between standard and extras

**Enticement Strategy:**
- Count badge creates curiosity ("7 pieces? That's a big kit!")
- Preview line shows variety
- "+X more" triggers FOMO (fear of missing out)

---

### 4. CYMBALS SECTION (Collapsible)

#### Collapsed State Design

```
┌─────────────────────────────────────────────────────┐
│ 🥏 Cymbals (6 pieces)                       [>]    │
│ Zildjian • Paiste • Sabian • +3 more               │
└─────────────────────────────────────────────────────┘
```

**Visual Elements:**
- **Icon**: 🥏 (flying disc - closest to cymbal) or ⭕ (hollow circle)
- **Title**: "Cymbals" with count badge
- **Preview Line**: Show BRANDS extracted from values
  - Smart parsing: Extract first word from each cymbal value
  - Deduplicate brands
  - Format: `Brand1 • Brand2 • Brand3 • +X more`
  - Fallback: Show first 3 cymbal labels if brand parsing fails

**Brand Extraction Logic:**
```javascript
// Extract unique brands from cymbal values
const extractBrands = (post) => {
  const cymbals = [post.crash, post.ride, post.hiHat, post.splash, post.china]
    .filter(Boolean);
  const brands = cymbals
    .map(cymbal => cymbal.split(' ')[0]) // Get first word
    .filter((brand, index, arr) => arr.indexOf(brand) === index); // Dedupe
  return brands;
};
```

**Why Show Brands?**
- More engaging than showing labels ("Crash • Ride • Hi-Hat")
- Creates brand recognition and preference signals
- Drummers care deeply about cymbal brands
- Differentiates similar kit configurations

#### Expanded State Design

```
┌─────────────────────────────────────────────────────┐
│ 🥏 Cymbals (6 pieces)                       [v]    │
│                                                     │
│ ┌─ Standard Cymbals ───────────────────────────┐   │
│ │ Crash:    Zildjian A Custom 18"              │   │
│ │ Ride:     Paiste 2002 22"                    │   │
│ │ Hi-Hat:   Zildjian New Beat 14"              │   │
│ │ Splash:   Sabian HHX 10"                     │   │
│ │ China:    Wuhan 18"                          │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌─ Additional Cymbals ─────────────────────────┐   │
│ │ crash2:   Zildjian K 20"                     │   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Same layout principles as Drums section.**

---

### 5. OTHER GEAR SECTION (Collapsible)

#### Collapsed State Design

```
┌─────────────────────────────────────────────────────┐
│ ⚙️ Other Gear (4 items)                     [>]    │
│ Hardware • Kick Pedals • Effects                    │
└─────────────────────────────────────────────────────┘
```

**Visual Elements:**
- **Icon**: ⚙️ (gear/settings icon)
- **Title**: "Other Gear" with count badge
- **Preview Line**: Show CATEGORIES (deduplicated)
  - Extract unique categories from extras array
  - Format category names nicely: "kick-pedal" → "Kick Pedals"
  - Example: "Hardware • Kick Pedals • Effects"

**Category Extraction:**
```javascript
const extractCategories = (extras) => {
  const categories = extras
    .map(e => e.category)
    .filter((cat, index, arr) => arr.indexOf(cat) === index)
    .map(cat => formatCategoryName(cat));
  return categories;
};

const formatCategoryName = (category) => {
  const map = {
    'hardware': 'Hardware',
    'kick-pedal': 'Kick Pedals',
    'effects': 'Effects'
  };
  return map[category] || category;
};
```

#### Expanded State Design

```
┌─────────────────────────────────────────────────────┐
│ ⚙️ Other Gear (4 items)                     [v]    │
│                                                     │
│ hardware1:      DW 9000 Series Stands               │
│ kick-pedal1:    Tama Iron Cobra Double Pedal       │
│ effects1:       Roland SPD-SX Sampling Pad         │
│ effects2:       Zildjian Gen16 Digital Cymbal      │
└─────────────────────────────────────────────────────┘
```

**Layout:**
- Single column list (simpler than grid)
- Each item on its own line
- Category-based grouping optional in future iteration

---

### 6. COMMENT SECTION (Collapsible)

> **KEY UX DECISION:** The comment count is ALWAYS visible on the collapsed section header. This provides immediate value assessment - users can instantly see if there's community discussion worth exploring before deciding to click.

#### Collapsed State Design

```
┌─────────────────────────────────────────────────────┐
│ 💬 Comments (12)                            [>]    │
│ Latest: "Amazing setup!" - jsmith • 2h ago          │
└─────────────────────────────────────────────────────┘
```

**Visual Elements:**
- **Icon**: 💬 (speech bubble)
- **Title**: "Comments" with **ALWAYS VISIBLE count badge** (lime green)
  - Count badge is critical UX feedback - justifies click decision
  - Shows `(0)` when no comments - clear signal nothing to read
  - Shows `(12)` when comments exist - creates social proof
- **Preview Line**: Show latest comment (only if count > 0)
  - Format: `"Title" - username • time ago`
  - Truncate title to 40 characters with ellipsis
  - Show relative time (2h ago, 3d ago)
- **No comments state**: Preview shows "Be the first to comment!"

**Why Comment Count is Critical:**
- **Zero comments**: User knows there's nothing to read, may choose to be first
- **Few comments (1-5)**: Manageable discussion, easy to read
- **Many comments (10+)**: Active discussion, social proof, FOMO trigger
- **Immediate decision-making**: No need to expand just to check if comments exist

**Comment Count Badge Styling (Emphasized):**
```css
.comment-count-badge {
  background: var(--color-primary);
  color: var(--color-text);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  margin-left: 8px;
  /* Slightly larger than other badges to emphasize social activity */
}

/* Zero comments - subdued styling */
.comment-count-badge.empty {
  background: var(--color-border);
  color: var(--color-text-light);
}
```

#### Expanded State Design

```
┌─────────────────────────────────────────────────────┐
│ 💬 Comments (12)                            [v]    │
│                                 [+ Add Comment]     │
│                                                     │
│ ┌───────────────────────────────────────────────┐  │
│ │ "Amazing setup!" • edited                     │  │
│ │ I've been looking for this exact config...    │  │
│ │ jsmith • 2 hours ago                    ✏️🗑️  │  │
│ └───────────────────────────────────────────────┘  │
│ [... more comments, scrollable ...]                │
└─────────────────────────────────────────────────────┘
```

**Current comment section already has good UI - keep it!**
- Comment form toggle
- Scrollable list (max-height: 400px)
- Inline editing
- Just wrap it in collapsible container

---

## Technical Implementation Strategy

### 1. Component Architecture

**New Component:** `CollapsibleSection.jsx`

```javascript
export default function CollapsibleSection({
  icon,
  title,
  count,
  previewContent,
  isExpanded,
  onToggle,
  isEmpty,
  emptyMessage,
  children,
  className,
  showEmptyCount = false // For comments - show (0) badge
}) {
  return (
    <div className={`collapsible-section ${isExpanded ? 'expanded' : 'collapsed'} ${className}`}>
      <button
        className="section-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="section-header-left">
          <span className="section-icon">{icon}</span>
          <h5 className="section-title">{title}</h5>
          {(count > 0 || showEmptyCount) && (
            <span className={`section-count-badge ${count === 0 ? 'empty' : ''}`}>
              {count}
            </span>
          )}
        </div>
        <div className="section-header-right">
          {!isExpanded && (
            <span className="section-preview">{previewContent}</span>
          )}
          <span className={`chevron ${isExpanded ? 'down' : 'right'}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      <div className={`section-content ${isExpanded ? 'visible' : 'hidden'}`}>
        {isEmpty ? (
          <p className="empty-state">{emptyMessage}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
```

### 2. State Management

**Add to DrummerCard component:**

```javascript
// Section expansion state
const [expandedSections, setExpandedSections] = useState({
  kitMetadata: false,
  drums: false,
  cymbals: false,
  otherGear: false,
  comments: false
});

// Toggle individual section
const toggleSection = (sectionName) => {
  setExpandedSections(prev => ({
    ...prev,
    [sectionName]: !prev[sectionName]
  }));
};

// Expand all (for edit mode)
const expandAllSections = () => {
  setExpandedSections({
    kitMetadata: true,
    drums: true,
    cymbals: true,
    otherGear: true,
    comments: true
  });
};
```

### 3. Edit Mode Behavior

**Strategy:** Automatically expand all sections when entering edit mode

```javascript
const handleEdit = () => {
  setIsEditing(true);
  expandAllSections(); // Show all fields for editing
};

const handleCancel = () => {
  // ... existing cancel logic ...
  setIsEditing(false);
  // Keep sections expanded or collapse them based on preference
};
```

**Rationale:**
- Editors need full visibility of all fields
- Prevents confusion about "hidden" editable fields
- Clear visual indication that edit mode is active
- Reduces interaction friction

**Alternative (Advanced):**
- Keep sections collapsible in edit mode
- Add visual indicator (orange border) on collapsed sections with empty required fields
- Allow focused editing of specific sections

### 4. Preview Content Generation

**Helper Functions:**

```javascript
// Kit Metadata Preview
const getKitMetadataPreview = (post) => {
  const parts = [
    post.drumKitModel,
    post.material,
    post.color,
    post.kitPieceCount && `${post.kitPieceCount}-piece`
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(' • ')
    : 'No kit details provided';
};

// Drums Preview
const getDrumsPreview = (post) => {
  const drumFields = ['bass', 'tom1', 'tom2', 'tom3', 'snare'];
  const filledDrums = drumFields.filter(field => post[field]);
  const extraCount = post.extraDrums?.length || 0;

  const preview = filledDrums.slice(0, 4).map(field =>
    field === 'bass' ? 'Bass' :
    field.includes('tom') ? `Tom ${field.slice(-1)}` :
    'Snare'
  );

  const remaining = filledDrums.length + extraCount - preview.length;
  if (remaining > 0) preview.push(`+${remaining} more`);

  return preview.join(' • ') || 'No drums configured';
};

// Cymbals Preview (with brand extraction)
const getCymbalsPreview = (post) => {
  const cymbalFields = ['crash', 'ride', 'hiHat', 'splash', 'china'];
  const cymbals = cymbalFields
    .map(field => post[field])
    .filter(Boolean);

  const extraCount = post.extraCymbals?.length || 0;

  if (cymbals.length === 0 && extraCount === 0) {
    return 'No cymbals configured';
  }

  // Extract unique brands
  const brands = [...new Set(cymbals.map(c => c.split(' ')[0]))];
  const preview = brands.slice(0, 3);

  const remaining = brands.length + extraCount - preview.length;
  if (remaining > 0) preview.push(`+${remaining} more`);

  return preview.join(' • ');
};

// Other Gear Preview
const getOtherGearPreview = (post) => {
  if (!post.extras || post.extras.length === 0) {
    return 'No other gear added';
  }

  const categoryMap = {
    'hardware': 'Hardware',
    'kick-pedal': 'Kick Pedals',
    'effects': 'Effects'
  };

  const categories = [...new Set(
    post.extras.map(e => categoryMap[e.category] || e.category)
  )];

  return categories.join(' • ');
};

// Comments Preview
const getCommentsPreview = (comments) => {
  if (comments.length === 0) {
    return 'Be the first to comment!';
  }

  const latest = comments[0]; // Already sorted newest first
  const truncatedTitle = latest.title.length > 40
    ? latest.title.substring(0, 40) + '...'
    : latest.title;

  return `"${truncatedTitle}" - ${latest.user?.username} • ${getRelativeTime(latest.createdAt)}`;
};
```

### 5. Count Calculation

```javascript
// Kit Metadata count (number of filled fields)
const kitMetadataCount = [
  post.drumKitModel,
  post.material,
  post.color,
  post.kitPieceCount
].filter(Boolean).length;

// Drums count
const drumsCount = [
  post.bass, post.tom1, post.tom2, post.tom3, post.snare
].filter(Boolean).length + (post.extraDrums?.length || 0);

// Cymbals count
const cymbalsCount = [
  post.crash, post.ride, post.hiHat, post.splash, post.china
].filter(Boolean).length + (post.extraCymbals?.length || 0);

// Other Gear count
const otherGearCount = post.extras?.length || 0;

// Comments count - ALWAYS SHOWN (critical UX feedback)
const commentsCount = comments.length;
```

---

## CSS Implementation

### Core Collapsible Styles

```css
/* Collapsible Section Container */
.collapsible-section {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  overflow: hidden;
  transition: all var(--transition-base);
}

.collapsible-section:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* Section Header (clickable button) */
.section-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-align: left;
}

.section-header:hover {
  background: var(--color-bg-accent);
}

.section-header:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

/* Header Left Side */
.section-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.section-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.section-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
}

.section-count-badge {
  background: var(--color-primary);
  color: var(--color-text);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

/* Empty count badge (for comments with 0) */
.section-count-badge.empty {
  background: var(--color-border);
  color: var(--color-text-light);
}

/* Header Right Side */
.section-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.section-preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  font-size: 0.875rem;
  color: var(--color-text-light);
  transition: transform var(--transition-base);
  flex-shrink: 0;
}

.chevron.down {
  transform: rotate(90deg);
}

/* Section Content */
.section-content {
  padding: 0 var(--space-md) var(--space-md) var(--space-md);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height var(--transition-slow),
              opacity var(--transition-base),
              padding var(--transition-slow);
}

.section-content.visible {
  max-height: 2000px; /* Large enough for any content */
  opacity: 1;
  padding: var(--space-md);
}

/* Empty State */
.empty-state {
  color: var(--color-text-light);
  font-style: italic;
  text-align: center;
  padding: var(--space-lg) 0;
}

/* Subsection Containers (Standard/Additional) */
.subsection-container {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.subsection-container:last-child {
  margin-bottom: 0;
}

.subsection-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-sm);
}
```

### Mobile Responsiveness

```css
@media (max-width: 768px) {
  .section-preview {
    max-width: 180px; /* Reduce on mobile */
    font-size: 0.75rem;
  }

  .section-icon {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: var(--font-size-base);
  }

  .section-count-badge {
    font-size: 0.75rem;
    padding: 2px 6px;
  }

  /* Stack header on very small screens */
  @media (max-width: 480px) {
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
    }

    .section-header-right {
      width: 100%;
      justify-content: space-between;
    }
  }
}
```

---

## Animation & Interaction Details

### 1. Expansion Animation

**Technique:** CSS max-height transition + opacity fade

**Timing:**
- Max-height: 350ms ease-out (smooth accordion effect)
- Opacity: 250ms ease-in (delayed 50ms for smoother feel)
- Padding: 350ms ease-out (prevents jump)

**Why not CSS Grid/Flexbox animations?**
- Max-height provides consistent, predictable animation
- Works across all browsers without JavaScript
- Allows for variable content heights

### 2. Chevron Rotation

**Timing:** 250ms ease-out
**Effect:** Rotate 90° clockwise (right → down)
**Accessibility:** Paired with aria-expanded attribute

### 3. Hover States

**Section Header:**
- Background: Subtle lime wash (--color-bg-accent)
- Border: Highlight with primary color
- Shadow: Slight elevation (--shadow-sm)
- Timing: 150ms ease-in-out

**Purpose:** Clear affordance that section is interactive

### 4. Focus States (Accessibility)

**Keyboard Navigation:**
- Tab through collapsible sections
- Enter/Space to toggle
- Clear focus ring (2px solid lime green)
- Focus visible on section header button

---

## Accessibility Specifications

### ARIA Attributes

```html
<button
  className="section-header"
  onClick={onToggle}
  aria-expanded={isExpanded}
  aria-controls={`section-content-${sectionId}`}
  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
>
  <!-- ... -->
</button>

<div
  id={`section-content-${sectionId}`}
  className="section-content"
  role="region"
  aria-labelledby={`section-header-${sectionId}`}
>
  <!-- ... -->
</div>
```

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Move focus to next collapsible section |
| Shift+Tab | Move focus to previous collapsible section |
| Enter/Space | Toggle section expansion |
| Escape | Collapse focused section (optional enhancement) |

### Screen Reader Experience

1. **Collapsed State Announcement:**
   - "Kit Information section, collapsed, button. Tama Starclassic • Birch Maple • 5-piece"

2. **Expanded State Announcement:**
   - "Kit Information section, expanded, button"
   - Content within section read normally

3. **Count Badges:**
   - Read as part of section title: "Drums 7 pieces"
   - Comments: "Comments 12" - provides immediate context

### Color Contrast

- **Count badges**: Dark text (#3A3A3A) on lime (#C5D945) = 9.2:1 (WCAG AAA)
- **Preview text**: Gray (#6B6B6B) on white = 5.7:1 (WCAG AA)
- **Section titles**: Dark (#3A3A3A) on white = 11.5:1 (WCAG AAA)

### Focus Indicators

- 2px solid outline in primary color
- Offset: -2px (inside button)
- Visible in all themes (light and dark)

---

## Edit Mode Integration

### Strategy: Auto-expand on Edit

**Behavior:**
1. User clicks "Edit" button
2. All collapsible sections expand simultaneously
3. Edit inputs replace static values
4. Sections remain expanded throughout edit session
5. Save/Cancel returns to user's previous expansion state (optional) OR collapses all

**Visual Indicator:**
- Add subtle orange/amber border to entire card in edit mode
- "Edit Mode" badge in header
- Save/Cancel buttons prominent at top

**Alternative (Advanced):**
- Keep sections collapsible in edit mode
- Add "Edit this section" icon/button in each collapsed header
- Clicking a collapsed section in edit mode expands it and focuses first input

### Validation in Collapsed Sections

**Problem:** User might miss validation errors in collapsed sections

**Solutions:**

1. **Error Badge on Section Header:**
   ```
   ┌─────────────────────────────────────────────────┐
   │ 🛠️ Kit Information [⚠️ 2 errors]        [>]   │
   └─────────────────────────────────────────────────┘
   ```
   - Red warning badge with count
   - Auto-expand section on save attempt if errors present

2. **Prevent Collapse with Errors:**
   - Sections with validation errors cannot be collapsed
   - Show lock icon instead of chevron
   - Clear error explanation at top of section

3. **Sticky Error Summary:**
   - Show error summary banner above all sections
   - "Fix 2 errors in Kit Information section" (clickable link)
   - Clicking expands relevant section and focuses first error field

**Recommended:** Combination of #1 and #3 for best UX

---

## Mobile Responsiveness

### Breakpoint Strategy

**Large Desktop (1200px+):**
- 2-column grids for all sections
- Full preview text visible (400px max-width)
- Spacious padding (16px)

**Desktop/Tablet (768px - 1199px):**
- 2-column grids maintained
- Preview text truncates earlier (300px)
- Standard padding (16px)

**Mobile (480px - 767px):**
- 1-column grids for all sections
- Preview text shortened (180px)
- Reduced padding (12px)
- Section icons slightly smaller

**Small Mobile (< 480px):**
- Section header stacks vertically
- Preview text on separate line
- Chevron remains on right
- Touch targets minimum 44x44px

### Touch Interactions

**Target Sizes:**
- Section header button: Minimum 60px tall (entire row clickable)
- Chevron: 44x44px touch target (even though icon is smaller)
- Count badges: Not interactive, no touch requirement

**Gesture Support:**
- Tap to expand/collapse
- No swipe gestures (could conflict with feed scrolling)
- Smooth scroll to section if expanded content causes layout shift

---

## Performance Considerations

### 1. Render Optimization

**Challenge:** Multiple collapsible sections per card, multiple cards in feed

**Solutions:**

- **Conditional rendering:** Only render section content when expanded
  ```javascript
  {isExpanded && (
    <div className="section-content visible">
      {children}
    </div>
  )}
  ```

- **React.memo:** Memoize CollapsibleSection component
  ```javascript
  export default React.memo(CollapsibleSection);
  ```

- **Virtual scrolling (future):** Consider react-window for feed with 100+ posts

### 2. Animation Performance

**Use CSS transforms over position changes:**
- Chevron rotation: `transform: rotate(90deg)` ✅
- Avoid: `top`, `left`, `width` animations ❌

**GPU acceleration:**
```css
.section-content {
  will-change: max-height, opacity; /* Hint to browser */
}
```

**Remove will-change after animation completes (advanced):**
```javascript
useEffect(() => {
  if (isExpanded) {
    const timer = setTimeout(() => {
      contentRef.current.style.willChange = 'auto';
    }, 350); // After animation duration
    return () => clearTimeout(timer);
  }
}, [isExpanded]);
```

### 3. Initial Load Strategy

**Default State:** All sections collapsed

**Rationale:**
- Fastest initial render (minimal DOM nodes)
- Compact feed view immediately
- User chooses what to explore

**Alternative (Smart Defaults):**
- Expand sections with data automatically on first card only
- Keep all others collapsed
- Creates "hero card" effect at feed top

---

## UX Enhancements & Advanced Features

### 1. "Expand All / Collapse All" Toggle

**Location:** Card header (optional button)

**Design:**
```
┌─────────────────────────────────────────────────┐
│ NEIL PEART                     [Expand All ⬇️] │
│                                [Edit] [Delete]  │
└─────────────────────────────────────────────────┘
```

**Behavior:**
- Clicking "Expand All" opens all sections simultaneously
- Label changes to "Collapse All" when all expanded
- Useful for users who want full data at once
- Can coexist with individual section toggles

**State Management:**
```javascript
const [expandAll, setExpandAll] = useState(false);

const handleExpandAll = () => {
  const newState = !expandAll;
  setExpandAll(newState);
  setExpandedSections({
    kitMetadata: newState,
    drums: newState,
    cymbals: newState,
    otherGear: newState,
    comments: newState
  });
};
```

### 2. Deep Linking to Expanded Sections

**Use Case:** Share direct link to specific drum kit details

**Implementation:**
```javascript
// URL: /feed?post=abc123&expand=drums,cymbals

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const expandParam = params.get('expand');

  if (expandParam) {
    const sectionsToExpand = expandParam.split(',');
    setExpandedSections(prev => {
      const newState = { ...prev };
      sectionsToExpand.forEach(section => {
        newState[section] = true;
      });
      return newState;
    });
  }
}, []);
```

**Share Button:**
- Add "Share this kit" button in card header
- Generates URL with expanded sections
- Copies to clipboard

### 3. Section Persistence (LocalStorage)

**Feature:** Remember user's expansion preferences across sessions

**Implementation:**
```javascript
// Save state when toggling
const toggleSection = (sectionName) => {
  const newState = {
    ...expandedSections,
    [sectionName]: !expandedSections[sectionName]
  };
  setExpandedSections(newState);

  // Save to localStorage
  localStorage.setItem(
    `cardExpansion_${post._id}`,
    JSON.stringify(newState)
  );
};

// Load state on mount
useEffect(() => {
  const saved = localStorage.getItem(`cardExpansion_${post._id}`);
  if (saved) {
    setExpandedSections(JSON.parse(saved));
  }
}, [post._id]);
```

**Consideration:** Could bloat localStorage with many posts. Implement TTL or limit to last 20 viewed posts.

### 4. Animated Item Counts

**Feature:** Count badges animate when values change (edit mode)

**Design:**
```css
@keyframes countPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.section-count-badge.updated {
  animation: countPulse 0.3s ease-in-out;
}
```

**Trigger:** When drum/cymbal/gear items added or removed in edit mode

### 5. Intelligent Preview Truncation

**Feature:** Preview text adapts to available space

**Implementation:**
```javascript
const [previewWidth, setPreviewWidth] = useState(400);

useEffect(() => {
  const header = headerRef.current;
  if (header) {
    const availableWidth = header.offsetWidth - leftSideWidth - chevronWidth - 32;
    setPreviewWidth(Math.max(180, Math.min(400, availableWidth)));
  }
}, []);
```

**CSS:**
```css
.section-preview {
  max-width: var(--preview-width);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 6. Section Loading States

**Use Case:** Comments section loads async after card render

**Design:**
```
┌─────────────────────────────────────────────────┐
│ 💬 Comments (...)                       [>]    │
│ Loading...                                      │
└─────────────────────────────────────────────────┘
```

**Collapsed state shows:** "Loading..." instead of preview
**Count badge:** Shows "..." or spinner icon while loading

### 7. Empty State Encouragement

**Better empty messages:**
- Kit Metadata: "Add kit details to showcase your gear" [+Add Details]
- Drums: "Configure your drum setup" [+Add Drums]
- Cymbals: "Tell us about your cymbals" [+Add Cymbals]
- Other Gear: "Got pedals, hardware, or effects?" [+Add Gear]
- Comments: "Start the conversation!" [+Add Comment]

**Action Buttons:**
- Clicking empty state button expands section and focuses first input
- Only shown in edit mode or on user's own posts

---

## Visual Comparison

### Before: Current Card Height (~1000px)

```
┌─────────────────────────────────────────────────┐
│ NEIL PEART                     [Edit] [Delete] │ 60px
├─────────────────────────────────────────────────┤
│ Band: Rush | Album: Moving Pictures            │ 60px
├─────────────────────────────────────────────────┤
│ Kit Information                                 │ 40px
│ Model: Tama...                                  │ 30px
│ Material: ...                                   │ 30px
│ Color: ...                                      │ 30px
│ Pieces: 5                                       │ 30px
├─────────────────────────────────────────────────┤
│ Drums                                           │ 40px
│ Bass: ...                                       │ 30px
│ Tom 1: ...                                      │ 30px
│ Tom 2: ...                                      │ 30px
│ Tom 3: ...                                      │ 30px
│ Snare: ...                                      │ 30px
│ Additional Drums                                │ 30px
│ tom4: ...                                       │ 30px
│ tom5: ...                                       │ 30px
├─────────────────────────────────────────────────┤
│ Cymbals                                         │ 40px
│ Crash: ...                                      │ 30px
│ Ride: ...                                       │ 30px
│ Hi-Hat: ...                                     │ 30px
│ Splash: ...                                     │ 30px
│ China: ...                                      │ 30px
│ Additional Cymbals                              │ 30px
│ crash2: ...                                     │ 30px
│ ride2: ...                                      │ 30px
├─────────────────────────────────────────────────┤
│ Other Gear                                      │ 40px
│ hardware1: ...                                  │ 30px
│ kick-pedal1: ...                                │ 30px
│ effects1: ...                                   │ 30px
├─────────────────────────────────────────────────┤
│ 👍 42  👎 3                                     │ 60px
├─────────────────────────────────────────────────┤
│ Posted by: jsmith                               │ 40px
├─────────────────────────────────────────────────┤
│ Comments (12)                [+ Add Comment]    │ 40px
│ [Comment form or list - 300-400px if expanded] │ 350px
└─────────────────────────────────────────────────┘
TOTAL: ~1000px (with comments collapsed)
```

### After: Collapsed Card Height (~350px)

```
┌─────────────────────────────────────────────────┐
│ NEIL PEART                     [Edit] [Delete] │ 60px
├─────────────────────────────────────────────────┤
│ Band: Rush | Album: Moving Pictures            │ 60px
├─────────────────────────────────────────────────┤
│ 🛠️ Kit Information (4)                   [>]  │ 60px
│ Tama Starclassic • Birch/Maple • 5-piece      │
├─────────────────────────────────────────────────┤
│ 🥁 Drums (7)                             [>]  │ 60px
│ Bass • Tom 1 • Tom 2 • Snare • +3 more        │
├─────────────────────────────────────────────────┤
│ 🥏 Cymbals (7)                           [>]  │ 60px
│ Zildjian • Paiste • Sabian • +4 more          │
├─────────────────────────────────────────────────┤
│ ⚙️ Other Gear (3)                        [>]  │ 60px
│ Hardware • Kick Pedals • Effects              │
├─────────────────────────────────────────────────┤
│ 💬 Comments (12)                         [>]  │ 60px  ← COUNT ALWAYS VISIBLE
│ "Amazing setup!" - jsmith • 2h ago            │
├─────────────────────────────────────────────────┤
│ 👍 42  👎 3                                     │ 60px
├─────────────────────────────────────────────────┤
│ Posted by: jsmith                               │ 40px
└─────────────────────────────────────────────────┘
TOTAL: ~520px (all collapsed)

REDUCTION: ~48% height reduction
ABOVE FOLD: 3-4 cards visible (up from 1-2)
```

---

## Implementation Roadmap

### Phase 1: Core Collapsible Infrastructure ✅ COMPLETE
- [x] Create CollapsibleSection component
- [x] Add section state management to DrummerCard
- [x] Implement CSS animations and transitions
- [x] Add accessibility attributes (ARIA)
- [x] Test keyboard navigation
- [x] **BONUS:** Create custom drummer SVG icon pack (replaced emojis)

**Files Created:**
- `src/components/CollapsibleSection.jsx` - Reusable collapsible section component
- `src/components/CollapsibleSection.css` - Styles with animations, dark mode, mobile responsive
- `src/components/icons/DrummerIcons.jsx` - Custom SVG icon library
- `src/components/icons/DrummerIcons.css` - Icon styling with theme support

**Files Modified:**
- `src/components/DrummerCard.jsx` - Integrated collapsible sections for all 5 areas

### Phase 2: Section Migration ✅ COMPLETE (merged into Phase 1)
- [x] Refactor Kit Metadata section
- [x] Refactor Drums section
- [x] Refactor Cymbals section
- [x] Refactor Other Gear section
- [x] Create preview content generators

### Phase 3: Comments Integration
- [x] Wrap CommentSection in collapsible container
- [ ] Implement comments preview logic with ALWAYS VISIBLE count
- [ ] Async loading state handling
- [ ] Test comment interactions in collapsed/expanded states

**Note:** Comments section is wrapped but count visibility on collapsed header requires lifting state from CommentSection component.

### Phase 4: Edit Mode Integration ✅ COMPLETE (merged into Phase 1)
- [x] Auto-expand on edit logic
- [ ] Validation error handling
- [ ] Form state preservation
- [x] Save/cancel behavior refinement

### Phase 5: Polish & Optimization
- [ ] Mobile responsiveness testing
- [ ] Animation performance optimization
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [x] Dark mode compatibility verification
- [ ] Accessibility audit (WCAG 2.1 AA compliance)

### Phase 6: Enhanced Features (Optional)
- [ ] "Expand All/Collapse All" toggle
- [ ] LocalStorage persistence
- [ ] Deep linking support
- [ ] Animated count badges
- [ ] User testing and iteration

---

## Risk Assessment & Mitigation

### Risk 1: Users Don't Understand Collapsible Sections

**Likelihood:** Medium
**Impact:** High

**Mitigation:**
- Clear visual affordances (chevron, hover states)
- First-time user tooltip: "Click to see more details"
- Consider expanding first card's sections by default as example
- Monitor expansion interaction rates in analytics

### Risk 2: Performance Issues with Many Cards

**Likelihood:** Low
**Impact:** Medium

**Mitigation:**
- Use React.memo for CollapsibleSection
- Implement virtual scrolling if feed exceeds 50 posts
- Lazy load comment sections (only fetch when expanded)
- Profile with React DevTools

### Risk 3: Mobile Touch Interactions Fail

**Likelihood:** Low
**Impact:** High

**Mitigation:**
- Ensure minimum 44x44px touch targets
- Test on real devices (iOS Safari, Android Chrome)
- Add touch event handlers as fallback if needed
- User testing on mobile devices

### Risk 4: Edit Mode Becomes Confusing

**Likelihood:** Medium
**Impact:** Medium

**Mitigation:**
- Auto-expand all sections in edit mode
- Clear "Edit Mode" indicator in header
- Prominent Save/Cancel buttons
- Validation error handling with section indicators

### Risk 5: Accessibility Issues

**Likelihood:** Low
**Impact:** High

**Mitigation:**
- ARIA attributes on all interactive elements
- Keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification
- Focus indicator visibility check

---

## Success Metrics

| Metric | Before (Baseline) | Target |
|--------|------------------|--------|
| Average Card Height | ~1000px | ~350px collapsed |
| Posts Visible Above Fold | 1-2 posts | 3-5 posts |
| Time to Scan Feed | ~45s for 10 posts | ~20s for 10 posts |
| Expansion Interaction Rate | N/A | 60%+ of users |
| Edit Mode Completion Rate | Baseline TBD | +15% increase |
| Mobile Bounce Rate | Baseline TBD | -20% decrease |

---

## Summary

This refactor transforms DrummerCard from a monolithic, vertically-stacked component into an engaging, explorable interface using progressive disclosure. By collapsing 5 major sections (Kit Metadata, Drums, Cymbals, Other Gear, Comments), we reduce initial card height by approximately **50-70%** while increasing information scannability and user engagement.

**Key Decision Added:** Comment count is ALWAYS visible on the collapsed section header, providing immediate feedback about community engagement and helping users decide whether to expand the comments section.

---

## Changelog

### v1.1 - 2026-01-14 (Phase 1 Complete)

**Implemented:**
- Created `CollapsibleSection.jsx` component with full ARIA accessibility support
- Created `CollapsibleSection.css` with animations, dark mode, and mobile responsiveness
- Integrated collapsible sections into `DrummerCard.jsx` for all 5 sections
- Added `expandedSections` state management with `toggleSection()` function
- Implemented auto-expand all sections when entering edit mode
- Created preview content generators for each section type
- Created custom drummer SVG icon library (`icons/DrummerIcons.jsx`)
  - 11 custom icons: DrumIcon, CymbalIcon, DrumKitIcon, GearIcon, CommentIcon, HiHatIcon, PedalIcon, SnareIcon, HardwareIcon, EffectsIcon, DrumSticksIcon
  - Pure SVG, no dependencies, theme-aware with hover states
- Replaced all emoji icons with custom SVG icons

**Technical Details:**
- CSS max-height transitions for smooth expand/collapse animations
- Keyboard navigation support (Tab, Enter/Space)
- Screen reader compatible with aria-expanded, aria-controls, aria-label
- Dark mode compatible using CSS custom properties
- Mobile responsive with breakpoints at 768px and 480px

---

*Document Version: 1.1*
*Created: 2026-01-13*
*Last Updated: 2026-01-14*
