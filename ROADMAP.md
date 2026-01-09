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

## Phase 1: Authentication System ✅ COMPLETED
**Goal:** Build complete user signup, login, and protected routes.

### Step 1.1: Create the User Model ✅
- [x] Create `server/models/User.js`
- [x] Define schema: username (unique, required), password (required)
- [x] Add pre-save hook to hash password with bcryptjs
- [x] Add method to compare passwords for login

**What you'll learn:** Mongoose schemas, password hashing, instance methods

### Step 1.2: Build Auth Routes ✅
- [x] Create `server/routes/authRouter.js`
- [x] POST `/signup` - validate input, create user, return JWT
- [x] POST `/login` - find user, verify password, return JWT
- [x] Use `jsonwebtoken` to sign tokens with your secret
- [x] Mount router in `server.js` at `/api/auth`

**What you'll learn:** JWT creation, route organization, error responses

### Step 1.3: Create Auth Middleware ✅
- [x] Create `server/middleware/authMiddleware.js`
- [x] Use `express-jwt` to verify tokens
- [x] Middleware should add `req.auth` with user data
- [x] Export for use in protected routes

**What you'll learn:** Middleware pattern, JWT verification, protecting routes

### Step 1.4: Test Auth with API Client ✅
- [x] Test signup creates user and returns token
- [x] Test login returns token for valid credentials
- [x] Test login fails for wrong password
- [x] Test protected route without token (should fail)
- [x] Test protected route with token (should succeed)

**What you'll learn:** API testing, debugging auth issues

### Step 1.5: Build Frontend Auth Context ✅
- [x] Create `client/src/context/AuthContext.jsx`
- [x] Manage state: user, token, loading
- [x] Create functions: signup, login, logout
- [x] Store token in localStorage
- [x] Check for existing token on app load
- [x] Wrap App in AuthProvider

**What you'll learn:** React Context, localStorage, auth state management

### Step 1.6: Build Auth Page UI ✅
- [x] Create `client/src/pages/Auth.jsx`
- [x] Toggle between Login and Signup forms
- [x] Connect forms to AuthContext functions
- [x] Handle loading states and errors
- [x] Redirect to `/feed` on successful auth

**What you'll learn:** Controlled forms, conditional rendering, navigation

### Step 1.7: Set Up Protected Routes ✅
- [x] Create route structure in `App.jsx`
- [x] Build `ProtectedRoute` component that checks for token
- [x] Redirect to `/` (auth page) if not logged in
- [x] Create placeholder pages for Feed, MyPosts, CreatePost

**What you'll learn:** React Router, route guards, redirects

**🎯 Checkpoint:** Users can sign up, log in, and access protected routes. Token persists on refresh.

**✅ Phase 1 Complete!** Backend server running on port 8000, frontend on port 5173.

---

## Phase 2: Drummer Posts - Backend ✅ COMPLETED
**Goal:** Build the complete API for drummer posts.

### Step 2.1: Create DrummerPost Model ✅
- [x] Create `server/models/DrummerPost.js`
- [x] Define schema with all fields from CLAUDE.md
- [x] Add required `album` field (String) - connects drummer to specific album
- [x] Note: One drummer can have multiple posts (one per album/kit combo)
- [x] Add `user` reference to track creator
- [x] Add `likes` and `dislikes` as arrays of User references
- [x] Add timestamps

**What you'll learn:** Mongoose references, embedded vs referenced data

### Step 2.2: Build Basic CRUD Routes ✅
- [x] Create `server/routes/drummerPostRouter.js`
- [x] GET `/` - get all posts, populate user, sort by likes count
- [x] GET `/user` - get posts by logged-in user only
- [x] GET `/:postId` - get single post with user populated
- [x] POST `/` - create new post (attach req.auth._id as user)
- [x] DELETE `/:postId` - delete (only if creator matches)
- [x] Apply auth middleware to all routes

**What you'll learn:** CRUD operations, populate, authorization checks

### Step 2.3: Build Update Route (Owner Only) ✅
- [x] PUT `/:postId` - update ANY field (drummer name, album, drum kit, add-ons)
- [x] Check that req.auth._id matches post.user (owner only)
- [x] Return 403 Forbidden if not the owner
- [x] Accept partial updates (only update fields that are provided)

**What you'll learn:** Full ownership authorization, protecting resources

### Step 2.4: Build Voting Routes ✅
- [x] PUT `/:postId/like` - add user to likes array
  - If already liked, remove (toggle off)
  - If disliked, remove dislike first, then add like
  - Uses array filter and push for array operations
