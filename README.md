# 🥁 Drum Kit Social

A community-driven MERN stack application where users create and share professional drummer profiles with their drum kit configurations by album.

## 🚀 Project Status

**Current Phase:** Phase 5 Complete ✅
**Next Up:** Phase 6 - Create Post Page

### ✅ Completed Features

- **User Authentication**
  - User signup with password hashing (bcryptjs)
  - User login with JWT token generation
  - Protected routes with JWT verification
  - Persistent sessions via localStorage
  - Auth Context for global state management

- **Drummer Posts (Backend)**
  - DrummerPost model with drum kit and add-ons structure
  - Full CRUD operations (create, read, update, delete)
  - Ownership model - only creators can edit/delete their posts
  - Many-to-many voting system (likes/dislikes)
  - Toggle voting logic (can't like AND dislike simultaneously)
  - Sorted by likes (most popular first)
  - Album field for drummer/album/kit combinations

- **Comments System (Backend)**
  - Comment model with title, text, user, and post references
  - Full CRUD operations on comments
  - Ownership model - only creators can edit/delete their comments
  - Edit tracking (isEdited flag)
  - Sorted by newest first

- **Frontend - Data Layer**
  - Axios instance with JWT request interceptors
  - Complete API layer (postsApi.js, commentsApi.js)
  - PostContext for global state management
  - Optimistic UI updates for voting
  - Error handling and loading states
  - Date formatting utilities

- **Frontend - UI Components**
  - React 19 with Vite
  - React Router v7 with protected routes
  - Auth page with login/signup toggle
  - Custom CSS design system with Michroma + Inter typography
  - **DrummerCard Component:**
    - Visual hierarchy: Drummer name (Michroma all-caps) → Album (lime green) → Kit details
    - Two-column grid layout for drum kit information
    - Add-ons section with organized display
    - Owner information footer
  - **Voting System:**
    - Like/Dislike buttons with emoji icons (👍👎)
    - Real-time vote counts
    - Visual feedback (lime green when voted)
    - Toggle behavior (click again to remove vote)
    - Mutually exclusive voting (can't like AND dislike)
    - Optimistic UI updates for instant feedback
  - **Comment Section:**
    - Scrollable comment list (newest first)
    - Add comment form with validation
    - Inline editing with "edited" badge indicator
    - Delete with confirmation dialog
    - Owner-only edit/delete controls
    - Error handling for empty submissions
    - Relative timestamps ("2 hours ago")
  - **Feed Page:**
    - Displays all drummer posts sorted by popularity
    - Loading, error, and empty states
    - Fully interactive cards with voting and comments

- **Backend Infrastructure**
  - Express.js server on port 8000
  - MongoDB Atlas connection
  - Three Mongoose models (User, DrummerPost, Comment)
  - Auth routes (/api/auth/*)
  - Post routes (/api/posts/*)
  - Comment routes (/api/comments/*)
  - Auth middleware for route protection

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router v7, Vite, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (jsonwebtoken, express-jwt), bcryptjs |
| **Dev Tools** | nodemon, Vite HMR |

## 📁 Project Structure

```
drum-kit-social/
├── client/                      # React frontend
│   ├── src/
│   │   ├── api/                 # API layer with axios
│   │   │   ├── axiosInstance.js # Configured axios with JWT interceptors
│   │   │   ├── postsApi.js      # Drummer post API calls
│   │   │   └── commentsApi.js   # Comment API calls
│   │   ├── components/          # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── DrummerCard.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx  # Auth state management
│   │   │   └── PostContext.jsx  # Post/comment state management
│   │   ├── pages/               # Page components
│   │   │   ├── Auth.jsx         # Login/Signup page
│   │   │   └── Feed.jsx         # Main feed (ready for Phase 5)
│   │   ├── utils/               # Helper functions
│   │   │   └── dateUtils.js     # Date formatting utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js           # Vite config with proxy
│   └── package.json
├── server/                      # Express backend
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # User model
│   │   ├── DrummerPost.js       # Drummer post model
│   │   └── Comment.js           # Comment model
│   ├── routes/                  # API routes
│   │   ├── authRouter.js        # Auth endpoints
│   │   ├── drummerPostRouter.js # Post CRUD & voting
│   │   └── commentRouter.js     # Comment CRUD
│   ├── middleware/              # Custom middleware
│   │   └── authMiddleware.js    # JWT verification
│   ├── server.js                # Express app
│   ├── .env                     # Environment variables
│   └── package.json
├── CLAUDE.md                    # Project specifications
├── ROADMAP.md                   # Development roadmap
└── README.md                    # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd drum-kit-social
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env` with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=8000
   ```

### Running the Application

**Start the backend server** (from `server/` directory):
```bash
npm run dev
```
Server runs on `http://localhost:8000`

**Start the frontend** (from `client/` directory):
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

**Note:** The Vite dev server proxies `/api` requests to the backend automatically.

## 🧪 Testing Authentication

1. Visit `http://localhost:5173`
2. Sign up with a new username and password
3. You'll be redirected to the Feed page
4. Click "Logout" to test the logout flow
5. Login again with your credentials
6. Try accessing `/feed` directly while logged out (should redirect to login)

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Create new user, returns JWT | No |
| POST | `/login` | Login user, returns JWT | No |

### Drummer Post Routes (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posts (sorted by likes) | Yes |
| GET | `/user` | Get current user's posts | Yes |
| GET | `/:postId` | Get single post | Yes |
| POST | `/` | Create new post | Yes |
| PUT | `/:postId` | Update post (owner only) | Yes |
| PUT | `/:postId/like` | Toggle like on post | Yes |
| PUT | `/:postId/dislike` | Toggle dislike on post | Yes |
| DELETE | `/:postId` | Delete post (owner only) | Yes |

### Comment Routes (`/api/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post/:postId` | Get comments for a post | Yes |
| POST | `/post/:postId` | Add comment to post | Yes |
| PUT | `/:commentId` | Edit comment (owner only, sets isEdited) | Yes |
| DELETE | `/:commentId` | Delete comment (owner only) | Yes |

**Example Request (Signup):**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "drummer1", "password": "password123"}'
```

**Example Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "drummer1",
    "_id": "...",
    "createdAt": "2026-01-07T18:51:12.201Z"
  }
}
```

## 🎨 Design System

**Color Palette:**
- Primary: `#C5D945` (Vibrant lime green)
- Text: `#3A3A3A` (Dark charcoal)
- Background: `#FFFFFF` / `#F5F5F5`
- Error: `#E63946`

**Typography:**
- **Display Font (H1-H3):** Michroma - All-caps with increased letter-spacing (3-5%) for high-end cymbal branding aesthetic
- **Sub-headings (H4-H5):** Inter Bold - Bridge between display and body text
- **Body Text:** Inter Regular - Clean, readable, professional
- **Visual Hierarchy:** Michroma headings → Inter Bold sub-headings → Inter Regular body

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project specifications, data models, and API reference
- **[ROADMAP.md](./ROADMAP.md)** - Phase-by-phase development guide with learning objectives

## 🗺️ Roadmap

- [x] **Phase 0:** Project Setup & Foundation
- [x] **Phase 1:** Authentication System
- [x] **Phase 2:** Drummer Posts - Backend
- [x] **Phase 3:** Comments - Backend
- [x] **Phase 4:** Frontend - Post Context & API Layer
- [x] **Phase 5:** Frontend - Feed Page (DrummerCard, Voting, Comments)
- [ ] **Phase 6:** Frontend - Create Post Page
- [ ] **Phase 7:** Frontend - My Posts Page
- [ ] **Phase 8:** Navigation & Polish
- [ ] **Phase 9:** Deployment

## 🤝 Contributing

This is a learning project. Follow the roadmap in `ROADMAP.md` for structured development.

## 📝 License

ISC

---

**Next Steps:** Begin Phase 6 - Build the Create Post page to allow users to add new drummer/kit configurations!
