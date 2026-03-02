const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts', // Creates relationship with posts collection
        required: [true, "Post ID is required"] // Ensures like always belongs to a post
    },
    userId: {
        type: String,
        required: [true, "UserName is required"]
        // Currently storing username (works, but not ideal for long-term stability)
    }
}, { timestamps: true }) // Adds createdAt & updatedAt automatically

// Prevent duplicate likes by same user on same post
// Ensures one user can like a post only once
likeSchema.index({ postId: 1, userId: 1 }, { unique: true })

const likeModel = mongoose.model('likes', likeSchema)

module.exports = likeModel

