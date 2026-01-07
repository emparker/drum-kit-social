# ROADMAP.md - Drum Kit Social Development Guide

This roadmap breaks down the project into phases. Each phase builds on the previous one. Take your time with each step—the goal is to understand what you're building, not just to finish quickly.

---

## Phase 0: Project Setup & Foundation
**Goal:** Get your development environment ready and understand the project structure.

### Step 0.1: Initialize the Monorepo
- [ ] Create project folder: `drum-kit-social`
- [ ] Initialize git: `git init`
- [ ] Create `.gitignore` with Node, React, and environment file exclusions
- [ ] Create root `package.json` with scripts to run client/server

**What you'll learn:** Monorepo structure, npm workspaces concept

### Step 0.2: Set Up the Backend Foundation
- [ ] Create `server/` folder
- [ ] Initialize: `cd server && npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install express mongoose dotenv jsonwebtoken express-jwt bcryptjs cors
  npm install -D nodemon
  ```
- [ ] Create `server.js` with basic Express setup (just a test route)
- [ ] Create `.env` file with `PORT` and `MONGO_URI`
- [ ] Test that server runs: `npm run dev`

**What you'll learn:** Express basics, environment variables, nodemon for hot reload

### Step 0.3: Set Up the Frontend Foundation
- [ ] Create React app with Vite: `npm create vite@latest client -- --template react`
- [ ] Install additional dependencies:
  ```bash
  cd client
  npm install react-router-dom axios
  ```
- [ ] Set up custom CSS variables and base styles in `index.css`
- [ ] Set up Vite proxy to backend (in `vite.config.js`)
- [ ] Test that frontend runs: `npm run dev`

**What you'll learn:** Vite setup, CSS custom properties, proxy for API calls

### Step 0.4: Connect to MongoDB Atlas
- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Create database user with password
- [ ] Whitelist your IP address (or allow access from anywhere for development)
- [ ] Get connection string and add to `.env` as `MONGO_URI`
- [ ] Create database connection in `server.js` using Mongoose
- [ ] Verify connection logs "Connected to MongoDB"

**What you'll learn:** MongoDB Atlas setup, cloud database connection, Mongoose

**🎯 Checkpoint:** You should have both client and server running. Server logs "Connected to MongoDB".

---

## Phase 1: Authentication System
**Goal:** Build complete user signup, login, and protected routes.

### Step 1.1: Create the User Model
- [ ] Create `server/models/User.js`
- [ ] Define schema: username (unique, required), password (required)
- [ ] Add pre-save hook to hash password with bcryptjs
- [ ] Add method to compare passwords for login

**What you'll learn:** Mongoose schemas, password hashing, instance methods

### Step 1.2: Build Auth Routes
- [ ] Create `server/routes/authRouter.js`
- [ ] POST `/signup` - validate input, create user, return JWT
- [ ] POST `/login` - find user, verify password, return JWT
- [ ] Use `jsonwebtoken` to sign tokens with your secret
- [ ] Mount router in `server.js` at `/api/auth`

**What you'll learn:** JWT creation, route organization, error responses

### Step 1.3: Create Auth Middleware
- [ ] Create `server/middleware/authMiddleware.js`
- [ ] Use `express-jwt` to verify tokens
- [ ] Middleware should add `req.auth` with user data
- [ ] Export for use in protected routes

**What you'll learn:** Middleware pattern, JWT verification, protecting routes

### Step 1.4: Test Auth with Postman/Thunder Client
- [ ] Test signup creates user and returns token
- [ ] Test login returns token for valid credentials
- [ ] Test login fails for wrong password
- [ ] Test protected route without token (should fail)
- [ ] Test protected route with token (should succeed)

**What you'll learn:** API testing, debugging auth issues

### Step 1.5: Build Frontend Auth Context
- [ ] Create `client/src/context/AuthContext.jsx`
- [ ] Manage state: user, token, loading
- [ ] Create functions: signup, login, logout
- [ ] Store token in localStorage
- [ ] Check for existing token on app load
- [ ] Wrap App in AuthProvider

**What you'll learn:** React Context, localStorage, auth state management

