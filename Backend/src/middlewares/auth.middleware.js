const jwt = require('jsonwebtoken');

const identifyUser = async (req, res, next) => {

    // Extract JWT token from cookies (sent by client after login)
    const token = req.cookies.token

    // If token not present → user is not authenticated
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized - No token provided"
        })
    }

    let decoded = null;

    try {
        // Verify token using secret key
        // If expired or tampered → throws error
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).send({
            message: "Unauthorized - Invalid token"
        });
    }

    // Attach decoded payload (id, username) to request object
    // So controllers can access req.user
    req.user = decoded;

    next(); // Pass control to next middleware/controller
}

module.exports = identifyUser