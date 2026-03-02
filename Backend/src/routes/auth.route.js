const express = require('express')
const authController = require('../controllers/auth.controler')
const identifyUser = require('../middlewares/auth.middleware')

const authRouter = express.Router()  
// Create isolated router instance for auth-related routes

// Route for user registration
authRouter.post("/register", authController.registerController)

// Route for user login
authRouter.post("/login", authController.loginController)

// Route for user get details (protected route)
authRouter.get("/get-me", identifyUser, authController.getMeController)

// Route for user logout
authRouter.post("/logout", authController.logoutController);

module.exports = authRouter
// Export router to be mounted in main app (e.g., app.use("/auth", authRouter))