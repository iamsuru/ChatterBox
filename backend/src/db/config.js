const mongoose = require('mongoose')
require('dotenv').config()
const dbURL = process.env.DB_URL

mongoose.connect(dbURL)
    .then(() => {
        console.log('Database connection successful')
    })
    .catch((err) => {
        console.log(`Database connection failed\n${err}`)
    }) 