const express = require('express')


const {registerUser,loginUser, updateUser, deleteUser} = require('../controllers/authController')

const router = express.Router()

router.post('/register',registerUser)
router.put("/user/update", updateUser)

router.post('/login',loginUser)
router.delete('/user/:userId',deleteUser)

module.exports = router