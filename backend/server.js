const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')


const UserRouter = require("./routes/userRoute")
const ChatRouter = require("./routes/chatRoute")
const MessageRouter = require("./routes/messageRoute")

//database
require('./src/db/config')
require('dotenv').config()

//middlewares
app.use(express.json()) //to accept json data
app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: '*',
    methods: 'GET,PUT,POST',
    allowedHeaders: '*'
}))

app.use('/api/user', UserRouter)
app.use('/api/chat', ChatRouter)
app.use('/api/message', MessageRouter)

//---------------------------------Deployment----------------------------
const __dirname1 = path.resolve()
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.end('API is Running Successfully.')
    })
}
//---------------------------------Deployment----------------------------
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

io.on('connection', (socket) => {

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) {
            console.log('chat.users not defined');
            return
        }

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })

    socket.off('setup', () => {
        console.log('User Disconnected');
        socket.leave(userData._id)
    })
})