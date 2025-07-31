

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()

const app = express()
const PORT =  process.env.PORT || 5000;

app.use(cors())
connectDB()
app.use(express.json())


const matchRoutes = require('./routes/matches')

const authRoutes = require('../cric11-backend/routes/authRoutes')
app.use('/api/matches',matchRoutes)
app.use('/api/auth',authRoutes)

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})