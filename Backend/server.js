const app = require('./src/app')
const connectDb = require('./src/config/database')
require('dotenv').config()

// Establish MongoDB connection before handling requests
connectDb()

// Start HTTP server
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})