const Auth = require("../src/models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require("email-validator")
const { generateToken } = require("../src/helper/generateToken")
const User = require("../src/models/userModel")


const Login = async (req, res) => {
    const { identifier, password } = req.body
    let auth;

    try {

        if (validator.validate(identifier)) {
            const email_id = identifier
            auth = await Auth.findOne({ email_id })
        }
        else {
            const username = identifier
            auth = await Auth.findOne({ username })
        }


        if (!auth) {
            return res.status(404).json({ message: 'User not found' })
        }
        const passwordMatch = await bcrypt.compare(password, auth.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const { password: userPassword, ...authWithoutPassword } = auth.toObject();

        res.status(200).json({
            message: 'Authentication successful',
            auth: authWithoutPassword,
            token: generateToken(auth._id)
        })
    }
    catch (err) {
        res.status(500).json({ message: `Internal Server Error ${err}` })
    }
}


const Register = async (req, res) => {
    const { name, email_id, gender, username, password, profilePicture } = req.body;

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while hashing the password'
            })
        } else {
            const new_user = await User.create({
                name,
                email_id,
                gender,
                username: username.toLowerCase(),
                password: hash,
                profilePicture
            })
                .then((new_user) => {
                    res.status(201).json({
                        message: 'Registered Successfully',
                    })
                })
                .catch((err) => {
                    if (err.code === 11000 && err.keyPattern && err.keyValue) {
                        const duplicateField = Object.keys(err.keyPattern)[0];
                        if (duplicateField == "email_id") {
                            res.status(409).json({
                                message: `Email already in use.`
                            })
                        } else {
                            res.status(409).json({
                                message: `Username aready taken.`
                            })
                        }
                    }
                    else {
                        res.status(400).json({
                            message: `Error Occurred ${err}`
                        });
                    }
                })
        }
    })
}

const isTokenExpired = async (req, res) => {
    const { token } = req.body
    if (token) {
        try {
            const decodedToken = jwt.decode(token, { complete: true });

            if (decodedToken.payload.exp) {
                const expirationTime = decodedToken.payload.exp

                const currentTime = Math.floor(Date.now() / 1000);

                if (expirationTime < currentTime) {
                    return res.status(410).json({ message: 'Session Expired' })
                } else {
                    return res.status(200).json({ message: 'Not expired' })
                }
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    } else {
        return res.status(410).json({ message: 'Session Expired' })
    }
}

const RecoverPassword = async (req, res) => {
    const { email_id, password } = req.body
    let auth;

    try {

        auth = await Auth.findOne({ email_id })

        if (!auth) {
            return res.status(404).json({ message: 'User not found' })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                res.status(500).json({
                    message: 'Error occurred while hashing the password'
                })
            } else {
                auth.password = hash
                await auth.save()
                return res.status(200).json({ message: 'Password updated successfully' });
            }
        })
    }
    catch (err) {
        res.status(500).json({ message: `Internal Server Error ${err}` })
    }
}

module.exports = { Login, Register, isTokenExpired, RecoverPassword }