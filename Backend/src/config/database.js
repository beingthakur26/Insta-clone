const mongoose = require('mongoose');

const connectDb = async () => {

    // Attempt to connect to MongoDB using URI from environment variables
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        // Logs connection error but does NOT stop the server
        console.log("Error connecting to MongoDB", err)
    })
}

module.exports = connectDb;