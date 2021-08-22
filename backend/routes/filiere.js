require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    getFiliere,
    addFiliere,
    deleteFiliere,
    modifyFiliere
} = require('../controllers/filiere.js')

router.get('/', authenticateToken, getFiliere)
router.post('/', authenticateToken, addFiliere)
router.delete('/:filiereId', authenticateToken, deleteFiliere)
router.put('/', authenticateToken, modifyFiliere)

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