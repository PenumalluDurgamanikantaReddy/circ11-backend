

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const cron = require("node-cron");
// const { runAutomation } = require("./cron/jobs");
dotenv.config()

const app = express()
const PORT =  process.env.PORT || 5000;

app.use(cors())
connectDB()
app.use(express.json())


const matchRoutes = require('./routes/matches')

const authRoutes = require('../cric11-backend/routes/authRoutes')
const playerStatsRoutes = require('../cric11-backend/routes/playerStatsRoutes');
const { fetchTodayMatches } = require('./controllers/matchController');
cron.schedule('0 */12 * * *',()=>{
    fetchTodayMatches()
})
app.use('/api/matches',matchRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/players',playerStatsRoutes)
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})