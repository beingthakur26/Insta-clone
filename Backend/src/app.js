const express = require('express')
const cookies = require('cookie-parser')
const cors = require('cors')

const app = express()

// Parse incoming JSON body (req.body)
app.use(express.json())

// Parse cookies from incoming requests (needed for JWT in cookies)
app.use(cookies())

// Enable CORS for all routes (allows frontend to communicate with backend)

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* requiring routes */
const authRouter = require('./routes/auth.route')
const postRouter = require('./routes/post.route')
const userRouter = require('./routes/user.route')

/* mounting routes with base paths */
app.use('/api/auth', authRouter)   // Authentication routes
app.use('/api/posts', postRouter)  // Post-related routes
app.use('/api/users', userRouter)  // User & follow-related routes

module.exports = app