const Chat = require("../src/models/chatModel")
const User = require("../src/models/userModel")

//checked
const accessChat = async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ message: "UserID param not sent with request" })
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.auth._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name username email_id pic"
    })

    if (isChat.length > 0) {
        res.status(200).send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.auth._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)

            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password")
                .populate("latestMessage")

            res.status(200).send(FullChat)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}


const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.auth._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email_id username pic"
                })
                res.status(200).json({ message: results })
            })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//checked
const createGroupChat = async (req, res) => {
    let groupName = req.body.name
    let users = req.body.users
    let profilePicture = req.body.profilePicture
    if (users.length < 2) {
        return res.status(400).json({ message: "A group require more than 2 users." })
    }

    users.unshift(req.auth);

    try {
        const groupChat = await Chat.create({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.auth,
            profilePicture: profilePicture
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("profilePicture")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//checked
const renameGroupChat = async (req, res) => {
    const { chatId, chatName } = req.body;
    console.log(req.body);
    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        { chatName: chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updatedChat) {
        res.status(404).json({ message: "Group not found" })
    }
    else {
        res.status(200).json({ message: "Group name updated.", updatedChat })
    }
}

//checked
const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        { new: true }
    )

        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!added) {
        res.status(404).json({ message: "Group not found" })
    }
    else {
        res.status(200).json({ message: "Added to the group.", added })
    }
}


//checked
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    )

        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(404).json({ message: "Group not found" })
    }
    else {
        res.status(200).json({ message: "Removed from the group.", removed })
    }
}
module.exports = { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup }