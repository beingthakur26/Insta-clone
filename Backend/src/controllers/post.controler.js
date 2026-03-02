const PostModel = require('../models/post.model')
const ImageKit = require('@imagekit/nodejs')
const {toFile} = require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources/index.js')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const identifyUser = require('../middlewares/auth.middleware')
const likeModel = require('../models/like.model')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPost = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Image file is required"
            });
        }

        const file = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: req.file.originalname,
            folder: "cohort-2-insta-posts"
        });

        const post = await PostModel.create({
            caption: req.body.caption,
            imgUrl: file.url,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong while creating post"
        });
    }
};

const getAllPosts = async (req, res) => {

    // Fetch only posts created by logged-in user
    const posts = await PostModel.find({
        userId: req.user.id
    })

    res.status(200).json({  
        message: "Posts fetched successfully",
        posts
    })
}   

const getPostDetails = async (req, res) => {

    const userid = req.user.id
    const postId = req.params.postId

    const post = await PostModel.findById(postId)

    // If post doesn't exist
    if (!post) {
        return res.status(404).send({
            message: "Post not found"
        })
    }

    // Ensure only owner can access post details
    const isValidUser = post.userId.toString() === userid

    if (!isValidUser) {
        return res.status(403).send({
            message: "Forbidden - You don't have access to this post"
        })
    }

    res.status(200).json({
        message: "Post details fetched successfully",
        post,
        isValidUser
    })
}

const likePost = async (req, res) => {

    const username = req.user.username
    const postId = req.params.postId

    const post = await PostModel.findById(postId)

    // Prevent liking non-existing post
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    try {

        // Create like record (assumes unique index on postId + userId)
        const like = await likeModel.create({
            postId: postId,
            userId: username
        })

        res.status(200).json({
            message: "Post liked successfully",
            like
        })

    } catch (error) {

        // Mongo duplicate key error → user already liked post
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already liked this post"
            })
        }

        // Any unexpected database error
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getFeedPosts = async (req, res) => {

    const user = req.user   // keep full user object

    const feedPosts = await Promise.all(
        (await PostModel
            .find()
            .populate("userId")
            .lean()
        )
        .map(async (post) => {

            const isLiked = await likeModel.findOne({
                postId: post._id,
                userId: user.username   // since you're storing username
            })

            post.isLiked = Boolean(isLiked)  // convert to true/false

            return post;
        })
    )

    res.status(200).json({
        message: "posts fetched successfully.",
        posts: feedPosts
    });
};

const unlikePost = async (req, res) => {

    const username = req.user.username
    const postId = req.params.postId

    try {

        // Check if like exists first
        const like = await likeModel.findOne({
            postId: postId,
            userId: username
        })

        if (!like) {
            return res.status(404).json({
                message: "You have not liked this post"
            })
        }

        // Delete the like record
        await likeModel.deleteOne({
            postId: postId,
            userId: username
        })

        res.status(200).json({
            message: "Post unliked successfully"
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}



module.exports = {
    createPost,
    getAllPosts,
    getPostDetails,
    likePost,
    getFeedPosts,
    unlikePost
}