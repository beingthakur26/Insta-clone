const userModel = require('../models/user.model')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const registerController = async (req, res) => {
  try {
    const { user, email, password, bio, profileImage } = req.body;

    // 🔹 Basic validation
    if (!user || !email || !password) {
      return res.status(400).json({
        message: "User, email and password are required"
      });
    }

    // 🔹 Check if user already exists (by username OR email)
    const isUserAlreadyExist = await userModel.findOne({
      $or: [
        { user: user },
        { email: email }
      ]
    });

    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const newUser = await userModel.create({
      user,
      email,
      password: hashedPassword,
      bio: bio || "",
      profileImage: profileImage || ""
    });

    // 🔹 Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    // 🔹 Generate token
    const token = JWT.sign(
      {
        id: newUser._id,
        username: newUser.user
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔹 Set cookie (works in production + localhost)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    // 🔹 Send response (never send password)
    return res.status(201).json({
      message: "User registered successfully",
      email: newUser.email,
      user: newUser.user,
      bio: newUser.bio,
      profileImage: newUser.profileImage
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

// const registerController = async (req, res) => {

//     const { user, email, password, bio, profileImage } = req.body

//     // Check if username OR email already exists in database
//     const isUserAlreadyExist = await userModel.findOne({ 
//         $or: [
//             { user },
//             { email }
//         ] 
//     })

//     // Stop registration if duplicate found
//     if (isUserAlreadyExist) {
//         return res.status(409).json({ 
//             message: "User already exists" + 
//                 (isUserAlreadyExist.email ? " with this email" : " with this username")
//         })
//     }

//     // Hash password before saving (never store plain password)
//     const hash = await bcrypt.hash(password, 10)

//     // Create user with hashed password
//     const newUser = await userModel.create({
//         user,
//         email,
//         password: hash,
//         bio,
//         profileImage
//     })

//     // Generate JWT token for authentication (valid 1 day)
//     const token = JWT.sign({ 
//         id: newUser._id,
//         username: newUser.user
//     }, process.env.JWT_SECRET, { expiresIn: '1d' })

//     console.log("JWT_SECRET:", process.env.JWT_SECRET)

//     // Store token in cookie for future requests
//     res.cookie('token', token)

//     // Send user data (never send password)
//     res.status(201).json({ 
//         message: "User registered successfully",
//         email : newUser.email,
//         user : newUser.user,
//         bio : newUser.bio,
//         profileImage : newUser.profileImage
//      })
// }

const loginController = async (req, res) => {

    try {

        const { user, email, password } = req.body

        // 🔹 Basic validation (prevents bcrypt error if password is missing)
        if (!password || (!user && !email)) {
            return res.status(400).json({
                message: "Please provide user/email and password"
            })
        }

        // 🔹 Find user by username OR email
        const userExists = await userModel.findOne({
            $or: [
                { user: user },
                { email: email }
            ]
        }).select("+password") // include password because it's hidden in schema

        if (!userExists) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 🔹 Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        // 🔹 Generate JWT token
        const token = JWT.sign(
            {
                id: userExists._id,
                username: userExists.user
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // token valid for 1 day
        )

        // 🔹 Store token inside cookie
        // WHY added options?
        // Because without them logout and CORS may not work properly
        // res.cookie("token", token, {
        //     httpOnly: true,   // prevents JS from accessing token (security)
        //     sameSite: "lax",  // allows frontend (5173) to talk to backend (3000)
        //     secure: false     // must be false for localhost (true only in HTTPS)
        // })
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production", 
        //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        // });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        // 🔹 Send user details (without password)
        res.status(200).json({
            message: "User logged in successfully",
            email: userExists.email,
            user: userExists.user,
            bio: userExists.bio,
            profileImage: userExists.profileImage
        })

    } catch (error) {

        // 🔹 Prevents server crash if something unexpected happens
        console.error("Login error:", error)

        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

// const loginController = async (req, res) => {

//     const { user, email, password } = req.body

//     // Find user using either username or email
//     const userExists = await userModel.findOne({ 
//         $or: [
//             { user: user }, 
//             { email: email }
//         ] 
//     }).select("+password")  // Include password for verification

//     // If no matching user found
//     if (!userExists) {
//         return res.status(404).json({ 
//             message: "User not found" 
//         })
//     }   

//     // Compare entered password with hashed password in DB
//     const isPasswordCorrect = await bcrypt.compare(password, userExists.password)

//     // If password doesn't match
//     if (!isPasswordCorrect) {
//         return res.status(401).json({ 
//             message: "Invalid credentials" 
//         })
//     }    

//     // Generate new JWT token after successful login
//     const token = JWT.sign({ 
//         id: userExists._id,
//         username: userExists.user
//     }, process.env.JWT_SECRET, { expiresIn: '1d' })

//     res.cookie('token', token)       

//     // Send response without password field
//     res.status(200).json({ 
//         message: "User logged in successfully",
//         email : userExists.email, 
//         user : userExists.user,
//         bio : userExists.bio,
//         profileImage : userExists.profileImage
//     })
// }

const getMeController = async (req, res) => {

    const userId = req.user.id  

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }   

    res.status(200).json({
        email : user.email,
        user : user.user,
        bio : user.bio,
        profileImage : user.profileImage
    })
}

const logoutController = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,       // true in production (HTTPS)
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Logout failed"
        });
    }
};

module.exports = {
    registerController,
    loginController,
    getMeController,
    logoutController
}