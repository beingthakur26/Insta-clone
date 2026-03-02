const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    followers: {
        type: String
        // Stores username of the follower (should ideally be ObjectId for stability)
    },
    following:{
        type: String  
        // Stores username of the user being followed
    },
    status:{
        type: String,
        default: "pending",  // Default state for follow requests (useful for private accounts)
        emun: {   // ❌ Typo here — should be "enum", otherwise validation will NOT work
            value: ['pending', 'accepted', 'rejected'],
            message: "status can only be pending, accepted or rejected"
        }
    }
}, { timestamps: true }) // Automatically adds createdAt & updatedAt

// Prevent duplicate follow relationships between same users
// Ensures one follower → following pair exists only once
followSchema.index({ followers: 1, following: 1 }, { unique: true })

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel