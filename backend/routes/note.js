require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    getNote,
    addNote,
    modifyNote,
    getNoteByEtudMat,
    getNoteByEtud
} = require('../controllers/note.js')

router.get('/', authenticateToken, getNote)
router.get('/ByEtdiantMatiere', authenticateToken, getNoteByEtudMat)
router.get('/ByEtdiant', authenticateToken, getNoteByEtud)
router.post('/', authenticateToken, addNote)
router.put('/', authenticateToken, modifyNote)

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