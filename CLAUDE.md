# CLAUDE.md - Drum Kit Social App

## Project Overview

**Drum Kit Social** is a community-driven web application where users can share and collaborate on professional drummer profiles and their drum kit configurations. Think of it as a wiki-style social platform specifically for the drumming community.

This project is a learning exercise for the MERN stack (MongoDB, Express, React, Node.js) with JWT authentication.

## Design Direction

**Visual Theme:** Edgy, creative, bold, and clean

**Color Palette:**
- **Primary Accent:** Vibrant lime/chartreuse green (#C5D945)
- **Text:** Dark charcoal (#3A3A3A)
- **Backgrounds:** Mix of white, light grays, and accent green
- **Contrast:** High contrast for modern, punchy aesthetic

**Typography:**
- Bold, modern sans-serif fonts
- Large, impactful headings
- Clean, readable body text

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
```javascript
{
  drummerName: String (required),
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
  createdAt: Date
}
```

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Create new user | No |
| POST | `/login` | Login, returns JWT | No |

### Drummer Post Routes (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posts (sorted by likes) | Yes |
| GET | `/user` | Get current user's posts | Yes |
| GET | `/:postId` | Get single post | Yes |
| POST | `/` | Create new post | Yes |
| PUT | `/:postId` | Update post (owner only for name) | Yes |
| PUT | `/:postId/drumkit` | Update drum kit info (any user) | Yes |
| PUT | `/:postId/addons` | Update add-ons (any user) | Yes |
| PUT | `/:postId/like` | Like a post | Yes |
| PUT | `/:postId/dislike` | Dislike a post | Yes |
| DELETE | `/:postId` | Delete post (owner only) | Yes |

### Comment Routes (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post/:postId` | Get comments for a post | Yes |
| POST | `/post/:postId` | Add comment to post | Yes |
| DELETE | `/:commentId` | Delete comment (owner only) | Yes |

## Frontend Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Auth.jsx` | Login/Signup page (landing) |
| `/feed` | `Feed.jsx` | Public feed - all drummer posts |
| `/my-posts` | `MyPosts.jsx` | User's personal posts (full edit) |
| `/create` | `CreatePost.jsx` | Create new drummer post |

## Context Providers

### AuthContext
Manages: user state, token, login/logout/signup functions

### PostContext
Manages: posts array, CRUD operations, voting, drum kit updates

## Key Features & Business Logic

### Authentication Flow
1. User signs up → password hashed → stored in DB
2. User logs in → JWT generated → stored in localStorage
3. JWT attached to all API requests via Authorization header
4. Protected routes check for valid token

### Voting Rules
- Each user can ONLY like OR dislike a post (not both)
- Clicking like when already liked → removes like
- Clicking dislike when already disliked → removes dislike
- Clicking like when disliked → removes dislike, adds like
- Posts sorted by total likes (descending)

### Editing Permissions
| Field | Who Can Edit | Where |
|-------|--------------|-------|
| Drummer Name | Post creator only | My Posts page |
| Drum Kit Info | Any logged-in user | Feed (unless set by creator) |
| Add-ons | Any logged-in user | Feed |
| Delete Post | Post creator only | My Posts page |

### Comments
- Newest comments appear at top
- Scrollable comment section per card
- Username displayed with each comment

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
