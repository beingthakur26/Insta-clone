const express = require("express")
const userControllers = require('../controllers/user.controler')
const identifyUser = require('../middlewares/auth.middleware')
const multer = require("multer")

const userRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

/* 
 - POST /api/users/follow/:username
 - Follow a user (authenticated route)
*/
userRouter.post(
    "/follow/:username",
    identifyUser, // Ensures only logged-in users can follow someone
    userControllers.followUserController
)

/*
 - POST /api/users/unfollow/:username
 - Unfollow a user (authenticated route)
*/
userRouter.post(
    "/unfollow/:username",
    identifyUser, // Prevents unauthorized unfollow attempts
    userControllers.unFollowUserController
)

/*
  PATCH /api/users/follow/status/:username
  - Accept or reject a follow request
  - Requires logged-in user (target of the request)
*/
userRouter.patch(
    "/follow/status/:username",
    identifyUser, // Needed to verify that only the target user updates status
    userControllers.updateFollowStatus
)

/*
  GET /api/users/suggestions
  - Get suggested users to follow (excluding already followed and self)
*/

userRouter.get(
    "/suggested",
    identifyUser,
    userControllers.getSuggestedUsers
)

userRouter.get("/requests", identifyUser, userControllers.getFollowRequests)

userRouter.get("/following", identifyUser, userControllers.getFollowingUsers)

userRouter.patch(
    "/update-profile",
    identifyUser,
    upload.single("profileImage"),
    userControllers.updateProfile
)

module.exports = userRouter;