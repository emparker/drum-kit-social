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

**Note:** A single drummer can have multiple posts (one per album/kit combination).

```javascript
{
  drummerName: String (required),
  album: String (required),             // Album where drummer used this kit
  user: ObjectId (ref: User),           // Creator of the post

  // Standard 5-Piece Kit
  drumKit: {
    kickDrum: String,
    snare: String,
    rackTom1: String,
    rackTom2: String,
    floorTom: String
  },

  // Add-ons (predefined categories)
  addOns: {
    hiHats: String,
    rideCymbal: String,
    crashCymbal: String,
    hardware: String,
    effects: String
  },

  // Voting system (many-to-many)
  likes: [ObjectId (ref: User)],        // Users who liked
  dislikes: [ObjectId (ref: User)],     // Users who disliked

  createdAt: Date,
  updatedAt: Date
}
```

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
| `/my-posts` | `MyPosts.jsx` | User's personal posts (full edit) | 🔄 Planned |
| `/create` | `CreatePost.jsx` | Create new drummer post | 🔄 Planned |

## Frontend Components

| Component | Description | Status |
|-----------|-------------|--------|
| `ProtectedRoute.jsx` | Route guard for authenticated pages | ✅ Complete |
| `DrummerCard.jsx` | Display drummer post with kit details, voting, and comments | ✅ Complete |
| `CommentSection.jsx` | Comment list, create, edit, and delete functionality | ✅ Complete |

## Context Providers

### AuthContext
Manages: user state, token, login/logout/signup functions

### PostContext
Manages: posts array, CRUD operations, voting, drum kit updates, comment operations (create, update, delete)

## Key Features & Business Logic

### Authentication Flow
1. User signs up → password hashed → stored in DB
2. User logs in → JWT generated → stored in localStorage
3. JWT attached to all API requests via Authorization header
4. Protected routes check for valid token

### Album Field & Display ✅ Implemented
- Album is a required field connecting the drummer to a specific recording
- **Implementation:** Album displayed in highlighted lime green box between drummer name and kit details
- Visual hierarchy: Drummer name (Michroma all-caps) → Album (lime green, Inter Bold) → Kit details
- Album has its own section with "Album:" label and prominent title styling
- Clear separation from drum kit information for improved readability

### Voting Rules ✅ Implemented
- Each user can ONLY like OR dislike a post (not both)
- Clicking like when already liked → removes like (toggle off)
- Clicking dislike when already disliked → removes dislike (toggle off)
- Clicking like when disliked → removes dislike, adds like (mutually exclusive)
- Posts sorted by total likes (descending)
- **Implementation:** Emoji buttons (👍👎) with vote counts, lime green highlight when voted, optimistic UI updates

### Editing Permissions
| Field | Who Can Edit | Where |
|-------|--------------|-------|
| Drummer Name | Post creator only | My Posts page |
| Album | Post creator only | My Posts page |
| Drum Kit Info | Post creator only | My Posts page |
| Add-ons | Post creator only | My Posts page |
| Delete Post | Post creator only | My Posts page |

**Key Concept:** Full ownership model. Only the creator can edit ANY field on their post. Community interaction is limited to viewing, voting, and commenting.

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
