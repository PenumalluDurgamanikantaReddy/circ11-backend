

const express = require('express');

const router = express.Router()
const { getTodatMatches }  = require('../controllers/matchController')

router.get('/today',getTodatMatches)

router.get('/',(req,res)=>{
res.json({message:"Api is working"})
})


module.exports = router