const mongoose = require('mongoose')

const MessageModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, { timestamps: true })

const Message = mongoose.model('Message', MessageModel)

module.exports = Message