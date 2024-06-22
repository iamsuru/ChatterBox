const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true,
        unique: [true, 'Email is already in use']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Assuming gender can only be one of these values
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: [true, 'Username already taken']
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    }
}, { timestamps: true })



const User = mongoose.model("User", UserModel)

module.exports = User