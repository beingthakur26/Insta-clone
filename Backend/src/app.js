const express = require('express')
const cookies = require('cookie-parser')
const cors = require('cors')

const app = express()

// 🔥 CORS MUST COME FIRST
console.log("CORS CONFIG LOADED")

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// THEN middlewares
app.use(express.json())
app.use(cookies())

/* requiring routes */
const authRouter = require('./routes/auth.route')
const postRouter = require('./routes/post.route')
const userRouter = require('./routes/user.route')

/* mounting routes */
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

module.exports = app