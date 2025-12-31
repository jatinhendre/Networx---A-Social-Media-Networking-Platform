# 🏢 Networx

> A modern social networking platform built for meaningful professional connections

Networx is a full-stack social networking platform where users can connect, share ideas, and grow their professional network. Think of it as your personal space to engage with like-minded professionals through posts, comments, and connection requests.

---

## 🌐 Live Application

**Frontend:** [https://networx-a-social-media-networking-p.vercel.app](https://networx-a-social-media-networking-p.vercel.app)  
**Backend API:** [https://networx-a-social-media-networking.onrender.com](https://networx-a-social-media-networking.onrender.com)

![Status](https://img.shields.io/badge/Status-Live-success) ![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?logo=nextdotjs) ![Node.js](https://img.shields.io/badge/Backend-Node.js-43853d?logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-4ea94b?logo=mongodb) ![License](https://img.shields.io/badge/License-Open-blue)

---

## ✨ What Makes Networx Special

### 👤 User Profiles & Discovery
- Secure registration and login with JWT authentication
- Personalized profiles with avatars
- Discover and explore other users on the platform
- Persistent sessions that keep you logged in

### 🤝 Smart Connection System
- Send connection requests to users you'd like to network with
- Accept or decline incoming requests
- Track connection status in real-time
- View all your connections in one place

### 📝 Content Sharing
- Create engaging posts with text and images
- Upload media seamlessly through Cloudinary integration
- Like and unlike posts from your network
- Manage your content by deleting posts you've created
- Your feed shows posts from people you're connected with

### 💬 Engage Through Comments
- Join conversations by commenting on posts
- Read through discussion threads
- Build meaningful interactions with your network

---

## 🛠 Technology Stack

I built Networx using modern, reliable technologies to ensure a smooth experience:

### Frontend
- **Next.js 16** - For lightning-fast page loads and great SEO
- **React** - Building interactive user interfaces
- **Redux Toolkit** - Managing application state elegantly
- **Axios** - Handling API requests efficiently
- **CSS Modules** - Scoped, maintainable styling

### Backend
- **Node.js & Express.js** - Powering the REST API
- **MongoDB with Mongoose** - Flexible, scalable database
- **JWT Authentication** - Keeping your data secure
- **Cloudinary** - Reliable media storage and delivery
- **CORS** - Secure cross-origin requests

### Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend hosting with environment management

---

## 🚀 Getting Started Locally

Want to run Networx on your machine? Here's how:

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account (free tier works fine)
- Git

### Step 1: Clone the Repository
```bash
git clone [https://github.com/yourusername/networx.git](https://github.com/jatinhendre/Networx-lets-connect.git)
cd networx
```

### Step 2: Set Up the Frontend
```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

The frontend should now be running at `http://localhost:3000`

### Step 3: Set Up the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm start
```

The API should now be running at `http://localhost:5000`

---

## 📂 Project Structure

```
networx/
├── frontend/                # Next.js application
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages and routing
│   ├── redux/              # State management
│   ├── styles/             # CSS modules
│   └── public/             # Static assets
│
└── backend/                # Express.js API
    ├── controllers/        # Request handlers
    ├── models/             # MongoDB schemas
    ├── routes/             # API endpoints
    ├── middleware/         # Auth and validation
    └── utils/              # Helper functions
```

---

## 🔌 API Documentation

Here are some key endpoints you can use:

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Sign in to your account

### User Management
- `GET /api/user/profile` - Get your profile
- `GET /api/user/getMyConnections` - View your connections
- `GET /api/user/discover` - Find new users

### Posts
- `GET /api/posts` - Fetch all posts from your network
- `POST /api/posts/create` - Share a new post
- `POST /api/posts/like` - Like or unlike a post
- `DELETE /api/posts/:id` - Remove your post

### Connections
- `POST /api/connections/send` - Send a connection request
- `POST /api/connections/accept` - Accept a request
- `POST /api/connections/reject` - Decline a request

### Comments
- `POST /api/comments/create` - Add a comment to a post
- `GET /api/comments/:postId` - Get comments for a post

---

## 🔐 Security Features

Your safety is my priority:

- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Only authenticated users can access sensitive data
- **CORS Configuration** - Restricted to trusted domains only
- **HTTPS** - All production traffic is encrypted
- **Password Hashing** - User passwords are never stored in plain text

---

## 🎯 Development Roadmap

I'm excited about these upcoming features:

### Coming Soon
- 🔔 **Real-time Notifications** - Get instant updates on likes, comments, and connection requests
- 💬 **Direct Messaging** - Chat privately with your connections
- 🤖 **AI-Powered Insights** - Get smart suggestions for profile optimization
- 📊 **Analytics Dashboard** - Track your engagement and reach
- 🎨 **Themes** - Customize your interface with light and dark modes

### Future Enhancements
- Video post support
- Advanced search and filters
- Groups and communities
- Event management
- Mobile app (React Native)

---

## 🙏 Acknowledgments

This project wouldn't be possible without:
- The amazing open-source community
- Next.js and React teams
- MongoDB and Cloudinary for their excellent documentation
- Everyone who's tested and provided feedback

---

## 👨‍💻 About the Developer

**Jatin Hendre**

I'm a full-stack developer passionate about building tools that bring people together. Networx started as a learning project and evolved into something I'm really proud of. I'm always open to feedback, collaboration, and new ideas!

Feel free to reach out if you have questions, suggestions, or just want to connect.

---


## 🤝 Contributing

I welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---



