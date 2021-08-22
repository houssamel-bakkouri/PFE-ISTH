require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    addUser,
    getUsers,
    modifyUser,
    changePassword
} = require('../controllers/user.js')

router.put('/changePassword', authenticateToken, changePassword);
router.route('/').post(authenticateToken, addUser).get(authenticateToken, getUsers).put(authenticateToken, modifyUser)

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = router;