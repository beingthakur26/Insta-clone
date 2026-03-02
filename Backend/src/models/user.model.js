const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: [true, 'User already exists'],  
        // Creates unique index (prevents duplicate usernames at DB level)
        required: [true, 'User is required']
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],  
        // Also enforced at database level (not just validation)
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false  // Exclude password from query results by default
        // Must always store hashed password (never plain text)
    },
    bio: String,  // Optional user description
    profileImage: {
        type: String,
        default: 'https://ik.imagekit.io/hhb2cdv9pt/profileImage.jpg'
        // Default profile image if user doesn't upload one
    }
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel