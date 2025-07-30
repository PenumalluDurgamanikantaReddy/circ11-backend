

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()
const PORT =  process.env.PORT || 5000;

app.use(cors())

app.use(express.json())


const matchRoutes = require('./routes/matches')
app.use('/api/matches',matchRoutes)

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})