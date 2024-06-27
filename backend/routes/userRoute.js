const express = require('express')
const multer = require('multer');

const UserController = require('../controllers/userController')
const SearchController = require('../controllers/searchController')
const AuthMiddleWare = require('../middlewares/authMiddleware')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
})

const router = express.Router()

router.post('/login', UserController.Login)
router.post('/register', upload.single('file'), UserController.Register)
router.post('/isTokenExpired', UserController.isTokenExpired)
router.put('/recover-password', UserController.RecoverPassword)
router.get('/search-user', AuthMiddleWare.protect, SearchController.SearchUser)


module.exports = router