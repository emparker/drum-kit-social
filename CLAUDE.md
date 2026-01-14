# CLAUDE.md - Drum Kit Social App

## Project Overview

**Drum Kit Social** is a community-driven web application where users can create and share professional drummer profiles with their drum kit configurations by album. Users build a searchable database of drummer/album/kit combinations. Each submission is fully owned by its creator, with community interaction through voting and comments.

This project is a learning exercise for the MERN stack (MongoDB, Express, React, Node.js) with JWT authentication.

## Design Direction

**Visual Theme:** Edgy, creative, bold, and clean

**Color Palette:**
- **Primary Accent:** Vibrant lime/chartreuse green (#C5D945)
- **Text:** Dark charcoal (#3A3A3A)
- **Backgrounds:** Mix of white, light grays, and accent green
- **Contrast:** High contrast for modern, punchy aesthetic

**Typography:**
- **Display Font (H1-H3):** Michroma - All-caps with increased letter-spacing (3-5%) for high-end cymbal branding aesthetic
- **Sub-headings (H4-H5):** Inter Bold - Bridge between display and body text
- **Body Text:** Inter Regular - Clean, readable, professional
- Large, impactful headings create strong visual hierarchy
- Fonts loaded via Google Fonts CDN

**UI Approach:**
- Minimalist with bold accent colors
- Clean lines and generous spacing
- Strong visual hierarchy
- Creative use of the lime green for CTAs and highlights
- **Dark Mode:** Full theme support with toggle button, persisted preference in localStorage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), React Router, Context API |
| Styling | Vanilla CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas with Mongoose ODM |
| Authentication | JWT (jsonwebtoken + express-jwt) |
| Environment | dotenv |

## Project Structure

```
drum-kit-social/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── icons/         # Custom SVG icon library
│   │   │   │   ├── DrummerIcons.jsx
│   │   │   │   └── DrummerIcons.css
│   │   │   ├── AppHeader.jsx
│   │   │   ├── CollapsibleSection.jsx
│   │   │   ├── CollapsibleSection.css
│   │   │   ├── CommentSection.jsx
│   │   │   ├── DrummerCard.jsx
│   │   │   ├── DrummerCard.css
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/           # React Context providers
│   │   ├── pages/             # Page-level components
│   │   ├── api/               # API call functions
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── DrummerPost.js
│   │   └── Comment.js
│   ├── routes/                # API route handlers
│   │   ├── authRouter.js
│   │   ├── drummerPostRouter.js
│   │   └── commentRouter.js
│   ├── middleware/            # Custom middleware
│   │   └── authMiddleware.js
│   ├── server.js              # Express app entry point
│   └── package.json
├── plans/                     # Refactor documentation
│   ├── DrummerCard-Collapsible-Sections-Refactor.md
│   ├── DrummerPost-Refactor-Documentation.md
│   ├── Quick-Reference.md
│   └── README.md
├── .env                       # Environment variables (git ignored)
├── .gitignore
├── CLAUDE.md                  # This file
├── ROADMAP.md                 # Development roadmap
└── README.md
```

## Data Models

### User Model
```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### DrummerPost Model

**Note:** A single drummer can have multiple posts (one per album/kit combination). Uses a flat structure with organized sections.

```javascript
{
  // Required Fields
  drummerName: String (required, trim),
  band: String (required, trim),        // Band name
  album: String (required, trim),       // Album where drummer used this kit
  user: ObjectId (ref: User),           // Creator of the post

  // Kit Metadata (Optional)
  drumKitModel: String (trim),          // e.g., "Tama Starclassic"
  material: String (trim),              // e.g., "Birch/Maple"
  color: String (trim),                 // e.g., "Starburst Fade"
  kitPieceCount: Number,                // e.g., 5

  // Drums (Optional) - Flat fields
  bass: String (trim),
  tom1: String (trim),
  tom2: String (trim),
  tom3: String (trim),
  snare: String (trim),

  // Cymbals (Optional) - Flat fields
  crash: String (trim),
  ride: String (trim),
  splash: String (trim),
  china: String (trim),
  hiHat: String (trim),

  // Extra Drums (Dynamic Array) - For additional drums beyond standard 5
  extraDrums: [{
    category: String (enum: ['bass', 'tom', 'snare']),
    label: String (auto-generated),     // e.g., "tom4", "bass2", "snare2"
    value: String (trim)                // e.g., "DW 16x14"
  }],

  // Extra Cymbals (Dynamic Array) - For additional cymbals beyond standard 5
  extraCymbals: [{
    category: String (enum: ['crash', 'ride', 'splash', 'china', 'hi-hat']),
    label: String (auto-generated),     // e.g., "crash2", "ride2", "hiHat2"
    value: String (trim)                // e.g., "Zildjian 20\""
  }],

  // Extras (Dynamic Array) - For other gear (hardware, pedals, effects)
  extras: [{
    category: String (enum: ['hardware', 'kick-pedal', 'effects']),
    label: String (auto-generated),     // e.g., "hardware1", "kick-pedal1"
    value: String (trim)                // e.g., "DW 9000 Double Pedal"
  }],

  // Voting system (many-to-many)
  likes: [ObjectId (ref: User)],        // Users who liked
  dislikes: [ObjectId (ref: User)],     // Users who disliked

  createdAt: Date,
  updatedAt: Date
}
```

**Extras Label Generation:** The backend pre-validate hook automatically generates sequential labels based on existing fields and extras of the same category. For example, if `tom1`, `tom2`, `tom3` exist and you add a "tom" extra to `extraDrums`, it becomes "tom4". Each array (`extraDrums`, `extraCymbals`, `extras`) is processed separately.

### Comment Model
```javascript
{
  title: String (required),
  text: String (required),
  user: ObjectId (ref: User),           // Comment author
  drummerPost: ObjectId (ref: DrummerPost),
  isEdited: Boolean (default: false),   // Tracks if comment was edited
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Create new user | No |
| POST | `/login` | Login, returns JWT | No |
| GET | `/users` | Get all users (for debugging/testing) | No |

### Drummer Post Routes (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posts (sorted by likes) | Yes |
| GET | `/user` | Get current user's posts | Yes |
| GET | `/:postId` | Get single post | Yes |
| POST | `/` | Create new post | Yes |
| PUT | `/:postId` | Update post (owner only) | Yes |
| PUT | `/:postId/like` | Like a post | Yes |
| PUT | `/:postId/dislike` | Dislike a post | Yes |
| DELETE | `/:postId` | Delete post (owner only) | Yes |

### Comment Routes (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post/:postId` | Get comments for a post | Yes |
| POST | `/post/:postId` | Add comment to post | Yes |
| PUT | `/:commentId` | Edit comment (owner only, marks as edited) | Yes |
| DELETE | `/:commentId` | Delete comment (owner only) | Yes |

## Frontend Pages & Routes

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/` | `Auth.jsx` | Login/Signup page (landing) | ✅ Complete |
| `/feed` | `Feed.jsx` | Public feed with DrummerCard, voting, and comments | ✅ Complete |
| `/create` | `CreatePost.jsx` | Create new drummer post (desktop button + mobile FAB) | ✅ Complete |
| `/my-posts` | `MyPosts.jsx` | User's personal posts (full edit and delete) | ✅ Complete |

## Frontend Components

| Component | Description | Status |
|-----------|-------------|--------|
| `ProtectedRoute.jsx` | Route guard for authenticated pages | ✅ Complete |
| `AppHeader.jsx` | Reusable header with branding, user info, theme toggle, logout | ✅ Complete |
| `ThemeToggle.jsx` | Dark/light mode toggle button | ✅ Complete |
| `DrummerCard.jsx` | Display drummer post with collapsible sections, voting, and comments | ✅ Complete |
| `CommentSection.jsx` | Comment list, create, edit, and delete functionality | ✅ Complete |
| `CollapsibleSection.jsx` | Reusable expandable/collapsible container with ARIA support | ✅ Complete |
| `icons/DrummerIcons.jsx` | Custom SVG icon library for drummer-specific icons | ✅ Complete |

### Custom Icon Library

Located in `src/components/icons/DrummerIcons.jsx`. Pure SVG icons with no dependencies.

**Usage:**
```javascript
import { DrumIcon, CymbalIcon } from './icons/DrummerIcons';
<DrumIcon size={24} className="my-class" />
```

**Available Icons:**
| Icon | Component | Used For |
|------|-----------|----------|
| Drum (side view) | `<DrumIcon />` | Drums section |
| Cymbal (top view) | `<CymbalIcon />` | Cymbals section |
| Drum Kit | `<DrumKitIcon />` | Kit Information section |
| Gear Cog | `<GearIcon />` | Other Gear section |
| Comment Bubble | `<CommentIcon />` | Comments section |
| Hi-Hat | `<HiHatIcon />` | Alternative cymbal icon |
| Kick Pedal | `<PedalIcon />` | Hardware/pedals |
| Snare (top view) | `<SnareIcon />` | Alternative drum icon |
| Hardware Stand | `<HardwareIcon />` | Stands/hardware |
| Effects Pad | `<EffectsIcon />` | Electronic gear |
| Drum Sticks | `<DrumSticksIcon />` | Branding/general |

**Features:**
- `size` prop for scaling (default: 24px)
- Inherits `currentColor` for easy theming
- Dark mode compatible
- Hover states change to lime green accent

**Vote Button Icons (SVG):**
- Like button: `src/assets/metal-horns.svg` - Rock hand gesture
- Dislike button: `src/assets/drumstick.svg` - Broken drumstick
- Fill color: #2A2A2A (dark gray)
- Imported as modules in DrummerCard.jsx for proper Vite bundling
- **Styling:** Social media style (Twitter/Reddit-like) - no box containers, just icon + count
- **Size:** 32px desktop, 28px mobile
- **Spacing:** 0.5rem gap between like and dislike buttons
- **Dark mode:** CSS filter `invert(85%)` for visibility
- **Hover/Active:** Lime green (#C5D945) tint with subtle scale animation

## Context Providers

### AuthContext
Manages: user state, token, login/logout/signup functions

### ThemeContext
Manages: dark/light theme state, persisted in localStorage

### PostContext
Manages: posts array, CRUD operations, voting, drum kit updates, comment operations (create, update, delete)

## Navigation & User Flow

### App Navigation Structure ✅ Implemented
- **AppHeader**: Reusable header component with:
  - App branding (🥁 Drum Kit Social)
  - Navigation links (Feed, My Posts) with active state highlighting
  - User welcome message with username
  - Theme toggle button
  - Logout button
- **Responsive Create Post Navigation**:
  - Desktop/tablet: "Create Post" button in page header
  - Mobile: Floating Action Button (FAB) with "+" icon
  - Both navigate to `/create` page
- **Protected Routes**: All authenticated pages (Feed, Create, My Posts) require valid JWT token

## Key Features & Business Logic

### Authentication Flow
1. User signs up → password hashed → stored in DB
2. User logs in → JWT generated → stored in localStorage
3. JWT attached to all API requests via Authorization header
4. Protected routes check for valid token

### Band & Album Fields ✅ Implemented
- Band and Album are required fields connecting the drummer to a specific recording
- **Implementation:** Band and Album displayed inline in a single row (flexbox)
  - Shared container with subtle accent background and lime green left border
  - Band on left, Album on right
  - Labels in uppercase, values in lime green accent color
- Visual hierarchy: Drummer name (Michroma all-caps) → Band & Album row → Kit details
- Form sections: Required Info → Kit Metadata → Drums → Cymbals → Extras

### Voting Rules ✅ Implemented
- Each user can ONLY like OR dislike a post (not both)
- Clicking like when already liked → removes like (toggle off)
- Clicking dislike when already disliked → removes dislike (toggle off)
- Clicking like when disliked → removes dislike, adds like (mutually exclusive)
- Posts sorted by total likes (descending)
- **Implementation:** Custom SVG icons (metal horns for like, broken drumstick for dislike) with vote counts, social media style (no box containers), lime green highlight on hover/active, optimistic UI updates

### Editing Permissions ✅ Implemented
| Field | Who Can Edit | Where |
|-------|--------------|-------|
| Drummer Name | Post creator only | My Posts page |
| Band | Post creator only | My Posts page |
| Album | Post creator only | My Posts page |
| Kit Metadata | Post creator only | My Posts page |
| Drums | Post creator only | My Posts page |
| Cymbals | Post creator only | My Posts page |
| Extras | Post creator only | My Posts page |
| Delete Post | Post creator only | My Posts page |

**Key Concept:** Full ownership model. Only the creator can edit ANY field on their post. Community interaction is limited to viewing, voting, and commenting.

**Implementation:**
- DrummerCard component accepts `showEditControls` and `isOwner` props
- Edit mode toggles inline text inputs for all fields
- Save button validates required fields and calls `updatePost()`
- Cancel button reverts form state to original values
- Delete button shows browser confirmation dialog before calling `deletePost()`
- Edit controls only visible on My Posts page, not in public Feed

### Comments ✅ Implemented
- Newest comments appear at top (sorted by `createdAt` descending)
- Scrollable comment section per card (max-height: 400px)
- Each comment displays: title (bold), text, username, and relative timestamp ("2 hours ago")
- Display small "edited" badge if `isEdited === true`
- Edit (✏️) and delete (🗑️) emoji buttons visible only to comment owner
- Inline editing: click edit → modify in-place → save (sets `isEdited: true`)
- Delete with browser confirmation dialog
- Full ownership model: only creator can edit or delete their comments
- **Implementation:** CommentSection component with form validation, error messages for empty submissions, optimistic UI updates

## Environment Variables

Create a `.env` file in the root:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/drum-kit-social?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-here
PORT=5000
```

## Development Commands

```bash
# Install all dependencies
npm run install-all

# Run backend only
npm run server

# Run frontend only
npm run client

# Run both concurrently
npm run dev
```

## Common Gotchas for Students

1. **CORS**: Backend must allow requests from frontend origin
2. **Token expiration**: Handle gracefully in frontend
3. **ObjectId validation**: Validate before DB queries
4. **Password never returned**: Exclude from User queries
5. **Populate references**: Use `.populate()` to get user info with posts
6. **Array updates in Mongoose**: Use `$push`, `$pull`, `$addToSet`

## Deployment Notes

- **Frontend**: Vercel or Netlify (static hosting)
- **Backend**: Render, Railway, or Vercel serverless
- **Database**: MongoDB Atlas (free tier available)
- Update CORS origins for production URLs
- Set environment variables in hosting platform

## Reference: Standard 5-Piece Pro Kit

**Main Kit:**
- 1 Bass Drum (Kick Drum)
- 1 Snare Drum
- 2 Rack Toms (High Tom, Mid Tom)
- 1 Floor Tom

**Standard Add-ons:**
- Hi-Hats (14" pair)
- Ride Cymbal (20"–22")
- Crash Cymbals (16" and 18")
- Hardware (throne, kick pedal, stands)
- Effects (splash, china, cowbell)
