# 🥁 Drum Kit Social

A community-driven MERN stack application where users create and share professional drummer profiles with their drum kit configurations by album.

## 🚀 Project Status

**Current Phase:** Phase 1 Complete ✅
**Next Up:** Phase 2 - Drummer Posts Backend

### ✅ Completed Features

- **User Authentication**
  - User signup with password hashing (bcryptjs)
  - User login with JWT token generation
  - Protected routes with JWT verification
  - Persistent sessions via localStorage
  - Auth Context for global state management

- **Frontend**
  - React 19 with Vite
  - React Router v7 with protected routes
  - Auth page with login/signup toggle
  - Feed page placeholder
  - Custom CSS design system (lime green accent theme)

- **Backend**
  - Express.js server on port 8000
  - MongoDB Atlas connection
  - User model with Mongoose
  - Auth routes (/api/auth/signup, /api/auth/login)
  - Auth middleware for route protection

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router v7, Vite, Vanilla CSS |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (jsonwebtoken, express-jwt), bcryptjs |
| **Dev Tools** | nodemon, Vite HMR |

## 📁 Project Structure

```
drum-kit-social/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Auth.jsx
│   │   │   └── Feed.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js           # Vite config with proxy
│   └── package.json
├── server/                      # Express backend
│   ├── models/                  # Mongoose schemas
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   └── authRouter.js
│   ├── middleware/              # Custom middleware
│   │   └── authMiddleware.js
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
- Font Family: Inter, system fonts
- Bold, modern sans-serif style
- Large, impactful headings

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project specifications, data models, and API reference
- **[ROADMAP.md](./ROADMAP.md)** - Phase-by-phase development guide with learning objectives

## 🗺️ Roadmap

- [x] **Phase 0:** Project Setup & Foundation
- [x] **Phase 1:** Authentication System
- [ ] **Phase 2:** Drummer Posts - Backend
- [ ] **Phase 3:** Comments - Backend
- [ ] **Phase 4:** Frontend - Post Context & API Layer
- [ ] **Phase 5:** Frontend - Feed Page
- [ ] **Phase 6:** Frontend - Create Post Page
- [ ] **Phase 7:** Frontend - My Posts Page
- [ ] **Phase 8:** Navigation & Polish
- [ ] **Phase 9:** Deployment

## 🤝 Contributing

This is a learning project. Follow the roadmap in `ROADMAP.md` for structured development.

## 📝 License

ISC

---

**Next Steps:** Begin Phase 2 - Create DrummerPost model and CRUD routes!
