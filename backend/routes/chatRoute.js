const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } = require('../controllers/chatController')

const router = express.Router()


router.post("/access-chat", protect, accessChat)
router.get("/fetch-chat", protect, fetchChats)
router.post("/create-group-chat", protect, createGroupChat)
router.put("/rename-group-chat", protect, renameGroupChat)
router.put("/add-individual-to-group", protect, addToGroup)
router.put("/remove-individual-from-group", protect, removeFromGroup)

module.exports = router