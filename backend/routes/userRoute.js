const express = require('express')

const UserController = require('../controllers/userController')
const SearchController = require('../controllers/searchController')
const AuthMiddleWare = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', UserController.Login)
router.post('/register', UserController.Register)
router.post('/isTokenExpired', UserController.isTokenExpired)
router.put('/recover-password', UserController.RecoverPassword)
router.get('/search-user', AuthMiddleWare.protect, SearchController.SearchUser)


module.exports = router