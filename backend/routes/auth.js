require('dotenv').config()
const express = require('express')
const router = express.Router()

const {
    getToken,
    getCurrentUser,
    logout,
    login
} = require('../controllers/auth.js')


//use it when the access token expired
router.post('/token', getToken)
router.get('/currentUser', getCurrentUser)
router.delete('/logout', logout)
router.post('/login', login);


module.exports = router;