### Step 1.6: Build Auth Page UI
- [ ] Create `client/src/pages/Auth.jsx`
- [ ] Toggle between Login and Signup forms
- [ ] Connect forms to AuthContext functions
- [ ] Handle loading states and errors
- [ ] Redirect to `/feed` on successful auth

**What you'll learn:** Controlled forms, conditional rendering, navigation

### Step 1.7: Set Up Protected Routes
- [ ] Create route structure in `App.jsx`
- [ ] Build `ProtectedRoute` component that checks for token
- [ ] Redirect to `/` (auth page) if not logged in
- [ ] Create placeholder pages for Feed, MyPosts, CreatePost

**What you'll learn:** React Router, route guards, redirects

**🎯 Checkpoint:** Users can sign up, log in, and access protected routes. Token persists on refresh.

---

## Phase 2: Drummer Posts - Backend
**Goal:** Build the complete API for drummer posts.

### Step 2.1: Create DrummerPost Model
- [ ] Create `server/models/DrummerPost.js`
- [ ] Define schema with all fields from CLAUDE.md
- [ ] Add `user` reference to track creator
- [ ] Add `likes` and `dislikes` as arrays of User references
- [ ] Add timestamps

**What you'll learn:** Mongoose references, embedded vs referenced data

### Step 2.2: Build Basic CRUD Routes
- [ ] Create `server/routes/drummerPostRouter.js`
- [ ] GET `/` - get all posts, populate user, sort by likes count
- [ ] GET `/user` - get posts by logged-in user only
- [ ] GET `/:postId` - get single post with user populated
- [ ] POST `/` - create new post (attach req.auth._id as user)
- [ ] DELETE `/:postId` - delete (only if creator matches)
- [ ] Apply auth middleware to all routes

**What you'll learn:** CRUD operations, populate, authorization checks

### Step 2.3: Build Update Routes (Editing Logic)
- [ ] PUT `/:postId` - update drummer name (creator only)
- [ ] PUT `/:postId/drumkit` - update drum kit fields (any user)
- [ ] PUT `/:postId/addons` - update add-on fields (any user)
- [ ] Implement permission checks where needed

**What you'll learn:** Partial updates, conditional authorization

### Step 2.4: Build Voting Routes
- [ ] PUT `/:postId/like` - add user to likes array
  - If already liked, remove (toggle off)
  - If disliked, remove dislike first, then add like
  - Use `$addToSet` and `$pull` for array operations
- [ ] PUT `/:postId/dislike` - same logic reversed
- [ ] Return updated post with new vote counts

**What you'll learn:** Many-to-many relationships, Mongoose array operators

### Step 2.5: Add Sorting by Likes
- [ ] Modify GET `/` to sort by likes array length (descending)
- [ ] Use MongoDB aggregation OR sort after fetch
- [ ] Consider adding virtual for `likeCount` and `dislikeCount`

**What you'll learn:** Sorting, virtuals, aggregation basics

### Step 2.6: Test All Post Endpoints
- [ ] Create post, verify user is attached
- [ ] Get all posts, verify sorted by likes
- [ ] Update drummer name as creator (success)
- [ ] Update drummer name as different user (should fail)
- [ ] Update drum kit as any user (success)
- [ ] Like/dislike toggling works correctly
- [ ] Delete as creator (success), as other user (fail)

**🎯 Checkpoint:** All post CRUD operations work correctly. Voting logic is solid.

---

## Phase 3: Comments - Backend
**Goal:** Add commenting functionality to posts.

### Step 3.1: Create Comment Model
- [ ] Create `server/models/Comment.js`
- [ ] Define schema: title, text, user (ref), drummerPost (ref)
- [ ] Add timestamps, sort by newest first

**What you'll learn:** Related models, timestamps

### Step 3.2: Build Comment Routes
- [ ] Create `server/routes/commentRouter.js`
- [ ] GET `/post/:postId` - get all comments for a post, sorted newest first
- [ ] POST `/post/:postId` - create comment, attach user and post IDs
- [ ] DELETE `/:commentId` - delete (only if creator matches)
- [ ] Populate user on GET to show username

**What you'll learn:** Nested routes, populating related data

