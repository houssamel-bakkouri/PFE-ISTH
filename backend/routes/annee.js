require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    getAnnee,
    addAnnee,
    modifyAnnee,
    deleteAnnee
} = require('../controllers/annee.js')

router.get('/', authenticateToken, getAnnee)
router.post('/', authenticateToken, addAnnee)
router.put('/', authenticateToken, modifyAnnee)
router.delete('/:anneeId', authenticateToken, deleteAnnee)

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = router;