const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')
const ImageKit = require('@imagekit/nodejs')
const {toFile} = require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources/index.js')
require('dotenv').config()


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const followUserController = async (req, res) => {

    const followerUsername  = req.user.username
    const followingUsername = req.params.username
 
    // Prevent self-follow
    if (followerUsername === followingUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    // Ensure the target user actually exists in DB
    const isFollowingExists = await userModel.findOne({
        user: followingUsername
    })

    if (!isFollowingExists) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    // Check if follow relationship already exists
    const isAlreadyFollowing = await followModel.findOne({
        followers: followerUsername,
        following: followingUsername
    })

    if (isAlreadyFollowing) {
        return res.status(409).json({
            message: "You are already following this user",
            follow: isAlreadyFollowing
        })
    }

    // Create new follow request (default status = pending)
    const followRecords = await followModel.create({
        followers: followerUsername,
        following: followingUsername,
        status: "pending"  // useful for private accounts logic
    })

    res.status(200).json({
        message: `User followed ${followingUsername} successfully`,
        follower: followerUsername,
        following: followingUsername,
        follow: followRecords
    })
}

const unFollowUserController = async (req, res) => {

    const followerUsername  = req.user.username
    const followingUsername = req.params.username

    // Check if relationship exists before deleting
    const isUserFollowing = await followModel.findOne({
        followers: followerUsername,
        following: followingUsername
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You are not following this ${followingUsername} user`
        })
    }

    // Remove follow relationship
    await followModel.findOneAndDelete({
        followers: followerUsername,
        following: followingUsername
    })

    res.status(200).json({
        message: `User unfollowed ${followingUsername} successfully`,
        follower: followerUsername,
        unfollowed: followingUsername
    })
}

const updateFollowStatus = async (req, res) => {

    const loggedInUser = req.user.username
    const requesterUsername = req.params.username
    const { status } = req.body   // expected: accepted or rejected

    // Only allow valid status transitions
    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
            message: "Status must be accepted or rejected"
        })
    }

    // Find pending follow request where:
    // requester -> loggedInUser
    const followRequest = await followModel.findOne({
        followers: requesterUsername,
        following: loggedInUser,
        status: "pending"
    })

    if (!followRequest) {
        return res.status(404).json({
            message: "Pending request not found"
        })
    }

    // Update follow request status
    followRequest.status = status
    await followRequest.save()

    res.status(200).json({
        message: `Follow request ${status}`,
        follow: followRequest
    })
}

const getSuggestedUsers = async (req, res) => {

    const loggedInUsername = req.user.username

    try {

        // 1️⃣ Get users you are already following
        const followingRecords = await followModel.find({
            followers: loggedInUsername
        }).select("following")

        const followingUsernames = followingRecords.map(f => f.following)

        // Include yourself so you don't see yourself in suggestions
        followingUsernames.push(loggedInUsername)

        // 2️⃣ Get users NOT in that list
        const suggestedUsers = await userModel.find({
            user: { $nin: followingUsernames }
        }).select("user profileImage bio")

        res.status(200).json({
            message: "Suggested users fetched",
            users: suggestedUsers
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getFollowRequests = async (req, res) => {

    const loggedInUsername = req.user.username

    const requests = await followModel.find({
        following: loggedInUsername,
        status: "pending"
    }).select("followers")

    res.status(200).json({
        message: "Follow requests fetched",
        requests
    })
}

const getFollowingUsers = async (req, res) => {

    const loggedInUsername = req.user.username

    const following = await followModel.find({
        followers: loggedInUsername,
        status: "accepted"
    }).select("following")

    res.status(200).json({
        following
    })
}

const updateProfile = async (req, res) => {

    const userId = req.user.id

    const { user, bio } = req.body

    const updatedData = {}

    if (user) updatedData.user = user
    if (bio) updatedData.bio = bio

    // If profile image uploaded
    if (req.file) {

        const file = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: req.file.originalname,
            folder: "profile-images"
        })

        updatedData.profileImage = file.url
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true }
    ).select("-password")

    res.status(200).json({
        message: "Profile updated",
        user: updatedUser
    })
}

module.exports = {
    followUserController,
    unFollowUserController,
    updateFollowStatus,
    getSuggestedUsers,
    getFollowRequests,
    getFollowingUsers,
    updateProfile
}