const Auth = require('../src/models/userModel')
const jwt = require('jsonwebtoken')
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.auth = await Auth.findById(decoded.id).select("-password")

            next();
        } catch (error) {
            return res.status(404).json({ message: error })
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not Authorized' })
    }
}

module.exports = { protect }