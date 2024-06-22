const Chat = require("../src/models/chatModel")
const Message = require("../src/models/messageModel")
const User = require("../src/models/userModel")

const sendMessage = async (req, res) => {
    const { message, chatId } = req.body

    if (!message || !chatId) {
        return res.status(400).json({ message: "Invalid data" })
    }

    var newMessage = {
        sender: req.auth._id,
        message: message,
        chat: chatId
    }

    try {
        var createdMessage = await Message.create(newMessage)

        createdMessage = await createdMessage.populate("sender", "name profilePicture");
        createdMessage = await createdMessage.populate("chat");

        createdMessage = await User.populate(createdMessage, {
            path: 'chat.users',
            select: 'name profilePicture username'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: createdMessage
        })

        res.status(200).json({ message: createdMessage })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const allMessages = async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name profilePicture username")
            .populate("chat");

        res.status(200).json({ message: message })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

module.exports = { sendMessage, allMessages }