### Step 3.3: Test Comment Endpoints
- [ ] Create comment on post
- [ ] Verify comment appears with username
- [ ] Verify newest comments come first
- [ ] Delete own comment (success)
- [ ] Try to delete another user's comment (fail)

**🎯 Checkpoint:** Comments fully functional. Ready for frontend!

---

## Phase 4: Frontend - Post Context & API Layer
**Goal:** Set up state management and API calls for posts.

### Step 4.1: Create API Helper Functions
- [ ] Create `client/src/api/posts.js`
- [ ] Functions for all post endpoints (with token in headers)
- [ ] Create `client/src/api/comments.js`
- [ ] Functions for all comment endpoints
- [ ] Handle errors gracefully, return consistent format

**What you'll learn:** API abstraction, axios configuration

### Step 4.2: Build Post Context
- [ ] Create `client/src/context/PostContext.jsx`
- [ ] State: posts array, userPosts array, loading, error
- [ ] Actions: fetchAllPosts, fetchUserPosts, createPost, updatePost, deletePost, vote
- [ ] Consider `useReducer` for cleaner state updates (optional but recommended)
- [ ] Wrap App in PostProvider (inside AuthProvider)

**What you'll learn:** Context for data management, reducer pattern

**🎯 Checkpoint:** Context set up and API calls working (test with console.log).

---

## Phase 5: Frontend - Feed Page (Public Posts)
**Goal:** Build the main feed showing all drummer posts.

### Step 5.1: Build the DrummerCard Component
- [ ] Create `client/src/components/DrummerCard.jsx`
- [ ] Display drummer name prominently
- [ ] Show drum kit info in organized layout (two columns as per wireframe)
- [ ] Show add-ons section
- [ ] Display like/dislike buttons with counts
- [ ] Show "Posted by: username"
- [ ] Style with Vanilla CSS (edgy, bold, creative theme)

**What you'll learn:** Component composition, props, CSS layout

### Step 5.2: Add Voting to DrummerCard
- [ ] Like button calls vote function from context
- [ ] Dislike button calls vote function
- [ ] Visual feedback: highlight if user has voted
- [ ] Disable buttons during API call (prevent double-click)

**What you'll learn:** Event handling, optimistic UI updates

### Step 5.3: Build Drum Kit Edit Form
- [ ] Create inline edit capability for drum kit fields
- [ ] "+ Add-On to this Kit" button reveals add-on form
- [ ] Any user can fill in empty fields
- [ ] Save button calls update API
- [ ] Show success/error feedback

**What you'll learn:** Controlled inputs, inline editing pattern

### Step 5.4: Build Comment Section
- [ ] Display comments in scrollable container (max height)
- [ ] Newest at top, oldest at bottom
- [ ] "+ Add Comment" button reveals form
- [ ] Comment shows title, text, and username
- [ ] Submit calls create comment API
- [ ] Auto-refresh comments after adding

**What you'll learn:** Scrollable containers, nested data display

### Step 5.5: Build Feed Page
- [ ] Create `client/src/pages/Feed.jsx`
- [ ] Fetch all posts on mount (use PostContext)
- [ ] Map posts to DrummerCard components
- [ ] Show loading state
- [ ] Handle empty state (no posts yet)

**What you'll learn:** Page composition, loading states

**🎯 Checkpoint:** Feed page displays all posts. Voting, editing, and commenting work.

---

## Phase 6: Frontend - Create Post Page
**Goal:** Allow users to create new drummer posts.

### Step 6.1: Build Create Post Form
- [ ] Create `client/src/pages/CreatePost.jsx`
- [ ] Form field for drummer name (required)
- [ ] Optional fields for drum kit info
- [ ] Optional fields for add-ons
- [ ] Submit creates post via context
- [ ] Redirect to feed on success

**What you'll learn:** Form handling, validation, redirects

**🎯 Checkpoint:** Users can create new drummer posts.

---

## Phase 7: Frontend - My Posts Page
**Goal:** Private page for users to manage their own posts.

### Step 7.1: Build My Posts Page
- [ ] Create `client/src/pages/MyPosts.jsx`
- [ ] Fetch only current user's posts
- [ ] Display using DrummerCard (or variant)
- [ ] Add "Edit Name" capability (only here)
- [ ] Add "Delete Post" button (only here)
- [ ] Confirm before delete