- [x] PUT `/:postId/dislike` - same logic reversed
- [x] Return updated post with new vote counts

**What you'll learn:** Many-to-many relationships, Mongoose array operators

### Step 2.5: Add Sorting by Likes ✅
- [x] Modify GET `/` to sort by likes array length (descending)
- [x] Sort after fetch using JavaScript array sort
- [x] Note added for future refactor: virtual properties and aggregation pipeline

**What you'll learn:** Sorting, virtuals, aggregation basics

### Step 2.6: Test All Post Endpoints ✅
- [x] Create post, verify user is attached
- [x] Get all posts, verify sorted by likes
- [x] Update post as creator (success)
- [x] Update post as different user (should fail with 403)
- [x] Like/dislike toggling works correctly
- [x] Delete as creator (success), as other user (fail)

**🎯 Checkpoint:** All post CRUD operations work correctly. Voting logic is solid.

**✅ Phase 2 Complete!** Drummer posts API fully functional with ownership model and voting system.

---

## Phase 3: Comments - Backend ✅ COMPLETED
**Goal:** Add commenting functionality to posts.

### Step 3.1: Create Comment Model ✅
- [x] Create `server/models/Comment.js`
- [x] Define schema: title, text, user (ref), drummerPost (ref), isEdited (Boolean)
- [x] Add timestamps (createdAt, updatedAt)

**What you'll learn:** Related models, timestamps, edit tracking

### Step 3.2: Build Comment Routes ✅
- [x] Create `server/routes/commentRouter.js`
- [x] GET `/post/:postId` - get all comments for a post, sorted newest first
- [x] POST `/post/:postId` - create comment, attach user and post IDs
- [x] PUT `/:commentId` - edit comment (only if creator matches), set isEdited to true
- [x] DELETE `/:commentId` - delete (only if creator matches)
- [x] Populate user on GET to show username

**What you'll learn:** Nested routes, populating related data, owner-only authorization

### Step 3.3: Test Comment Endpoints ✅
- [x] Create comment on post
- [x] Verify comment appears with username and isEdited is false
- [x] Verify newest comments come first
- [x] Edit own comment (success), verify isEdited becomes true
- [x] Try to edit another user's comment (should return 403)
- [x] Delete own comment (success)
- [x] Try to delete another user's comment (should return 403)

**🎯 Checkpoint:** Comments fully functional with CRUD operations. Ready for frontend!

**✅ Phase 3 Complete!** Comment system fully functional with ownership model and edit tracking.

---

## Phase 4: Frontend - Post Context & API Layer ✅ COMPLETED
**Goal:** Set up state management and API calls for posts.

### Step 4.1: Create API Helper Functions ✅
- [x] Create `client/src/api/axiosInstance.js` - configured with JWT interceptors
- [x] Create `client/src/api/postsApi.js` - all post endpoints (getAllPosts, getUserPosts, createPost, updatePost, deletePost, likePost, dislikePost)
- [x] Create `client/src/api/commentsApi.js` - all comment endpoints (getCommentsByPost, createComment, updateComment, deleteComment)
- [x] Automatic JWT token attachment via request interceptor
- [x] Global error handling via response interceptor (401 redirects to login)
- [x] Consistent error format returned from all API calls

**What you'll learn:** API abstraction, axios configuration, request/response interceptors

### Step 4.2: Build Post Context ✅
- [x] Create `client/src/context/PostContext.jsx`
- [x] State: posts array, userPosts array, isLoading, error
- [x] CRUD operations: fetchAllPosts, fetchUserPosts, fetchPostById, createPost, updatePost, deletePost
- [x] Voting operations: toggleLike, toggleDislike (with optimistic UI updates)
- [x] Comment operations: fetchCommentsByPost, createComment, updateComment, deleteComment
- [x] Consume AuthContext for user info
- [x] Wrap App in PostProvider (inside AuthProvider in main.jsx)

**What you'll learn:** Context for data management, optimistic updates, context composition

### Step 4.3: Create Utility Helpers ✅
- [x] Create `client/src/utils/dateUtils.js`
- [x] formatDate() - readable date format (e.g., "Jan 15, 2024 at 3:45 PM")
- [x] getRelativeTime() - relative time from now (e.g., "2 hours ago")
- [x] formatShortDate() - short date format (e.g., "Jan 15, 2024")

**What you'll learn:** Utility functions, date formatting

**🎯 Checkpoint:** Context set up and API calls working. All state management ready for UI components.

**✅ Phase 4 Complete!** Complete data layer built with axios, PostContext, and optimistic UI updates. Frontend ready for UI components!

---

