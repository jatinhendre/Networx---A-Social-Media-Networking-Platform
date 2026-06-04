# 🌐 Networx

> A modern full-stack social networking platform built for meaningful professional connections

Networx is a feature-rich social networking platform where professionals can connect, share ideas, and grow their network in real-time. Built with Next.js and Node.js, it combines the feel of modern networking platform with the speed of modern real-time chat — complete with live messaging, typing indicators, online presence, notifications toasts, and much more.

---

## 🚀 Live Application

**Frontend:** [https://networx-a-social-media-networking-p.vercel.app](https://networx-a-social-media-networking-p.vercel.app)  
**Backend API:** [https://networx-a-social-media-networking.onrender.com](https://networx-a-social-media-networking.onrender.com)

![Status](https://img.shields.io/badge/Status-Live-success)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Backend-Node.js-43853d?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4ea94b?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?logo=socket.io)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary)

---

## ✨ Features at a Glance

### 👤 User Profiles & Authentication
- Secure registration and login with **JWT authentication**
- Persistent sessions — stay logged in across page refreshes
- Fully editable profiles with **profile picture** and **cover photo** uploads (via Cloudinary)
- Bio, current job title, education history, and work experience sections
- Username-based public profile URLs (`/view_profile/:username`)
- Profile page shows a **"(You)"** badge when viewing your own profile
- **Download resume** feature to export your profile as a PDF

### 🤝 Connection System
- Send, accept, and reject connection requests
- Three-state connection button UI: `Connect` → `Request Sent` → `Connected`
- Accept/reject pending requests directly from the **Notifications page** or **My Connections page**
- View all accepted connections in a dedicated connections list
- Connection feed showing posts from only your connected peers
- Search/filter connections and pending requests by name, username, or email

### 📝 Posts & Content Feed
- Create text posts with optional **image/video media** attachments
- **Media preview** before posting with the ability to remove the selection
- Like and unlike posts with a heart toggle (❤️ / 🤍 with count)
- **Share posts** directly to Twitter/X with one click
- Delete your own posts (with a confirmation prompt)
- Connection-scoped feed — only see posts from people you're connected with
- **Post upload loader** — the Post button transitions to "Posting…" while the upload completes, preventing duplicate submissions
- Click on post images to open a full-screen **Lightbox viewer**

### 💬 Comments
- Expand inline comment threads on any post
- Add comments directly from the feed
- View all comments per post in a collapsible section

### 📨 Real-Time Direct Messaging (Socket.IO)
- One-on-one direct messaging between connected users
- Start a conversation from any user's profile page with a **"Message"** button
- Messages sent and received instantly via **Socket.IO** — no page refresh needed
- **Read receipts** — single tick (sent) and double tick (read) indicators on every message
- **Unread message badge** — conversation list shows a count of unread messages per chat, just like WhatsApp
- **Typing indicator** — "Typing…" text displayed in the chat header when the other user is composing a message
- **Online/offline presence** — a green dot badge is shown on user avatars both in the conversation list sidebar and in the chat header when a user is active
- Auto-marks messages as read when the conversation is opened
- Back button to return to the conversations list on mobile

### 🔔 Real-Time Notifications
- In-app **toast notifications** for new events — appear in the top-right corner and auto-dismiss after ~4.5 seconds
- Notifications triggered by: **likes**, **comments**, **connection requests**, **connection accepted**, and **new messages**
- Dedicated **Notifications page** with full notification history
- Unread notification count badge displayed in the navigation bar
- Mark individual notifications as read, or **mark all as read** at once
- Delete individual notifications
- Accept or reject connection requests directly **from the notification item** (without leaving the page)
- Paginated notification list with a **"Load more"** button
- Real-time notification count sync on every socket reconnect

### 🖼️ Media & File Handling
- Profile pictures and cover photos uploaded and stored on **Cloudinary**
- Post media (images/videos) uploaded to Cloudinary with a 5 MB size limit and automatic resizing
- Image lightbox for full-screen media viewing across profiles, posts, and activity feeds

### 🌍 Discover & Explore
- Discover page lists all users on the platform
- Real-time **search bar** to filter users by name or username
- Excludes your own profile from the results
- Click any user card to navigate to their public profile

### 📋 Testimonials
- Submit testimonials for other users (with your role and a message)
- View all testimonials submitted about a user on their profile
- Dedicated "Add Testimonial" and "All Testimonials" pages

### ⚙️ Profile Editing
- Upload and change profile picture and cover photo independently, each with an **"Uploading…" loader**
- Edit display name and username
- Add/remove multiple education entries (school, degree, field of study)
- Add/remove multiple work experience entries (company, position, years)
- Write a bio and set a current job title
- All save actions show a **"Saving…" loader** and use toast notifications for success/error feedback

### 📱 Mobile-First Responsive UI
- Fully responsive layout across desktop, tablet, and mobile
- **Hamburger menu** opens a slide-in navigation drawer on mobile screens
- Mobile-optimised chat interface — conversation list and chat window adapt to screen width
- CSS Modules used throughout for scoped, maintainable styling

### ☁️ Backend Reliability
- **Keep-Alive cron job** — pings the Render backend every 5 minutes to prevent cold starts on the free tier, ensuring the API stays responsive

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | SSR/SSG, routing, performance |
| **React** | Component-based UI |
| **Redux Toolkit** | Global state management |
| **Socket.IO Client** | Real-time messaging & notifications |
| **Axios** | HTTP API requests |
| **CSS Modules** | Scoped component styling |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications for user actions |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js & Express.js** | REST API server |
| **Socket.IO** | Real-time bi-directional communication |
| **MongoDB & Mongoose** | Database and ORM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Cloudinary** | Cloud media storage (images/videos) |
| **Multer** | Multipart file upload handling |
| **node-cron** | Keep-alive scheduled job |
| **PDFKit** | PDF resume generation |
| **CORS** | Cross-origin request policy |

### Deployment
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting with automatic CI/CD |
| **Render** | Backend hosting with environment management |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Media CDN |

---

## 📂 Project Structure

```
networx/
├── frontend/                        # Next.js application
│   └── src/
│       ├── Components/              # Reusable UI components
│       │   ├── ConversationList/    # Sidebar chat list with online dots & unread badges
│       │   ├── MessageList/         # Chat message thread with read receipts
│       │   ├── MessageComposer/     # Message input with typing event emitter
│       │   ├── NotificationSocketBridge/ # Global socket event → Redux dispatcher
│       │   ├── NotificationToasts/  # Auto-dismissing toast notification stack
│       │   ├── Lightbox/            # Full-screen media viewer
│       │   ├── Navbar/              # Top navigation bar
│       │   ├── Footer/              # Site footer
│       │   └── MobileNavigationDrawer/ # Hamburger slide-in menu
│       ├── pages/
│       │   ├── dashboard/           # Post feed & create post
│       │   ├── messages/            # Conversations list & [id] chat detail
│       │   ├── notifications/       # Notification history page
│       │   ├── my_connections/      # Connections & pending requests
│       │   ├── discover/            # Browse & search all users
│       │   ├── edit_profile/        # Profile editing form
│       │   ├── view_profile/[username] # Public profile page (SSR)
│       │   ├── add_testimonial/     # Submit a testimonial
│       │   ├── all_testimonials/    # View all testimonials
│       │   └── login/               # Auth page
│       └── config/
│           ├── redux/               # Redux store, reducers, and async actions
│           └── socket.js            # Socket.IO client singleton
│
└── backend/                         # Express.js REST + Socket.IO API
    ├── server.js                    # Entry point, HTTP server, socket setup
    ├── controllers/                 # Business logic handlers
    ├── models/                      # Mongoose schemas
    │   ├── users.model.js
    │   ├── profile.model.js
    │   ├── posts.model.js
    │   ├── comments.model.js
    │   ├── connections.model.js
    │   ├── conversations.model.js
    │   ├── messages.model.js
    │   ├── notifications.model.js
    │   └── testimonials.model.js
    ├── routes/                      # Express route definitions
    ├── middleware/                  # JWT auth middleware
    ├── config/                      # Cloudinary & DB config
    ├── services/                    # Notification service
    └── utils/
        ├── socket.js                # Socket.IO server — rooms, events, presence
        └── keepAlive.js             # Cron job to prevent Render cold starts
```

---

## 🔌 API Reference

All endpoints are prefixed with the base API URL.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new account |
| `POST` | `/login` | Sign in and receive a JWT |

### User & Profile
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/get_user_profile` | Get the logged-in user's profile |
| `POST` | `/update_profile` | Update display name and username |
| `POST` | `/update_profile_data` | Update bio, current position, education, work history |
| `POST` | `/update_profile_picture` | Upload a new profile picture (multipart) |
| `POST` | `/update_cover_picture` | Upload a new cover photo (multipart) |
| `GET` | `/user/getAllProfiles` | Fetch all user profiles (Discover page) |
| `GET` | `/user/getProfileOnUsername` | Get a profile by username (SSR) |
| `GET` | `/user/downloadResume` | Download profile as PDF |

### Connections
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user/sendConnectionRequest` | Send a connection request |
| `GET` | `/user/getMyConnections` | List accepted connections |
| `GET` | `/user/myConnectionRequest` | List incoming connection requests |
| `GET` | `/user/getConnectionStatus` | Check connection status with a user |
| `POST` | `/user/acceptConnectionRequest` | Accept or reject a request |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/create_post` | Create a post (text + optional media) |
| `GET` | `/posts` | Fetch all posts from your network |
| `POST` | `/delete_post` | Delete a post you own |
| `POST` | `/toggle_Like` | Like or unlike a post |
| `GET` | `/getComments` | Fetch comments for a post |
| `POST` | `/comment` | Add a comment to a post |

### Testimonials
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/add_testimonial` | Submit a testimonial (auth required) |
| `GET` | `/getTestimonials` | Get testimonials for a user |
| `GET` | `/getTestimonialsAll` | Get all testimonials platform-wide |
| `POST` | `/postTestimonial` | Post a testimonial |

### Messaging (REST)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/conversations` | Get all conversations for the current user |
| `POST` | `/conversations` | Find or create a conversation |
| `GET` | `/conversations/:id/messages` | Get messages in a conversation |
| `POST` | `/conversations/:id/messages` | Send a message (REST fallback) |
| `PUT` | `/conversations/:id/read` | Mark a conversation as read |
| `GET` | `/conversations/unread/count` | Get total unread message count |

### Notifications (REST)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | Get paginated notification list |
| `GET` | `/notifications/unread-count` | Get unread notification count |
| `POST` | `/notifications/:id/read` | Mark a single notification as read |
| `POST` | `/notifications/read-all` | Mark all notifications as read |
| `DELETE` | `/notifications/:id` | Delete a notification |

---

## ⚡ Real-Time Socket.IO Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `join_conversations` | — | Join all conversation rooms for the user |
| `join_conversation` | `{ conversationId }` | Join a specific conversation room |
| `send_message` | `{ conversationId, content }` | Send a new message |
| `mark_as_read` | `{ conversationId }` | Mark messages as read |
| `typing` | `{ conversationId, isTyping }` | Broadcast typing status |
| `new_conversation` | `{ otherUserId }` | Notify other user of a new conversation |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `online_users` | `[userId, ...]` | Full list of online user IDs (on connect) |
| `user_online` | `{ userId }` | A user just came online |
| `user_offline` | `{ userId }` | A user went offline |
| `typing_status` | `{ conversationId, userId, isTyping }` | Another user's typing state |
| `message_received` | `{ conversationId, message }` | New incoming message |
| `messages_read` | `{ conversationId, readBy }` | Messages were read by a participant |
| `conversation_updated` | `{ conversationId, lastMessage }` | Conversation metadata updated |
| `conversation_started` | `{ conversation }` | A new conversation was initiated |
| `notification:new` | `notification` | New real-time notification |
| `notification:unread_count` | `{ unreadCount }` | Updated unread count |

---

## 🚦 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- [Cloudinary account](https://cloudinary.com/) (free tier works)
- Git

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/networx.git](https://github.com/jatinhendre/Networx-lets-connect.git)
cd networx
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
BACKEND_URL=http://localhost:5000   # used by the keep-alive cron job
```

Start the backend:
```bash
npm start          # production
npm run dev        # development (nodemon)
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Security

- **JWT Authentication** — all sensitive routes are protected via a `requireAuth` middleware
- **Bcrypt password hashing** — plaintext passwords are never stored
- **Socket.IO authentication** — the socket server validates the JWT token on handshake; unauthenticated connections are rejected
- **CORS** — restricted to trusted origins in production
- **HTTPS** — all production traffic is encrypted (Vercel & Render)
- **File type validation** — only allowed image/video formats are accepted for upload

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---