**What you'll learn:** Filtered data, confirmation dialogs

### Step 7.2: Implement Full Edit Mode
- [ ] Edit drummer name (text input)
- [ ] Edit all drum kit fields
- [ ] Edit all add-on fields
- [ ] Save all changes at once
- [ ] Cancel reverts to original

**What you'll learn:** Edit mode state, form reset

**🎯 Checkpoint:** Users can fully manage their own posts.

---

## Phase 8: Navigation & Polish
**Goal:** Tie everything together with navigation and UX improvements.

### Step 8.1: Build Navigation Component
- [ ] Create `client/src/components/Navbar.jsx`
- [ ] Links: Feed, Create Post, My Posts
- [ ] Show logged-in username
- [ ] Logout button
- [ ] Style appropriately

**What you'll learn:** Navigation patterns, logout flow

### Step 8.2: Add Loading & Error States
- [ ] Consistent loading spinners/skeletons
- [ ] Error messages that are helpful
- [ ] Toast notifications for actions (optional but nice)

**What you'll learn:** UX polish, error handling

### Step 8.3: Responsive Design
- [ ] Cards stack on mobile
- [ ] Navigation collapses or adjusts
- [ ] Forms are mobile-friendly
- [ ] Test at various breakpoints

**What you'll learn:** Responsive design with CSS media queries

### Step 8.4: Final Testing & Bug Fixes
- [ ] Test complete user flows
- [ ] Fix any edge cases
- [ ] Test with multiple users
- [ ] Verify voting logic prevents duplicates

**🎯 Checkpoint:** App is fully functional and polished!

---

## Phase 9: Deployment (Optional)
**Goal:** Get your app live on the internet.

### Step 9.1: Prepare for Production
- [ ] Create production build of React app
- [ ] Update CORS for production URLs
- [ ] Set up MongoDB Atlas (if not already)
- [ ] Review environment variables

### Step 9.2: Deploy Backend
- [ ] Deploy to Render, Railway, or Vercel
- [ ] Set environment variables in platform
- [ ] Test API endpoints work

### Step 9.3: Deploy Frontend
- [ ] Deploy to Vercel or Netlify
- [ ] Update API base URL for production
- [ ] Test full application flow

**🎯 Final Checkpoint:** Your app is live! Share the link!

---

## Quick Reference: Key Concepts by Phase

| Phase | Key Concepts |
|-------|--------------|
| 0 | Monorepo, Vite, MongoDB Atlas, CSS variables |
| 1 | JWT auth, bcrypt, Context API, protected routes |
| 2 | Mongoose CRUD, references, array operators |
| 3 | Related models, nested routes, sorting |
| 4 | API abstraction, useReducer |
| 5 | Component composition, inline editing, scrollable UI |
| 6 | Form handling, validation |
| 7 | Filtered data, edit modes |
| 8 | Navigation, responsive CSS, polish |
| 9 | Deployment, environment management |

---

## Tips for Success

1. **Commit often** - After each step works, commit with a descriptive message
2. **Test as you go** - Don't build 5 things then test. Build 1, test 1.
3. **Read errors carefully** - The answer is usually in the error message
4. **Use console.log liberally** - It's not cheating, it's debugging
5. **Take breaks** - Stuck for 20+ minutes? Walk away and come back fresh
6. **Reference CLAUDE.md** - It has all the data structures and endpoints

---

## Estimated Time

| Phase | Estimated Time |
|-------|---------------|
| Phase 0 | 1-2 hours |
| Phase 1 | 3-4 hours |
| Phase 2 | 2-3 hours |
| Phase 3 | 1-2 hours |
| Phase 4 | 2-3 hours |
| Phase 5 | 4-5 hours |
| Phase 6 | 1-2 hours |
| Phase 7 | 2-3 hours |
| Phase 8 | 2-3 hours |
| Phase 9 | 1-2 hours |
| **Total** | **~20-30 hours** |

These are rough estimates. Take the time you need!

---

Good luck, and happy coding! 🥁
