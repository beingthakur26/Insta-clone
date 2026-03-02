# 📸 Insta-Clone (Full Stack Social Media App)

A fully functional Instagram-inspired social media application built
using **MERN Stack (MongoDB, Express, React, Node.js)** with
authentication, post creation, like system, follow system, and profile
management.

------------------------------------------------------------------------

## 🚀 Tech Stack

### Frontend

-   React (Hooks + Functional Components)
-   Vite
-   React Router DOM
-   Axios
-   SCSS
-   Context API
-   Cookie-based JWT Authentication

### Backend

-   Node.js
-   Express.js
-   MongoDB + Mongoose
-   JWT Authentication
-   bcryptjs
-   Multer
-   ImageKit Cloud Storage

------------------------------------------------------------------------

## 🔐 Features

### Authentication

-   Register user
-   Login user
-   Logout
-   JWT stored in HTTP-only cookies
-   Protected routes

### Posts

-   Create post with image upload
-   Caption support
-   Feed system
-   Like / Unlike functionality
-   View post details

### Follow System

-   Follow user
-   Unfollow user
-   Accept follow request
-   Reject follow request
-   Suggested users
-   View following list
-   Follow request management

### Profile Management

-   View profile
-   Edit username
-   Edit bio
-   Update profile image
-   Manage follow requests from profile

------------------------------------------------------------------------

## 🗄️ Database Models

### User

-   user (unique)
-   email (unique)
-   password (hashed)
-   bio
-   profileImage

### Post

-   caption
-   imgUrl
-   userId
-   timestamps

### Like

-   postId
-   userId
-   unique compound index

### Follow

-   followers
-   following
-   status (pending, accepted, rejected)

------------------------------------------------------------------------

## 🌐 API Endpoints

### Auth

-   POST /api/auth/register
-   POST /api/auth/login
-   GET /api/auth/get-me
-   POST /api/auth/logout

### Posts

-   POST /api/posts/create
-   GET /api/posts
-   GET /api/posts/feed
-   GET /api/posts/details/:postId
-   POST /api/posts/like/:postId
-   DELETE /api/posts/unlike/:postId

### Users

-   POST /api/users/follow/:username
-   POST /api/users/unfollow/:username
-   PATCH /api/users/follow/status/:username
-   GET /api/users/suggested
-   GET /api/users/requests
-   GET /api/users/following
-   PATCH /api/users/update-profile

------------------------------------------------------------------------

## ▶️ Run Locally

### Backend

cd Backend npm install npm run dev

Runs on http://localhost:3000

### Frontend

cd Frontend npm install npm run dev

Runs on http://localhost:5173

------------------------------------------------------------------------

## 📌 Status

✅ Authentication\
✅ Post Creation\
✅ Like System\
✅ Follow System\
✅ Profile Management\
✅ Cloud Image Upload\
✅ Responsive UI

Fully functional full-stack Instagram clone.
"# Insta-clone" 