## Phase 5: Frontend - Feed Page (Public Posts) ✅ COMPLETED
**Goal:** Build the main feed showing all drummer posts.

### Step 5.1: Build the DrummerCard Component ✅
- [x] Create `client/src/components/DrummerCard.jsx`
- [x] Display drummer name prominently with Michroma all-caps typography
- [x] Show drum kit info in organized two-column layout
- [x] Show add-ons section
- [x] Display like/dislike buttons with counts
- [x] Show "Posted by: username"
- [x] Style with Vanilla CSS (edgy, bold, creative theme)

**What you'll learn:** Component composition, props, CSS layout

### Step 5.2: Add Voting to DrummerCard ✅
- [x] Like button calls vote function from context
- [x] Dislike button calls vote function
- [x] Visual feedback: lime green highlight if user has voted
- [x] Disable buttons during API call (prevent double-click)
- [x] Toggle behavior (click again to remove vote)
- [x] Mutually exclusive voting (like removes dislike and vice versa)

**What you'll learn:** Event handling, optimistic UI updates

### Step 5.3: Display Album Prominently ✅
- [x] Album title large and bold (more prominent than kit data)
- [x] Position album between drummer name and kit details
- [x] Clear visual hierarchy: Name (Michroma) → Album (lime green) → Kit
- [x] Lime green accent with highlighted background box

**What you'll learn:** Visual hierarchy, CSS typography

### Step 5.4: Build Comment Section ✅
- [x] Display comments in scrollable container (max height 400px)
- [x] Newest at top, oldest at bottom
- [x] "+ Add Comment" button reveals form
- [x] Comment shows title, text, username, and relative timestamp
- [x] Display "edited" badge if `isEdited === true`
- [x] Show Edit (✏️) and Delete (🗑️) buttons only for user's own comments
- [x] Edit button toggles inline edit mode
- [x] Form validation with error messages for empty submissions
- [x] Submit calls create comment API
- [x] Save edited comment calls update comment API, sets isEdited to true
- [x] Delete calls delete comment API with confirmation dialog
- [x] Auto-refresh comments after adding/editing/deleting

**What you'll learn:** Scrollable containers, nested data display, conditional rendering, owner-only UI controls, form validation

### Step 5.5: Build Feed Page ✅
- [x] Updated `client/src/pages/Feed.jsx`
- [x] Fetch all posts on mount (use PostContext)
- [x] Map posts to DrummerCard components
- [x] Show loading state
- [x] Handle empty state (no posts yet)
- [x] Handle error state

**What you'll learn:** Page composition, loading states

**🎯 Checkpoint:** Feed page displays all posts. Voting and commenting work perfectly!

### Step 5.6: Add Dark Mode Support ✅
- [x] Create `client/src/context/ThemeContext.jsx`
- [x] Create `client/src/components/ThemeToggle.jsx` component
- [x] Add CSS dark mode overrides in `index.css`
- [x] Persist theme preference in localStorage
- [x] Add theme toggle to header

**What you'll learn:** CSS custom properties, theme switching, localStorage persistence

**✅ Phase 5 Complete!** Fully interactive feed with DrummerCard components, voting system, comment sections with CRUD operations, and dark mode support.

---

## Phase 6: Frontend - Create Post Page ✅ COMPLETED
**Goal:** Allow users to create new drummer posts.

### Step 6.1: Build Create Post Form ✅
- [x] Create `client/src/pages/CreatePost.jsx`
- [x] Form field for drummer name (required)
- [x] Form field for album (required)
- [x] Optional fields for drum kit info (5-piece kit in grid layout)
- [x] Optional fields for add-ons (cymbals, hardware, effects in grid)
- [x] Submit creates post via context
- [x] Redirect to feed on success
- [x] Three-section form layout with visual hierarchy
- [x] Nested state management for drumKit and addOns
- [x] Client-side validation with error messages
- [x] Placeholder examples for guidance

### Step 6.2: Add Navigation ✅
- [x] Extract `AppHeader.jsx` component for reusable header
- [x] Add "Create Post" button to Feed page (desktop/tablet)
- [x] Add Floating Action Button (FAB) for mobile navigation
- [x] CSS media queries toggle button visibility by screen size

**What you'll learn:** Form handling with nested state, validation, responsive navigation patterns, component reusability

**🎯 Checkpoint:** Users can create new drummer posts from Feed page via desktop button or mobile FAB.

**✅ Phase 6 Complete!** Full create post functionality with three-section form, responsive navigation (desktop button + mobile FAB), and AppHeader component extracted for reuse.

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
- [ ] Edit album (text input)
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
