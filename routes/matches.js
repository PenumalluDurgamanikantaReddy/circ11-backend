

const express = require('express');

const router = express.Router()
const {fetchTodayMatches} = require('../controllers/fetchMatches')


router.get('/fetch-today-matches',fetchTodayMatches)

router.get('/',(req,res)=>{
res.json({message:"Api is working"})
})


// router.get('/today-matches',(req,res)=>{
//    res.json({message:'fetched today matches'})
// })

module.exports = router